const categoryArtClasses = {
  nature: 'bg-[linear-gradient(145deg,_#e7f0dc,_#f5f2df)]',
  adventure: 'bg-[linear-gradient(145deg,_#e1edf0,_#f4ead6)]',
  friendship: 'bg-[linear-gradient(145deg,_#f7e5df,_#f4edda)]',
  learning: 'bg-[linear-gradient(145deg,_#e8e8f3,_#eaf1df)]',
}

export default function CategoryRecommendationCard({ category, count, language, text, onChoose }) {
  const storyCount = count === 1 ? text.storyCountOne : `${count} ${text.storyCountMany}`
  const artClass = categoryArtClasses[category.art] || 'bg-card'

  return (
    <button
      className={`group flex min-w-0 min-h-[178px] cursor-pointer flex-col items-start gap-[10px] rounded-[18px] border border-[rgba(28,48,43,0.09)] px-[18px] py-[18px] text-left text-ink shadow-[0_5px_15px_rgba(44,57,47,0.025)] transition-[transform,box-shadow] duration-[180ms] hover:-translate-y-[3px] hover:shadow-[0_10px_22px_rgba(44,57,47,0.09)] focus-visible:outline-3 focus-visible:outline-offset-[3px] focus-visible:outline-[rgba(65,116,78,0.45)] dark:border-line ${artClass} max-compact:grid max-compact:min-h-[102px] max-compact:grid-cols-[38px_minmax(0,1fr)_auto] max-compact:items-center max-compact:gap-[11px] max-compact:p-[13px]`}
      type="button"
      onClick={() => onChoose(category.id)}
      aria-label={`${text.exploreCategory}: ${category.label[language]}`}
    >
      <span className="grid size-[39px] place-items-center rounded-[13px] bg-white/70 text-[21px] text-[#416c4d] dark:bg-[#34473a] dark:text-[#d8ebdc] max-compact:size-9">{category.icon}</span>
      <span className="grid gap-1">
        <strong className="font-story text-[15px] text-green-dark">{category.label[language]}</strong>
        <span className="text-[11px] leading-[1.5] text-[#6b7b70] dark:text-[#b8c9bc]">{category.hint[language]}</span>
      </span>
      <span className="mt-auto flex w-full items-center justify-between text-[#66806b] dark:text-[#b8c9bc] max-compact:mt-0 max-compact:w-auto max-compact:flex-row-reverse max-compact:gap-[6px]">
        <small className="text-[10px] font-[750]">{storyCount}</small>
        <span className="text-[17px]" aria-hidden="true">↗</span>
      </span>
    </button>
  )
}
