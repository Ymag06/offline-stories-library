import { useEffect, useState } from 'react'
import EmptyPage from '../components/EmptyPage.jsx'
import ReadingProgressCard from '../components/ReadingProgressCard.jsx'
import { stories } from '../data/stories.js'
import { getAllReadingProgress } from '../lib/readingProgress.js'

export default function ProgressPage({ text, language, onContinueStory }) {
  const [records, setRecords] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let active = true

    getAllReadingProgress()
      .then((items) => {
        if (!active) return
        setRecords(items.sort((first, second) => new Date(second.lastOpenedAt) - new Date(first.lastOpenedAt)))
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

  const storiesWithProgress = records
    .map((record) => ({ record, story: stories.find((item) => item.id === record.storyId) }))
    .filter((item) => item.story)

  if (storiesWithProgress.length === 0) {
    return <EmptyPage icon="◷" brand={text.brand} title={text.progressTitle} body={text.progressText} note={text.startReading} />
  }

  return (
    <section className="progress-page">
      <div className="section-heading">
        <div><span className="eyebrow">{text.brand}</span><h1>{text.progressTitle}</h1><p>{text.progressText}</p></div>
      </div>
      <div className="progress-list">
        {storiesWithProgress.map(({ record, story }) => (
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

