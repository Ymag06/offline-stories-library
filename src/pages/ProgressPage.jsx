import { useEffect, useState } from 'react'
import EmptyPage from '../components/EmptyPage.jsx'
import ReadingProgressCard from '../components/ReadingProgressCard.jsx'
import ScrollReveal from '../components/ScrollReveal.jsx'
import { stories } from '../data/stories.js'
import { getAllReadingProgress } from '../lib/readingProgress.js'
import { getAllUserStories } from '../lib/userStories.js'

export default function ProgressPage({ text, language, onContinueStory }) {
  const [records, setRecords] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let active = true

    Promise.all([getAllReadingProgress(), getAllUserStories()])
      .then(([items, userStories]) => {
        if (!active) return
        const knownStories = new Map([...stories, ...userStories].map((story) => [story.id, story]))
        setRecords(items
          .map((record) => ({ record, story: knownStories.get(record.storyId) }))
          .filter((item) => item.story)
          .sort((first, second) => new Date(second.record.lastOpenedAt) - new Date(first.record.lastOpenedAt)))
        setStatus('ready')
      })
      .catch(() => {
        if (active) setStatus('error')
      })

    return () => { active = false }
  }, [])

  if (status === 'loading') {
    return <p className="grid min-h-[350px] place-content-center text-center text-muted" role="status">{text.progressLoading}</p>
  }

  if (status === 'error') {
    return <EmptyPage icon="◷" brand={text.brand} title={text.progressTitle} body={text.progressStorageError} note={text.startReading} />
  }

  if (records.length === 0) {
    return <EmptyPage icon="◷" brand={text.brand} title={text.progressTitle} body={text.progressText} note={text.startReading} />
  }

  return (
    <section className="pt-2">
      <div className="mb-5 flex items-end justify-between gap-5 max-compact:items-start max-compact:flex-col max-compact:gap-3">
        <div><span className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#577065] dark:text-[#b7cbbd]">{text.brand}</span><h1 className="mt-[6px] mb-1 font-story text-[clamp(26px,3vw,36px)] font-medium leading-[1.2] tracking-[-0.035em] text-green-dark max-compact:text-[28px]">{text.progressTitle}</h1><p className="m-0 text-[13px] text-muted max-compact:text-xs">{text.progressText}</p></div>
      </div>
      <div className="grid gap-[13px]">
        {records.map(({ record, story }, index) => (
          <ScrollReveal key={record.storyId} pop delay={Math.min(index * 120, 360)}>
            <ReadingProgressCard
            story={story}
            record={record}
            language={language}
            text={text}
            onContinue={onContinueStory}
            />
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}

