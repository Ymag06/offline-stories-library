import { useMemo, useState } from 'react'
import StoryCard from '../components/StoryCard.jsx'
import ScrollReveal from '../components/ScrollReveal.jsx'
import { categories, stories } from '../data/stories.js'

export default function LibraryPage({ text, language, initialCategory = 'all', onChooseStory }) {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState(initialCategory)

  const visibleStories = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase(language === 'my' ? 'my' : 'en')
    return stories.filter((story) => {
      const matchesCategory = activeCategory === 'all' || story.category === activeCategory
      const searchText = `${story.title[language]} ${story.description[language]}`
        .toLocaleLowerCase(language === 'my' ? 'my' : 'en')
      return matchesCategory && (!normalizedQuery || searchText.includes(normalizedQuery))
    })
  }, [activeCategory, language, query])

  return (
    <section className="pt-[11px]">
      <div className="mb-[26px] flex items-start justify-between gap-5 max-compact:flex-col max-compact:gap-3">
        <div><span className="inline-flex items-center rounded-full bg-[#e8efff] px-3 py-1 text-xs font-extrabold text-[#315fce] dark:bg-[#2b3b61] dark:text-[#b9ccff]">{text.sample}</span><h1 className="mt-2 mb-1 font-story text-[clamp(30px,3.2vw,40px)] font-bold leading-[1.15] tracking-[-0.035em] text-green-dark max-compact:text-[28px]">{text.searchTitle}</h1><p className="m-0 text-sm text-muted max-compact:text-xs">{text.searchSub}</p></div>
      </div>
      <label className="mb-[18px] flex h-[52px] w-full max-w-[520px] items-center gap-[11px] rounded-[15px] border border-ink/12 bg-card px-[15px] text-[#7b8b82] dark:border-line dark:text-muted">
        <span className="text-[25px] leading-none" aria-hidden="true">⌕</span>
        <span className="sr-only">{text.searchTitle}</span>
        <input className="w-full border-0 bg-transparent text-sm text-ink outline-none focus-visible:outline-none" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={text.searchPlaceholder} />
        {query && (
          <button
            className="grid size-7 cursor-pointer place-items-center rounded-full border-0 bg-[#edf0e9] text-lg dark:bg-[#2b3831] dark:text-[#d1ddd4]"
            type="button"
            onClick={() => setQuery('')}
            aria-label={language === 'en' ? 'Clear search' : 'ရှာဖွေမှုကို ဖျက်ရန်'}
          >×</button>
        )}
      </label>
      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label={text.allStories}>
        {categories.map((category) => (
          <button
            className={`min-h-11 cursor-pointer rounded-full border border-ink/12 bg-[rgba(255,254,249,0.55)] px-4 py-2.5 text-[13px] font-bold text-[#53685d] transition-colors hover:border-selected-bg hover:bg-selected-bg hover:text-selected-ink dark:border-line dark:bg-[#202b25] dark:text-[#d3ddd6] ${activeCategory === category.id ? 'border-selected-bg bg-selected-bg text-selected-ink' : ''}`}
            key={category.id}
            type="button"
            onClick={() => setActiveCategory(category.id)}
            aria-pressed={activeCategory === category.id}
          >
            {category.label[language]}
          </button>
        ))}
      </div>
      {visibleStories.length ? (
        <div className="grid grid-cols-3 gap-[17px] max-tablet:grid-cols-2 max-compact:grid-cols-1 max-compact:gap-[13px]">
          {visibleStories.map((story, index) => (
            <ScrollReveal key={story.id} delay={Math.min(index * 70, 350)}>
              <StoryCard story={story} language={language} text={text} onChoose={onChooseStory} />
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <div className="grid min-h-[210px] place-content-center justify-items-center rounded-[20px] border border-dashed border-ink/20 text-center text-muted dark:border-line dark:bg-card"><span className="text-[32px]" aria-hidden="true">⌕</span><p className="max-w-[330px] text-sm">{text.noResults}</p></div>
      )}
    </section>
  )
}

