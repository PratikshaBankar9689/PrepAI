import { Response, Router } from 'express'
import authMiddleware from '../middleware/authMiddleware'
import Session from '../models/Session'
import { generateQuestions, evaluateAnswer } from '../services/ai'
import { AuthRequest } from '../types'

const router = Router()

// POST /api/interview/start
// User picks role + level → AI generates 5 questions → session saved
router.post('/start', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { role, level } = req.body

    if (!role || !level) {
      res.status(400).json({ message: 'Role and level are required' })
      return
    }

    const questions = await generateQuestions(role, level)

    const session = await Session.create({
      userId: req.userId,
      role,
      level,
      questions: questions.map((q: string) => ({ questionText: q }))
    })

    res.status(201).json({
      message: 'Interview started',
      sessionId: session._id,
      questions: session.questions.map((q: any) => ({
        id: q._id,
        questionText: q.questionText
      }))
    })
  } catch (error) {
    console.error('Start interview error:', error)
    res.status(500).json({ message: 'Failed to generate questions', error })
  }
})

// POST /api/interview/answer
// User submits answer → AI scores it → saved to session
router.post('/answer', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { sessionId, questionId, answer } = req.body

    if (!sessionId || !questionId || !answer) {
      res.status(400).json({ message: 'sessionId, questionId and answer are required' })
      return
    }

    const session = await Session.findById(sessionId)
    if (!session) {
      res.status(404).json({ message: 'Session not found' })
      return
    }

    const question = session.questions.find(
      (q: any) => q._id.toString() === questionId
    ) as any

    if (!question) {
      res.status(404).json({ message: 'Question not found' })
      return
    }

    const feedback = await evaluateAnswer(
      question.questionText,
      answer,
      session.role,
      session.level
    )

    question.userAnswer = answer
    question.aiScore = feedback.score
    question.aiFeedback = feedback.feedback
    question.aiSuggestedAnswer = feedback.suggestedAnswer

    await session.save()

    res.json({
      message: 'Answer evaluated',
      score: feedback.score,
      feedback: feedback.feedback,
      suggestedAnswer: feedback.suggestedAnswer
    })
  } catch (error) {
    console.error('Answer error:', error)
    res.status(500).json({ message: 'Failed to evaluate answer', error })
  }
})

// POST /api/interview/complete
// Mark session as done + calculate total score
router.post('/complete', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { sessionId } = req.body
    const session = await Session.findById(sessionId)

    if (!session) {
      res.status(404).json({ message: 'Session not found' })
      return
    }

    const answered = session.questions.filter((q: any) => q.aiScore > 0)
    const totalScore = answered.length > 0
      ? answered.reduce((sum: number, q: any) => sum + q.aiScore, 0) / answered.length
      : 0

    session.totalScore = Math.round(totalScore * 10) / 10
    session.completedAt = new Date()
    await session.save()

    res.json({
      message: 'Interview completed',
      totalScore: session.totalScore,
      sessionId: session._id
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// GET /api/interview/history
// Get all past sessions for logged in user
router.get('/history', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const sessions = await Session.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .select('role level totalScore completedAt createdAt questions')

    res.json({ sessions })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// GET /api/interview/session/:id
// Get full session with all questions + feedback
router.get('/session/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      userId: req.userId
    })

    if (!session) {
      res.status(404).json({ message: 'Session not found' })
      return
    }

    res.json({ session })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

export default router