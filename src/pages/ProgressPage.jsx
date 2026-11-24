import { useEffect, useState } from 'react'
import EmptyPage from '../components/EmptyPage.jsx'
import ReadingProgressCard from '../components/ReadingProgressCard.jsx'
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
    return <p className="progress-loading" role="status">{text.progressLoading}</p>
  }

  if (status === 'error') {
    return <EmptyPage icon="◷" brand={text.brand} title={text.progressTitle} body={text.progressStorageError} note={text.startReading} />
  }

  if (records.length === 0) {
    return <EmptyPage icon="◷" brand={text.brand} title={text.progressTitle} body={text.progressText} note={text.startReading} />
  }

  return (
    <section className="progress-page">
      <div className="section-heading">
        <div><span className="eyebrow">{text.brand}</span><h1>{text.progressTitle}</h1><p>{text.progressText}</p></div>
      </div>
      <div className="progress-list">
        {records.map(({ record, story }) => (
          <ReadingProgressCard
            key={record.storyId}
            story={story}
            record={record}
            language={language}
            text={text}
            onContinue={onContinueStory}
          />
        ))}
      </div>
    </section>
  )
}

