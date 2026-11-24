export default function CategoryRecommendationCard({ category, count, language, text, onChoose }) {
  const storyCount = count === 1 ? text.storyCountOne : `${count} ${text.storyCountMany}`

  return (
    <button
      className={`category-recommendation-card category-rec-${category.art}`}
      type="button"
      onClick={() => onChoose(category.id)}
      aria-label={`${text.exploreCategory}: ${category.label[language]}`}
    >
      <span className="category-rec-icon" aria-hidden="true">{category.icon}</span>
      <span className="category-rec-copy">
        <strong>{category.label[language]}</strong>
        <span>{category.hint[language]}</span>
      </span>
      <span className="category-rec-footer">
        <small>{storyCount}</small>
        <span aria-hidden="true">↗</span>
      </span>
    </button>
  )
}
