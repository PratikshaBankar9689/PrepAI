import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../api/axios'
import type { Session } from '../types'


export default function Results() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/interview/session/${sessionId}`)
      .then(r => setSession(r.data.session))
      .finally(() => setLoading(false))
  }, [sessionId])

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>Loading results...</div>
    </div>
  )

  if (!session) return null

  const answered = session.questions.filter((q: any) => q.aiScore > 0)
  const avgScore = answered.length
    ? (answered.reduce((s: number, q: any) => s + q.aiScore, 0) / answered.length).toFixed(1)
    : '0'

  const scoreColor = (score: number) =>
    score >= 7 ? '#1a7a4a' : score >= 5 ? '#b45309' : '#c00'
  const scoreBg = (score: number) =>
    score >= 7 ? '#e6f9f0' : score >= 5 ? '#fff8e1' : '#fff0f0'

  const overallColor = Number(avgScore) >= 7 ? '#1a7a4a' : Number(avgScore) >= 5 ? '#b45309' : '#c00'
  const overallBg = Number(avgScore) >= 7 ? '#e6f9f0' : Number(avgScore) >= 5 ? '#fff8e1' : '#fff0f0'

  const getMessage = () => {
    if (Number(avgScore) >= 8) return '🎉 Excellent! You are interview ready.'
    if (Number(avgScore) >= 6) return '👍 Good effort! Keep practicing weak areas.'
    return '📚 Keep practicing — review the suggested answers.'
  }

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>
      <Navbar />
      <div style={styles.container}>

        {/* Score summary */}
        <div style={styles.summaryCard}>
          <div style={styles.scoreCircle}>
            <div style={{ ...styles.scoreBig, color: overallColor, background: overallBg }}>
              {avgScore}
              <span style={styles.scoreOut}>/10</span>
            </div>
          </div>
          <div style={styles.summaryInfo}>
            <h1 style={styles.title}>Interview Complete!</h1>
            <p style={styles.role}>
              {session.role.charAt(0).toUpperCase() + session.role.slice(1)} — {session.level} •{' '}
              {new Date(session.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric'
              })}
            </p>
            <p style={styles.message}>{getMessage()}</p>
            <div style={styles.statRow}>
              <div style={styles.statItem}>
                <span style={styles.statNum}>{answered.length}</span>
                <span style={styles.statLabel}>Answered</span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statNum}>
                  {answered.filter((q: any) => q.aiScore >= 7).length}
                </span>
                <span style={styles.statLabel}>Score ≥ 7</span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statNum}>
                  {answered.filter((q: any) => q.aiScore < 5).length}
                </span>
                <span style={styles.statLabel}>Need work</span>
              </div>
            </div>
          </div>
        </div>

        {/* Question breakdown */}
        <h2 style={styles.sectionTitle}>Question Breakdown</h2>
        {session.questions.map((q: any, i: number) => (
          <div key={q._id} style={styles.qCard}>
            <div style={styles.qHeader}>
              <span style={styles.qNum}>Q{i + 1}</span>
              {q.aiScore > 0 && (
                <span style={{
                  ...styles.qScore,
                  background: scoreBg(q.aiScore),
                  color: scoreColor(q.aiScore)
                }}>
                  {q.aiScore}/10
                </span>
              )}
            </div>
            <p style={styles.qText}>{q.questionText}</p>

            {q.userAnswer && (
              <div style={styles.answerBlock}>
                <div style={styles.answerLabel}>Your answer</div>
                <p style={styles.answerText}>{q.userAnswer}</p>
              </div>
            )}

            {q.aiFeedback && (
              <div style={styles.feedbackBlock}>
                <div style={styles.feedbackLabel}>🤖 Feedback</div>
                <p style={styles.feedbackText}>{q.aiFeedback}</p>
              </div>
            )}

            {q.aiSuggestedAnswer && (
              <div style={styles.suggestedBlock}>
                <div style={styles.suggestedLabel}>💡 Ideal Answer</div>
                <p style={styles.suggestedText}>{q.aiSuggestedAnswer}</p>
              </div>
            )}
          </div>
        ))}

        <div style={styles.actions}>
          <button style={styles.btnPrimary} onClick={() => navigate('/')}>
            🏠 Back to Dashboard
          </button>
          <button style={styles.btnSecondary} onClick={() => navigate('/')}>
            🔄 Practice Again
          </button>
        </div>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: { maxWidth: '720px', margin: '0 auto', padding: '2rem 1rem' },
  summaryCard: { background: '#fff', borderRadius: '12px', padding: '1.75rem', marginBottom: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', flexWrap: 'wrap' },
  scoreCircle: { flexShrink: 0 },
  scoreBig: { fontSize: '40px', fontWeight: 800, padding: '1rem 1.5rem', borderRadius: '12px', display: 'flex', alignItems: 'baseline', gap: '4px' },
  scoreOut: { fontSize: '18px', fontWeight: 400 },
  summaryInfo: { flex: 1 },
  title: { fontSize: '20px', fontWeight: 700, margin: '0 0 4px' },
  role: { fontSize: '13px', color: '#888', margin: '0 0 8px' },
  message: { fontSize: '15px', color: '#444', margin: '0 0 1rem', lineHeight: 1.5 },
  statRow: { display: 'flex', gap: '1.5rem' },
  statItem: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  statNum: { fontSize: '22px', fontWeight: 700, color: '#6C63FF' },
  statLabel: { fontSize: '11px', color: '#888' },
  sectionTitle: { fontSize: '17px', fontWeight: 600, margin: '0 0 1rem' },
  qCard: { background: '#fff', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  qHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  qNum: { fontSize: '12px', fontWeight: 600, color: '#6C63FF', background: '#f0effe', padding: '3px 10px', borderRadius: '20px' },
  qScore: { fontSize: '13px', fontWeight: 700, padding: '4px 12px', borderRadius: '20px' },
  qText: { fontSize: '15px', fontWeight: 500, margin: '0 0 1rem', lineHeight: 1.6 },
  answerBlock: { background: '#f8f8f8', borderRadius: '8px', padding: '10px 14px', marginBottom: '10px' },
  answerLabel: { fontSize: '11px', fontWeight: 600, color: '#888', marginBottom: '4px', textTransform: 'uppercase' },
  answerText: { fontSize: '13px', color: '#333', margin: 0, lineHeight: 1.6 },
  feedbackBlock: { background: '#fafafe', border: '1px solid #ebe9ff', borderRadius: '8px', padding: '10px 14px', marginBottom: '10px' },
  feedbackLabel: { fontSize: '12px', fontWeight: 600, color: '#6C63FF', marginBottom: '4px' },
  feedbackText: { fontSize: '13px', color: '#444', margin: 0, lineHeight: 1.6 },
  suggestedBlock: { background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '10px 14px' },
  suggestedLabel: { fontSize: '12px', fontWeight: 600, color: '#1a7a4a', marginBottom: '4px' },
  suggestedText: { fontSize: '13px', color: '#333', margin: 0, lineHeight: 1.6 },
  actions: { display: 'flex', gap: '1rem', marginTop: '2rem' },
  btnPrimary: { flex: 1, padding: '12px', background: '#6C63FF', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' },
  btnSecondary: { flex: 1, padding: '12px', background: '#fff', color: '#6C63FF', border: '2px solid #6C63FF', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }
}