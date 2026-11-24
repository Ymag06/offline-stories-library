import { useEffect, useRef } from 'react'
import LanguageSwitcher from '../components/LanguageSwitcher.jsx'

export default function SettingsPage({ text, language, onLanguageChange, theme, onThemeChange, onClose }) {
  const closeButtonRef = useRef(null)

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    closeButtonRef.current?.focus()
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className="settings-drawer-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <aside className="settings-drawer" role="dialog" aria-modal="true" aria-labelledby="settings-drawer-title" onMouseDown={(event) => event.stopPropagation()}>
        <header className="settings-drawer-heading">
          <div>
            <span className="eyebrow">{text.settingsTitle}</span>
            <h1 id="settings-drawer-title">{text.settings}</h1>
            <p>{text.settingsText}</p>
          </div>
          <button ref={closeButtonRef} className="settings-drawer-close" type="button" onClick={onClose} aria-label={text.closeSettings}>×</button>
        </header>
        <div className="settings-drawer-content">
          <section className="settings-drawer-group" aria-labelledby="settings-language-label">
            <div className="settings-drawer-label"><strong id="settings-language-label">{text.language}</strong><small>{text.languageSaved}</small></div>
            <LanguageSwitcher text={text} language={language} onChange={onLanguageChange} large />
          </section>
          <section className="settings-drawer-group" aria-labelledby="settings-theme-label">
            <div className="settings-drawer-label"><strong id="settings-theme-label">{text.theme}</strong><small>{text.themeSaved}</small></div>
            <div className="theme-control" role="group" aria-label={text.theme}>
              <button type="button" className={theme === 'light' ? 'is-selected' : ''} onClick={() => onThemeChange('light')} aria-pressed={theme === 'light'}>
                <span aria-hidden="true">☀</span>{text.lightTheme}
              </button>
              <button type="button" className={theme === 'dark' ? 'is-selected' : ''} onClick={() => onThemeChange('dark')} aria-pressed={theme === 'dark'}>
                <span aria-hidden="true">☾</span>{text.darkTheme}
              </button>
            </div>
          </section>
        </div>
      </aside>
    </div>
  )
}

