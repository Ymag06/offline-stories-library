export default function StoryDetailPage({ story, language, text, onBack }) {
  return (
    <section className="detail-panel" aria-labelledby="detail-title">
      <button className="back-button" type="button" onClick={onBack}>← {text.library}</button>
      <div className={`detail-art art-${story.art}`} aria-hidden="true"><span>{story.icon}</span></div>
      <div className="detail-copy">
        <span className="eyebrow">{text.sample}</span>
        <h1 id="detail-title">{story.title[language]}</h1>
        <p>{story.description[language]}</p>
        <div className="reader-next-note"><span aria-hidden="true">✦</span><span>{text.readerSoon}</span></div>
      </div>
    </section>
  )
}

