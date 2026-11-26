const navItems = [
  { id: 'home', icon: '⌂' },
  { id: 'library', icon: '▤' },
  { id: 'myStories', icon: '♡' },
  { id: 'progress', icon: '◷' },
  { id: 'settings', icon: '⚙' },
]

export default function Header({ text, section, isStoryOpen, onNavigate }) {
  return (
    <header className="sticky top-0 z-10 border-b border-ink/10 bg-cream/[0.92] backdrop-blur-[16px] dark:border-line">
      <div className="mx-auto flex min-h-[82px] max-w-[1280px] items-center justify-between gap-7 px-[42px] max-wide:gap-[18px] max-wide:px-6 max-tablet:min-h-[74px] max-tablet:flex-wrap max-tablet:gap-x-3 max-tablet:gap-y-0 max-tablet:px-5 max-tablet:pt-3 max-tablet:pb-2 max-compact:px-[15px] max-compact:pt-[10px] max-compact:pb-[6px]">
        <button className="mr-auto inline-flex shrink-0 cursor-pointer items-center gap-[11px] border-0 bg-transparent p-0 text-left" type="button" onClick={() => onNavigate('home')} aria-label={text.brand}>
          <span className="grid size-[43px] place-items-center overflow-hidden rounded-[15px] shadow-[0_5px_14px_rgba(23,63,53,0.13)] max-tablet:size-[39px]" aria-hidden="true"><img className="block size-full" src="/storybook.svg" alt="" /></span>
          <span className="grid leading-[1.15]"><strong className="font-story text-[16px] tracking-[-0.025em] max-compact:text-[14px]">{text.brand}</strong><small className="mt-1 text-[11px] tracking-[0.045em] text-muted max-compact:text-[10px]">{text.brandSub}</small></span>
        </button>

        <nav className="flex items-center justify-center gap-1 max-tablet:order-3 max-tablet:w-full max-tablet:justify-start max-tablet:overflow-x-auto max-tablet:pt-2 max-tablet:pb-px [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label={text.navLabel}>
          {navItems.map((item) => {
            const isActive = section === item.id && !isStoryOpen
            const navStateClasses = isActive
              ? 'bg-[#e7eee6] text-green-dark dark:bg-[#2c3d33] dark:text-green-dark'
              : 'bg-transparent text-[#67766f] hover:bg-[rgba(29,81,67,0.06)] hover:text-green-dark dark:text-[#bdc9c1] dark:hover:bg-[#2c3d33] dark:hover:text-green-dark'

            return (
              <button
                className={`inline-flex shrink-0 cursor-pointer items-center gap-[7px] whitespace-nowrap rounded-xl border-0 px-3 py-2.5 text-[13px] font-semibold transition-colors duration-[180ms] max-wide:px-2 max-wide:py-[9px] max-wide:text-xs max-tablet:px-[11px] max-tablet:py-2 ${navStateClasses}`}
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="inline-grid w-[17px] place-items-center text-[17px] leading-none" aria-hidden="true">{item.icon}</span>
                <span>{text[item.id]}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </header>
  )
}

