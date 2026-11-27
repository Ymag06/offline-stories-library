export default function PageFooter({ text, onBlue = false }) {
  return (
    <footer className={`flex items-center justify-center gap-2 pt-[34px] pb-[5px] text-center text-[11px] max-compact:pt-[25px] max-compact:text-[10px] ${onBlue ? 'text-white/90' : 'text-muted'}`}>
      <span className={onBlue ? 'text-[#ffdc62]' : 'text-coral'} aria-hidden="true">✦</span>
      <span>{text.placeholderNotice}</span>
    </footer>
  )
}

