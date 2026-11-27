import { categories } from '../data/stories.js'
import { getStoryDescription, getStoryTitle } from '../lib/storyContent.js'
import AudioAvailabilityBadge from './AudioAvailabilityBadge.jsx'
import { getStoryArtClass } from './storyArtClasses.js'

export default function StoryCard({ story, language, text, onChoose, className = '' }) {
  const category = categories.find((item) => item.id === story.category)
  const title = getStoryTitle(story, language)
  const description = getStoryDescription(story, language)

  return (
    <article className={`group min-w-0 overflow-hidden rounded-[8px] border-[5px] border-white bg-card shadow-[0_9px_20px_rgba(41,56,81,0.16)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(44,57,47,0.18)] dark:border-line ${className}`}>
      <button
        className={`group/cover relative grid h-[210px] w-full cursor-pointer place-items-center overflow-hidden border-0 max-compact:h-[180px] ${getStoryArtClass(story.art)}`}
        onClick={() => onChoose(story)}
        type="button"
        aria-label={`${text.openStory}: ${title}`}
      >
        {story.coverImage ? (
          <img className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover/cover:scale-[1.03]" src={story.coverImage} alt="" />
        ) : (
          <>
            <span className="absolute -right-8 -top-10 size-40 rounded-full border-[18px] border-white/15" aria-hidden="true" />
            <span className="absolute -bottom-16 -left-7 size-48 rounded-full border-[22px] border-white/15" aria-hidden="true" />
            <span className="relative z-[1] grid size-32 place-items-center rounded-[38px] border-[5px] border-white/80 bg-white/55 text-[76px] shadow-[0_18px_28px_rgba(47,72,57,0.16)] backdrop-blur-[2px] transition-transform duration-300 group-hover/cover:-translate-y-1 group-hover/cover:rotate-3 max-compact:size-28 max-compact:text-[68px]" aria-hidden="true">{story.icon}</span>
          </>
        )}
        <span className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1.5 text-[11px] font-extrabold text-[#355744]">{category?.label[language]}</span>
      </button>
      <div className="p-5 max-compact:p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full bg-[#edf3e9] px-3 py-1 text-xs font-bold text-[#466a50] dark:bg-[#2c4032] dark:text-[#c6e4c9]">{story.minutes} {text.readTime}</span>
          <AudioAvailabilityBadge story={story} language={language} text={text} />
        </div>
        <h3 className="mt-3 mb-1.5 font-story text-[22px] font-bold leading-[1.25] text-[#263755] dark:text-green-dark">{title}</h3>
        <p className="m-0 min-h-[48px] text-[14px] leading-[1.65] text-[#64746b] dark:text-[#b8c5bd] max-compact:min-h-0">{description}</p>
        <button className="mt-4 inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border-0 bg-[#eaf1e6] px-4 py-3 text-sm font-extrabold text-[#285442] transition-colors hover:bg-[#dce9d9] dark:bg-[#304638] dark:text-[#e0f0e1] dark:hover:bg-[#3a5544]" type="button" onClick={() => onChoose(story)}>
          {text.openStory}<span aria-hidden="true">→</span>
        </button>
      </div>
    </article>
  )
}

