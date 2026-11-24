import { categories } from '../data/stories.js'

export default function StoryCard({ story, language, text, onChoose }) {
  const category = categories.find((item) => item.id === story.category)

  return (
    <article className="story-card">
      <button
        className={`story-cover art-${story.art}`}
        onClick={() => onChoose(story)}
        type="button"
        aria-label={`${text.sample}: ${story.title[language]}`}
      >
        <span className="cover-spark cover-spark-one" aria-hidden="true" />
        <span className="cover-spark cover-spark-two" aria-hidden="true" />
        <span className="cover-icon" aria-hidden="true">{story.icon}</span>
        <span className="cover-placeholder">{text.sample}</span>
      </button>
      <div className="story-card-copy">
        <div className="story-meta">
          <span className="category-label">{category?.label[language]}</span>
          <span className="read-time">{story.minutes} {text.readTime}</span>
        </div>
        <h3>{story.title[language]}</h3>
        <p>{story.description[language]}</p>
        <button className="text-button" type="button" onClick={() => onChoose(story)}>
          {text.sample} <span aria-hidden="true">↗</span>
        </button>
      </div>
    </article>
  )
}

