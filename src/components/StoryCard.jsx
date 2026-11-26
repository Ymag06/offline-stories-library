import { categories } from '../data/stories.js'
import { getStoryDescription, getStoryTitle } from '../lib/storyContent.js'
import AudioAvailabilityBadge from './AudioAvailabilityBadge.jsx'
import { getStoryArtClass } from './storyArtClasses.js'
import { textButtonClasses } from './buttonClasses.js'

export default function StoryCard({ story, language, text, onChoose }) {
  const category = categories.find((item) => item.id === story.category)
  const title = getStoryTitle(story, language)
  const description = getStoryDescription(story, language)

  return (
    <article className="group min-w-0 overflow-hidden rounded-[20px] border border-[rgba(28,48,43,0.08)] bg-card shadow-[0_5px_18px_rgba(44,57,47,0.035)] transition-[transform,box-shadow] duration-200 hover:-translate-y-[3px] hover:shadow-[0_12px_25px_rgba(44,57,47,0.09)] dark:border-line">
      <button
        className={`group/cover relative grid h-40 w-full cursor-pointer place-items-center overflow-hidden border-0 max-compact:h-[180px] ${getStoryArtClass(story.art)}`}
        onClick={() => onChoose(story)}
        type="button"
        aria-label={`${text.openStory}: ${title}`}
      >
        <span className="absolute top-[22px] left-[22px] size-7 rounded-full bg-white/45" aria-hidden="true" />
        <span className="absolute right-[25px] bottom-[21px] size-[14px] rounded-full bg-white/45" aria-hidden="true" />
        <span className="relative z-[1] text-[66px] drop-shadow-[0_9px_6px_rgba(45,57,48,0.15)] [transform:rotate(-7deg)] transition-transform duration-300 group-hover/cover:translate-y-[-4px] group-hover/cover:rotate-[2deg] group-hover/cover:scale-[1.04]" aria-hidden="true">{story.icon}</span>
        <span className="absolute top-[13px] left-[13px] rounded-full bg-[rgba(28,48,43,0.5)] px-2 py-1 text-[9px] font-extrabold uppercase tracking-[0.1em] text-[#fffef9]">{text.sample}</span>
      </button>
      <div className="p-[15px_16px_16px] max-compact:p-[14px]">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#59806b] dark:text-[#a3d1ad]">{category?.label[language]}</span>
          <span className="whitespace-nowrap text-[10px] text-[#89958e] dark:text-[#b5c1b9]">{story.minutes} {text.readTime}</span>
        </div>
        <div className="mt-[7px] flex min-h-[22px] items-center"><AudioAvailabilityBadge story={story} language={language} text={text} /></div>
        <h3 className="mt-[7px] mb-[5px] font-story text-lg font-semibold leading-[1.3] text-[#233c32] dark:text-green-dark">{title}</h3>
        <p className="m-0 min-h-[42px] text-xs leading-[1.55] text-[#728078] dark:text-[#b8c5bd] max-compact:min-h-0">{description}</p>
        <button className={textButtonClasses} type="button" onClick={() => onChoose(story)}>
          {text.openStory} <span aria-hidden="true">↗</span>
        </button>
      </div>
    </article>
  )
}

