import { Request } from 'express'

export interface AuthRequest extends Request {
  userId?: string
}

export interface QuestionType {
  questionText: string
  userAnswer: string
  aiScore: number
  aiFeedback: string
  aiSuggestedAnswer: string
}