import { getStoryTitle } from '../lib/storyContent.js'
import AudioAvailabilityBadge from './AudioAvailabilityBadge.jsx'

export default function ReadingProgressCard({ story, record, language, text, onContinue }) {
  const totalPages = Math.max(1, record.totalPages || 1)
  const percent = record.completed
    ? 100
    : Math.min(100, Math.round(((record.lastPosition + 1) / totalPages) * 100))
  const lastOpened = new Intl.DateTimeFormat(language === 'my' ? 'my-MM' : 'en-US', { dateStyle: 'medium' })
    .format(new Date(record.lastOpenedAt))

  return (
    <article className="progress-card">
      <div className={`progress-cover art-${story.art}`} aria-hidden="true"><span>{story.icon}</span></div>
      <div className="progress-card-body">
        <div className="progress-card-heading">
          <div>
            <span className="category-label">{record.completed ? text.completed : `${percent}% ${text.read}`}</span>
            <h2>{getStoryTitle(story, language)}</h2>
          </div>
          <span className="progress-page-count">{record.lastPosition + 1}/{totalPages}</span>
        </div>
        <div className="progress-track" role="progressbar" aria-label={text.progressTitle} aria-valuemin="0" aria-valuemax="100" aria-valuenow={percent}>
          <span style={{ width: `${percent}%` }} />
        </div>
        <div className="progress-card-audio"><AudioAvailabilityBadge story={story} language={story.userCreated ? (story.language || language) : language} text={text} /></div>
        <div className="progress-card-footer">
          <small>{text.lastOpened}: {lastOpened}</small>
          <button className="text-button" type="button" onClick={() => onContinue(story)}>
            {text.continueReading}<span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </article>
  )
}

