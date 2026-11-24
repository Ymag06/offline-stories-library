import { useCallback, useEffect, useRef, useState } from 'react'
import SpeechControls from '../components/SpeechControls.jsx'
import { getReadingProgress, saveReadingProgress } from '../lib/readingProgress.js'
import { getStoryDescription, getStoryPages, getStoryTitle } from '../lib/storyContent.js'

const MIN_TEXT_SIZE = 1
const MAX_TEXT_SIZE = 1.5
const TEXT_SIZE_STEP = 0.1

export default function ReaderPage({ story, mode, language, text, onBack, suspendAudio = false }) {
  const pages = getStoryPages(story, language)
  const totalPages = pages.length
  const [currentPage, setCurrentPage] = useState(0)
  const [textSize, setTextSize] = useState(1.2)
  const [completed, setCompleted] = useState(false)
  const [activeMode, setActiveMode] = useState(mode)
  const [layoutMode, setLayoutMode] = useState('pages')
  const [controlsCollapsed, setControlsCollapsed] = useState(false)
  const [progressLoaded, setProgressLoaded] = useState(false)
  const [storageError, setStorageError] = useState(false)
  const pageElementsRef = useRef([])

  useEffect(() => {
    let active = true
    setProgressLoaded(false)
    setStorageError(false)

    getReadingProgress(story.id)
      .then((record) => {
        if (!active) return
        const savedPage = Number.isInteger(record?.lastPosition) ? record.lastPosition : 0
        const restoredPage = Math.min(Math.max(savedPage, 0), Math.max(totalPages - 1, 0))
        setCurrentPage(restoredPage)
        setCompleted(Boolean(record?.completed || (mode === 'read' && totalPages > 0 && restoredPage === totalPages - 1)))
        setProgressLoaded(true)
      })
      .catch(() => {
        if (!active) return
        setStorageError(true)
        setProgressLoaded(true)
      })

    return () => { active = false }
  }, [mode, story.id, totalPages])

  useEffect(() => { setActiveMode(mode) }, [mode, story.id])

  const updatePageFromScroll = useCallback(() => {
    if (layoutMode !== 'scroll' || activeMode !== 'read') return
    const marker = window.innerHeight * 0.38
    let visiblePage = totalPages - 1
    for (let index = 0; index < pageElementsRef.current.length; index += 1) {
      const pageElement = pageElementsRef.current[index]
      if (pageElement && pageElement.getBoundingClientRect().bottom > marker) {
        visiblePage = index
        break
      }
    }
    setCurrentPage((page) => page === visiblePage ? page : visiblePage)
    if (visiblePage === totalPages - 1) setCompleted(true)
  }, [activeMode, layoutMode, totalPages])

  useEffect(() => {
    if (layoutMode !== 'scroll') return undefined
    const scheduleUpdate = () => window.requestAnimationFrame(updatePageFromScroll)
    scheduleUpdate()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    return () => {
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
    }
  }, [layoutMode, updatePageFromScroll])

  useEffect(() => {
    if (layoutMode !== 'scroll') return undefined
    const frame = window.requestAnimationFrame(() => {
      pageElementsRef.current[currentPage]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [layoutMode])

  useEffect(() => {
    if (!progressLoaded || totalPages === 0) return undefined
    let active = true
    const record = {
      storyId: story.id,
      lastPosition: currentPage,
      completed,
      totalPages,
      lastOpenedAt: new Date().toISOString(),
    }

    saveReadingProgress(record)
      .then(() => { if (active) setStorageError(false) })
      .catch(() => { if (active) setStorageError(true) })

    return () => { active = false }
  }, [completed, currentPage, progressLoaded, story.id, totalPages])

  const goToPage = (nextPage) => {
    const boundedPage = Math.min(Math.max(nextPage, 0), Math.max(totalPages - 1, 0))
    setCurrentPage(boundedPage)
    if (boundedPage === totalPages - 1) setCompleted(true)
    if (layoutMode === 'scroll') {
      window.requestAnimationFrame(() => pageElementsRef.current[boundedPage]?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    }
  }

  const handleAudioPageComplete = useCallback(() => {
    if (currentPage < totalPages - 1) {
      const nextPage = Math.min(currentPage + 1, totalPages - 1)
      setCurrentPage(nextPage)
      if (layoutMode === 'scroll') {
        window.requestAnimationFrame(() => pageElementsRef.current[nextPage]?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
      }
    } else {
      setCompleted(true)
    }
  }, [currentPage, layoutMode, totalPages])

  const pageNumber = currentPage + 1
  const percent = totalPages ? Math.round((pageNumber / totalPages) * 100) : 0

  if (!totalPages) {
    return (
      <section className="reader-page">
        <button className="back-button" type="button" onClick={onBack}>← {text.backToStories}</button>
        <p>{text.readerUnavailable}</p>
      </section>
    )
  }

  if (!progressLoaded) {
    return (
      <section className="reader-page">
        <button className="back-button" type="button" onClick={onBack}>← {text.backToStories}</button>
        <p className="reader-loading" role="status">{text.progressLoading}</p>
      </section>
    )
  }

  return (
    <section className="reader-page" aria-labelledby="reader-title">
      <div className="reader-topline">
        <button className="back-button" type="button" onClick={onBack}>← {text.backToStories}</button>
        <span className="eyebrow">{story.userCreated ? text.writtenByYou : text.sample}</span>
      </div>
      <header className="reader-heading">
        <div className={`reader-cover art-${story.art}`} aria-hidden="true"><span>{story.icon}</span></div>
        <div>
          <span className="category-label">{text.readerLabel}</span>
          <h1 id="reader-title">{getStoryTitle(story, language)}</h1>
          <p>{getStoryDescription(story, language)}</p>
        </div>
      </header>

      <div className={`reader-workspace${controlsCollapsed ? ' reader-workspace-collapsed' : ''}`}>
        <div className="reader-reading-column">
          {layoutMode === 'pages' ? (
            <article ref={(element) => { pageElementsRef.current[currentPage] = element }} className="reader-paper" aria-live="polite">
              <div className="reader-paper-top"><span>{text.brand}</span><span>{String(pageNumber).padStart(2, '0')}</span></div>
              <p className="reader-story-text" style={{ fontSize: `${textSize}rem` }}>{pages[currentPage]}</p>
              {completed && currentPage === totalPages - 1 && <p className="reader-complete" role="status">✦ {text.readerComplete}</p>}
            </article>
          ) : (
            <article className="reader-paper reader-scroll-paper" aria-label={getStoryTitle(story, language)}>
              <div className="reader-paper-top"><span>{text.brand}</span><span>{pageNumber} / {totalPages}</span></div>
              <div className="reader-scroll-content">
                {pages.map((pageText, index) => (
                  <section
                    ref={(element) => { pageElementsRef.current[index] = element }}
                    className="reader-scroll-segment"
                    key={`${story.id}-page-${index}`}
                    aria-label={`${text.page} ${index + 1} ${text.of} ${totalPages}`}
                    aria-current={index === currentPage ? 'true' : undefined}
                  >
                    <p className="reader-story-text" style={{ fontSize: `${textSize}rem` }}>{pageText}</p>
                  </section>
                ))}
              </div>
              {completed && currentPage === totalPages - 1 && <p className="reader-complete" role="status">✦ {text.readerComplete}</p>}
            </article>
          )}

          {activeMode === 'listen' && (
            <SpeechControls
              key={`${story.id}-${currentPage}-${language}`}
              storyText={pages[currentPage]}
              language={story.userCreated ? (story.language || language) : language}
              labels={text}
              onPageComplete={handleAudioPageComplete}
              onReadInstead={() => setActiveMode('read')}
              suspendAudio={suspendAudio}
            />
          )}

          <div className="reader-progress-line" role="progressbar" aria-label={text.progressTitle} aria-valuemin="0" aria-valuemax="100" aria-valuenow={percent}>
            <span style={{ width: `${percent}%` }} />
          </div>
        </div>

        <aside className={`reader-sidebar${controlsCollapsed ? ' is-minimized' : ''}`} aria-label={text.readerControls}>
          <button
            className="reader-sidebar-toggle"
            type="button"
            onClick={() => setControlsCollapsed((collapsed) => !collapsed)}
            aria-label={controlsCollapsed ? text.expandControls : text.minimizeControls}
            aria-expanded={!controlsCollapsed}
          >
            <span aria-hidden="true">{controlsCollapsed ? '‹' : '›'}</span>
            {!controlsCollapsed && <span>{text.minimizeControls}</span>}
          </button>
          {!controlsCollapsed && (
            <>
              <div className="reader-sidebar-group">
                <span className="reader-sidebar-label">{text.textSize}</span>
                <div className="reader-size-buttons" role="group" aria-label={text.textSize}>
                  <button type="button" onClick={() => setTextSize((size) => Math.max(MIN_TEXT_SIZE, Number((size - TEXT_SIZE_STEP).toFixed(1))))} disabled={textSize <= MIN_TEXT_SIZE} aria-label={text.smallerText}>A−</button>
                  <button type="button" onClick={() => setTextSize((size) => Math.min(MAX_TEXT_SIZE, Number((size + TEXT_SIZE_STEP).toFixed(1))))} disabled={textSize >= MAX_TEXT_SIZE} aria-label={text.largerText}>A+</button>
                </div>
              </div>
              <div className="reader-sidebar-group">
                <span className="reader-sidebar-label">{text.readingLayout}</span>
                <div className="reader-layout-switch" role="group" aria-label={text.readingLayout}>
                  <button type="button" onClick={() => setLayoutMode('pages')} aria-pressed={layoutMode === 'pages'}>{text.layoutPages}</button>
                  <button type="button" onClick={() => setLayoutMode('scroll')} aria-pressed={layoutMode === 'scroll'}>{text.layoutScroll}</button>
                </div>
              </div>
              <div className="reader-sidebar-group reader-sidebar-page-nav">
                <span className="reader-sidebar-label" aria-live="polite">{text.page} {pageNumber} {text.of} {totalPages}</span>
                <div className="reader-sidebar-navigation">
                  <button type="button" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 0} aria-label={text.previousPage}>←</button>
                  <button type="button" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages - 1} aria-label={text.nextPage}>→</button>
                </div>
              </div>
            </>
          )}
        </aside>
      </div>
      {storageError && <p className="reader-storage-warning" role="status">{text.saveProgressError}</p>}
    </section>
  )
}

