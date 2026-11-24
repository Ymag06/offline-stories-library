import LanguageSwitcher from './LanguageSwitcher.jsx'

const navItems = [
  { id: 'home', icon: '⌂' },
  { id: 'library', icon: '▤' },
  { id: 'myStories', icon: '♡' },
  { id: 'progress', icon: '◷' },
  { id: 'settings', icon: '⚙' },
]

export default function Header({ text, language, onLanguageChange, section, isStoryOpen, onNavigate }) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <button className="brand" type="button" onClick={() => onNavigate('home')} aria-label={text.brand}>
          <span className="brand-mark" aria-hidden="true"><img src="/storybook.svg" alt="" /></span>
          <span className="brand-copy"><strong>{text.brand}</strong><small>{text.brandSub}</small></span>
        </button>

        <nav className="main-nav" aria-label={text.navLabel}>
          {navItems.map((item) => (
            <button
              className={`nav-link ${section === item.id && !isStoryOpen ? 'is-active' : ''}`}
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              aria-current={section === item.id && !isStoryOpen ? 'page' : undefined}
            >
              <span className="nav-icon" aria-hidden="true">{item.icon}</span>
              <span>{text[item.id]}</span>
            </button>
          ))}
        </nav>

        <LanguageSwitcher text={text} language={language} onChange={onLanguageChange} />
      </div>
    </header>
  )
}

