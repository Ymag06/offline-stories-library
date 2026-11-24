export default function LanguageSwitcher({ text, language, onChange, large = false }) {
  return (
    <div
      className={`language-control${large ? ' language-control-large' : ''}`}
      role="group"
      aria-label={text.selectLanguage}
    >
      <button type="button" onClick={() => onChange('en')} aria-pressed={language === 'en'}>
        {large ? text.english : 'EN'}
      </button>
      <span aria-hidden="true" />
      <button type="button" onClick={() => onChange('my')} aria-pressed={language === 'my'}>
        {large ? text.burmese : 'မြန်မာ'}
      </button>
    </div>
  )
}

