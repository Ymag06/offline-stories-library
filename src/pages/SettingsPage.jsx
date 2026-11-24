import LanguageSwitcher from '../components/LanguageSwitcher.jsx'

export default function SettingsPage({ text, language, onLanguageChange }) {
  return (
    <section className="settings-page">
      <div className="settings-card">
        <span className="eyebrow">{text.settings}</span>
        <h1>{text.settingsTitle}</h1>
        <p>{text.settingsText}</p>
        <div className="setting-row">
          <div><strong>{text.language}</strong><small>{text.languageSaved}</small></div>
          <LanguageSwitcher text={text} language={language} onChange={onLanguageChange} large />
        </div>
      </div>
    </section>
  )
}

