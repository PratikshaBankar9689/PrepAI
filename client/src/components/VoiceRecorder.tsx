import { useState, useRef, useEffect } from 'react'

interface VoiceRecorderProps {
  onTranscript: (text: string) => void
  disabled?: boolean
}

// Browser SpeechRecognition type
const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

export default function VoiceRecorder({ onTranscript, disabled }: VoiceRecorderProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState('')
  const [supported, setSupported] = useState(true)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    if (!SpeechRecognition) {
      setSupported(false)
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event: any) => {
      let finalText = ''
      let interimText = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalText += result[0].transcript
        } else {
          interimText += result[0].transcript
        }
      }

      const fullText = transcript + finalText
      setTranscript(fullText)
      onTranscript(fullText + interimText)
    }

    recognition.onerror = (event: any) => {
      if (event.error === 'not-allowed') {
        setError('Microphone access denied. Please allow microphone in browser settings.')
      } else if (event.error === 'no-speech') {
        setError('No speech detected. Try again.')
      } else {
        setError(`Error: ${event.error}`)
      }
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition
  }, [transcript])

  const startListening = () => {
    if (!supported) return
    setError('')
    setIsListening(true)
    recognitionRef.current?.start()
  }

  const stopListening = () => {
    recognitionRef.current?.stop()
    setIsListening(false)
  }

  const clearTranscript = () => {
    setTranscript('')
    onTranscript('')
    setError('')
  }

  if (!supported) {
    return (
      <div style={styles.unsupported}>
        🎤 Voice not supported in this browser. Use Chrome or Edge.
      </div>
    )
  }

  return (
    <div style={styles.container}>

      {/* Buttons row */}
      <div style={styles.btnRow}>
        {!isListening ? (
          <button
            style={{
              ...styles.micBtn,
              opacity: disabled ? 0.5 : 1,
              cursor: disabled ? 'not-allowed' : 'pointer'
            }}
            onClick={startListening}
            disabled={disabled}
          >
            <span style={styles.micIcon}>🎤</span>
            <span>Start Speaking</span>
          </button>
        ) : (
          <button style={styles.stopBtn} onClick={stopListening}>
            <span style={styles.pulse} />
            <span>Stop Recording</span>
          </button>
        )}

        {transcript && !isListening && (
          <button style={styles.clearBtn} onClick={clearTranscript}>
            🗑️ Clear
          </button>
        )}
      </div>

      {/* Live indicator */}
      {isListening && (
        <div style={styles.liveRow}>
          <span style={styles.liveDot} />
          <span style={styles.liveText}>Listening... speak now</span>
        </div>
      )}

      {/* Error */}
      {error && <div style={styles.error}>{error}</div>}

      {/* Tip */}
      {!isListening && !transcript && (
        <div style={styles.tip}>
          💡 Click "Start Speaking" and answer out loud — works best in Chrome
        </div>
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: { marginTop: '12px' },
  btnRow: { display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' },
  micBtn: {
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '10px 20px', background: '#6C63FF', color: '#fff',
    border: 'none', borderRadius: '8px', fontSize: '14px',
    fontWeight: 600, cursor: 'pointer'
  },
  stopBtn: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '10px 20px', background: '#c00', color: '#fff',
    border: 'none', borderRadius: '8px', fontSize: '14px',
    fontWeight: 600, cursor: 'pointer', position: 'relative'
  },
  micIcon: { fontSize: '16px' },
  pulse: {
    display: 'inline-block', width: '10px', height: '10px',
    borderRadius: '50%', background: '#fff',
    animation: 'pulse 1s infinite'
  },
  clearBtn: {
    padding: '10px 16px', background: 'transparent',
    border: '1px solid #ddd', borderRadius: '8px',
    fontSize: '13px', cursor: 'pointer', color: '#666'
  },
  liveRow: {
    display: 'flex', alignItems: 'center', gap: '8px',
    marginTop: '10px', padding: '8px 12px',
    background: '#fff0f0', borderRadius: '8px',
    border: '1px solid #fca5a5'
  },
  liveDot: {
    width: '8px', height: '8px', borderRadius: '50%',
    background: '#c00', animation: 'pulse 1s infinite',
    flexShrink: 0
  },
  liveText: { fontSize: '13px', color: '#c00', fontWeight: 500 },
  error: {
    marginTop: '8px', padding: '8px 12px',
    background: '#fff0f0', color: '#c00',
    borderRadius: '8px', fontSize: '13px'
  },
  tip: {
    marginTop: '8px', fontSize: '12px',
    color: '#999', fontStyle: 'italic'
  },
  unsupported: {
    padding: '10px 14px', background: '#fff8e1',
    border: '1px solid #fde68a', borderRadius: '8px',
    fontSize: '13px', color: '#b45309', marginTop: '8px'
  }
}