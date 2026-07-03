import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'

const features = [
  'AI-generated questions for your role',
  'Instant score out of 10 per answer',
  'Detailed feedback + ideal answer',
  'Voice recording support',
  'Track progress across sessions',
]

const stats = [
  { num: '5', label: 'Questions/session' },
  { num: 'AI', label: 'Powered feedback' },
  { num: '4+', label: 'Roles' },
]

const strengthLabels = ['', 'Weak', 'Medium', 'Strong']

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.post('/auth/register', form)
      navigate('/login', { state: { message: `${'\u2705'} Account created! Please login.` } })
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const strength =
    form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3

  return (
    <div className="flex min-h-screen w-full font-sans">

      {/* Left panel */}
      <div className="hidden w-[45%] shrink-0 items-center justify-center bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] px-10 py-12 lg:flex">
        <div className="w-full max-w-[340px]">
          <div className="mb-8 text-xl font-bold text-[#a5b4fc]">{'\u{1F3AF}'} PrepAI</div>
          <h2 className="mb-3 text-[28px] font-extrabold leading-tight tracking-tight text-white">
            Land your dream developer job
          </h2>
          <p className="mb-7 text-sm leading-7 text-white/60">
            Join developers acing their interviews with AI-powered practice sessions.
          </p>
          <div className="mb-8 flex flex-col gap-3">
            {features.map(f => (
              <div key={f} className="flex items-center gap-2.5">
                <span className="flex size-[18px] shrink-0 items-center justify-center rounded-full bg-[#6C63FF] text-[10px] font-bold text-white">
                  {'\u2713'}
                </span>
                <span className="text-[13px] text-white/75">{f}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-8 border-t border-white/10 pt-6">
            {stats.map(s => (
              <div key={s.label}>
                <div className="text-2xl font-extrabold text-[#a5b4fc]">{s.num}</div>
                <div className="mt-0.5 text-[11px] text-white/40">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex min-h-screen flex-1 items-center justify-center bg-[#f4f5fa] px-6 py-10">
        <div className="w-full max-w-[400px] rounded-[20px] border border-[#e8e8e8] bg-white p-8 shadow-[0_4px_32px_rgba(0,0,0,0.10)] sm:p-10">

          {/* Mobile-only logo, since left panel is hidden below lg */}
          <div className="mb-6 text-lg font-bold text-[#6C63FF] lg:hidden">{'\u{1F3AF}'} PrepAI</div>

          <h1 className="mb-1 text-[26px] font-bold text-[#111]">Create your account</h1>
          <p className="mb-8 text-[14px] text-[#999]">Free forever — no credit card needed</p>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="mb-2 block text-[13px] font-semibold text-[#444]">Full name</label>
              <input
                className="w-full rounded-xl border border-[#e2e2e2] bg-[#fafafa] px-4 py-3 text-[14px] text-[#111] placeholder-[#bbb] outline-none transition focus:border-[#6C63FF] focus:bg-white focus:ring-2 focus:ring-[#6C63FF]/15"
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-[13px] font-semibold text-[#444]">Email address</label>
              <input
                className="w-full rounded-xl border border-[#e2e2e2] bg-[#fafafa] px-4 py-3 text-[14px] text-[#111] placeholder-[#bbb] outline-none transition focus:border-[#6C63FF] focus:bg-white focus:ring-2 focus:ring-[#6C63FF]/15"
                type="email"
                placeholder="you@gmail.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-[13px] font-semibold text-[#444]">Password</label>
              <input
                className="w-full rounded-xl border border-[#e2e2e2] bg-[#fafafa] px-4 py-3 text-[14px] text-[#111] placeholder-[#bbb] outline-none transition focus:border-[#6C63FF] focus:bg-white focus:ring-2 focus:ring-[#6C63FF]/15"
                type="password"
                placeholder="Min 6 characters"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
                minLength={6}
              />
              {form.password.length > 0 && (
                <div className="mt-2 flex items-center gap-2.5">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#eee]">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        strength === 1 ? 'bg-red-500' : strength === 2 ? 'bg-amber-400' : 'bg-green-500'
                      }`}
                      style={{ width: `${(strength / 3) * 100}%` }}
                    />
                  </div>
                  <span
                    className={`w-12 text-[11px] font-semibold ${
                      strength === 1 ? 'text-red-500' : strength === 2 ? 'text-amber-500' : 'text-green-600'
                    }`}
                  >
                    {strengthLabels[strength]}
                  </span>
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full rounded-xl bg-[#6C63FF] py-3.5 text-[15px] font-bold text-white shadow-[0_4px_16px_rgba(108,99,255,0.35)] transition hover:bg-[#5b54e8] active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? 'Creating account...' : `Create Account ${'\u2192'}`}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#f0f0f0]" />
            <span className="text-[11px] text-[#ccc]">No credit card required</span>
            <div className="h-px flex-1 bg-[#f0f0f0]" />
          </div>

          <p className="text-center text-[13px] text-[#aaa]">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[#6C63FF] no-underline hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}