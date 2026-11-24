import EmptyPage from '../components/EmptyPage.jsx'

export default function ProgressPage({ text }) {
  return (
    <EmptyPage
      icon="◷"
      brand={text.brand}
      title={text.progressTitle}
      body={text.progressText}
      note={text.startReading}
    />
  )
}

