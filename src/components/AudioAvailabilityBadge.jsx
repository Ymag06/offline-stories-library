import { useEffect, useState } from 'react'
import { waitForLocalVoice } from '../lib/speechPlayback.js'

export default function AudioAvailabilityBadge({ story, language, text }) {
  const [available, setAvailable] = useState(null)

  useEffect(() => {
    let active = true
    setAvailable(null)

    if (story.audioEnabled === false) {
      setAvailable(false)
      return () => { active = false }
    }

    if (typeof window === 'undefined' || !('speechSynthesis' in window) || typeof window.SpeechSynthesisUtterance !== 'function') {
      setAvailable(false)
      return () => { active = false }
    }

    waitForLocalVoice(window.speechSynthesis, language)
      .then((voice) => { if (active) setAvailable(Boolean(voice)) })
      .catch(() => { if (active) setAvailable(false) })

    return () => { active = false }
  }, [language, story.audioEnabled])

  const state = available === null ? 'checking' : available ? 'available' : 'unavailable'
  const label = available === null ? text.audioChecking : available ? text.audioAvailable : text.audioUnavailable

  return (
    <span className={`audio-availability audio-availability-${state}`} aria-label={label} title={label}>
      <span aria-hidden="true">{available === false ? '◌' : '♫'}</span>
      {label}
    </span>
  )
}
