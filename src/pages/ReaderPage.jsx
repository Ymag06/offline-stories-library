import { useCallback, useEffect, useRef, useState } from 'react'
import SpeechControls from '../components/SpeechControls.jsx'
import { getReadingProgress, saveReadingProgress } from '../lib/readingProgress.js'
import { getStoryPages, getStoryTitle } from '../lib/storyContent.js'

const MIN_TEXT_SIZE = 1
const MAX_TEXT_SIZE = 1.5
const TEXT_SIZE_STEP = 0.1
const readerPageClasses = 'mx-auto max-w-[1120px] pt-[5px] pb-[25px]'
const backButtonClasses = 'inline-flex min-h-[46px] cursor-pointer items-center justify-start gap-[9px] rounded-[13px] border border-line bg-card px-4 py-2 text-sm font-[750] leading-[1.4] text-green shadow-[0_3px_10px_rgba(33,50,39,0.04)] transition-colors hover:border-green hover:bg-soft-surface max-compact:px-[13px] max-compact:text-[13px]'
const bookClasses = "relative isolate grid min-h-[470px] grid-cols-[minmax(0,1fr)_25px_minmax(0,1fr)] items-stretch [transform:rotateX(1deg)_rotateY(-1deg)] [transform-style:preserve-3d] drop-shadow-[0_17px_15px_rgba(40,46,36,0.16)] before:pointer-events-none before:absolute before:-z-10 before:inset-[8px_1px_0] before:rounded-[15px_18px_18px_15px] before:bg-[linear-gradient(135deg,_#8c6042,_#68442f_52%,_#80563c)] before:shadow-[0_11px_17px_rgba(45,35,25,0.2)] before:content-[''] before:[transform:translateZ(-18px)_translateY(8px)] after:pointer-events-none after:absolute after:-z-10 after:right-[6px] after:bottom-1 after:left-[7px] after:h-[14px] after:rounded-[0_0_12px_12px] after:bg-[repeating-linear-gradient(to_bottom,_#fffaf0_0_2px,_#d9cfbc_2px_3px)] after:content-[''] after:[transform:translateZ(-7px)_translateY(5px)] dark:before:bg-[linear-gradient(135deg,_#4d392b,_#30271f_52%,_#493628)] dark:after:bg-[repeating-linear-gradient(to_bottom,_#26332b_0_2px,_#111915_2px_3px)] max-compact:min-h-0 max-compact:grid-cols-1 max-compact:[transform:rotateX(0.6deg)]"
const bookPaperClasses = 'relative min-w-0 border border-[rgba(87,72,50,0.15)] bg-reader-paper dark:border-line'
const bookPageClasses = 'min-h-[470px] px-[clamp(18px,3vw,42px)] pt-7 pb-[30px] shadow-[inset_0_0_0_6px_rgba(181,159,119,0.06)] max-compact:min-h-[310px] max-compact:px-[18px] max-compact:pt-[22px] max-compact:pb-6'
const storyTextClasses = 'mx-auto mt-[33px] mb-5 max-w-[700px] whitespace-pre-line font-story leading-[2.05] text-reader-ink max-compact:mt-[23px] max-compact:leading-[1.95]'
const readerSidebarClasses = 'fixed top-[108px] right-0 z-30 grid w-[190px] gap-1 rounded-[17px] border border-line bg-card p-[10px] shadow-[0_7px_22px_rgba(39,54,43,0.06)] transition-[width,right] duration-[180ms] max-tablet:static max-tablet:order-first max-tablet:w-auto max-tablet:right-auto max-tablet:rounded-[17px] max-tablet:shadow-[0_7px_22px_rgba(39,54,43,0.06)]'
const sidebarToggleClasses = 'flex min-w-0 min-h-10 cursor-pointer items-center justify-start gap-2 rounded-[10px] border-0 bg-transparent px-[9px] py-[7px] text-left text-[11px] font-[750] text-muted hover:bg-soft-surface hover:text-green-dark'
const sidebarGroupClasses = 'grid gap-2 border-t border-line px-[3px] py-3 max-compact:px-0.5 max-compact:py-[10px]'
const sidebarLabelClasses = 'text-[10px] font-extrabold text-muted max-compact:text-[9px]'
const sidebarControlGroupClasses = 'flex gap-[6px]'
const sidebarButtonClasses = 'min-w-0 min-h-[38px] flex-1 cursor-pointer rounded-[10px] border border-line bg-card px-2 py-[6px] text-xs font-[750] text-green-dark disabled:cursor-default disabled:opacity-50 disabled:text-muted max-compact:min-h-9 max-compact:p-[5px]'
const sidebarNavigationButtonClasses = `${sidebarButtonClasses} text-[17px] dark:disabled:border-line dark:disabled:bg-[#29352e] dark:disabled:text-[#aab7ae] dark:disabled:opacity-100`

function renderStoryText(content, activeWord) {
  if (!activeWord || activeWord.start < 0 || activeWord.end <= activeWord.start || activeWord.end > content.length) {
    return content
  }

  return (
    <>
      {content.slice(0, activeWord.start)}
      <mark className="rounded-[0.2em] bg-[#f4d574] text-[#27311f] [box-decoration-break:clone] [-webkit-box-decoration-break:clone] dark:bg-[#f2cf5e] dark:text-[#202819]">{content.slice(activeWord.start, activeWord.end)}</mark>
      {content.slice(activeWord.end)}
    </>
  )
}

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
  const [activeWord, setActiveWord] = useState(null)
  const pageElementsRef = useRef([])

  useEffect(() => {
    let active = true
    setProgressLoaded(false)
    setStorageError(false)
    setActiveWord(null)

    getReadingProgress(story.id)
      .then((record) => {
        if (!active) return
        const savedPage = Number.isInteger(record?.lastPosition) ? record.lastPosition : 0
        const restoredPage = Math.min(Math.max(savedPage, 0), Math.max(totalPages - 1, 0))
        setCurrentPage(restoredPage)
        const restoredSpreadEnd = Math.min(Math.floor(restoredPage / 2) * 2 + 1, totalPages - 1)
        setCompleted(Boolean(record?.completed || (mode === 'read' && totalPages > 0 && restoredSpreadEnd === totalPages - 1)))
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
    setActiveWord(null)
    setCurrentPage(boundedPage)
    if (boundedPage === totalPages - 1) setCompleted(true)
    if (layoutMode === 'scroll') {
      window.requestAnimationFrame(() => pageElementsRef.current[boundedPage]?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    }
  }

  const goToSpread = (direction) => {
    const spreadStart = Math.floor(currentPage / 2) * 2
    const lastSpreadStart = Math.floor((totalPages - 1) / 2) * 2
    const nextSpreadStart = Math.min(Math.max(spreadStart + direction * 2, 0), lastSpreadStart)
    if (nextSpreadStart === spreadStart) return
    setActiveWord(null)
    setCurrentPage(nextSpreadStart)
    if (nextSpreadStart + 1 >= totalPages - 1) setCompleted(true)
  }

  const handleAudioPageComplete = useCallback(() => {
    if (currentPage < totalPages - 1) {
      const nextPage = Math.min(currentPage + 1, totalPages - 1)
      setActiveWord(null)
      setCurrentPage(nextPage)
      if (layoutMode === 'scroll') {
        window.requestAnimationFrame(() => pageElementsRef.current[nextPage]?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
      }
    } else {
      setCompleted(true)
    }
  }, [currentPage, layoutMode, totalPages])

  const handleWordBoundary = useCallback((wordRange) => {
    setActiveWord(wordRange ? { ...wordRange, pageIndex: currentPage } : null)
  }, [currentPage])

  const textForPage = (pageText, pageIndex) => renderStoryText(
    pageText,
    activeMode === 'listen' && activeWord?.pageIndex === pageIndex ? activeWord : null,
  )

  const pageNumber = currentPage + 1
  const spreadStartPage = Math.floor(currentPage / 2) * 2
  const spreadEndPage = Math.min(spreadStartPage + 1, totalPages - 1)
  const spreadLabel = spreadEndPage > spreadStartPage
    ? `${text.page} ${spreadStartPage + 1}–${spreadEndPage + 1} ${text.of} ${totalPages}`
    : `${text.page} ${spreadStartPage + 1} ${text.of} ${totalPages}`
  const lastSpreadStart = Math.floor((totalPages - 1) / 2) * 2
  const progressPageNumber = layoutMode === 'pages' && activeMode === 'read' ? spreadEndPage + 1 : pageNumber
  const percent = totalPages ? Math.round((progressPageNumber / totalPages) * 100) : 0

  if (!totalPages) {
    return (
      <section className={readerPageClasses}>
        <button className={backButtonClasses} type="button" onClick={onBack}>← {text.backToStories}</button>
        <p>{text.readerUnavailable}</p>
      </section>
    )
  }

  if (!progressLoaded) {
    return (
      <section className={readerPageClasses}>
        <button className={backButtonClasses} type="button" onClick={onBack}>← {text.backToStories}</button>
        <p className="grid min-h-[350px] place-content-center text-center text-muted" role="status">{text.progressLoading}</p>
      </section>
    )
  }

  return (
    <section className={readerPageClasses} aria-labelledby="reader-title">
      <div className="mb-[19px] flex items-center justify-between max-compact:mb-3">
        <button className={backButtonClasses} type="button" onClick={onBack}>← {text.backToStories}</button>
        <span className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#577065] dark:text-[#b7cbbd]">{story.userCreated ? text.writtenByYou : text.sample}</span>
      </div>
      <h1 id="reader-title" className="sr-only">{getStoryTitle(story, language)}</h1>
      <div className="relative mt-5 max-tablet:grid max-tablet:grid-cols-[minmax(0,1fr)] max-tablet:gap-3">
        <div className="min-w-0">
          <div className="[perspective:1500px] px-[5px] pt-2 pb-5 max-compact:[perspective:1000px] max-compact:px-0 max-compact:pt-[5px] max-compact:pb-4">
            <div className={bookClasses}>
              {layoutMode === 'pages' ? (
                <>
                  <article className={`${bookPaperClasses} ${bookPageClasses} border-r-0 rounded-[14px_3px_3px_13px] shadow-[inset_-11px_0_18px_rgba(80,66,47,0.09),inset_0_0_0_6px_rgba(181,159,119,0.06)] max-compact:border-r max-compact:border-b-0 max-compact:rounded-[10px_10px_2px_2px] max-compact:shadow-[inset_0_-11px_18px_rgba(80,66,47,0.09),inset_0_0_0_6px_rgba(181,159,119,0.06)]`} aria-label={`${text.page} ${spreadStartPage + 1} ${text.of} ${totalPages}`}>
                    <p className={storyTextClasses} style={{ fontSize: `${textSize}rem` }}>{textForPage(pages[spreadStartPage], spreadStartPage)}</p>
                  </article>
                  <div className="relative z-[1] bg-[linear-gradient(90deg,_rgba(76,54,37,0.12),_#967252_36%,_#705139_52%,_#b18a64_76%,_rgba(76,54,37,0.16))] shadow-[inset_1px_0_rgba(255,255,255,0.24),inset_-1px_0_rgba(48,32,21,0.28)] dark:bg-[linear-gradient(90deg,_#202921,_#596a58_36%,_#334337_52%,_#748368_76%,_#202921)] max-compact:h-3 max-compact:bg-[linear-gradient(180deg,_rgba(76,54,37,0.12),_#967252_36%,_#705139_52%,_#b18a64_76%,_rgba(76,54,37,0.16))] max-compact:shadow-[inset_0_1px_rgba(255,255,255,0.24),inset_0_-1px_rgba(48,32,21,0.28)] dark:max-compact:bg-[linear-gradient(180deg,_#202921,_#596a58_36%,_#334337_52%,_#748368_76%,_#202921)]" aria-hidden="true" />
                  <article className={`${bookPaperClasses} ${bookPageClasses} border-l-0 rounded-[3px_14px_13px_3px] shadow-[inset_12px_0_19px_rgba(80,66,47,0.08),inset_0_0_0_6px_rgba(181,159,119,0.06)] max-compact:border-t-0 max-compact:border-l max-compact:rounded-[2px_2px_10px_10px] max-compact:shadow-[inset_0_11px_19px_rgba(80,66,47,0.08),inset_0_0_0_6px_rgba(181,159,119,0.06)]`} aria-label={spreadStartPage + 1 < totalPages ? `${text.page} ${spreadStartPage + 2} ${text.of} ${totalPages}` : undefined} aria-hidden={spreadStartPage + 1 >= totalPages}>
                    {spreadStartPage + 1 < totalPages ? (
                      <p className={storyTextClasses} style={{ fontSize: `${textSize}rem` }}>{textForPage(pages[spreadStartPage + 1], spreadStartPage + 1)}</p>
                    ) : null}
                  </article>
                </>
              ) : (
                <article className={`${bookPaperClasses} ${bookPageClasses} col-span-full min-h-[450px] rounded-[14px] shadow-[inset_0_0_0_6px_rgba(181,159,119,0.06)] max-compact:rounded-[10px]`} aria-label={getStoryTitle(story, language)}>
                  <div className="mx-auto mt-[26px] grid max-w-[700px] gap-5 max-compact:mt-[22px] max-compact:gap-[18px]">
                    {pages.map((pageText, index) => (
                      <section
                        ref={(element) => { pageElementsRef.current[index] = element }}
                        className="scroll-mt-28 max-compact:scroll-mt-[110px]"
                        key={`${story.id}-page-${index}`}
                        aria-label={`${text.page} ${index + 1} ${text.of} ${totalPages}`}
                        aria-current={index === currentPage ? 'true' : undefined}
                      >
                        <p className={`${storyTextClasses} m-0`} style={{ fontSize: `${textSize}rem` }}>{textForPage(pageText, index)}</p>
                      </section>
                    ))}
                  </div>
                </article>
              )}
            </div>
          </div>
          {completed && (layoutMode === 'pages' ? spreadEndPage === totalPages - 1 : currentPage === totalPages - 1) && <p className="mt-[25px] mb-0 flex items-center gap-2 text-xs font-extrabold text-[#538061] dark:text-[#a6d9b0]" role="status">✦ {text.readerComplete}</p>}

          {activeMode === 'listen' && (
            <SpeechControls
              key={`${story.id}-${currentPage}-${language}`}
              storyText={pages[currentPage]}
              language={story.userCreated ? (story.language || language) : language}
              labels={text}
              onPageComplete={handleAudioPageComplete}
              onWordBoundary={handleWordBoundary}
              onReadInstead={() => { setActiveWord(null); setActiveMode('read') }}
              suspendAudio={suspendAudio}
            />
          )}

          <div className="mt-[19px] h-[7px] overflow-hidden rounded-full bg-[#e8ece3] dark:bg-[#344139]" role="progressbar" aria-label={text.progressTitle} aria-valuemin="0" aria-valuemax="100" aria-valuenow={percent}>
            <span className="block h-full rounded-[inherit] bg-[#75a783] transition-[width] duration-200" style={{ width: `${percent}%` }} />
          </div>
        </div>

        <aside className={`${readerSidebarClasses} ${controlsCollapsed ? 'right-[136px] w-[54px] p-[6px] max-tablet:right-auto max-tablet:w-full' : 'max-tablet:grid-cols-2 max-tablet:gap-x-3 max-compact:gap-x-[9px] max-compact:gap-y-0 max-compact:p-2'}`} aria-label={text.readerControls}>
          <button
            className={`${sidebarToggleClasses} ${controlsCollapsed ? 'w-10 justify-center p-0 max-tablet:w-full max-tablet:justify-start max-tablet:px-[9px] max-tablet:py-[7px]' : 'max-tablet:col-span-full'}`}
            type="button"
            onClick={() => setControlsCollapsed((collapsed) => !collapsed)}
            aria-label={controlsCollapsed ? text.expandControls : text.minimizeControls}
            aria-expanded={!controlsCollapsed}
          >
            <span aria-hidden="true">{controlsCollapsed ? '›' : '‹'}</span>
            {!controlsCollapsed && <span>{text.minimizeControls}</span>}
          </button>
          {!controlsCollapsed && (
            <>
              <div className={sidebarGroupClasses}>
                <span className={sidebarLabelClasses}>{text.textSize}</span>
                <div className={sidebarControlGroupClasses} role="group" aria-label={text.textSize}>
                  <button className={sidebarButtonClasses} type="button" onClick={() => setTextSize((size) => Math.max(MIN_TEXT_SIZE, Number((size - TEXT_SIZE_STEP).toFixed(1))))} disabled={textSize <= MIN_TEXT_SIZE} aria-label={text.smallerText}>A−</button>
                  <button className={sidebarButtonClasses} type="button" onClick={() => setTextSize((size) => Math.min(MAX_TEXT_SIZE, Number((size + TEXT_SIZE_STEP).toFixed(1))))} disabled={textSize >= MAX_TEXT_SIZE} aria-label={text.largerText}>A+</button>
                </div>
              </div>
              <div className={sidebarGroupClasses}>
                <span className={sidebarLabelClasses}>{text.readingLayout}</span>
                <div className={sidebarControlGroupClasses} role="group" aria-label={text.readingLayout}>
                  <button className={`${sidebarButtonClasses} text-[10px] ${layoutMode === 'pages' ? 'border-selected-bg bg-selected-bg text-selected-ink dark:text-selected-ink' : ''}`} type="button" onClick={() => setLayoutMode('pages')} aria-pressed={layoutMode === 'pages'}>{text.layoutPages}</button>
                  <button className={`${sidebarButtonClasses} text-[10px] ${layoutMode === 'scroll' ? 'border-selected-bg bg-selected-bg text-selected-ink dark:text-selected-ink' : ''}`} type="button" onClick={() => setLayoutMode('scroll')} aria-pressed={layoutMode === 'scroll'}>{text.layoutScroll}</button>
                </div>
              </div>
              <div className={`${sidebarGroupClasses} max-tablet:col-span-full max-tablet:grid-cols-[1fr_auto] max-tablet:items-center`}>
                <span className={sidebarLabelClasses} aria-live="polite">{layoutMode === 'pages' ? spreadLabel : `${text.page} ${pageNumber} ${text.of} ${totalPages}`}</span>
                <div className={`${sidebarControlGroupClasses} min-w-[110px]`}>
                  <button className={sidebarNavigationButtonClasses} type="button" onClick={() => layoutMode === 'pages' ? goToSpread(-1) : goToPage(currentPage - 1)} disabled={layoutMode === 'pages' ? spreadStartPage === 0 : currentPage === 0} aria-label={text.previousPage}>←</button>
                  <button className={sidebarNavigationButtonClasses} type="button" onClick={() => layoutMode === 'pages' ? goToSpread(1) : goToPage(currentPage + 1)} disabled={layoutMode === 'pages' ? spreadStartPage >= lastSpreadStart : currentPage === totalPages - 1} aria-label={text.nextPage}>→</button>
                </div>
              </div>
            </>
          )}
        </aside>
      </div>
      {storageError && <p className="mt-3 mb-0 text-xs text-[#9d5847]" role="status">{text.saveProgressError}</p>}
    </section>
  )
}

