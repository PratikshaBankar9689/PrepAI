import { useState, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Timer from '../components/Timer'
import api from '../api/axios'
import type { Question } from '../types'
import VoiceRecorder from '../components/VoiceRecorder'

const TIMER_SECONDS = 90

export default function Interview() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { session } = state || {}

  const [currentIndex, setCurrentIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [answered, setAnswered] = useState<Record<number, any>>({})
  const [timerRunning, setTimerRunning] = useState(true)
  const [timeUpFor, setTimeUpFor] = useState<number | null>(null)
  const [voiceMode, setVoiceMode] = useState(false)

  if (!session) {
    navigate('/dashboard')
    return null
  }

  const questions: Question[] = session.questions
  const currentQ = questions[currentIndex]
  const isLast = currentIndex === questions.length - 1
  const isAnswered = answered[currentIndex]

  const handleTimeUp = useCallback(() => {
    if (!answered[currentIndex]) {
      setTimeUpFor(currentIndex)
      setTimerRunning(false)
      // Auto submit with whatever they typed or empty
      submitAnswer(true)
    }
  }, [currentIndex, answered, answer])

  const submitAnswer = async (isAutoSubmit = false) => {
    const finalAnswer = isAutoSubmit
      ? (answer.trim() || 'No answer provided — time ran out.')
      : answer

    if (!finalAnswer.trim() && !isAutoSubmit) return
    setTimerRunning(false)
    setLoading(true)

    try {
      const { data } = await api.post('/interview/answer', {
        sessionId: session.sessionId,
        questionId: currentQ.id,
        answer: finalAnswer
      })
      setAnswered(prev => ({ ...prev, [currentIndex]: { ...data, answer: finalAnswer } }))
    } catch {
      alert('Failed to evaluate. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const nextQuestion = () => {
    setCurrentIndex(i => i + 1)
    setAnswer('')
    setTimerRunning(true)
    setTimeUpFor(null)
  }

  const finishInterview = async () => {
    try {
      await api.post('/interview/complete', { sessionId: session.sessionId })
    } finally {
      navigate(`/results/${session.sessionId}`)
    }
  }

  const scoreColor = (score: number) =>
    score >= 7 ? '#1a7a4a' : score >= 5 ? '#b45309' : '#c00'
  const scoreBg = (score: number) =>
    score >= 7 ? '#e6f9f0' : score >= 5 ? '#fff8e1' : '#fff0f0'

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>
      <Navbar />
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>
              <span style={{ color: '#6C63FF', textTransform: 'capitalize' }}>
                {session.role} · {session.level}
              </span>
            </h1>
          </div>
          <div style={styles.headerRight}>
            <div style={styles.progressPill}>
              Q{currentIndex + 1} of {questions.length}
            </div>
            {/* Timer shown only when not answered */}
            {!isAnswered && (
              <Timer
                key={currentIndex}
                seconds={TIMER_SECONDS}
                onTimeUp={handleTimeUp}
                isRunning={timerRunning && !loading}
              />
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div style={styles.progressBar}>
          <div style={{
            ...styles.progressFill,
            width: `${((currentIndex + 1) / questions.length) * 100}%`
          }} />
        </div>

        {/* Time up banner */}
        {timeUpFor === currentIndex && (
          <div style={styles.timeUpBanner}>
            ⏰ Time's up! Auto-submitted your answer.
          </div>
        )}

        {/* Question card */}
        <div style={styles.card}>
          <div style={styles.qNum}>Q{currentIndex + 1}</div>
          <p style={styles.qText}>{currentQ.questionText}</p>

       {!isAnswered ? (
  <>
    {/* Voice / Text toggle */}
    <div style={styles.modeToggle}>
      <button
        style={{
          ...styles.modeBtn,
          background: !voiceMode ? '#6C63FF' : 'transparent',
          color: !voiceMode ? '#fff' : '#666',
          border: !voiceMode ? 'none' : '1px solid #ddd'
        }}
        onClick={() => setVoiceMode(false)}
      >
        ⌨️ Type
      </button>
      <button
        style={{
          ...styles.modeBtn,
          background: voiceMode ? '#6C63FF' : 'transparent',
          color: voiceMode ? '#fff' : '#666',
          border: voiceMode ? 'none' : '1px solid #ddd'
        }}
        onClick={() => setVoiceMode(true)}
      >
        🎤 Speak
      </button>
    </div>

    {/* Text area */}
    {!voiceMode ? (
      <textarea
        style={styles.textarea}
        placeholder="Type your answer here... Be as detailed as possible."
        value={answer}
        onChange={e => setAnswer(e.target.value)}
        rows={6}
        disabled={loading}
      />
    ) : (
      <div style={styles.voiceBox}>
        <VoiceRecorder
          onTranscript={(text) => setAnswer(text)}
          disabled={loading}
        />
        {/* Show live transcript */}
        {answer ? (
          <div style={styles.transcriptBox}>
            <div style={styles.transcriptLabel}>📝 Transcript</div>
            <p style={styles.transcriptText}>{answer}</p>
          </div>
        ) : null}
      </div>
    )}

    <div style={styles.submitRow}>
      <span style={styles.charCount}>{answer.length} chars</span>
      <button
        style={{
          ...styles.btn,
          opacity: !answer.trim() || loading ? 0.6 : 1,
          cursor: !answer.trim() || loading ? 'not-allowed' : 'pointer'
        }}
        onClick={() => submitAnswer(false)}
        disabled={!answer.trim() || loading}
      >
        {loading ? '⏳ AI is evaluating...' : '✅ Submit Answer'}
      </button>
    </div>
  </>
) : (
  // ... rest of your answered section stays exactly the same
            <>
              {/* Your answer */}
              <div style={styles.yourAnswer}>
                <div style={styles.yourAnswerLabel}>Your answer</div>
                <p style={styles.yourAnswerText}>{isAnswered.answer}</p>
              </div>

              {/* AI Feedback */}
              <div style={styles.feedbackCard}>
                <div style={styles.feedbackHeader}>
                  <span style={styles.feedbackTitle}>🤖 AI Feedback</span>
                  <span style={{
                    ...styles.scorePill,
                    background: scoreBg(isAnswered.score),
                    color: scoreColor(isAnswered.score)
                  }}>
                    {isAnswered.score}/10
                  </span>
                </div>
                <p style={styles.feedbackText}>{isAnswered.feedback}</p>
                <div style={styles.suggestedLabel}>💡 Ideal Answer</div>
                <p style={styles.suggestedText}>{isAnswered.suggestedAnswer}</p>
              </div>

              {isLast ? (
                <button style={styles.btn} onClick={finishInterview}>
                  🎉 Finish & See Results
                </button>
              ) : (
                <button style={styles.btn} onClick={nextQuestion}>
                  Next Question →
                </button>
              )}
            </>
          )}
        </div>

        {/* Dots */}
        <div style={styles.dots}>
          {questions.map((_, i) => (
            <div key={i} style={{
              ...styles.dot,
              background: answered[i]
                ? (answered[i].score >= 7 ? '#1D9E75' : answered[i].score >= 5 ? '#BA7517' : '#c00')
                : i === currentIndex ? '#6C63FF' : '#ddd'
            }} />
          ))}
        </div>
        <div style={styles.dotsLabel}>
          Green = good · Yellow = ok · Red = needs work
        </div>

      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: { maxWidth: '720px', margin: '0 auto', padding: '2rem 1rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', gap: '1rem' },
  title: { fontSize: '17px', fontWeight: 600, margin: 0 },
  headerRight: { display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 },
  progressPill: { fontSize: '13px', color: '#888', background: '#fff', padding: '6px 14px', borderRadius: '20px', border: '1px solid #eee', whiteSpace: 'nowrap' },
  progressBar: { height: '6px', background: '#e0e0e0', borderRadius: '3px', marginBottom: '1.5rem', overflow: 'hidden' },
  progressFill: { height: '100%', background: '#6C63FF', borderRadius: '3px', transition: 'width 0.4s ease' },
  timeUpBanner: { background: '#fff0f0', border: '1px solid #fca5a5', color: '#c00', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 500, marginBottom: '1rem', textAlign: 'center' },
  card: { background: '#fff', padding: '1.75rem', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: '1rem' },
  qNum: { fontSize: '12px', fontWeight: 600, color: '#6C63FF', background: '#f0effe', display: 'inline-block', padding: '3px 10px', borderRadius: '20px', marginBottom: '12px' },
  qText: { fontSize: '17px', fontWeight: 500, lineHeight: 1.6, margin: '0 0 1.5rem', color: '#1a1a1a' },
  textarea: { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', lineHeight: 1.6, resize: 'vertical', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' },
  submitRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' },
  charCount: { fontSize: '12px', color: '#bbb' },
  btn: { padding: '12px 28px', background: '#6C63FF', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' },
  yourAnswer: { background: '#f8f8f8', borderRadius: '8px', padding: '12px 14px', marginBottom: '1rem' },
  yourAnswerLabel: { fontSize: '11px', fontWeight: 600, color: '#888', marginBottom: '6px', textTransform: 'uppercase' },
  yourAnswerText: { fontSize: '14px', color: '#333', margin: 0, lineHeight: 1.6 },
  feedbackCard: { background: '#fafafe', border: '1px solid #ebe9ff', borderRadius: '10px', padding: '1.25rem', marginBottom: '1rem' },
  feedbackHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  feedbackTitle: { fontSize: '14px', fontWeight: 600, color: '#333' },
  scorePill: { fontSize: '14px', fontWeight: 700, padding: '4px 14px', borderRadius: '20px' },
  feedbackText: { fontSize: '14px', color: '#444', lineHeight: 1.7, margin: '0 0 1rem' },
  suggestedLabel: { fontSize: '12px', fontWeight: 600, color: '#6C63FF', marginBottom: '6px' },
  suggestedText: { fontSize: '14px', color: '#333', lineHeight: 1.7, margin: 0 },
  dots: { display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '1rem' },
  dot: { width: '12px', height: '12px', borderRadius: '50%', transition: 'background 0.3s' },
  dotsLabel: { textAlign: 'center', fontSize: '11px', color: '#bbb', marginTop: '6px' },
  modeToggle: {
  display: 'flex', gap: '8px', marginBottom: '12px',
  background: '#f5f5f5', padding: '4px',
  borderRadius: '8px', width: 'fit-content'
},
modeBtn: {
  padding: '7px 18px', borderRadius: '6px',
  fontSize: '13px', fontWeight: 600,
  cursor: 'pointer', transition: 'all 0.2s'
},
voiceBox: {
  background: '#fafafe', border: '1px solid #ebe9ff',
  borderRadius: '10px', padding: '1rem', marginBottom: '4px'
},
transcriptBox: {
  marginTop: '12px', background: '#fff',
  border: '1px solid #eee', borderRadius: '8px', padding: '10px 14px'
},
transcriptLabel: {
  fontSize: '11px', fontWeight: 600, color: '#888',
  marginBottom: '6px', textTransform: 'uppercase' as const
},
transcriptText: {
  fontSize: '14px', color: '#333', margin: 0, lineHeight: 1.6
},
}