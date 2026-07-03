import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="sticky top-0 z-[100] flex h-[62px] items-center justify-between border-b border-[#f0f0f0] bg-white px-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)] sm:px-7">
      <div className="flex items-center gap-4 sm:gap-8">
        <button className="flex cursor-pointer items-center gap-1.5 bg-transparent text-xl" onClick={() => navigate('/dashboard')}>
          {'\u{1F3AF}'} <span className="text-lg font-bold text-[#6C63FF]">PrepAI</span>
        </button>
        <div className="flex gap-1">
          <button
            className={`rounded-lg bg-transparent px-3.5 py-1.5 text-sm transition hover:bg-[#f8f7ff] ${isActive('/dashboard') ? 'font-semibold text-[#6C63FF]' : 'font-normal text-[#555]'}`}
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden items-center gap-2 rounded-full bg-[#f5f5f5] px-3 py-1.5 sm:flex">
          <div className="flex size-[26px] items-center justify-center rounded-full bg-gradient-to-br from-[#6C63FF] to-[#9b8dff] text-xs font-bold text-white">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <span className="text-[13px] font-medium text-[#333]">{user?.name}</span>
        </div>
        <button className="rounded-lg border border-[#e8e8e8] bg-transparent px-4 py-[7px] text-[13px] font-medium text-[#666] transition hover:border-[#6C63FF] hover:text-[#6C63FF]" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  )
}

