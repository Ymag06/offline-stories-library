import StoryCard from '../components/StoryCard.jsx'
import CategoryRecommendationCard from '../components/CategoryRecommendationCard.jsx'
import { categories, stories } from '../data/stories.js'

export default function HomePage({ text, language, onNavigate, onChooseStory, onChooseCategory }) {
  const featuredStories = stories.filter((story) => story.featured)
  const recommendedCategories = categories
    .filter((category) => category.id !== 'all')
    .map((category) => ({
      ...category,
      storyCount: stories.filter((story) => story.category === category.id).length,
    }))

  return (
    <>
      <section className="hero-card">
        <div className="hero-copy">
          <span className="eyebrow"><span className="eyebrow-dot" />{text.eyebrow}</span>
          <h1>{text.heroTitle.split('\n').map((line) => <span key={line}>{line}</span>)}</h1>
          <p>{text.heroText}</p>
          <button className="primary-button" type="button" onClick={() => onNavigate('library')}>
            {text.explore}<span aria-hidden="true">→</span>
          </button>
        </div>
        <div className="hero-illustration" aria-hidden="true">
          <span className="hero-moon" />
          <span className="hero-cloud hero-cloud-one" />
          <span className="hero-cloud hero-cloud-two" />
          <span className="hero-hill hero-hill-back" />
          <span className="hero-hill hero-hill-front" />
          <span className="hero-book"><span /><span /></span>
          <span className="hero-star star-one">✦</span>
          <span className="hero-star star-two">✦</span>
          <span className="hero-offline"><span>✓</span>{text.offlineReady}</span>
        </div>
      </section>

      <section className="quick-facts" aria-label={text.brandSub}>
        <div className="fact-item"><span className="fact-icon fact-sun">✦</span><span><strong>{stories.length}</strong><small>{text.storiesCount}</small></span></div>
        <div className="fact-item"><span className="fact-icon fact-leaf">❋</span><span><strong>{categories.length - 1}</strong><small>{text.categoriesCount}</small></span></div>
        <div className="fact-item"><span className="fact-icon fact-book">▤</span><span><strong>{text.offlineReady}</strong><small>{text.brandSub}</small></span></div>
      </section>

      <section className="story-section" id="featured-stories">
        <div className="section-heading">
          <div><span className="eyebrow">{text.sample}</span><h2>{text.featured}</h2><p>{text.featuredSub}</p></div>
          <button className="secondary-button" type="button" onClick={() => onNavigate('library')}>
            {text.seeAll}<span aria-hidden="true">↗</span>
          </button>
        </div>
        <div className="story-grid">
          {featuredStories.map((story) => (
            <StoryCard key={story.id} story={story} language={language} text={text} onChoose={onChooseStory} />
          ))}
        </div>
      </section>

      <section className="category-recommendations" aria-labelledby="recommended-categories-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">{text.brand}</span>
            <h2 id="recommended-categories-title">{text.recommendedCategories}</h2>
            <p>{text.recommendedCategoriesText}</p>
          </div>
        </div>
        <div className="category-recommendation-grid">
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

