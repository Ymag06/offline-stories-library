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

    if (story.audioFiles?.[language]) {
      setAvailable(true)
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
  }, [language, story.audioEnabled, story.audioFiles])

  const state = available === null ? 'checking' : available ? 'available' : 'unavailable'
  const label = available === null ? text.audioChecking : available ? text.audioAvailable : text.audioUnavailable
  const stateClasses = {
    checking: 'border-line bg-[#f2f5fb] text-[#65738b] dark:border-line dark:bg-[#2b3650] dark:text-[#c4cee2]',
    available: 'border-[rgba(69,140,91,0.24)] bg-[#eaf6ec] text-[#356c43] dark:border-[rgba(131,196,154,0.32)] dark:bg-[#253c2c] dark:text-[#c5ebce]',
    unavailable: 'border-[rgba(211,87,71,0.24)] bg-[#fff0ed] text-[#9e3934] dark:border-[rgba(255,151,145,0.45)] dark:bg-[#492b2b] dark:text-[#ffd0cc]',
  }

  return (
    <span className={`inline-flex w-fit max-w-full items-center gap-[5px] rounded-full border px-2 py-1 text-[10px] font-[750] leading-[1.35] ${stateClasses[state]}`} aria-label={label} title={label}>
      <span className="text-xs" aria-hidden="true">{available === false ? '◌' : '♫'}</span>
      {label}
    </span>
  )
}
