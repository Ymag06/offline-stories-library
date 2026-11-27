import { getStoryTitle } from '../lib/storyContent.js'
import AudioAvailabilityBadge from './AudioAvailabilityBadge.jsx'
import { getStoryArtClass } from './storyArtClasses.js'
import { textButtonClasses } from './buttonClasses.js'

export default function ReadingProgressCard({ story, record, language, text, onContinue }) {
  const totalPages = Math.max(1, record.totalPages || 1)
  const isCompleted = Boolean(record.completed && record.lastPosition >= totalPages - 1)
  const displayedPage = isCompleted ? totalPages : Math.min(record.lastPosition + 1, totalPages)
  const percent = isCompleted
    ? 100
    : Math.min(100, Math.round(((record.lastPosition + 1) / totalPages) * 100))
  const lastOpened = new Intl.DateTimeFormat(language === 'my' ? 'my-MM' : 'en-US', { dateStyle: 'medium' })
    .format(new Date(record.lastOpenedAt))

  return (
    <article className="grid grid-cols-[104px_1fr] gap-[17px] rounded-[19px] border border-[rgba(28,48,43,0.08)] bg-card p-[13px] max-compact:grid-cols-[74px_1fr] max-compact:gap-[11px] max-compact:p-[10px] dark:border-line">
      <div className={`grid min-h-28 place-items-center rounded-[14px] text-[42px] max-compact:min-h-[86px] max-compact:text-[32px] ${getStoryArtClass(story.art)}`} aria-hidden="true"><span>{story.icon}</span></div>
      <div className="min-w-0 self-center">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#59806b] dark:text-[#a3d1ad]">{isCompleted ? text.completed : `${percent}% ${text.read}`}</span>
            <h2 className="mt-[5px] mb-[10px] font-story text-[19px] font-semibold leading-[1.3] text-green-dark max-compact:text-base">{getStoryTitle(story, language)}</h2>
          </div>
          <span className="whitespace-nowrap rounded-lg bg-[#f0f2ec] px-2 py-[5px] text-[10px] font-bold text-[#718078] dark:bg-[#2b3831] dark:text-[#d1ddd4]">{displayedPage}/{totalPages}</span>
        </div>
        <div className="h-[5px] overflow-hidden rounded-full bg-[#e8ece3] dark:bg-[#344139]" role="progressbar" aria-label={text.progressTitle} aria-valuemin="0" aria-valuemax="100" aria-valuenow={percent}>
          <span className="block h-full rounded-[inherit] bg-[#75a783] transition-[width] duration-200" style={{ width: `${percent}%` }} />
        </div>
        <div className="mt-[7px] mb-px"><AudioAvailabilityBadge story={story} language={story.userCreated ? (story.language || language) : language} text={text} /></div>
        <div className="mt-2 flex items-center justify-between gap-3 max-compact:items-start max-compact:flex-col max-compact:gap-0.5">
          <small className="text-[10px] text-[#89958e] dark:text-[#b1beb6]">{text.lastOpened}: {lastOpened}</small>
          <button className={textButtonClasses} type="button" onClick={() => onContinue(story)}>
            {text.continueReading}<span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </article>
  )
}

