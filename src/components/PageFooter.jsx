export default function PageFooter({ text }) {
  return (
    <footer className="page-footer">
      <span className="footer-mark" aria-hidden="true">✦</span>
      <span>{text.placeholderNotice}</span>
    </footer>
  )
}

