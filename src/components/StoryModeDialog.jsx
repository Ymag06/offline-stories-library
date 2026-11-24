import { useEffect, useRef, useState } from 'react'
import { getStoryTitle } from '../lib/storyContent.js'
import { waitForLocalVoice } from '../lib/speechPlayback.js'

export default function StoryModeDialog({ story, language, text, onChoose, onCancel }) {
  const readButtonRef = useRef(null)
  const [audioAvailability, setAudioAvailability] = useState('checking')

  const voiceLanguage = story.userCreated ? (story.language || language) : language

  useEffect(() => {
    let active = true

    if (story.audioEnabled === false) {
      setAudioAvailability('unavailable')
      return () => { active = false }
    }

    setAudioAvailability('checking')
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || typeof window.SpeechSynthesisUtterance !== 'function') {
      setAudioAvailability('unavailable')
      return () => { active = false }
    }

    waitForLocalVoice(window.speechSynthesis, voiceLanguage)
      .then((voice) => { if (active) setAudioAvailability(voice ? 'available' : 'unavailable') })
      .catch(() => { if (active) setAudioAvailability('unavailable') })

    return () => { active = false }
  }, [story.audioEnabled, story.id, voiceLanguage])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKeyDown)
    readButtonRef.current?.focus()
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onCancel])

  return (
    <div className="story-mode-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel() }}>
      <section
        className="story-mode-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="story-mode-title"
        aria-describedby="story-mode-description"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <span className="eyebrow">{text.brand}</span>
        <h2 id="story-mode-title">{text.storyModeTitle}</h2>
        <p id="story-mode-description">{text.storyModeDescription}</p>
        <strong className="story-mode-story-title">{getStoryTitle(story, language)}</strong>
        <div className="story-mode-options">
          <button ref={readButtonRef} className="story-mode-option story-mode-read" type="button" onClick={() => onChoose('read')}>
            <span className="story-mode-option-icon" aria-hidden="true">▤</span>
            <span><strong>{text.storyModeRead}</strong><small>{text.storyModeReadHelp}</small></span>
            <span className="story-mode-arrow" aria-hidden="true">→</span>
          </button>
          <button
            className={`story-mode-option story-mode-listen${audioAvailability === 'unavailable' ? ' is-unavailable' : audioAvailability === 'checking' ? ' is-checking' : ''}`}
            type="button"
            onClick={() => onChoose('listen')}
            disabled={audioAvailability !== 'available'}
          >
            <span className="story-mode-option-icon" aria-hidden="true">♫</span>
            <span>
              <strong>{audioAvailability === 'unavailable' ? text.storyModeListenUnavailable : text.storyModeListen}</strong>
              <small>{audioAvailability === 'checking' ? text.audioChecking : audioAvailability === 'unavailable' ? text.storyListenUnavailableHelp : text.storyModeListenHelp}</small>
            </span>
            <span className="story-mode-arrow" aria-hidden="true">{audioAvailability === 'unavailable' ? '×' : '→'}</span>
          </button>
        </div>
        <button className="story-mode-cancel" type="button" onClick={onCancel}>{text.cancel}</button>
      </section>
    </div>
  )
}
