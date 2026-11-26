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
  const stateClasses = {
    checking: 'border-[rgba(95,105,99,0.16)] bg-[#f4f4ef] text-[#758078] dark:border-line dark:bg-[#29342e] dark:text-[#c4cec7]',
    available: 'border-[rgba(69,113,79,0.22)] bg-[#edf4e9] text-[#426b4a] dark:border-[rgba(131,196,154,0.32)] dark:bg-[#253c2c] dark:text-[#c5ebce]',
    unavailable: 'border-[rgba(180,55,49,0.24)] bg-[#fff0ed] text-[#9e3934] dark:border-[rgba(255,151,145,0.45)] dark:bg-[#492b2b] dark:text-[#ffd0cc]',
  }

  return (
    <span className={`inline-flex w-fit max-w-full items-center gap-[5px] rounded-full border px-2 py-1 text-[10px] font-[750] leading-[1.35] ${stateClasses[state]}`} aria-label={label} title={label}>
      <span className="text-xs" aria-hidden="true">{available === false ? '◌' : '♫'}</span>
      {label}
    </span>
  )
}
