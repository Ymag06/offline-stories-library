import { useCallback, useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import PageFooter from './components/PageFooter.jsx'
import HomePage from './pages/HomePage.jsx'
import LibraryPage from './pages/LibraryPage.jsx'
import MyStoriesPage from './pages/MyStoriesPage.jsx'
import ProgressPage from './pages/ProgressPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import ReaderPage from './pages/ReaderPage.jsx'
import StoryModeDialog from './components/StoryModeDialog.jsx'
import { messages } from './i18n.js'

function readSavedLanguage() {
  try {
    return window.localStorage.getItem('story-library-language') === 'my' ? 'my' : 'en'
  } catch {
    return 'en'
  }
}

function readSavedTheme() {
  try {
    return window.localStorage.getItem('story-library-theme') === 'dark' ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

export default function App() {
  const [language, setLanguage] = useState(readSavedLanguage)
  const [theme, setTheme] = useState(readSavedTheme)
  const [section, setSection] = useState('home')
  const [settingsReturnSection, setSettingsReturnSection] = useState('home')
  const [libraryCategory, setLibraryCategory] = useState('all')
  const [selectedStory, setSelectedStory] = useState(null)
  const [pendingStory, setPendingStory] = useState(null)
  const [readerMode, setReaderMode] = useState('read')
  const text = messages[language]

  useEffect(() => {
    document.documentElement.lang = language === 'my' ? 'my' : 'en'
    try {
      window.localStorage.setItem('story-library-language', language)
    } catch {
      // Language switching still works for this session if storage is unavailable.
    }
  }, [language])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    try {
      window.localStorage.setItem('story-library-theme', theme)
    } catch {
      // The selected theme still applies for the current session if storage is unavailable.
    }
  }, [theme])

  const navigate = (nextSection) => {
    if (nextSection === 'settings') {
      if (section !== 'settings') setSettingsReturnSection(section)
      setSection('settings')
      setPendingStory(null)
      return
    }
    setSection(nextSection)
    setSelectedStory(null)
    setPendingStory(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openStoryChoice = (story) => {
    setPendingStory(story)
  }

  const chooseStoryMode = (mode) => {
    setReaderMode(mode)
    setSelectedStory(pendingStory)
    setPendingStory(null)
  }

  const chooseCategory = (categoryId) => {
    setLibraryCategory(categoryId)
    navigate('library')
  }

  const closeSettings = useCallback(() => setSection(settingsReturnSection), [settingsReturnSection])
  const contentSection = section === 'settings' ? settingsReturnSection : section

  return (
    <>
      <div className="app-shell min-h-screen">
        <Header
          text={text}
          section={section}
          isStoryOpen={section === 'settings' ? false : Boolean(selectedStory || pendingStory)}
          onNavigate={navigate}
        />

        <main className="page-shell mx-auto w-full">
          {selectedStory ? (
            <ReaderPage key={selectedStory.id} story={selectedStory} mode={readerMode} language={language} text={text} suspendAudio={section === 'settings'} onBack={() => setSelectedStory(null)} />
          ) : contentSection === 'home' ? (
            <HomePage text={text} language={language} onNavigate={navigate} onChooseStory={openStoryChoice} onChooseCategory={chooseCategory} />
          ) : contentSection === 'library' ? (
            <LibraryPage text={text} language={language} initialCategory={libraryCategory} onChooseStory={openStoryChoice} />
          ) : contentSection === 'myStories' ? (
            <MyStoriesPage text={text} language={language} onChooseStory={openStoryChoice} />
          ) : contentSection === 'progress' ? (
            <ProgressPage text={text} language={language} onContinueStory={openStoryChoice} />
          ) : null}

          <PageFooter text={text} />
        </main>
        {pendingStory && (
          <StoryModeDialog
            story={pendingStory}
            language={language}
            text={text}
            onChoose={chooseStoryMode}
            onCancel={() => setPendingStory(null)}
          />
        )}
      </div>
      {section === 'settings' && (
        <SettingsPage
          text={text}
          language={language}
          onLanguageChange={setLanguage}
          theme={theme}
          onThemeChange={setTheme}
          onClose={closeSettings}
        />
      )}
    </>
  )
}

