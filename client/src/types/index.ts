export interface User {
  id: string
  name: string
  email: string
}

export interface Question {
  id: string
  questionText: string
  userAnswer?: string
  aiScore?: number
  aiFeedback?: string
  aiSuggestedAnswer?: string
}

export interface Session {
  _id: string
  role: string
  level: string
  totalScore: number
  completedAt?: string
  createdAt: string
  questions: Question[]
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}