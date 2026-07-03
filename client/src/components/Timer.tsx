import { useEffect, useState, useRef } from 'react'

interface TimerProps {
  seconds: number
  onTimeUp: () => void
  isRunning: boolean
}

export default function Timer({ seconds, onTimeUp, isRunning }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(seconds)
  const intervalRef = useRef<any>(null)

  useEffect(() => {
    setTimeLeft(seconds)
  }, [seconds])

  useEffect(() => {
    if (!isRunning) {
      clearInterval(intervalRef.current)
      return
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current)
          onTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(intervalRef.current)
  }, [isRunning, onTimeUp])

  const percent = (timeLeft / seconds) * 100
  const isWarning = timeLeft <= 30
  const isDanger = timeLeft <= 10

  const color = isDanger ? '#c00' : isWarning ? '#b45309' : '#6C63FF'
  const bgColor = isDanger ? '#fff0f0' : isWarning ? '#fff8e1' : '#f0effe'

  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60
  const display = `${mins}:${secs.toString().padStart(2, '0')}`

  // Circle SVG values
  const radius = 28
  const circumference = 2 * Math.PI * radius
  const strokeDash = (percent / 100) * circumference

  return (
    <div style={{ ...styles.container, background: bgColor, borderColor: color + '33' }}>
      <svg width="70" height="70" style={styles.svg}>
        {/* Background circle */}
        <circle
          cx="35" cy="35" r={radius}
          fill="none"
          stroke="#eee"
          strokeWidth="4"
        />
        {/* Progress circle */}
        <circle
          cx="35" cy="35" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeDasharray={`${strokeDash} ${circumference}`}
          strokeLinecap="round"
          transform="rotate(-90 35 35)"
          style={{ transition: 'stroke-dasharray 1s linear, stroke 0.3s' }}
        />
        {/* Time text */}
        <text
          x="35" y="40"
          textAnchor="middle"
          fontSize="13"
          fontWeight="700"
          fill={color}
        >
          {display}
        </text>
      </svg>
      <div style={styles.label}>
        {isDanger ? '⚠️ Time almost up!' : isWarning ? '⏳ Hurry up!' : '⏱️ Time left'}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    padding: '10px 16px',
    borderRadius: '12px',
    border: '1px solid',
    transition: 'all 0.3s'
  },
  svg: { display: 'block' },
  label: { fontSize: '11px', fontWeight: 500, color: '#666' }
}