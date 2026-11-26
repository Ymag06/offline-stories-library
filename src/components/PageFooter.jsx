export default function PageFooter({ text }) {
  return (
    <footer className="flex items-center justify-center gap-2 pt-[34px] pb-[5px] text-center text-[10px] text-[#89968d] max-compact:pt-[25px] max-compact:text-[9px]">
      <span className="text-[#d49551]" aria-hidden="true">✦</span>
      <span>{text.placeholderNotice}</span>
    </footer>
  )
}

