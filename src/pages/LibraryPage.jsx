import { useMemo, useState } from 'react'
import StoryCard from '../components/StoryCard.jsx'
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
    <section className="library-page">
      <div className="section-heading library-heading">
        <div><span className="eyebrow">{text.sample}</span><h1>{text.searchTitle}</h1><p>{text.searchSub}</p></div>
      </div>
      <label className="search-box">
        <span aria-hidden="true">⌕</span>
        <span className="sr-only">{text.searchTitle}</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={text.searchPlaceholder} />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label={language === 'en' ? 'Clear search' : 'ရှာဖွေမှုကို ဖျက်ရန်'}
          >×</button>
        )}
      </label>
      <div className="category-list" role="group" aria-label={text.allStories}>
        {categories.map((category) => (
          <button
            className={`category-chip ${activeCategory === category.id ? 'is-selected' : ''}`}
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
        <div className="story-grid library-grid">
          {visibleStories.map((story) => (
            <StoryCard key={story.id} story={story} language={language} text={text} onChoose={onChooseStory} />
          ))}
        </div>
      ) : (
        <div className="no-results"><span aria-hidden="true">⌕</span><p>{text.noResults}</p></div>
      )}
    </section>
  )
}

