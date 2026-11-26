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
    <div className="fixed inset-0 z-40 flex justify-end bg-[rgba(20,31,25,0.46)] backdrop-blur-[3px] dark:bg-[rgba(0,0,0,0.62)]" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <aside className="h-screen [height:100dvh] w-[min(390px,calc(100vw-16px))] overflow-y-auto border-l border-line bg-card px-[clamp(18px,4vw,28px)] py-[25px] text-ink shadow-[-14px_0_44px_rgba(20,35,26,0.18)]" role="dialog" aria-modal="true" aria-labelledby="settings-drawer-title" onMouseDown={(event) => event.stopPropagation()}>
        <header className="flex items-start justify-between gap-[15px] pb-5">
          <div>
            <span className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#577065] dark:text-[#b7cbbd]">{text.settingsTitle}</span>
            <h1 className="mt-1 mb-[5px] font-story text-[27px] leading-[1.2] text-green-dark" id="settings-drawer-title">{text.settings}</h1>
            <p className="m-0 text-xs leading-[1.5] text-muted">{text.settingsText}</p>
          </div>
          <button ref={closeButtonRef} className="grid size-[42px] shrink-0 cursor-pointer place-items-center rounded-xl border border-line bg-soft-surface text-[25px] leading-none text-ink" type="button" onClick={onClose} aria-label={text.closeSettings}>×</button>
        </header>
        <div className="grid">
          <section className="grid justify-items-start gap-[11px] border-t border-line py-[17px]" aria-labelledby="settings-language-label">
            <div className="grid gap-[3px]"><strong className="text-sm text-ink" id="settings-language-label">{text.language}</strong><small className="text-[10px] leading-[1.4] text-muted">{text.languageSaved}</small></div>
            <LanguageSwitcher text={text} language={language} onChange={onLanguageChange} large />
          </section>
          <section className="grid justify-items-start gap-[11px] border-t border-line py-[17px]" aria-labelledby="settings-theme-label">
            <div className="grid gap-[3px]"><strong className="text-sm text-ink" id="settings-theme-label">{text.theme}</strong><small className="text-[10px] leading-[1.4] text-muted">{text.themeSaved}</small></div>
            <div className="inline-flex flex-wrap gap-[7px] max-compact:w-full" role="group" aria-label={text.theme}>
              <button type="button" className={`inline-flex min-h-[42px] cursor-pointer items-center gap-2 rounded-xl border px-[14px] py-2 text-xs font-[750] ${theme === 'light' ? 'border-green bg-soft-surface text-green-dark dark:border-[#83c49a] dark:bg-[#314438] dark:text-[#e4f2e7]' : 'border-line bg-card text-muted dark:text-green-dark'} max-compact:flex-1 max-compact:justify-center`} onClick={() => onThemeChange('light')} aria-pressed={theme === 'light'}>
                <span className="text-base" aria-hidden="true">☀</span>{text.lightTheme}
              </button>
              <button type="button" className={`inline-flex min-h-[42px] cursor-pointer items-center gap-2 rounded-xl border px-[14px] py-2 text-xs font-[750] ${theme === 'dark' ? 'border-green bg-soft-surface text-green-dark dark:border-[#83c49a] dark:bg-[#314438] dark:text-[#e4f2e7]' : 'border-line bg-card text-muted dark:text-green-dark'} max-compact:flex-1 max-compact:justify-center`} onClick={() => onThemeChange('dark')} aria-pressed={theme === 'dark'}>
                <span className="text-base" aria-hidden="true">☾</span>{text.darkTheme}
              </button>
            </div>
          </section>
        </div>
      </aside>
    </div>
  )
}

