import { useEffect, useState } from 'react'
import StoryCard from '../components/StoryCard.jsx'
import ReadingProgressCard from '../components/ReadingProgressCard.jsx'
import HomeHero from '../components/HomeHero.jsx'
import ScrollReveal from '../components/ScrollReveal.jsx'
import { categories, stories } from '../data/stories.js'
import { getAllReadingProgress } from '../lib/readingProgress.js'

export default function HomePage({ text, language, onNavigate, onChooseStory, onChooseCategory }) {
  const [recentStories, setRecentStories] = useState([])
  const [shelfPaused, setShelfPaused] = useState(false)
  const featuredStories = stories.filter((story) => story.featured)
  const recommendedCategories = categories.filter((category) => category.id !== 'all')

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
            return story && !reachedLastPage
          })
          .sort((first, second) => new Date(second.lastOpenedAt) - new Date(first.lastOpenedAt))
          .slice(0, 2)
          .map((record) => ({ record, story: builtInStories.get(record.storyId) }))
        setRecentStories(recent)
      })
      .catch(() => { if (active) setRecentStories([]) })
    return () => { active = false }
  }, [])

  return (
    <>
      <HomeHero text={text} onExplore={() => onNavigate('library')} onWrite={() => onNavigate('myStories')} />
      <div className="relative z-[1] mx-auto -mt-2 max-w-[1180px] rounded-t-[32px] bg-[#fff9e9] px-8 pt-8 pb-10 shadow-[0_-10px_35px_rgba(42,85,134,0.12)] dark:bg-card max-tablet:px-5 max-compact:rounded-t-[24px] max-compact:px-4 max-compact:pt-6">
        <ScrollReveal as="section" className="mb-8" aria-labelledby="category-title">
          <div className="mb-4 flex items-end justify-between gap-4 max-compact:items-start max-compact:flex-col">
            <div>
              <h2 className="m-0 font-story text-[25px] font-bold text-[#263e65] dark:text-green-dark" id="category-title">{text.recommendedCategories}</h2>
              <p className="mt-1 mb-0 text-sm text-[#68758a] dark:text-muted">{text.recommendedCategoriesText}</p>
            </div>
            <button className="min-h-11 cursor-pointer rounded-xl border-0 bg-transparent px-3 text-sm font-extrabold text-[#315fce] hover:bg-[#e8efff] dark:text-green-dark" type="button" onClick={() => onNavigate('library')}>{text.seeAll} →</button>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {recommendedCategories.map((category, index) => {
              const colors = ['bg-[#dbf1d6]', 'bg-[#dcecff]', 'bg-[#ffe1d5]', 'bg-[#eee3ff]']
              return (
                <button
                  className={`inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-xl border-2 border-white px-4 py-2 text-sm font-extrabold text-[#17233b] shadow-[0_3px_0_rgba(61,75,97,0.1)] transition-transform hover:-translate-y-0.5 dark:border-line ${colors[index % colors.length]}`}
                  key={category.id}
                  type="button"
                  onClick={() => onChooseCategory(category.id)}
                >
                  <span aria-hidden="true">{category.icon}</span>{category.label[language]}
                </button>
              )
            })}
          </div>
        </ScrollReveal>

        {recentStories.length > 0 && (
          <ScrollReveal as="section" className="mb-9 border-t-2 border-dashed border-[#dfd7c3] pt-7 dark:border-line" aria-labelledby="recent-stories-title">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="m-0 font-story text-[25px] font-bold text-[#263e65] dark:text-green-dark" id="recent-stories-title">{text.recentlyOpened}</h2>
              <button className="min-h-11 cursor-pointer rounded-xl border-0 bg-transparent px-3 text-sm font-bold text-[#315fce] hover:bg-[#e8efff] dark:text-green-dark" type="button" onClick={() => onNavigate('progress')}>{text.progress}</button>
            </div>
            <div className="grid gap-3">
              {recentStories.map(({ record, story }, index) => (
                <ScrollReveal key={record.storyId} pop delay={index * 120}>
                  <ReadingProgressCard story={story} record={record} language={language} text={text} onContinue={onChooseStory} />
                </ScrollReveal>
              ))}
            </div>
          </ScrollReveal>
        )}

        <ScrollReveal as="section" className="border-t-2 border-dashed border-[#dfd7c3] pt-7 dark:border-line" id="featured-stories" aria-labelledby="featured-title">
          <div className="mb-4 flex items-end justify-between gap-4 max-compact:items-start max-compact:flex-col">
            <div>
              <h2 className="m-0 font-story text-[25px] font-bold text-[#263e65] dark:text-green-dark" id="featured-title">{text.featured}</h2>
              <p className="mt-1 mb-0 text-sm text-[#68758a] dark:text-muted">{text.featuredSub}</p>
            </div>
            <div className="flex items-center gap-2 max-compact:w-full max-compact:justify-between">
              <button className="min-h-11 cursor-pointer rounded-xl border border-line bg-white px-3 text-sm font-bold text-[#315fce] hover:bg-[#e8efff] dark:bg-card dark:text-green-dark" type="button" onClick={() => setShelfPaused((paused) => !paused)} aria-pressed={shelfPaused}>
                <span aria-hidden="true">{shelfPaused ? '▶' : 'Ⅱ'}</span><span className="ml-2">{shelfPaused ? text.playStories : text.pauseStories}</span>
              </button>
              <button className="min-h-11 cursor-pointer rounded-xl border-0 bg-transparent px-3 text-sm font-extrabold text-[#315fce] hover:bg-[#e8efff] dark:text-green-dark" type="button" onClick={() => onNavigate('library')}>{text.seeAll} →</button>
            </div>
          </div>
          <div className="overflow-hidden" aria-label={text.featured}>
            <div className={`flex w-max ${shelfPaused ? '[animation-play-state:paused]' : 'animate-[story-shelf-scroll_42s_linear_infinite]'} hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] motion-reduce:animate-none`}>
              {[0, 1].map((copy) => (
                <div className="flex w-max gap-5 pr-5 max-compact:gap-4 max-compact:pr-4" key={copy} aria-hidden={copy === 1 ? 'true' : undefined} inert={copy === 1 ? true : undefined}>
                  {featuredStories.map((story) => <StoryCard key={`${copy}-${story.id}`} className="w-[min(31vw,350px)] shrink-0 max-tablet:w-[min(45vw,350px)] max-compact:w-[min(82vw,350px)]" story={story} language={language} text={text} onChoose={onChooseStory} />)}
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </>
  )
}
