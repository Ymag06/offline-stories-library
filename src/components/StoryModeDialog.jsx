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
    <div className="fixed inset-0 z-30 grid place-items-center overflow-y-auto bg-[rgba(21,38,32,0.52)] p-5 backdrop-blur-[5px]" onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel() }}>
      <section
        className="w-full max-w-[490px] rounded-[23px] border border-[rgba(28,48,43,0.1)] bg-card p-[clamp(22px,5vw,34px)] text-ink shadow-[0_22px_70px_rgba(17,33,26,0.25)] dark:border-line"
        role="dialog"
        aria-modal="true"
        aria-labelledby="story-mode-title"
        aria-describedby="story-mode-description"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <span className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#577065] dark:text-[#b7cbbd]">{text.brand}</span>
        <h2 className="mt-[7px] mb-2 font-story text-[clamp(22px,5vw,29px)] leading-[1.25] text-green-dark" id="story-mode-title">{text.storyModeTitle}</h2>
        <p className="m-0 text-[13px] leading-[1.65] text-muted" id="story-mode-description">{text.storyModeDescription}</p>
        <strong className="mt-[18px] mb-[13px] block text-sm text-ink">{getStoryTitle(story, language)}</strong>
        <div className="grid gap-[10px]">
          <button ref={readButtonRef} className="grid min-h-[76px] cursor-pointer grid-cols-[42px_minmax(0,1fr)_18px] items-center gap-3 rounded-[15px] border border-[rgba(28,48,43,0.12)] bg-white px-[15px] py-3 text-left text-ink transition-[border-color,transform] duration-150 hover:-translate-y-px hover:border-[#6d9b78] dark:border-line dark:bg-[#18211c] max-compact:grid-cols-[36px_minmax(0,1fr)_14px] max-compact:gap-[9px] max-compact:p-[11px]" type="button" onClick={() => onChoose('read')}>
            <span className="grid size-10 place-items-center rounded-[13px] bg-[#e9f1e6] text-[22px] text-green max-compact:size-9" aria-hidden="true">▤</span>
            <span className="grid gap-[3px]"><strong className="text-sm text-green-dark">{text.storyModeRead}</strong><small className="text-[11px] leading-[1.45] text-muted">{text.storyModeReadHelp}</small></span>
            <span className="text-lg text-[#74887a] dark:text-[#b8c9bd]" aria-hidden="true">→</span>
          </button>
          <button
            className={`grid min-h-[76px] cursor-pointer grid-cols-[42px_minmax(0,1fr)_18px] items-center gap-3 rounded-[15px] border border-[rgba(28,48,43,0.12)] bg-white px-[15px] py-3 text-left text-ink transition-[border-color,transform] duration-150 hover:-translate-y-px hover:border-[#6d9b78] dark:border-line dark:bg-[#18211c] max-compact:grid-cols-[36px_minmax(0,1fr)_14px] max-compact:gap-[9px] max-compact:p-[11px] ${audioAvailability === 'unavailable' ? 'cursor-not-allowed border-[rgba(180,55,49,0.25)] bg-[#fff4f1] hover:border-[rgba(180,55,49,0.25)] hover:transform-none dark:border-[rgba(255,151,145,0.4)] dark:bg-[#3b2827] dark:hover:border-[rgba(255,151,145,0.4)]' : audioAvailability === 'checking' ? 'cursor-wait disabled:cursor-wait hover:transform-none dark:border-line dark:bg-[#202b25]' : ''}`}
            type="button"
            onClick={() => onChoose('listen')}
            disabled={audioAvailability !== 'available'}
          >
            <span className={`grid size-10 place-items-center rounded-[13px] text-[22px] text-green max-compact:size-9 ${audioAvailability === 'unavailable' ? 'bg-[#f9dfdb] text-[#a33e38] dark:bg-[#593331] dark:text-[#ffd0cc]' : 'bg-[#e9f1e6]'}`} aria-hidden="true">♫</span>
            <span className="grid gap-[3px]">
              <strong className="text-sm text-green-dark">{audioAvailability === 'unavailable' ? text.storyModeListenUnavailable : text.storyModeListen}</strong>
              <small className="text-[11px] leading-[1.45] text-muted">{audioAvailability === 'checking' ? text.audioChecking : audioAvailability === 'unavailable' ? text.storyListenUnavailableHelp : text.storyModeListenHelp}</small>
            </span>
            <span className={`text-lg ${audioAvailability === 'unavailable' ? 'text-[#ad4942] dark:text-[#ffc3bc]' : 'text-[#74887a] dark:text-[#b8c9bd]'}`} aria-hidden="true">{audioAvailability === 'unavailable' ? '×' : '→'}</span>
          </button>
        </div>
        <button className="mx-auto mt-3 block min-h-10 cursor-pointer rounded-[10px] border-0 bg-transparent px-[14px] text-xs font-bold text-muted" type="button" onClick={onCancel}>{text.cancel}</button>
      </section>
    </div>
  )
}
