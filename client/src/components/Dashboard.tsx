import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, RadarChart, Radar,
  PolarGrid, PolarAngleAxis
} from 'recharts'
import Navbar from '../components/Navbar'
import api from '../api/axios'
import type { Session } from '../types'

const ROLES = ['Frontend', 'Backend', 'Fullstack', 'React Native', 'Node.js']
const LEVELS = ['Junior', 'Mid', 'Senior']
const DIFFICULTIES = ['Easy', 'Medium', 'Hard']

const scoreTextClass = (score: number) =>
  score >= 7 ? 'text-[#1D9E75]' : score >= 5 ? 'text-[#BA7517]' : 'text-[#c00]'

const difficultyClass = (difficulty: string) => {
  if (difficulty === 'Hard') return 'border-red-300 text-[#c00]'
  if (difficulty === 'Easy') return 'border-green-300 text-[#1a7a4a]'
  return 'border-[#ddd] text-[#333]'
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [sessions, setSessions] = useState<Session[]>([])
  const [starting, setStarting] = useState(false)
  const [role, setRole] = useState('Frontend')
  const [level, setLevel] = useState('Mid')
  const [difficulty, setDifficulty] = useState('Medium')

  useEffect(() => {
    api.get('/interview/history').then(r => setSessions(r.data.sessions))
  }, [])

  const startInterview = async () => {
    setStarting(true)
    try {
      const { data } = await api.post('/interview/start', {
        role: role.toLowerCase(),
        level: level.toLowerCase(),
        difficulty: difficulty.toLowerCase()
      })
      navigate('/interview', { state: { session: data } })
    } catch {
      alert('Failed to start interview. Try again.')
    } finally {
      setStarting(false)
    }
  }

  const completed = sessions.filter(session => session.totalScore > 0)
  const avgScore = completed.length
    ? (completed.reduce((sum, session) => sum + session.totalScore, 0) / completed.length).toFixed(1)
    : '—'
  const best = completed.length ? Math.max(...completed.map(session => session.totalScore)) : 0
  const accuracy = completed.length
    ? Math.round((completed.filter(session => session.totalScore >= 7).length / completed.length) * 100)
    : 0

  const chartData = [...completed]
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .slice(-7)
    .map((session, index) => ({
      name: `S${index + 1}`,
      score: session.totalScore,
      role: session.role,
      date: new Date(session.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    }))

  const roleMap: Record<string, number[]> = {}
  completed.forEach(session => {
    if (!roleMap[session.role]) roleMap[session.role] = []
    roleMap[session.role].push(session.totalScore)
  })
  const radarData = Object.entries(roleMap).map(([roleName, scores]) => ({
    role: roleName.charAt(0).toUpperCase() + roleName.slice(1),
    avg: parseFloat((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1))
  }))

  const allQuestions: any[] = []
  completed.forEach(session => {
    session.questions?.forEach((question: any) => {
      if (question.aiScore > 0) allQuestions.push({ ...question, role: session.role })
    })
  })
  const strong = allQuestions.filter(question => question.aiScore >= 7)
  const weak = allQuestions.filter(question => question.aiScore < 5)

  const stats = [
    { label: 'Total Sessions', value: sessions.length, colorClass: 'text-[#6C63FF]', icon: '\u{1F4CB}' },
    { label: 'Average Score', value: avgScore, colorClass: 'text-[#1D9E75]', icon: '\u{1F4CA}' },
    { label: 'Best Score', value: best > 0 ? `${best}/10` : '—', colorClass: 'text-[#BA7517]', icon: '\u{1F3C6}' },
    { label: 'Accuracy >=7', value: completed.length ? `${accuracy}%` : '—', colorClass: 'text-[#534AB7]', icon: '\u{1F3AF}' },
  ]

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload?.length) {
      return (
        <div className="rounded-lg border border-[#eee] bg-white px-3.5 py-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
          <div className="mb-1 text-xs capitalize text-[#888]">
            {payload[0]?.payload?.date} — {payload[0]?.payload?.role}
          </div>
          <div className={`text-[15px] font-bold ${scoreTextClass(payload[0].value)}`}>
            Score: {payload[0].value}/10
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Navbar />
      <div className="mx-auto max-w-[1100px] px-4 py-8">
        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(stat => (
            <div key={stat.label} className="rounded-xl bg-white p-5 text-center shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
              <div className="mb-1.5 text-[22px]">{stat.icon}</div>
              <div className={`mb-1 text-[26px] font-bold ${stat.colorClass}`}>{stat.value}</div>
              <div className="text-xs text-[#888]">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid items-start gap-5 lg:grid-cols-[1fr_380px]">
          <div className="flex flex-col gap-5">
            <div className="rounded-xl bg-white px-6 py-5 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
              <div className="mb-5">
                <h2 className="mb-1 text-base font-semibold text-[#1a1a1a]">{'\u{1F680}'} Start New Interview</h2>
                <p className="text-[13px] text-[#888]">AI generates 5 fresh questions every session</p>
              </div>
              <div className="mb-5 grid gap-3 md:grid-cols-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[#555]">Role</label>
                  <select className="cursor-pointer rounded-lg border border-[#ddd] bg-white px-3 py-2.5 text-sm text-[#333] outline-none focus:border-[#6C63FF] focus:ring-4 focus:ring-[#6C63FF]/10" value={role} onChange={e => setRole(e.target.value)}>
                    {ROLES.map(roleOption => <option key={roleOption}>{roleOption}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[#555]">Level</label>
                  <select className="cursor-pointer rounded-lg border border-[#ddd] bg-white px-3 py-2.5 text-sm text-[#333] outline-none focus:border-[#6C63FF] focus:ring-4 focus:ring-[#6C63FF]/10" value={level} onChange={e => setLevel(e.target.value)}>
                    {LEVELS.map(levelOption => <option key={levelOption}>{levelOption}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[#555]">Difficulty</label>
                  <select
                    className={`cursor-pointer rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:border-[#6C63FF] focus:ring-4 focus:ring-[#6C63FF]/10 ${difficultyClass(difficulty)}`}
                    value={difficulty}
                    onChange={e => setDifficulty(e.target.value)}
                  >
                    {DIFFICULTIES.map(difficultyOption => <option key={difficultyOption}>{difficultyOption}</option>)}
                  </select>
                </div>
              </div>
              <button
                className="w-full rounded-lg bg-[#6C63FF] p-[13px] text-[15px] font-bold text-white transition hover:bg-[#5b54e8] active:scale-[0.98] disabled:opacity-70"
                onClick={startInterview}
                disabled={starting}
              >
                {starting ? `${'\u23F3'} Generating questions...` : `${'\u{1F680}'} Start Interview`}
              </button>
            </div>

            <div className="rounded-xl bg-white px-6 py-5 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
              <h2 className="mb-1 text-base font-semibold text-[#1a1a1a]">{'\u{1F4C8}'} Score Progress</h2>
              <p className="mb-4 text-[13px] text-[#888]">Last 7 completed sessions</p>
              {chartData.length < 2 ? (
                <div className="flex h-[220px] items-center justify-center text-center text-[13px] text-[#bbb]">
                  Complete at least 2 interviews to see your progress chart
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#999' }} />
                    <YAxis domain={[0, 10]} tick={{ fontSize: 12, fill: '#999' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#6C63FF"
                      strokeWidth={2.5}
                      dot={{ fill: '#6C63FF', r: 5, strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            {radarData.length >= 2 && (
              <div className="rounded-xl bg-white px-6 py-5 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
                <h2 className="mb-1 text-base font-semibold text-[#1a1a1a]">{'\u{1F578}\uFE0F'} Performance by Role</h2>
                <p className="mb-4 text-[13px] text-[#888]">Average score across different roles</p>
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#eee" />
                    <PolarAngleAxis dataKey="role" tick={{ fontSize: 12, fill: '#666' }} />
                    <Radar
                      name="Score"
                      dataKey="avg"
                      stroke="#6C63FF"
                      fill="#6C63FF"
                      fillOpacity={0.15}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-5">
            <div className="rounded-xl bg-white px-6 py-5 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
              <h2 className="mb-1 text-base font-semibold text-[#1a1a1a]">{'\u{1F4AA}'} Strong Topics</h2>
              <p className="mb-3 text-[13px] text-[#888]">Questions you scored 7+ on</p>
              {strong.length === 0 ? (
                <div className="py-4 text-center text-[13px] text-[#bbb]">Complete interviews to see strong topics</div>
              ) : (
                strong.slice(0, 3).map((question, index) => (
                  <div key={index} className="flex items-center justify-between gap-3 border-b border-[#f0f0f0] py-2 last:border-b-0">
                    <div className="flex-1 text-xs leading-5 text-[#444]">{question.questionText.slice(0, 70)}...</div>
                    <span className="shrink-0 rounded-full bg-[#e6f9f0] px-2 py-0.5 text-xs font-bold text-[#1a7a4a]">
                      {question.aiScore}/10
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="rounded-xl bg-white px-6 py-5 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
              <h2 className="mb-1 text-base font-semibold text-[#1a1a1a]">{'\u{1F4DA}'} Needs Work</h2>
              <p className="mb-3 text-[13px] text-[#888]">Questions you scored below 5</p>
              {weak.length === 0 ? (
                <div className="py-4 text-center text-[13px] text-[#bbb]">
                  {completed.length === 0 ? 'Complete interviews to see weak areas' : `${'\u{1F389}'} No weak topics yet — great work!`}
                </div>
              ) : (
                weak.slice(0, 3).map((question, index) => (
                  <div key={index} className="flex items-center justify-between gap-3 border-b border-[#f0f0f0] py-2 last:border-b-0">
                    <div className="flex-1 text-xs leading-5 text-[#444]">{question.questionText.slice(0, 70)}...</div>
                    <span className="shrink-0 rounded-full bg-[#fff0f0] px-2 py-0.5 text-xs font-bold text-[#c00]">
                      {question.aiScore}/10
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

