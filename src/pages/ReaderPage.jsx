import { useCallback, useEffect, useRef, useState } from 'react'
import RecordedAudioControls from '../components/RecordedAudioControls.jsx'
import SpeechControls from '../components/SpeechControls.jsx'
import { getReadingProgress, saveReadingProgress } from '../lib/readingProgress.js'
import { getStoryPageImage, getStoryPages, getStoryTitle } from '../lib/storyContent.js'

const MIN_TEXT_SIZE = 1
const MAX_TEXT_SIZE = 1.5
const TEXT_SIZE_STEP = 0.1
const readerPageClasses = 'mx-auto max-w-[1440px] pt-[5px] pb-[25px]'
const backButtonClasses = 'inline-flex min-h-[46px] cursor-pointer items-center justify-start gap-[9px] rounded-[13px] border border-line bg-card px-4 py-2 text-sm font-[750] leading-[1.4] text-green shadow-[0_3px_10px_rgba(33,50,39,0.04)] transition-colors hover:border-green hover:bg-soft-surface max-compact:px-[13px] max-compact:text-[13px]'
const bookClasses = "relative isolate grid min-h-[470px] grid-cols-[minmax(0,1fr)_25px_minmax(0,1fr)] items-stretch [transform:rotateX(1deg)_rotateY(-1deg)] [transform-style:preserve-3d] drop-shadow-[0_17px_15px_rgba(40,46,36,0.16)] before:pointer-events-none before:absolute before:-z-10 before:inset-[8px_1px_0] before:rounded-[15px_18px_18px_15px] before:bg-[linear-gradient(135deg,_#8c6042,_#68442f_52%,_#80563c)] before:shadow-[0_11px_17px_rgba(45,35,25,0.2)] before:content-[''] before:[transform:translateZ(-18px)_translateY(8px)] after:pointer-events-none after:absolute after:-z-10 after:right-[6px] after:bottom-1 after:left-[7px] after:h-[14px] after:rounded-[0_0_12px_12px] after:bg-[repeating-linear-gradient(to_bottom,_#fffaf0_0_2px,_#d9cfbc_2px_3px)] after:content-[''] after:[transform:translateZ(-7px)_translateY(5px)] dark:before:bg-[linear-gradient(135deg,_#4d392b,_#30271f_52%,_#493628)] dark:after:bg-[repeating-linear-gradient(to_bottom,_#26332b_0_2px,_#111915_2px_3px)] max-compact:min-h-0 max-compact:grid-cols-1 max-compact:[transform:rotateX(0.6deg)]"
const bookPaperClasses = 'relative min-w-0 border border-[rgba(87,72,50,0.15)] bg-reader-paper dark:border-line'
const bookPageClasses = 'min-h-[470px] px-[clamp(18px,3vw,42px)] pt-7 pb-[30px] shadow-[inset_0_0_0_6px_rgba(181,159,119,0.06)] max-compact:min-h-[310px] max-compact:px-[18px] max-compact:pt-[22px] max-compact:pb-6'
const storyTextClasses = 'mx-auto mt-[33px] mb-5 max-w-[700px] whitespace-pre-line font-story leading-[2.05] text-reader-ink max-compact:mt-[23px] max-compact:leading-[1.95]'
const readerSidebarClasses = 'fixed top-[108px] right-0 z-30 grid w-[190px] gap-1 rounded-[17px] border border-line bg-card p-[10px] shadow-[0_7px_22px_rgba(39,54,43,0.06)] transition-[width,right] duration-[180ms] max-tablet:static max-tablet:order-first max-tablet:w-auto max-tablet:right-auto max-tablet:rounded-[17px] max-tablet:shadow-[0_7px_22px_rgba(39,54,43,0.06)]'
const sidebarToggleClasses = 'flex min-w-0 min-h-10 cursor-pointer items-center justify-start gap-2 rounded-[10px] border-0 bg-transparent px-[9px] py-[7px] text-left text-[11px] font-[750] text-muted hover:bg-soft-surface hover:text-green-dark'
const sidebarGroupClasses = 'grid gap-2 border-t border-line px-[3px] py-3 max-compact:px-0.5 max-compact:py-[10px]'
const sidebarLabelClasses = 'text-[11px] font-extrabold text-muted'
const sidebarControlGroupClasses = 'flex gap-[6px]'
const sidebarButtonClasses = 'min-w-0 min-h-11 flex-1 cursor-pointer rounded-[10px] border border-line bg-card px-2 py-2 text-[13px] font-bold text-green-dark transition-[transform,background,box-shadow] duration-150 hover:bg-soft-surface active:scale-[0.97] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-default disabled:opacity-50 disabled:text-muted max-compact:min-h-11 max-compact:px-1'

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
  const audioLanguage = story.userCreated ? (story.language || language) : language
  const recordedAudio = story.audioFiles?.[audioLanguage]
  const [currentPage, setCurrentPage] = useState(0)
  const [textSize, setTextSize] = useState(1.2)
  const [completed, setCompleted] = useState(false)
  const [activeMode, setActiveMode] = useState(mode)
  const [layoutMode, setLayoutMode] = useState('pages')
  const [controlsCollapsed, setControlsCollapsed] = useState(false)
  const [progressLoaded, setProgressLoaded] = useState(false)
  const [storageError, setStorageError] = useState(false)
  const [activeWord, setActiveWord] = useState(null)
  const [audioPosition, setAudioPosition] = useState(0)
  const [turningSheet, setTurningSheet] = useState(null)
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
        setCompleted(Boolean(record?.completed && savedPage >= totalPages - 1))
        setAudioPosition(record?.audioLanguage === audioLanguage && Number.isFinite(record?.audioPosition) ? record.audioPosition : 0)
        setProgressLoaded(true)
      })
      .catch(() => {
        if (!active) return
        setStorageError(true)
        setProgressLoaded(true)
      })

    return () => { active = false }
  }, [audioLanguage, story.id, totalPages])

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
      lastPosition: completed ? totalPages - 1 : currentPage,
      completed,
      totalPages,
      audioPosition: recordedAudio ? audioPosition : undefined,
      audioLanguage: recordedAudio ? audioLanguage : undefined,
      lastOpenedAt: new Date().toISOString(),
    }

    saveReadingProgress(record)
      .then(() => { if (active) setStorageError(false) })
      .catch(() => { if (active) setStorageError(true) })

    return () => { active = false }
  }, [audioLanguage, audioPosition, completed, currentPage, progressLoaded, recordedAudio, story.id, totalPages])

  const goToPage = (nextPage) => {
    if (turningSheet) return
    const boundedPage = Math.min(Math.max(nextPage, 0), Math.max(totalPages - 1, 0))
    setActiveWord(null)
    setCurrentPage(boundedPage)
    if (boundedPage === totalPages - 1) setCompleted(true)
    if (layoutMode === 'scroll') {
      window.requestAnimationFrame(() => pageElementsRef.current[boundedPage]?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    }
  }

  const goToSpread = (direction) => {
    if (turningSheet) return
    const spreadStart = Math.floor(currentPage / 2) * 2
    const lastSpreadStart = Math.floor((totalPages - 1) / 2) * 2
    const nextSpreadStart = Math.min(Math.max(spreadStart + direction * 2, 0), lastSpreadStart)
    if (nextSpreadStart === spreadStart) return
    setActiveWord(null)
    setTurningSheet({
      direction: direction > 0 ? 'next' : 'previous',
      pageText: pages[direction > 0 ? spreadEndPage : spreadStart],
      targetPage: nextSpreadStart,
    })
  }

  const finishPageTurn = () => {
    if (!turningSheet) return
    setCurrentPage(turningSheet.targetPage)
    setTurningSheet(null)
  }

  const handleAudioPageComplete = useCallback(() => {
    if (turningSheet) return
    if (currentPage < totalPages - 1) {
      const nextPage = Math.min(currentPage + 1, totalPages - 1)
      if (layoutMode === 'pages' && Math.floor(nextPage / 2) !== Math.floor(currentPage / 2)) {
        setTurningSheet({ direction: 'next', pageText: pages[currentPage], targetPage: nextPage })
        return
      }
      setActiveWord(null)
      setCurrentPage(nextPage)
      if (layoutMode === 'scroll') {
        window.requestAnimationFrame(() => pageElementsRef.current[nextPage]?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
      }
    } else {
      setCompleted(true)
    }
  }, [currentPage, layoutMode, pages, totalPages, turningSheet])

  const handleRecordedAudioComplete = useCallback(() => {
    setAudioPosition(0)
    setCurrentPage(totalPages - 1)
    setCompleted(true)
    if (layoutMode === 'scroll') {
      window.requestAnimationFrame(() => pageElementsRef.current[totalPages - 1]?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    }
  }, [layoutMode, totalPages])

  const handleRecordedAudioPosition = useCallback((nextPosition) => {
    setAudioPosition(nextPosition)
  }, [])

  const handleWordBoundary = useCallback((wordRange) => {
    setActiveWord(wordRange ? { ...wordRange, pageIndex: currentPage } : null)
  }, [currentPage])

  const textForPage = (pageText, pageIndex) => renderStoryText(
    pageText,
    activeMode === 'readAlong' && activeWord?.pageIndex === pageIndex ? activeWord : null,
  )

  const renderPageContent = (pageText, pageIndex) => {
    const pageImage = getStoryPageImage(story, pageIndex)
    return (
      <>
        <p className={storyTextClasses} style={{ fontSize: `${textSize}rem` }}>{textForPage(pageText, pageIndex)}</p>
        {pageImage && <img className="mx-auto mt-3 block max-h-[190px] w-full max-w-[520px] rounded-xl object-contain max-compact:max-h-[145px]" src={pageImage} alt="" />}
      </>
    )
  }

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
          <div className="relative [perspective:1500px] px-[5px] pt-2 pb-5 max-compact:[perspective:1000px] max-compact:px-0 max-compact:pt-[5px] max-compact:pb-4">
            <div
              className={`${bookClasses} ${layoutMode === 'pages' ? 'h-[min(84vh,820px)] min-h-[700px] max-compact:h-[min(170vh,1200px)] max-compact:min-h-[900px] max-compact:grid-rows-[minmax(0,1fr)_12px_minmax(0,1fr)]' : ''}`}
            >
              {layoutMode === 'pages' ? (
                <>
                  <article className={`${bookPaperClasses} ${bookPageClasses} min-h-0 border-r-0 rounded-[14px_3px_3px_13px] shadow-[inset_-11px_0_18px_rgba(80,66,47,0.09),inset_0_0_0_6px_rgba(181,159,119,0.06)] max-compact:border-r max-compact:border-b-0 max-compact:rounded-[10px_10px_2px_2px] max-compact:shadow-[inset_0_-11px_18px_rgba(80,66,47,0.09),inset_0_0_0_6px_rgba(181,159,119,0.06)]`} style={{ height: '100%', minHeight: 0 }} aria-label={`${text.page} ${spreadStartPage + 1} ${text.of} ${totalPages}`}>
                    {renderPageContent(pages[spreadStartPage], spreadStartPage)}
                  </article>
                  <div className="relative z-[1] bg-[linear-gradient(90deg,_rgba(76,54,37,0.12),_#967252_36%,_#705139_52%,_#b18a64_76%,_rgba(76,54,37,0.16))] shadow-[inset_1px_0_rgba(255,255,255,0.24),inset_-1px_0_rgba(48,32,21,0.28)] dark:bg-[linear-gradient(90deg,_#202921,_#596a58_36%,_#334337_52%,_#748368_76%,_#202921)] max-compact:h-3 max-compact:bg-[linear-gradient(180deg,_rgba(76,54,37,0.12),_#967252_36%,_#705139_52%,_#b18a64_76%,_rgba(76,54,37,0.16))] max-compact:shadow-[inset_0_1px_rgba(255,255,255,0.24),inset_0_-1px_rgba(48,32,21,0.28)] dark:max-compact:bg-[linear-gradient(180deg,_#202921,_#596a58_36%,_#334337_52%,_#748368_76%,_#202921)]" aria-hidden="true" />
                  <article className={`${bookPaperClasses} ${bookPageClasses} min-h-0 border-l-0 rounded-[3px_14px_13px_3px] shadow-[inset_12px_0_19px_rgba(80,66,47,0.08),inset_0_0_0_6px_rgba(181,159,119,0.06)] max-compact:border-t-0 max-compact:border-l max-compact:rounded-[2px_2px_10px_10px] max-compact:shadow-[inset_0_11px_19px_rgba(80,66,47,0.08),inset_0_0_0_6px_rgba(181,159,119,0.06)]`} style={{ height: '100%', minHeight: 0 }} aria-label={spreadStartPage + 1 < totalPages ? `${text.page} ${spreadStartPage + 2} ${text.of} ${totalPages}` : undefined} aria-hidden={spreadStartPage + 1 >= totalPages}>
                    {spreadStartPage + 1 < totalPages ? (
                      renderPageContent(pages[spreadStartPage + 1], spreadStartPage + 1)
                    ) : null}
                  </article>
                  {turningSheet && (
                    <div
                      className={`absolute bottom-0 top-0 z-10 w-[calc((100%-25px)/2)] shadow-[0_8px_18px_rgba(52,43,31,0.28)] [transform-style:preserve-3d] ${turningSheet.direction === 'next' ? 'right-0 origin-left animate-[real-page-turn-forward_1100ms_cubic-bezier(.42,0,.25,1)_forwards] max-compact:top-1/2 max-compact:w-full max-compact:origin-top' : 'left-0 origin-right animate-[real-page-turn-backward_1100ms_cubic-bezier(.42,0,.25,1)_forwards] max-compact:bottom-1/2 max-compact:top-0 max-compact:origin-bottom'}`}
                      onAnimationEnd={finishPageTurn}
                      aria-hidden="true"
                    >
                      <div className="absolute inset-0 overflow-hidden rounded-[inherit] border border-[rgba(87,72,50,0.15)] bg-reader-paper [backface-visibility:hidden] dark:border-line">
                        <p className="mx-auto mt-[33px] max-w-[700px] whitespace-pre-line px-[clamp(18px,3vw,42px)] font-story leading-[2.05] text-reader-ink max-compact:mt-[23px] max-compact:leading-[1.95]" style={{ fontSize: `${textSize}rem` }}>{turningSheet.pageText}</p>
                      </div>
                      <div className="absolute inset-0 rounded-[inherit] border border-[rgba(87,72,50,0.15)] bg-[linear-gradient(100deg,#fffdf6,#eee5d0)] [transform:rotateY(180deg)] [backface-visibility:hidden] dark:border-line dark:bg-[linear-gradient(100deg,#263244,#1c263a)]" />
                    </div>
                  )}
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
                    {renderPageContent(pageText, index)}
                      </section>
                    ))}
                  </div>
                </article>
              )}
            </div>
            {layoutMode === 'pages' && (
              <>
                <button
                  className="absolute left-[-24px] top-1/2 z-20 grid size-[52px] -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-line bg-card text-[25px] font-bold text-green-dark shadow-[0_5px_15px_rgba(39,54,43,0.18)] transition-[transform,background,box-shadow] hover:scale-105 hover:bg-soft-surface hover:shadow-[0_7px_18px_rgba(39,54,43,0.22)] active:scale-95 disabled:cursor-default disabled:opacity-40 disabled:hover:scale-100 max-tablet:left-1 max-tablet:size-12 max-compact:top-1/4 max-compact:left-1"
                  type="button"
                  onClick={() => goToSpread(-1)}
                  disabled={spreadStartPage === 0}
                  aria-label={text.previousPage}
                >←</button>
                <button
                  className="absolute right-[-24px] top-1/2 z-20 grid size-[52px] -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-line bg-card text-[25px] font-bold text-green-dark shadow-[0_5px_15px_rgba(39,54,43,0.18)] transition-[transform,background,box-shadow] hover:scale-105 hover:bg-soft-surface hover:shadow-[0_7px_18px_rgba(39,54,43,0.22)] active:scale-95 disabled:cursor-default disabled:opacity-40 disabled:hover:scale-100 max-tablet:right-1 max-tablet:size-12 max-compact:top-3/4 max-compact:right-1"
                  type="button"
                  onClick={() => goToSpread(1)}
                  disabled={spreadStartPage >= lastSpreadStart}
                  aria-label={text.nextPage}
                >→</button>
              </>
            )}
          </div>
          {layoutMode === 'pages' && activeMode === 'read' && spreadEndPage === totalPages - 1 && !completed && (
            <button className="mt-5 inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-xl border-0 bg-[#58a36d] px-5 py-3 text-sm font-extrabold text-white shadow-[0_4px_0_#36784c] transition-transform hover:-translate-y-0.5 active:translate-y-0.5" type="button" onClick={() => { setCurrentPage(totalPages - 1); setCompleted(true) }}>
              <span aria-hidden="true">✦</span>{text.markComplete}
            </button>
          )}
          {completed && (layoutMode === 'pages' ? spreadEndPage === totalPages - 1 : currentPage === totalPages - 1) && <p className="mt-[25px] mb-0 flex items-center gap-2 text-sm font-extrabold text-[#538061] dark:text-[#a6d9b0]" role="status">✦ {text.readerComplete}</p>}

          {(activeMode === 'listen' || activeMode === 'readAlong') && (
            activeMode === 'listen' && recordedAudio ? (
              <RecordedAudioControls
                key={`${story.id}-${audioLanguage}-${activeMode}`}
                src={recordedAudio}
                labels={text}
                initialPosition={audioPosition}
                onPositionChange={handleRecordedAudioPosition}
                onComplete={handleRecordedAudioComplete}
                onReadInstead={() => { setActiveWord(null); setActiveMode('read') }}
                suspendAudio={suspendAudio}
              />
            ) : (
              <SpeechControls
                key={`${story.id}-${currentPage}-${language}-${activeMode}`}
                storyText={pages[currentPage]}
                language={audioLanguage}
                labels={text}
                onPageComplete={handleAudioPageComplete}
                onWordBoundary={handleWordBoundary}
                onReadInstead={() => { setActiveWord(null); setActiveMode('read') }}
                suspendAudio={suspendAudio}
              />
            )
          )}

          {layoutMode === 'pages' ? (
            <div className="mt-1 mb-1 flex justify-center" aria-live="polite">
              <span className="text-center text-xs font-extrabold text-muted">{spreadLabel}</span>
            </div>
          ) : (
          <div className="mt-3 mb-1 flex items-center justify-between gap-4 px-[clamp(4px,2vw,28px)]" role="group" aria-label={text.pageNavigation}>
            <button
              className="grid size-[52px] shrink-0 cursor-pointer place-items-center rounded-full border border-line bg-card text-[25px] font-bold text-green-dark shadow-[0_4px_12px_rgba(39,54,43,0.09)] transition-[transform,background] hover:bg-soft-surface active:scale-[0.96] disabled:cursor-default disabled:opacity-40 max-compact:size-12"
              type="button"
              onClick={() => layoutMode === 'pages' ? goToSpread(-1) : goToPage(currentPage - 1)}
              disabled={layoutMode === 'pages' ? spreadStartPage === 0 : currentPage === 0}
              aria-label={text.previousPage}
            >←</button>
            <span className="text-center text-xs font-extrabold text-muted" aria-live="polite">
              {layoutMode === 'pages' ? spreadLabel : `${text.page} ${pageNumber} ${text.of} ${totalPages}`}
            </span>
            <button
              className="grid size-[52px] shrink-0 cursor-pointer place-items-center rounded-full border border-line bg-card text-[25px] font-bold text-green-dark shadow-[0_4px_12px_rgba(39,54,43,0.09)] transition-[transform,background] hover:bg-soft-surface active:scale-[0.96] disabled:cursor-default disabled:opacity-40 max-compact:size-12"
              type="button"
              onClick={() => layoutMode === 'pages' ? goToSpread(1) : goToPage(currentPage + 1)}
              disabled={layoutMode === 'pages' ? spreadStartPage >= lastSpreadStart : currentPage === totalPages - 1}
              aria-label={text.nextPage}
            >→</button>
          </div>
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
            </>
          )}
        </aside>
      </div>
      {storageError && <p className="mt-3 mb-0 text-xs text-[#9d5847]" role="status">{text.saveProgressError}</p>}
    </section>
  )
}

