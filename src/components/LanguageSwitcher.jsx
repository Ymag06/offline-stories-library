export default function LanguageSwitcher({ text, language, onChange, large = false }) {
  const buttonSize = large
    ? 'min-h-[40px] px-[14px] py-[7px] text-xs max-compact:px-[13px]'
    : 'min-h-8 px-[10px] py-[5px] text-xs max-compact:min-h-[30px] max-compact:px-2 max-compact:py-1 max-compact:text-[10px]'

  return (
    <div
      className="inline-flex shrink-0 items-center gap-[3px] rounded-full border border-[rgba(28,48,43,0.12)] bg-[rgba(255,254,249,0.75)] p-1 dark:border-line dark:bg-[#26332c] max-compact:gap-px max-compact:p-[3px]"
      role="group"
      aria-label={text.selectLanguage}
    >
      <button className={`cursor-pointer rounded-full border-0 font-bold transition-colors duration-[180ms] ${buttonSize} ${language === 'en' ? 'bg-green text-white dark:text-[#10251a]' : 'bg-transparent text-muted'}`} type="button" onClick={() => onChange('en')} aria-pressed={language === 'en'}>
        {large ? text.english : 'EN'}
      </button>
      <span className="h-4 w-px bg-[rgba(28,48,43,0.13)] dark:bg-line" aria-hidden="true" />
      <button className={`cursor-pointer rounded-full border-0 font-bold transition-colors duration-[180ms] ${buttonSize} ${language === 'my' ? 'bg-green text-white dark:text-[#10251a]' : 'bg-transparent text-muted'}`} type="button" onClick={() => onChange('my')} aria-pressed={language === 'my'}>
        {large ? text.burmese : 'မြန်မာ'}
      </button>
    </div>
  )
}

