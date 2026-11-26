import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  approximateTimeAtCharacter,
  characterAtApproximateTime,
  createSpeechTiming,
  waitForLocalVoice,
} from '../lib/speechPlayback.js'
import { wordRangeAtCharacter } from '../lib/textSegmentation.js'

const SEEK_SECONDS = 5
const speechButtonClasses = 'inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border-0 bg-green px-[14px] text-xs font-[750] text-white'
const seekButtonClasses = 'inline-flex min-h-[38px] cursor-pointer items-center justify-center gap-1 whitespace-nowrap rounded-[10px] border border-[rgba(28,48,43,0.12)] bg-white px-[9px] text-[11px] font-[750] text-green-dark disabled:cursor-default disabled:opacity-[0.45] dark:border-line dark:bg-[#18211c] dark:text-ink dark:disabled:text-[#b6c5ba]'

function formatTime(seconds) {
  const bounded = Math.max(0, Math.floor(seconds || 0))
  return `${Math.floor(bounded / 60)}:${String(bounded % 60).padStart(2, '0')}`
}

export default function SpeechControls({ storyText, language, labels, onPageComplete, onWordBoundary, onReadInstead, suspendAudio = false }) {
  const timing = useMemo(() => createSpeechTiming(storyText, language), [storyText, language])
  const [voice, setVoice] = useState(null)
  const [status, setStatus] = useState('checking')
  const [position, setPosition] = useState(0)
  const [seekDraft, setSeekDraft] = useState(null)
  const positionRef = useRef(0)
  const seekDraftRef = useRef(null)
  const voiceRef = useRef(null)
  const utteranceRef = useRef(null)
  const synthesisRef = useRef(null)
  const generationRef = useRef(0)
  const anchorPositionRef = useRef(0)
  const startedAtRef = useRef(0)
  const pageCompleteRef = useRef(onPageComplete)
  const wordBoundaryRef = useRef(onWordBoundary)

  useEffect(() => { pageCompleteRef.current = onPageComplete }, [onPageComplete])
  useEffect(() => { wordBoundaryRef.current = onWordBoundary }, [onWordBoundary])

  const updatePosition = useCallback((nextPosition) => {
    const bounded = Math.max(0, Math.min(timing.duration, nextPosition))
    positionRef.current = bounded
    setPosition(bounded)
  }, [timing.duration])

  const startFromPosition = useCallback((requestedPosition, playImmediately = true) => {
    const synthesis = synthesisRef.current
    const selectedVoice = voiceRef.current
    if (!synthesis || !selectedVoice) return

    const startPosition = Math.max(0, Math.min(timing.duration, requestedPosition))
    const characterIndex = characterAtApproximateTime(startPosition, timing)
    generationRef.current += 1
    const generation = generationRef.current
    synthesis.cancel()
    updatePosition(startPosition)
    wordBoundaryRef.current?.(null)
    anchorPositionRef.current = startPosition
    startedAtRef.current = Date.now()

    if (!playImmediately || characterIndex >= storyText.length) {
      utteranceRef.current = null
      if (!playImmediately && characterIndex < storyText.length) {
        wordBoundaryRef.current?.(wordRangeAtCharacter(timing.wordRanges, characterIndex))
      }
      setStatus(playImmediately ? 'ended' : 'paused')
      if (playImmediately && characterIndex >= storyText.length) pageCompleteRef.current?.()
      return
    }

    const utterance = new SpeechSynthesisUtterance(storyText.slice(characterIndex))
    utterance.voice = selectedVoice
    utterance.lang = selectedVoice.lang || (language === 'my' ? 'my-MM' : 'en-US')
    utterance.rate = 1
    utteranceRef.current = utterance
    utterance.onboundary = (event) => {
      if (generation !== generationRef.current || !Number.isFinite(event.charIndex)) return
      const absoluteCharacter = characterIndex + event.charIndex
      updatePosition(approximateTimeAtCharacter(absoluteCharacter, storyText, timing))
      const boundaryName = String(event.name || '').toLowerCase()
      if (!boundaryName || boundaryName === 'word') {
        wordBoundaryRef.current?.(wordRangeAtCharacter(timing.wordRanges, absoluteCharacter))
      } else {
        wordBoundaryRef.current?.(null)
      }
    }
    utterance.onend = () => {
      if (generation !== generationRef.current) return
      utteranceRef.current = null
      updatePosition(timing.duration)
      setStatus('ended')
      pageCompleteRef.current?.()
    }
    utterance.onerror = (event) => {
      if (generation !== generationRef.current || event.error === 'canceled' || event.error === 'interrupted') return
      utteranceRef.current = null
      wordBoundaryRef.current?.(null)
      setStatus('error')
    }

    setStatus('speaking')
    synthesis.speak(utterance)
  }, [language, storyText, timing, updatePosition])

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || typeof window.SpeechSynthesisUtterance !== 'function') {
      setStatus('unavailable')
      return undefined
    }

    let active = true
    const synthesis = window.speechSynthesis
    synthesisRef.current = synthesis
    waitForLocalVoice(synthesis, language)
      .then((localVoice) => {
        if (!active) return
        if (!localVoice) {
          setStatus('unavailable')
          return
        }
        voiceRef.current = localVoice
        setVoice(localVoice)
        startFromPosition(positionRef.current)
      })
      .catch(() => { if (active) setStatus('unavailable') })

    return () => {
      active = false
      generationRef.current += 1
      synthesis.cancel()
      utteranceRef.current = null
      synthesisRef.current = null
    }
  }, [language, startFromPosition])

  useEffect(() => {
    if (status !== 'speaking') return undefined
    const timer = window.setInterval(() => {
      const elapsed = Math.max(0, (Date.now() - startedAtRef.current) / 1000)
      updatePosition(Math.min(timing.duration, anchorPositionRef.current + elapsed))
    }, 250)
    return () => window.clearInterval(timer)
  }, [status, timing.duration, updatePosition])

  useEffect(() => {
    if (!suspendAudio || status !== 'speaking') return
    const elapsed = Math.max(0, (Date.now() - startedAtRef.current) / 1000)
    const pausedAt = Math.min(timing.duration, anchorPositionRef.current + elapsed)
    updatePosition(pausedAt)
    anchorPositionRef.current = pausedAt
    synthesisRef.current?.pause()
    setStatus('paused')
  }, [status, suspendAudio, timing.duration, updatePosition])

  const togglePlayback = () => {
    const synthesis = synthesisRef.current
    if (!synthesis || !voiceRef.current) return
    if (status === 'speaking') {
      const elapsed = Math.max(0, (Date.now() - startedAtRef.current) / 1000)
      const pausedAt = Math.min(timing.duration, anchorPositionRef.current + elapsed)
      updatePosition(pausedAt)
      anchorPositionRef.current = pausedAt
      synthesis.pause()
      setStatus('paused')
      return
    }
    if (status === 'paused' && utteranceRef.current) {
      anchorPositionRef.current = positionRef.current
      startedAtRef.current = Date.now()
      synthesis.resume()
      setStatus('speaking')
      return
    }
    const restartAt = status === 'ended' ? 0 : positionRef.current
    startFromPosition(restartAt)
  }

  const commitSeek = (requestedPosition) => {
    const wasPlaying = status === 'speaking'
    const bounded = Math.max(0, Math.min(timing.duration, requestedPosition))
    updatePosition(bounded)
    seekDraftRef.current = null
    setSeekDraft(null)
    if (voiceRef.current) startFromPosition(bounded, wasPlaying)
  }

  const seekBy = (amount) => commitSeek((seekDraftRef.current ?? positionRef.current) + amount)

  const beginSeek = (value) => {
    const next = Number(value)
    seekDraftRef.current = next
    setSeekDraft(next)
  }

  const handleSeekKeyUp = (event) => {
    if (['ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown'].includes(event.key)) {
      commitSeek(seekDraftRef.current ?? positionRef.current)
    }
  }

  const unavailable = status === 'unavailable' || status === 'error'

  return (
    <section className="mt-4 mb-[5px] rounded-[17px] border border-[rgba(28,48,43,0.09)] bg-[#eef3eb] px-[18px] pt-4 pb-3 dark:border-line dark:bg-[#202e26] max-compact:px-3 max-compact:pt-[13px] max-compact:pb-[11px]" aria-label={labels.listenControls}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#69816e]">{labels.listenLabel}</span>
          <p className="mt-[3px] mb-0 text-xs font-bold text-green-dark" role="status" aria-live="polite">
            {status === 'checking' ? labels.speechChecking
              : status === 'unavailable' ? labels.speechUnavailable
                : status === 'error' ? labels.speechError
                  : status === 'paused' ? labels.audioPaused
                    : status === 'ended' ? labels.audioFinished
                      : labels.audioPlaying}
          </p>
        </div>
        {!unavailable && status !== 'checking' && (
          <button className={`${speechButtonClasses} dark:text-[#10251a]`} type="button" onClick={togglePlayback} aria-label={status === 'speaking' ? labels.pauseAudio : labels.playAudio}>
            <span className="text-[15px]" aria-hidden="true">{status === 'speaking' ? 'Ⅱ' : '▶'}</span>
            {status === 'speaking' ? labels.pauseAudio : labels.playAudio}
          </button>
        )}
      </div>

      {unavailable ? (
        <div className="mt-[10px] flex items-center justify-between gap-[15px] max-compact:items-stretch max-compact:flex-col max-compact:gap-[10px]">
          <p className="m-0 max-w-[570px] text-[11px] leading-[1.55] text-[#52675a] dark:text-[#d2ddd5]">{status === 'error' ? labels.speechErrorHelp : labels.speechUnavailableHelp}</p>
          <button className={`${speechButtonClasses} shrink-0 self-start`} type="button" onClick={onReadInstead}>{labels.readInstead}</button>
        </div>
      ) : (
        <>
          <div className="mt-3 grid grid-cols-[auto_minmax(60px,1fr)_auto] items-center gap-[10px] max-compact:grid-cols-2 max-compact:gap-[7px]">
            <button className={seekButtonClasses} type="button" onClick={() => seekBy(-SEEK_SECONDS)} disabled={status === 'checking'} aria-label={labels.seekBackward}>
              <span className="text-[15px]" aria-hidden="true">↶</span> −5s
            </button>
            <div className="min-w-0 max-compact:col-span-full max-compact:row-start-1">
              <label className="sr-only" htmlFor="speech-position">{labels.positionSlider}</label>
              <input
                className="m-0 block min-h-7 w-full cursor-pointer accent-[#548462] disabled:cursor-wait"
                id="speech-position"
                type="range"
                min="0"
                max={timing.duration}
                step="1"
                value={seekDraft ?? position}
                disabled={status === 'checking'}
                onChange={(event) => beginSeek(event.target.value)}
                onPointerUp={() => { if (seekDraftRef.current !== null) commitSeek(seekDraftRef.current) }}
                onKeyUp={handleSeekKeyUp}
                onBlur={() => { if (seekDraftRef.current !== null) commitSeek(seekDraftRef.current) }}
              />
              <div className="flex justify-between text-[10px] tabular-nums text-[#63796a] dark:text-[#b6c5ba]" aria-live="off">
                <span>~{formatTime(seekDraft ?? position)}</span>
                <span>~{formatTime(timing.duration)}</span>
              </div>
            </div>
            <button className={seekButtonClasses} type="button" onClick={() => seekBy(SEEK_SECONDS)} disabled={status === 'checking'} aria-label={labels.seekForward}>
              +5s <span className="text-[15px]" aria-hidden="true">↷</span>
            </button>
          </div>
          <p className="mt-[7px] mb-0 text-[10px] leading-[1.45] text-[#75857a] dark:text-[#b6c5ba]">{labels.approximatePosition}</p>
          <span className="sr-only">{voice?.name ? `${labels.localVoice}: ${voice.name}` : ''}</span>
        </>
      )}
    </section>
  )
}
