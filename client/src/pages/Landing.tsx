import { Fragment, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

const checklist = [
  'AI-generated questions for your exact role',
  'Instant score out of 10 per answer',
  'Detailed feedback + ideal answer shown',
  'Voice recording — speak like a real interview',
  'Track progress across sessions',
]

const stats = [
  { num: '5', label: 'Questions per session' },
  { num: 'AI', label: 'Instant feedback' },
  { num: '4+', label: 'Roles supported' },
  { num: '100%', label: 'Free to use' },
]

const steps = [
  { num: '01', icon: '\u{1F3AF}', title: 'Pick your role & level', desc: 'Choose from Frontend, Backend, Fullstack, Node.js. Select Junior, Mid, or Senior level.' },
  { num: '02', icon: '\u{1F916}', title: 'AI generates questions', desc: 'Get 5 real, role-specific interview questions generated fresh every session.' },
  { num: '03', icon: '\u{1F3A4}', title: 'Answer by voice or text', desc: 'Speak your answer like a real interview or type it — your choice every question.' },
  { num: '04', icon: '\u{1F4CA}', title: 'Get instant AI feedback', desc: 'Score out of 10, detailed feedback on what was good, and the ideal answer shown.' },
]

const features = [
  { icon: '\u{1F916}', title: 'AI-Generated Questions', desc: 'Real questions tailored to your role and experience level — never the same twice', className: 'bg-[#EEEDFE]' },
  { icon: '\u{1F4CA}', title: 'Instant Scoring', desc: 'Get scored out of 10 with detailed AI feedback explaining every point deducted', className: 'bg-[#E1F5EE]' },
  { icon: '\u{1F3A4}', title: 'Voice Recording', desc: 'Speak your answers just like a real interview using Web Speech API — no typing needed', className: 'bg-[#FAECE7]' },
  { icon: '\u23F1\uFE0F', title: 'Interview Timer', desc: 'Practice under real pressure with a per-question countdown just like actual interviews', className: 'bg-[#FAEEDA]' },
  { icon: '\u{1F4C8}', title: 'Progress Tracking', desc: 'Track your improvement across sessions with charts showing score trends over time', className: 'bg-[#E6F1FB]' },
  { icon: '\u{1F4C4}', title: 'PDF Reports', desc: 'Download a detailed interview report with all scores, feedback, and ideal answers', className: 'bg-[#EAF3DE]' },
]

const roles = [
  { icon: '\u269B\uFE0F', role: 'Frontend Developer', topics: 'React, TypeScript, CSS, Performance, Browser APIs' },
  { icon: '\u{1F527}', role: 'Backend Developer', topics: 'Node.js, APIs, Databases, Auth, System Design' },
  { icon: '\u{1F310}', role: 'Fullstack Developer', topics: 'End-to-end architecture, REST, React + Node' },
  { icon: '\u{1F4F1}', role: 'Node.js Developer', topics: 'Express, MongoDB, JWT, Microservices, Streams' },
]

export default function Landing() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (isAuthenticated()) navigate('/dashboard')
  }, [isAuthenticated, navigate])

  return (
    <div className="overflow-x-hidden font-sans text-[#1a1a1a]">
      <nav className="sticky top-0 z-[100] flex items-center justify-between border-b border-[#eee] bg-white px-4 py-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)] sm:px-8">
        <div className="text-xl font-bold text-[#6C63FF]">{'\u{1F3AF}'} PrepAI</div>
        <div className="flex items-center gap-2.5">
          <button className="rounded-lg border border-[#ddd] bg-transparent px-4 py-2 text-sm font-medium text-[#333] transition hover:border-[#6C63FF] hover:text-[#6C63FF]" onClick={() => navigate('/login')}>Login</button>
          <button className="rounded-lg bg-[#6C63FF] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#5b54e8]" onClick={() => navigate('/register')}>Get Started Free</button>
        </div>
      </nav>

      <section className="bg-[linear-gradient(160deg,#f8f7ff_0%,#fff_60%)] px-6 pb-16 pt-20 text-center">
        <div className="mb-6 inline-block rounded-full border border-[#dbd8ff] bg-[#f0effe] px-4 py-1.5 text-[13px] font-semibold text-[#6C63FF]">{'\u{1F916}'} Powered by AI · Free to use</div>
        <h1 className="mb-5 text-[clamp(36px,6vw,58px)] font-extrabold leading-[1.15] tracking-[-1.5px] text-[#1a1a1a]">
          Crack Your Next<br />
          <span className="bg-gradient-to-br from-[#6C63FF] to-[#9b8dff] bg-clip-text text-transparent">Tech Interview</span>
        </h1>
        <p className="mx-auto mb-8 max-w-[520px] text-lg leading-8 text-[#555]">
          AI generates real interview questions for your role and level.<br />
          Answer, get scored instantly, and improve with every session.
        </p>

        <div className="mb-10 inline-flex flex-col gap-2.5 rounded-xl border border-[#eee] bg-white px-6 py-5 text-left">
          {checklist.map(item => (
            <div key={item} className="flex items-center gap-2.5 text-sm text-[#333]">
              <span className="shrink-0 text-base font-bold text-[#1D9E75]">{'\u2713'}</span>
              <span>{item}</span>
            </div>
          ))}
        </div>

        <div className="mb-12 flex flex-wrap justify-center gap-3">
          <button className="rounded-[10px] bg-[#6C63FF] px-9 py-[15px] text-base font-bold text-white shadow-[0_4px_20px_rgba(108,99,255,0.3)] transition hover:bg-[#5b54e8] active:scale-[0.98]" onClick={() => navigate('/register')}>
            {'\u{1F680}'} Start Practicing Free
          </button>
          <button className="rounded-[10px] border-2 border-[#6C63FF] bg-white px-9 py-[15px] text-base font-semibold text-[#6C63FF] transition hover:bg-[#f8f7ff] active:scale-[0.98]" onClick={() => navigate('/login')}>
            I have an account {'\u2192'}
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 pt-8">
          {stats.map((stat, index) => (
            <Fragment key={stat.label}>
              <div className="flex flex-col items-center gap-1">
                <span className="text-[30px] font-extrabold text-[#6C63FF]">{stat.num}</span>
                <span className="text-xs text-[#888]">{stat.label}</span>
              </div>
              {index < stats.length - 1 && <div className="hidden h-10 w-px bg-[#e0e0e0] sm:block" />}
            </Fragment>
          ))}
        </div>
      </section>

      <section className="flex justify-center bg-[#f8f7ff] px-6 py-12">
        <div className="w-full max-w-[620px] overflow-hidden rounded-2xl border border-[#eee] bg-white shadow-[0_8px_40px_rgba(108,99,255,0.12)]">
          <div className="flex items-center gap-1.5 border-b border-[#eee] bg-[#f5f5f5] px-4 py-2.5">
            <div className="size-2.5 rounded-full bg-[#ddd]" />
            <div className="size-2.5 rounded-full bg-[#ddd]" />
            <div className="size-2.5 rounded-full bg-[#ddd]" />
            <span className="ml-2 text-xs text-[#999]">PrepAI — Interview in progress</span>
          </div>
          <div className="p-6">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="rounded-full bg-[#f0effe] px-2.5 py-1 text-[11px] font-semibold text-[#6C63FF]">Q2 of 5</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#eee]">
                <div className="h-full w-2/5 rounded-full bg-[#6C63FF]" />
              </div>
            </div>
            <p className="mb-4 text-left text-[17px] font-semibold leading-7 text-[#222]">
              How would you optimize a React app that has performance issues with deeply nested components?
            </p>
            <div className="mb-4 rounded-xl border border-[#eee] bg-[#fafafa] p-4 text-left">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-[#999]">Your answer</span>
              <p className="mt-1.5 text-sm leading-6 text-[#555]">
                I would use React.memo to prevent unnecessary re-renders, useMemo and useCallback for expensive computations...
              </p>
            </div>
            <div className="rounded-xl border border-[#dbd8ff] bg-[#f8f7ff] p-4 text-left">
              <div className="mb-2 flex items-center justify-between text-sm font-bold text-[#6C63FF]">
                <span>{'\u{1F916}'} AI Feedback</span>
                <span className="rounded-full bg-[#1D9E75] px-2 py-0.5 text-xs text-white">8/10</span>
              </div>
              <p className="text-sm leading-6 text-[#555]">
                Great answer! You covered memoization well. Consider also mentioning code splitting and React.lazy for further optimization.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 text-center">
        <h2 className="mb-2 text-[32px] font-extrabold text-[#1a1a1a]">How PrepAI works</h2>
        <p className="mb-10 text-base text-[#777]">From zero to interview-ready in minutes</p>
        <div className="mx-auto grid max-w-[1100px] gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map(step => (
            <div key={step.num} className="relative rounded-2xl border border-[#eee] bg-white p-6 text-left shadow-[0_4px_18px_rgba(0,0,0,0.04)]">
              <div className="mb-4 text-xs font-extrabold text-[#6C63FF]/40">{step.num}</div>
              <div className="mb-3 text-3xl">{step.icon}</div>
              <div className="mb-2 font-bold text-[#222]">{step.title}</div>
              <div className="text-sm leading-6 text-[#666]">{step.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#fafafa] px-6 py-16 text-center">
        <h2 className="mb-2 text-[32px] font-extrabold text-[#1a1a1a]">Everything you need to prepare</h2>
        <p className="mb-10 text-base text-[#777]">Built by a developer, for developers</p>
        <div className="mx-auto grid max-w-[1050px] gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map(feature => (
            <div key={feature.title} className={`rounded-2xl p-6 text-left ${feature.className}`}>
              <div className="mb-4 text-4xl">{feature.icon}</div>
              <div className="mb-2 text-lg font-bold text-[#1a1a1a]">{feature.title}</div>
              <div className="text-sm leading-6 text-[#555]">{feature.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-16 text-center">
        <h2 className="mb-2 text-[32px] font-extrabold text-[#1a1a1a]">Built for your role</h2>
        <p className="mb-10 text-base text-[#777]">Questions are customized for each track</p>
        <div className="mx-auto grid max-w-[1000px] gap-5 md:grid-cols-2 lg:grid-cols-4">
          {roles.map(role => (
            <div key={role.role} className="rounded-2xl border border-[#eee] bg-white p-6 text-center shadow-[0_4px_18px_rgba(0,0,0,0.04)] transition hover:-translate-y-1 hover:shadow-[0_8px_28px_rgba(0,0,0,0.08)]">
              <div className="mb-4 text-4xl">{role.icon}</div>
              <div className="mb-2 font-bold text-[#222]">{role.role}</div>
              <div className="mb-5 text-sm leading-6 text-[#666]">{role.topics}</div>
              <button className="rounded-lg bg-[#f0effe] px-4 py-2 text-sm font-semibold text-[#6C63FF] transition hover:bg-[#6C63FF] hover:text-white" onClick={() => navigate('/register')}>
                Practice now {'\u2192'}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#f8f7ff] px-6 py-16">
        <div className="mx-auto max-w-[760px] rounded-3xl bg-white p-8 text-center shadow-[0_8px_30px_rgba(108,99,255,0.12)] sm:p-10">
          <div className="text-xl font-semibold leading-9 text-[#333]">
            "The best way to prepare for technical interviews is deliberate practice with real feedback. PrepAI gives you exactly that — at any time, for free."
          </div>
          <div className="mt-5 text-sm font-semibold text-[#6C63FF]">— Built for developers actively job hunting</div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#6C63FF] to-[#9b8dff] px-6 py-16 text-center text-white">
        <div className="mx-auto max-w-[680px]">
          <h2 className="mb-4 text-[34px] font-extrabold text-white">Ready to land your next job?</h2>
          <p className="mb-7 text-base leading-7 text-white/85">
            Start practicing right now — no credit card, no setup, completely free.
          </p>
          <button className="rounded-[10px] bg-white px-9 py-[15px] text-base font-bold text-[#6C63FF] shadow-[0_4px_20px_rgba(0,0,0,0.16)] transition hover:bg-[#f8f7ff] active:scale-[0.98]" onClick={() => navigate('/register')}>
            {'\u{1F680}'} Create Free Account
          </button>
          <p className="mt-4 text-sm text-white/70">Takes 30 seconds to get started</p>
        </div>
      </section>

      <footer className="bg-[#111827] px-6 py-8 text-white">
        <div className="mx-auto flex max-w-[1100px] flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-1 text-xl font-bold text-[#a5b4fc]">{'\u{1F3AF}'} PrepAI</div>
            <div className="text-sm text-white/50">Practice smarter. Interview better.</div>
          </div>
          <div className="flex gap-3">
            <button className="text-sm font-medium text-white/70 transition hover:text-white" onClick={() => navigate('/register')}>Get Started</button>
            <button className="text-sm font-medium text-white/70 transition hover:text-white" onClick={() => navigate('/login')}>Login</button>
          </div>
        </div>
        <div className="mx-auto max-w-[1100px] pt-5 text-center text-xs text-white/40 sm:text-left">
          Built with React · TypeScript · Node.js · MongoDB · AI
        </div>
      </footer>
    </div>
  )
}