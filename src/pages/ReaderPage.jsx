import { useEffect, useState } from 'react'
import { storyPages } from '../data/storyPages.js'
import { getReadingProgress, saveReadingProgress } from '../lib/readingProgress.js'

const MIN_TEXT_SIZE = 1
const MAX_TEXT_SIZE = 1.5
const TEXT_SIZE_STEP = 0.1

export default function ReaderPage({ story, language, text, onBack }) {
  const pageSet = storyPages[story.id]
  const pages = pageSet?.[language] || pageSet?.en || []
  const totalPages = pages.length
  const [currentPage, setCurrentPage] = useState(0)
  const [textSize, setTextSize] = useState(1.2)
  const [completed, setCompleted] = useState(false)
  const [progressLoaded, setProgressLoaded] = useState(false)
  const [storageError, setStorageError] = useState(false)

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
        setCompleted(Boolean(record?.completed || (totalPages > 0 && restoredPage === totalPages - 1)))
        setProgressLoaded(true)
      })
      .catch(() => {
        if (!active) return
        setStorageError(true)
        setProgressLoaded(true)
      })

    return () => { active = false }
  }, [story.id, totalPages])

  useEffect(() => {
    if (!progressLoaded || totalPages === 0) return undefined
    let active = true
    const record = {
      storyId: story.id,
      lastPosition: currentPage,
      completed: completed || currentPage >= totalPages - 1,
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
  }

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
        <span className="eyebrow">{text.sample}</span>
      </div>
      <header className="reader-heading">
        <div className={`reader-cover art-${story.art}`} aria-hidden="true"><span>{story.icon}</span></div>
        <div>
          <span className="category-label">{text.readerLabel}</span>
          <h1 id="reader-title">{story.title[language]}</h1>
          <p>{story.description[language]}</p>
        </div>
      </header>

      <div className="reader-toolbar">
        <span className="reader-page-label" aria-live="polite">{text.page} {pageNumber} {text.of} {totalPages}</span>
        <div className="reader-text-size" role="group" aria-label={text.textSize}>
          <span>{text.textSize}</span>
          <button type="button" onClick={() => setTextSize((size) => Math.max(MIN_TEXT_SIZE, Number((size - TEXT_SIZE_STEP).toFixed(1))))} disabled={textSize <= MIN_TEXT_SIZE} aria-label={text.smallerText}>A−</button>
          <button type="button" onClick={() => setTextSize((size) => Math.min(MAX_TEXT_SIZE, Number((size + TEXT_SIZE_STEP).toFixed(1))))} disabled={textSize >= MAX_TEXT_SIZE} aria-label={text.largerText}>A+</button>
        </div>
      </div>

      <article className="reader-paper" aria-live="polite">
        <div className="reader-paper-top"><span>{text.brand}</span><span>{String(pageNumber).padStart(2, '0')}</span></div>
        <p className="reader-story-text" style={{ fontSize: `${textSize}rem` }}>{pages[currentPage]}</p>
        {currentPage === totalPages - 1 && <p className="reader-complete" role="status">✦ {text.readerComplete}</p>}
      </article>

      <div className="reader-progress-line" role="progressbar" aria-label={text.progressTitle} aria-valuemin="0" aria-valuemax="100" aria-valuenow={percent}>
        <span style={{ width: `${percent}%` }} />
      </div>
      <div className="reader-controls">
        <button className="reader-control-button" type="button" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 0}>
          <span aria-hidden="true">←</span>{text.previousPage}
        </button>
        <span className="reader-page-label">{pageNumber} / {totalPages}</span>
        <button className="reader-control-button reader-control-next" type="button" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages - 1}>
          {text.nextPage}<span aria-hidden="true">→</span>
        </button>
      </div>
      {storageError && <p className="reader-storage-warning" role="status">{text.saveProgressError}</p>}
    </section>
  )
}

