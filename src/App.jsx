import { useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import PageFooter from './components/PageFooter.jsx'
import HomePage from './pages/HomePage.jsx'
import LibraryPage from './pages/LibraryPage.jsx'
import MyStoriesPage from './pages/MyStoriesPage.jsx'
import ProgressPage from './pages/ProgressPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import StoryDetailPage from './pages/StoryDetailPage.jsx'
import { messages } from './i18n.js'

function readSavedLanguage() {
  try {
    return window.localStorage.getItem('story-library-language') === 'my' ? 'my' : 'en'
  } catch {
    return 'en'
  }
}

export default function App() {
  const [language, setLanguage] = useState(readSavedLanguage)
  const [section, setSection] = useState('home')
  const [selectedStory, setSelectedStory] = useState(null)
  const text = messages[language]

  useEffect(() => {
    document.documentElement.lang = language === 'my' ? 'my' : 'en'
    try {
      window.localStorage.setItem('story-library-language', language)
    } catch {
      // Language switching still works for this session if storage is unavailable.
    }
  }, [language])

  const navigate = (nextSection) => {
    setSection(nextSection)
    setSelectedStory(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app-shell min-h-screen">
      <Header
        text={text}
        language={language}
        onLanguageChange={setLanguage}
        section={section}
        isStoryOpen={Boolean(selectedStory)}
        onNavigate={navigate}
      />

      <main className="page-shell mx-auto w-full">
        {selectedStory ? (
          <StoryDetailPage story={selectedStory} language={language} text={text} onBack={() => setSelectedStory(null)} />
        ) : section === 'home' ? (
          <HomePage text={text} language={language} onNavigate={navigate} onChooseStory={setSelectedStory} />
        ) : section === 'library' ? (
          <LibraryPage text={text} language={language} onChooseStory={setSelectedStory} />
        ) : section === 'myStories' ? (
          <MyStoriesPage text={text} />
        ) : section === 'progress' ? (
          <ProgressPage text={text} />
        ) : (
          <SettingsPage text={text} language={language} onLanguageChange={setLanguage} />
        )}

        <PageFooter text={text} />
      </main>
    </div>
  )
}

