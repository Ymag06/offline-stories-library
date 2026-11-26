import { useEffect, useState } from 'react'
import StoryCard from '../components/StoryCard.jsx'
import CategoryRecommendationCard from '../components/CategoryRecommendationCard.jsx'
import ReadingProgressCard from '../components/ReadingProgressCard.jsx'
import HomeHero from '../components/HomeHero.jsx'
import { secondaryButtonClasses } from '../components/buttonClasses.js'
import { categories, stories } from '../data/stories.js'
import { getAllReadingProgress } from '../lib/readingProgress.js'

export default function HomePage({ text, language, onNavigate, onChooseStory, onChooseCategory }) {
  const [recentStories, setRecentStories] = useState([])
  const featuredStories = stories.filter((story) => story.featured)
  const recommendedCategories = categories
    .filter((category) => category.id !== 'all')
    .map((category) => ({
      ...category,
      storyCount: stories.filter((story) => story.category === category.id).length,
    }))

  useEffect(() => {
    let active = true
    const builtInStories = new Map(stories.map((story) => [story.id, story]))

    getAllReadingProgress()
      .then((records) => {
        if (!active) return
        const recent = records
          .filter((record) => {
            const story = builtInStories.get(record.storyId)
            const reachedLastPage = record.totalPages > 0 && record.lastPosition >= record.totalPages - 1
            return story && !record.completed && !reachedLastPage
          })
          .sort((first, second) => new Date(second.lastOpenedAt) - new Date(first.lastOpenedAt))
          .slice(0, 3)
          .map((record) => ({ record, story: builtInStories.get(record.storyId) }))
        setRecentStories(recent)
      })
      .catch(() => { if (active) setRecentStories([]) })

    return () => { active = false }
  }, [])

  return (
    <>
      <HomeHero text={text} onExplore={() => onNavigate('library')} />

      <section className="my-[21px] mb-[45px] grid grid-cols-3 rounded-[20px] border border-ink/10 bg-[rgba(255,254,249,0.75)] px-[25px] py-[17px] dark:border-line dark:bg-card max-tablet:px-[10px] max-tablet:py-[15px] max-compact:my-[13px] max-compact:mb-[31px] max-compact:grid-cols-2 max-compact:gap-x-[6px] max-compact:gap-y-[11px] max-compact:px-[10px] max-compact:py-[13px]" aria-label={text.brandSub}>
        <div className="flex items-center gap-3 px-5 py-0.5 max-tablet:gap-2 max-tablet:px-[10px] max-compact:px-[5px]"><span className="grid size-[37px] place-items-center rounded-[13px] bg-[#f9ebc6] text-[17px] text-[#ad713a] max-compact:size-[31px] max-compact:rounded-[10px] max-compact:text-sm" aria-hidden="true">✦</span><span className="grid leading-[1.3]"><strong className="text-[15px] text-ink max-tablet:text-[13px] max-compact:text-xs">{stories.length}</strong><small className="mt-[3px] text-[11px] text-muted max-tablet:text-[10px] max-compact:text-[9px]">{text.storiesCount}</small></span></div>
        <div className="flex items-center gap-3 border-l border-ink/10 px-5 py-0.5 max-tablet:gap-2 max-tablet:px-[10px] max-compact:px-[5px]"><span className="grid size-[37px] place-items-center rounded-[13px] bg-[#e3eddd] text-[17px] text-[#467658] max-compact:size-[31px] max-compact:rounded-[10px] max-compact:text-sm" aria-hidden="true">❋</span><span className="grid leading-[1.3]"><strong className="text-[15px] text-ink max-tablet:text-[13px] max-compact:text-xs">{categories.length - 1}</strong><small className="mt-[3px] text-[11px] text-muted max-tablet:text-[10px] max-compact:text-[9px]">{text.categoriesCount}</small></span></div>
        <div className="flex items-center gap-3 border-l border-ink/10 px-5 py-0.5 max-tablet:gap-2 max-tablet:px-[10px] max-compact:col-span-full max-compact:border-t max-compact:border-l-0 max-compact:border-ink/10 max-compact:px-[5px] max-compact:pt-[9px]"><span className="grid size-[37px] place-items-center rounded-[13px] bg-[#f5e1d9] text-[17px] text-[#a46052] max-compact:size-[31px] max-compact:rounded-[10px] max-compact:text-sm" aria-hidden="true">▤</span><span className="grid leading-[1.3]"><strong className="text-[15px] text-ink max-tablet:text-[13px] max-compact:text-xs">{text.offlineReady}</strong><small className="mt-[3px] text-[11px] text-muted max-tablet:text-[10px] max-compact:text-[9px]">{text.brandSub}</small></span></div>
      </section>

      <section className="pb-[19px]" id="featured-stories">
        <div className="mb-5 flex items-end justify-between gap-5 max-compact:items-start max-compact:flex-col max-compact:gap-3">
          <div><span className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#577065] dark:text-[#b7cbbd]">{text.sample}</span><h2 className="mt-[6px] mb-1 font-story text-[clamp(26px,3vw,36px)] font-medium leading-[1.2] tracking-[-0.035em] text-green-dark max-compact:text-[28px]">{text.featured}</h2><p className="m-0 text-[13px] text-muted max-compact:text-xs">{text.featuredSub}</p></div>
          <button className={secondaryButtonClasses} type="button" onClick={() => onNavigate('library')}>
            {text.seeAll}<span className="text-[17px] leading-none" aria-hidden="true">↗</span>
          </button>
        </div>
        <div className="grid grid-cols-3 gap-[17px] max-tablet:grid-cols-2 max-compact:grid-cols-1 max-compact:gap-[13px]">
          {featuredStories.map((story) => (
            <StoryCard key={story.id} story={story} language={language} text={text} onChoose={onChooseStory} />
          ))}
        </div>
      </section>

      {recentStories.length > 0 && (
        <section aria-labelledby="recent-stories-title">
          <div className="mb-5 flex items-end justify-between gap-5 max-compact:items-start max-compact:flex-col max-compact:gap-3">
            <div>
              <span className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#577065] dark:text-[#b7cbbd]">{text.progress}</span>
              <h2 className="mt-[6px] mb-1 font-story text-[clamp(26px,3vw,36px)] font-medium leading-[1.2] tracking-[-0.035em] text-green-dark max-compact:text-[28px]" id="recent-stories-title">{text.recentlyOpened}</h2>
              <p className="m-0 text-[13px] text-muted max-compact:text-xs">{text.recentlyOpenedText}</p>
            </div>
          </div>
          <div className="grid gap-[13px]">
            {recentStories.map(({ record, story }) => (
              <ReadingProgressCard
                key={record.storyId}
                story={story}
                record={record}
                language={language}
                text={text}
                onContinue={onChooseStory}
              />
            ))}
          </div>
        </section>
      )}

      <section className="pt-[27px] pb-2" aria-labelledby="recommended-categories-title">
        <div className="mb-5 flex items-end justify-between gap-5 max-compact:items-start max-compact:flex-col max-compact:gap-3">
          <div>
            <span className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#577065] dark:text-[#b7cbbd]">{text.brand}</span>
            <h2 className="mt-[6px] mb-1 font-story text-[clamp(26px,3vw,36px)] font-medium leading-[1.2] tracking-[-0.035em] text-green-dark max-compact:text-[28px]" id="recommended-categories-title">{text.recommendedCategories}</h2>
            <p className="m-0 text-[13px] text-muted max-compact:text-xs">{text.recommendedCategoriesText}</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-[13px] max-tablet:grid-cols-2 max-compact:grid-cols-1 max-compact:gap-[9px]">
          {recommendedCategories.map((category) => (
            <CategoryRecommendationCard
              key={category.id}
              category={category}
              count={category.storyCount}
              language={language}
              text={text}
              onChoose={onChooseCategory}
            />
          ))}
        </div>
      </section>
    </>
  )
}

