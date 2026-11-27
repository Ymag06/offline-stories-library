const categoryArtClasses = {
  nature: 'bg-[linear-gradient(145deg,_#d4f3d0,_#f7f3b3)]',
  adventure: 'bg-[linear-gradient(145deg,_#c8e8ff,_#e5d5ff)]',
  friendship: 'bg-[linear-gradient(145deg,_#ffd4cc,_#ffe8a5)]',
  learning: 'bg-[linear-gradient(145deg,_#d9d4ff,_#c8f1ee)]',
}

export default function CategoryRecommendationCard({ category, count, language, text, onChoose }) {
  const storyCount = count === 1 ? text.storyCountOne : `${count} ${text.storyCountMany}`
  const artClass = categoryArtClasses[category.art] || 'bg-card'

  return (
    <button
      className={`group flex min-w-0 min-h-[170px] cursor-pointer flex-col items-start gap-3 rounded-[22px] border border-ink/10 px-5 py-5 text-left text-ink shadow-[0_5px_15px_rgba(44,57,47,0.03)] transition-[transform,box-shadow] duration-[180ms] hover:-translate-y-1 hover:shadow-[0_10px_22px_rgba(44,57,47,0.09)] focus-visible:outline-3 focus-visible:outline-offset-[3px] focus-visible:outline-[rgba(65,116,78,0.45)] dark:border-line ${artClass} max-compact:grid max-compact:min-h-[100px] max-compact:grid-cols-[40px_minmax(0,1fr)_auto] max-compact:items-center max-compact:gap-3 max-compact:p-4`}
      type="button"
      onClick={() => onChoose(category.id)}
      aria-label={`${text.exploreCategory}: ${category.label[language]}`}
    >
      <span className="grid size-[39px] place-items-center rounded-[13px] bg-white/70 text-[21px] text-[#416c4d] dark:bg-[#34473a] dark:text-[#d8ebdc] max-compact:size-9">{category.icon}</span>
      <span className="grid gap-1">
        <strong className="font-story text-base text-green-dark">{category.label[language]}</strong>
        <span className="text-[13px] leading-[1.5] text-[#607267] dark:text-[#b8c9bc]">{category.hint[language]}</span>
      </span>
      <span className="mt-auto flex w-full items-center justify-between text-[#66806b] dark:text-[#b8c9bc] max-compact:mt-0 max-compact:w-auto max-compact:flex-row-reverse max-compact:gap-[6px]">
        <small className="text-xs font-bold">{storyCount}</small>
        <span className="text-lg" aria-hidden="true">↗</span>
      </span>
    </button>
  )
}
