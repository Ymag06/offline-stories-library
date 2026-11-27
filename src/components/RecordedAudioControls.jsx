import { useEffect, useRef, useState } from 'react'

const buttonClasses = 'inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[rgba(28,48,43,0.12)] bg-white px-3 text-xs font-extrabold text-green-dark transition-[transform,background] hover:bg-[#f7f8f4] active:scale-[0.97] disabled:cursor-default disabled:opacity-50 dark:border-line dark:bg-[#18211c] dark:text-ink'
const speedOptions = [0.75, 1, 1.25, 1.5]

function formatTime(seconds) {
  const bounded = Math.max(0, Math.floor(seconds || 0))
  return `${Math.floor(bounded / 60)}:${String(bounded % 60).padStart(2, '0')}`
}

export default function RecordedAudioControls({
  src,
  labels,
  initialPosition = 0,
  onPositionChange,
  onTimeUpdate,
  onComplete,
  onReadInstead,
  suspendAudio = false,
  seekRequest,
  timingNotice,
}) {
  const audioRef = useRef(null)
  const initialPositionRef = useRef(initialPosition)
  const lastSavedPositionRef = useRef(initialPosition)
  const [audioUrl, setAudioUrl] = useState('')
  const [position, setPosition] = useState(initialPosition)
  const [duration, setDuration] = useState(0)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    const controller = new AbortController()
    let objectUrl = ''

    setAudioUrl('')
    setStatus('loading')
    fetch(src, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Narration could not be loaded')
        return response.blob()
      })
      .then((audioFile) => {
        objectUrl = URL.createObjectURL(audioFile)
        setAudioUrl(objectUrl)
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setStatus('error')
      })

    return () => {
      controller.abort()
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [src])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !audioUrl) return undefined

    let active = true
    const prepareAudio = () => {
      if (!active) return
      const total = Number.isFinite(audio.duration) ? audio.duration : 0
      setDuration(total)
      const resumeAt = Math.min(Math.max(0, initialPositionRef.current), Math.max(0, total - 0.25))
      audio.currentTime = resumeAt
      audio.playbackRate = playbackRate
      setPosition(resumeAt)
      lastSavedPositionRef.current = resumeAt
      onTimeUpdate?.(resumeAt)
      audio.play().catch(() => {
        if (active) setStatus('paused')
      })
    }

    if (audio.readyState >= 1) prepareAudio()
    else audio.addEventListener('loadedmetadata', prepareAudio, { once: true })

    return () => {
      active = false
      audio.pause()
      audio.removeEventListener('loadedmetadata', prepareAudio)
    }
  }, [audioUrl])

  useEffect(() => {
    if (suspendAudio) audioRef.current?.pause()
  }, [suspendAudio])

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = playbackRate
  }, [audioUrl, playbackRate])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !seekRequest || !duration) return

    const nextPosition = Math.max(0, Math.min(duration, Number(seekRequest.seconds)))
    audio.currentTime = nextPosition
    setPosition(nextPosition)
    onTimeUpdate?.(nextPosition)
    savePosition(nextPosition, true)
    audio.play().catch(() => setStatus('error'))
  }, [duration, seekRequest])

  const savePosition = (seconds, force = false) => {
    if (force || Math.abs(seconds - lastSavedPositionRef.current) >= 5) {
      lastSavedPositionRef.current = seconds
      onPositionChange?.(seconds)
    }
  }

  const updatePosition = (seconds) => {
    setPosition(seconds)
    onTimeUpdate?.(seconds)
  }

  const handleTimeUpdate = () => {
    const audio = audioRef.current
    if (!audio) return
    updatePosition(audio.currentTime)
    savePosition(audio.currentTime)
  }

  const togglePlayback = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      if (audio.ended) audio.currentTime = 0
      audio.play().catch(() => setStatus('error'))
    } else {
      audio.pause()
    }
  }

  const seekBy = (amount) => {
    const audio = audioRef.current
    if (!audio || !duration) return
    const nextPosition = Math.max(0, Math.min(duration, audio.currentTime + amount))
    audio.currentTime = nextPosition
    updatePosition(nextPosition)
    savePosition(nextPosition, true)
  }

  const handleSeek = (value) => {
    const audio = audioRef.current
    const nextPosition = Math.max(0, Math.min(duration, Number(value)))
    if (audio) audio.currentTime = nextPosition
    updatePosition(nextPosition)
    savePosition(nextPosition, true)
  }

  const handleEnded = () => {
    setStatus('ended')
    updatePosition(duration)
    savePosition(0, true)
    onComplete?.()
  }

  const unavailable = status === 'error'

  return (
    <section className="mt-4 mb-[5px] rounded-[17px] border border-[rgba(28,48,43,0.09)] bg-[#eef3eb] px-[18px] pt-4 pb-3 dark:border-line dark:bg-[#202e26] max-compact:px-3 max-compact:pt-[13px] max-compact:pb-[11px]" aria-label={labels.listenControls}>
      <audio
        ref={audioRef}
        src={audioUrl || undefined}
        preload="auto"
        onPlay={() => setStatus('playing')}
        onPause={() => {
          if (audioRef.current && !audioRef.current.ended) {
            setStatus('paused')
            savePosition(audioRef.current.currentTime, true)
          }
        }}
        onTimeUpdate={handleTimeUpdate}
        onDurationChange={() => {
          const total = audioRef.current?.duration
          if (Number.isFinite(total)) setDuration(total)
        }}
        onEnded={handleEnded}
        onError={() => setStatus('error')}
        className="sr-only"
      />
      <div className="flex items-center justify-between gap-3 max-compact:items-start">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#69816e]">{labels.listenLabel}</span>
          <p className="mt-[3px] mb-0 text-xs font-bold text-green-dark" role="status" aria-live="polite">
            {status === 'loading' ? labels.speechChecking
              : status === 'error' ? labels.speechError
                : status === 'playing' ? labels.audioPlaying
                  : status === 'ended' ? labels.recordingFinished
                    : labels.audioPaused}
          </p>
        </div>
        {!unavailable && status !== 'loading' && (
          <div className="flex flex-wrap justify-end gap-2">
            <button className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border-0 bg-green px-4 text-sm font-extrabold text-white active:scale-[0.97] dark:text-[#10251a]" type="button" onClick={togglePlayback} aria-label={status === 'playing' ? labels.pauseAudio : labels.playAudio}>
              <span aria-hidden="true">{status === 'playing' ? 'Ⅱ' : '▶'}</span>
              {status === 'playing' ? labels.pauseAudio : labels.playAudio}
            </button>
          </div>
        )}
      </div>

      {unavailable ? (
        <div className="mt-[10px] flex items-center justify-between gap-[15px] max-compact:items-stretch max-compact:flex-col max-compact:gap-[10px]">
          <p className="m-0 max-w-[570px] text-[11px] leading-[1.55] text-[#52675a] dark:text-[#d2ddd5]">{labels.speechErrorHelp}</p>
          <button className="inline-flex min-h-10 cursor-pointer items-center justify-center rounded-xl border-0 bg-green px-[14px] text-xs font-extrabold text-white" type="button" onClick={onReadInstead}>{labels.readInstead}</button>
        </div>
      ) : (
        <>
          <div className="mt-3 grid grid-cols-[auto_minmax(60px,1fr)_auto] items-center gap-[10px] max-compact:grid-cols-2 max-compact:gap-[7px]">
            <button className={buttonClasses} type="button" onClick={() => seekBy(-5)} disabled={!duration} aria-label={labels.seekBackward}>−5s</button>
            <div className="min-w-0 max-compact:col-span-full max-compact:row-start-1">
              <label className="sr-only" htmlFor="recorded-audio-position">{labels.recordingPositionSlider}</label>
              <input
                className="m-0 block min-h-7 w-full cursor-pointer accent-[#548462] disabled:cursor-wait"
                id="recorded-audio-position"
                type="range"
                min="0"
                max={duration || 0}
                step="0.1"
                value={Math.min(position, duration || 0)}
                disabled={!duration}
                onChange={(event) => handleSeek(event.target.value)}
              />
              <div className="flex justify-between text-[10px] tabular-nums text-[#63796a] dark:text-[#b6c5ba]" aria-live="off">
                <span>{formatTime(position)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
            <button className={buttonClasses} type="button" onClick={() => seekBy(5)} disabled={!duration} aria-label={labels.seekForward}>+5s</button>
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-[11px] font-bold text-[#63796a] dark:text-[#c1d0c4]">
              <span>{labels.playbackSpeed}</span>
              <select className="min-h-9 cursor-pointer rounded-lg border border-[rgba(28,48,43,0.12)] bg-white px-2 text-xs font-bold text-green-dark dark:border-line dark:bg-[#18211c] dark:text-ink" value={playbackRate} onChange={(event) => setPlaybackRate(Number(event.target.value))}>
                {speedOptions.map((rate) => <option key={rate} value={rate}>{rate}×</option>)}
              </select>
            </label>
            <p className="m-0 text-[10px] leading-[1.45] text-[#63796a] dark:text-[#b6c5ba]">{labels.recordingPositionHelp}</p>
          </div>
          {timingNotice && <p className="mt-2 mb-0 rounded-lg bg-white/70 px-3 py-2 text-[11px] leading-[1.5] text-[#52675a] dark:bg-[#18211c]/70 dark:text-[#d2ddd5]" role="status">{timingNotice}</p>}
        </>
      )}
    </section>
  )
}
