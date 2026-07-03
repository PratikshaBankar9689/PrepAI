import mongoose, { Schema, Document } from 'mongoose'

const QuestionSchema = new Schema({
  questionText:      { type: String, required: true },
  userAnswer:        { type: String, default: '' },
  aiScore:           { type: Number, default: 0 },
  aiFeedback:        { type: String, default: '' },
  aiSuggestedAnswer: { type: String, default: '' }
})

export interface ISession extends Document {
  userId: mongoose.Types.ObjectId
  role: string
  level: string
  totalScore: number
  completedAt?: Date
  questions: typeof QuestionSchema[]
}

const SessionSchema = new Schema<ISession>({
  userId:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
  role:        { type: String, required: true },
  level:       { type: String, required: true },
  totalScore:  { type: Number, default: 0 },
  completedAt: { type: Date, default: null },
  questions:   [QuestionSchema]
}, { timestamps: true })

export default mongoose.model<ISession>('Session', SessionSchema)