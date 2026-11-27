const navItems = [
  { id: 'library', label: 'readNav', icon: '▤' },
  { id: 'myStories', label: 'createNav', icon: '✎' },
  { id: 'progress', label: 'readingNav', icon: '◷' },
]

export default function Header({ text, section, isStoryOpen, onNavigate }) {
  return (
    <header className="sticky top-0 z-10 border-b border-white/20 bg-[#56a4e8] transition-colors duration-700 ease-in-out dark:border-line dark:bg-[#142653]">
      <div className="mx-auto flex min-h-[78px] max-w-[1240px] items-center justify-between gap-8 px-8 max-wide:gap-5 max-wide:px-6 max-tablet:min-h-0 max-tablet:flex-wrap max-tablet:gap-x-3 max-tablet:gap-y-0 max-tablet:px-5 max-tablet:pt-3 max-tablet:pb-2 max-compact:px-4 max-compact:pt-3 max-compact:pb-2">
        <button className="mr-auto inline-flex min-h-12 shrink-0 cursor-pointer items-center gap-3 rounded-xl border-0 bg-transparent p-0 text-left" type="button" onClick={() => onNavigate('home')} aria-label={`${text.home}: ${text.brand}`}>
          <span className="grid size-11 place-items-center overflow-hidden rounded-2xl bg-[#fff0b2] shadow-[0_5px_14px_rgba(45,74,139,0.14)] max-tablet:size-10" aria-hidden="true"><img className="block size-full" src="/storybook.svg" alt="" /></span>
          <span className="grid leading-[1.15] text-white"><strong className="font-story text-[17px] tracking-[-0.025em] max-compact:text-[15px]">{text.brand}</strong><small className="mt-1 text-xs text-white/80 max-compact:text-[11px]">{text.brandSub}</small></span>
        </button>

        <nav className="flex items-center justify-center gap-1 rounded-full bg-[#f1f4fa] p-1 dark:bg-[#252f47] max-tablet:order-3 max-tablet:grid max-tablet:w-full max-tablet:grid-cols-3 max-tablet:rounded-2xl max-tablet:p-1" aria-label={text.navLabel}>
          {navItems.map((item) => {
            const isActive = (section === item.id || (item.id === 'library' && section === 'home')) && !isStoryOpen
            const navStateClasses = isActive
              ? 'bg-[#ffdc62] text-[#253b69] shadow-[0_3px_0_#e9a942] dark:bg-[#ffdc62] dark:text-[#253b69]'
              : 'bg-transparent text-[#405575] hover:bg-white/75 hover:text-[#243d78] dark:text-[#dce6ff] dark:hover:bg-white/15'

            return (
              <button
                className={`inline-flex min-h-12 shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full border-0 px-5 py-2.5 text-[14px] font-bold transition-[transform,background,color] duration-150 active:scale-[0.97] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus max-wide:px-4 max-tablet:rounded-xl max-tablet:px-2 max-tablet:py-2 max-tablet:text-[13px] max-compact:min-h-[54px] max-compact:flex-col max-compact:gap-0.5 max-compact:whitespace-normal max-compact:text-[11px] ${navStateClasses}`}
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="inline-grid w-[19px] place-items-center text-[18px] leading-none max-compact:text-[17px]" aria-hidden="true">{item.icon}</span>
                <span className="max-compact:leading-tight">{text[item.label]}</span>
              </button>
            )
          })}
        </nav>
        <button
          className={`grid size-12 shrink-0 cursor-pointer place-items-center rounded-full border border-white/50 bg-white/15 text-xl text-white transition-[transform,background] duration-150 hover:bg-white/25 active:scale-90 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus dark:border-white/25 dark:bg-white/10 dark:text-white max-tablet:ml-auto max-tablet:size-11 ${section === 'settings' ? 'bg-[#ffdc62] text-[#253b69]' : ''}`}
          type="button"
          onClick={() => onNavigate('settings')}
          aria-label={text.settings}
          aria-current={section === 'settings' ? 'page' : undefined}
        >⚙</button>
      </div>
    </header>
  )
}

