import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock } from 'lucide-react'
import api from '../api/axios'
import { useAuthStore } from '../store/useAuthStore'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setAuth } = useAuthStore()
  const [form, setForm] = useState({ email: '', password: '' })
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const successMessage = (location.state as any)?.message

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/auth/login', form)
      setAuth(data.user, data.accessToken)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#0f0c29] px-4 py-10 font-sans">

      {/* Ambient gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#4c1d95_0%,transparent_50%),radial-gradient(circle_at_80%_30%,#7c3aed_0%,transparent_45%),radial-gradient(circle_at_50%_85%,#1e1b4b_0%,transparent_55%)]" />
      <div className="absolute inset-0 bg-[#0f0c29]/40" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-[380px] rounded-[28px] border border-white/15 bg-white/10 p-8 shadow-[0_8px_60px_rgba(0,0,0,0.4)] backdrop-blur-2xl">

        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-white/10 text-3xl">
            {'\u{1F3AF}'}
          </div>
          <h1 className="text-xl font-bold text-white">Welcome back</h1>
          <p className="mt-1 text-[13px] text-white/60">Login to continue your practice</p>
        </div>

        {successMessage && (
          <div className="mb-5 rounded-xl border border-green-300/30 bg-green-400/10 px-4 py-3 text-center text-[13px] text-green-200">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="mb-5 rounded-xl border border-red-300/30 bg-red-400/10 px-4 py-3 text-center text-[13px] text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex items-center gap-3 border-b border-white/25 pb-2 transition focus-within:border-white/70">
            <Mail className="size-[18px] text-white/50" strokeWidth={1.75} />
            <input
              className="w-full bg-transparent text-[14px] text-white placeholder-white/40 outline-none"
              type="email"
              placeholder="Email ID"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="flex items-center gap-3 border-b border-white/25 pb-2 transition focus-within:border-white/70">
            <Lock className="size-[18px] text-white/50" strokeWidth={1.75} />
            <input
              className="w-full bg-transparent text-[14px] text-white placeholder-white/40 outline-none"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <div className="flex items-center justify-between text-[12.5px] text-white/60">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                className="size-3.5 accent-[#a78bfa]"
              />
              Remember me
            </label>
            <button type="button" className="text-white/60 hover:text-white transition">
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full rounded-full bg-gradient-to-r from-[#7c3aed] to-[#4f46e5] py-3.5 text-[14px] font-bold uppercase tracking-wide text-white shadow-[0_4px_24px_rgba(124,58,237,0.5)] transition hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-7 text-center text-[13px] text-white/50">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-white hover:underline">
            Create one free
          </Link>
        </p>
      </div>
    </div>
  )
}