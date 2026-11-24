import EmptyPage from '../components/EmptyPage.jsx'

export default function MyStoriesPage({ text }) {
  return (
    <EmptyPage
      icon="▧"
      brand={text.brand}
      title={text.myStoriesTitle}
      body={text.myStoriesText}
      note={text.importSoon}
    />
  )
}

