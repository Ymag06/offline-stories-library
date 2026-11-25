import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  approximateTimeAtCharacter,
  characterAtApproximateTime,
  createSpeechTiming,
  waitForLocalVoice,
} from '../lib/speechPlayback.js'
import { wordRangeAtCharacter } from '../lib/textSegmentation.js'

const SEEK_SECONDS = 5

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
    <section className="speech-controls" aria-label={labels.listenControls}>
      <div className="speech-status-row">
        <div>
          <span className="speech-controls-eyebrow">{labels.listenLabel}</span>
          <p className="speech-status" role="status" aria-live="polite">
            {status === 'checking' ? labels.speechChecking
              : status === 'unavailable' ? labels.speechUnavailable
                : status === 'error' ? labels.speechError
                  : status === 'paused' ? labels.audioPaused
                    : status === 'ended' ? labels.audioFinished
                      : labels.audioPlaying}
          </p>
        </div>
        {!unavailable && status !== 'checking' && (
          <button className="speech-play-button" type="button" onClick={togglePlayback} aria-label={status === 'speaking' ? labels.pauseAudio : labels.playAudio}>
            <span aria-hidden="true">{status === 'speaking' ? 'Ⅱ' : '▶'}</span>
            {status === 'speaking' ? labels.pauseAudio : labels.playAudio}
          </button>
        )}
      </div>

      {unavailable ? (
        <div className="speech-fallback">
          <p>{status === 'error' ? labels.speechErrorHelp : labels.speechUnavailableHelp}</p>
          <button className="speech-read-instead" type="button" onClick={onReadInstead}>{labels.readInstead}</button>
        </div>
      ) : (
        <>
          <div className="speech-seek-row">
            <button className="speech-seek-button" type="button" onClick={() => seekBy(-SEEK_SECONDS)} disabled={status === 'checking'} aria-label={labels.seekBackward}>
              <span aria-hidden="true">↶</span> −5s
            </button>
            <div className="speech-timeline">
              <label className="sr-only" htmlFor="speech-position">{labels.positionSlider}</label>
              <input
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
              <div className="speech-time-readout" aria-live="off">
                <span>~{formatTime(seekDraft ?? position)}</span>
                <span>~{formatTime(timing.duration)}</span>
              </div>
            </div>
            <button className="speech-seek-button" type="button" onClick={() => seekBy(SEEK_SECONDS)} disabled={status === 'checking'} aria-label={labels.seekForward}>
              +5s <span aria-hidden="true">↷</span>
            </button>
          </div>
          <p className="speech-approximate-note">{labels.approximatePosition}</p>
          <span className="sr-only">{voice?.name ? `${labels.localVoice}: ${voice.name}` : ''}</span>
        </>
      )}
    </section>
  )
}
