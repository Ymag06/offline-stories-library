import { useEffect, useState } from 'react'
import { categories } from '../data/stories.js'
import { getStoryDescription } from '../lib/storyContent.js'
import { getAllUserStories, removeUserStory, saveUserStory } from '../lib/userStories.js'

const storyParts = [
  { id: 'beginning', title: 'beginning', guide: 'beginningGuide', placeholder: 'beginningPlaceholder' },
  { id: 'middle', title: 'middle', guide: 'middleGuide', placeholder: 'middlePlaceholder' },
  { id: 'ending', title: 'ending', guide: 'endingGuide', placeholder: 'endingPlaceholder' },
]

function createDraft(language) {
  return { title: '', category: '', language, sections: { beginning: '', middle: '', ending: '' } }
}

function draftFromStory(story) {
  const sections = { beginning: '', middle: '', ending: '' }
  story.pages.forEach((page, index) => {
    const section = typeof page === 'string' ? storyParts[index]?.id : page.section
    if (section && sections[section] !== undefined) sections[section] = typeof page === 'string' ? page : page.text
  })

  return {
    title: story.title,
    category: story.category || '',
    language: story.language || 'en',
    sections,
  }
}

function newStoryId() {
  const randomId = globalThis.crypto?.randomUUID?.()
  return `written-${randomId || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`}`
}

export default function MyStoriesPage({ text, language, onChooseStory }) {
  const [stories, setStories] = useState([])
  const [status, setStatus] = useState('loading')
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState(() => createDraft(language))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [deleteId, setDeleteId] = useState(null)

  useEffect(() => {
    let active = true
    getAllUserStories()
      .then((items) => {
        if (!active) return
        setStories(items)
        setStatus('ready')
      })
      .catch(() => { if (active) setStatus('error') })
    return () => { active = false }
  }, [])

  const startNewStory = () => {
    setDraft(createDraft(language))
    setEditingId(null)
    setEditorOpen(true)
    setError('')
    setMessage('')
  }

  const startEditing = (story) => {
    setDraft(draftFromStory(story))
    setEditingId(story.id)
    setEditorOpen(true)
    setError('')
    setMessage('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancelEditing = () => {
    setEditorOpen(false)
    setEditingId(null)
    setError('')
  }

  const updateSection = (section, value) => {
    setDraft((current) => ({ ...current, sections: { ...current.sections, [section]: value } }))
  }

  const handleSave = async (event) => {
    event.preventDefault()
    setError('')

    const title = draft.title.trim()
    if (!title) {
      setError(text.storyTitleRequired)
      return
    }

    const pages = storyParts
      .map((part) => ({ section: part.id, text: draft.sections[part.id].trim() }))
      .filter((part) => part.text)

    if (pages.length === 0) {
      setError(text.storyTextRequired)
      return
    }

    const existingStory = stories.find((story) => story.id === editingId)
    const now = new Date().toISOString()
    const story = {
      id: editingId || newStoryId(),
      title,
      description: getStoryDescription({ description: pages[0].text }, draft.language).slice(0, 180),
      category: draft.category,
      language: draft.language,
      pages,
      userCreated: true,
      icon: '✍️',
      art: 'written',
      createdAt: existingStory?.createdAt || now,
      updatedAt: now,
    }

    setSaving(true)
    try {
      await saveUserStory(story)
      setStories((current) => [story, ...current.filter((item) => item.id !== story.id)])
      setEditorOpen(false)
      setEditingId(null)
      setMessage(text.storySaved)
    } catch {
      setError(text.storySaveError)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (storyId) => {
    setError('')
    try {
      await removeUserStory(storyId)
      setStories((current) => current.filter((story) => story.id !== storyId))
      setDeleteId(null)
    } catch {
      setError(text.storyDeleteError)
    }
  }

  return (
    <section className="my-stories-page">
      <div className="section-heading my-stories-heading">
        <div>
          <span className="eyebrow">{text.brand}</span>
          <h1>{text.myStoriesTitle}</h1>
          <p>{text.myStoriesText}</p>
        </div>
        {!editorOpen && (
          <button className="primary-button" type="button" onClick={startNewStory}>
            <span aria-hidden="true">＋</span> {text.createStory}
          </button>
        )}
      </div>

      {message && <p className="story-notice" role="status">{message}</p>}
      {error && <p className="story-error" role="alert">{error}</p>}

      {editorOpen && (
        <form className="story-editor" onSubmit={handleSave}>
          <div className="story-editor-heading">
            <div>
              <span className="eyebrow">{text.writtenByYou}</span>
              <h2>{editingId ? text.editStory : text.createStory}</h2>
              <p>{text.outlineHelp}</p>
            </div>
          </div>

          <div className="story-editor-meta">
            <label className="story-field">
              <span>{text.storyTitle}</span>
              <input
                autoFocus
                maxLength={90}
                aria-required="true"
                value={draft.title}
                onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
                placeholder={text.storyTitlePlaceholder}
              />
            </label>
            <label className="story-field">
              <span>{text.storyLanguage}</span>
              <select
                value={draft.language}
                onChange={(event) => setDraft((current) => ({ ...current, language: event.target.value }))}
              >
                <option value="en">{text.english}</option>
                <option value="my">{text.burmese}</option>
              </select>
            </label>
            <label className="story-field">
              <span>{text.storyCategory}</span>
              <select
                value={draft.category}
                onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))}
              >
                <option value="">{text.chooseCategory}</option>
                {categories.filter((category) => category.id !== 'all').map((category) => (
                  <option key={category.id} value={category.id}>{category.label[language]}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="story-outline-heading">
            <div><h3>{text.outlineTitle}</h3><p>{text.outlineHelp}</p></div>
            <span aria-hidden="true">✦</span>
          </div>
          <div className="story-outline-fields">
            {storyParts.map((part, index) => (
              <label className="story-part-field" key={part.id}>
                <span className="story-part-number" aria-hidden="true">{index + 1}</span>
                <span className="story-part-label">{text[part.title]}</span>
                <span className="story-part-guide">{text[part.guide]}</span>
                <textarea
                  lang={draft.language === 'my' ? 'my' : 'en'}
                  dir="auto"
                  rows={6}
                  value={draft.sections[part.id]}
                  onChange={(event) => updateSection(part.id, event.target.value)}
                  placeholder={text[part.placeholder]}
                />
              </label>
            ))}
          </div>

          <p className="story-storage-note"><span aria-hidden="true">◉</span> {text.storyStoredLocally}</p>
          <div className="story-editor-actions">
            <button className="secondary-button" type="button" onClick={cancelEditing} disabled={saving}>{text.cancel}</button>
            <button className="primary-button" type="submit" disabled={saving}>
              {saving ? text.savingStory : text.saveStory}
            </button>
          </div>
        </form>
      )}

      {status === 'loading' ? (
        <p className="progress-loading" role="status">{text.progressLoading}</p>
      ) : status === 'error' ? (
        <p className="story-error" role="alert">{text.storyLoadError}</p>
      ) : stories.length === 0 && !editorOpen ? (
        <div className="story-empty-state">
          <span className="story-empty-icon" aria-hidden="true">✎</span>
          <h2>{text.emptyStoriesTitle}</h2>
          <p>{text.emptyStoriesText}</p>
          <button className="secondary-button" type="button" onClick={startNewStory}>{text.createFirstStory}</button>
        </div>
      ) : stories.length > 0 ? (
        <div className="written-story-grid">
          {stories.map((story) => {
            const category = categories.find((item) => item.id === story.category)
            const partCount = story.pages.length
            return (
              <article className="written-story-card" key={story.id}>
                <div className="written-story-cover art-written" aria-hidden="true">
                  <span>{story.icon}</span><small>{text.writtenByYou}</small>
                </div>
                <div className="written-story-copy">
                  <div className="written-story-meta">
                    <span className="category-label">{category?.label[language] || text.writtenByYou}</span>
                    <span className="written-story-language">{story.language === 'my' ? text.burmese : text.english}</span>
                  </div>
                  <h2>{story.title}</h2>
                  <p>{story.description}</p>
                  <small className="written-story-parts">{partCount} {partCount === 1 ? text.storyPartOne : text.storyPartMany}</small>
                  <div className="written-story-actions">
                    <button className="text-button" type="button" onClick={() => onChooseStory(story)}>{text.readYourStory} <span aria-hidden="true">→</span></button>
                    <button className="story-icon-button" type="button" onClick={() => startEditing(story)} aria-label={`${text.editStory}: ${story.title}`}>{text.editStory}</button>
                    <button className="story-icon-button story-delete-button" type="button" onClick={() => { setDeleteId(story.id); setMessage('') }} aria-label={`${text.deleteStory}: ${story.title}`}>{text.deleteStory}</button>
                  </div>
                  {deleteId === story.id && (
                    <div className="story-delete-confirm" role="group" aria-label={text.deleteStoryConfirm}>
                      <p>{text.deleteStoryConfirm}</p>
                      <button className="story-delete-button" type="button" onClick={() => handleDelete(story.id)}>{text.confirmDeleteStory}</button>
                      <button className="story-icon-button" type="button" onClick={() => setDeleteId(null)}>{text.keepStory}</button>
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      ) : null}
    </section>
  )
}
