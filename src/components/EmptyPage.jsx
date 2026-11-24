export default function EmptyPage({ icon, brand, title, body, note }) {
  return (
    <section className="empty-page">
      <div className="empty-icon" aria-hidden="true">{icon}</div>
      <span className="eyebrow">{brand}</span>
      <h1>{title}</h1>
      <p>{body}</p>
      <div className="reader-next-note"><span aria-hidden="true">✦</span><span>{note}</span></div>
    </section>
  )
}

