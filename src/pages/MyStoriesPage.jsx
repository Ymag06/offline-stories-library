import { useEffect, useState } from 'react'
import AudioAvailabilityBadge from '../components/AudioAvailabilityBadge.jsx'
import { primaryButtonClasses, secondaryButtonClasses, textButtonClasses } from '../components/buttonClasses.js'
import { getStoryArtClass } from '../components/storyArtClasses.js'
import { categories } from '../data/stories.js'
import { getStoryDescription } from '../lib/storyContent.js'
import { getAllUserStories, removeUserStory, saveUserStory } from '../lib/userStories.js'

const storyParts = [
  { id: 'beginning', title: 'beginning', guide: 'beginningGuide', placeholder: 'beginningPlaceholder' },
  { id: 'middle', title: 'middle', guide: 'middleGuide', placeholder: 'middlePlaceholder' },
  { id: 'ending', title: 'ending', guide: 'endingGuide', placeholder: 'endingPlaceholder' },
]
const eyebrowClasses = 'inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#577065] dark:text-[#b7cbbd]'
const headingTitleClasses = 'mt-[6px] mb-1 font-story text-[clamp(26px,3vw,36px)] font-medium leading-[1.2] tracking-[-0.035em] text-green-dark max-compact:text-[28px]'
const storyIconButtonClasses = 'inline-flex min-h-[35px] cursor-pointer items-center rounded-[10px] border border-[rgba(28,48,43,0.12)] bg-transparent px-[9px] py-[6px] text-[11px] font-bold text-[#52695b] dark:border-line dark:text-[#d4e4d8]'
const storyDeleteButtonClasses = 'text-[#9b5748] dark:text-[#ffc5b5]'
const storyFieldClasses = 'grid content-start gap-[7px] text-xs font-[750] text-ink'
const storyFieldControlClasses = 'w-full min-h-[46px] rounded-xl border border-[rgba(28,48,43,0.16)] bg-white px-[13px] py-[10px] text-[12px] font-medium text-ink focus:border-[#6d9b78] focus:outline-[3px] focus:outline-[rgba(98,147,111,0.2)] dark:border-line dark:bg-[#18211c]'
const storyPartFieldClasses = 'grid grid-cols-[31px_minmax(0,1fr)] items-start gap-x-[11px] rounded-2xl border border-[rgba(28,48,43,0.09)] bg-[#fffefa] p-4 dark:border-line dark:bg-[#18211c] max-compact:grid-cols-[26px_minmax(0,1fr)] max-compact:gap-x-2 max-compact:p-3'
const storyTextareaClasses = 'col-start-2 min-h-[145px] w-full resize-y rounded-xl border border-[rgba(28,48,43,0.14)] bg-white p-[13px] text-sm leading-[1.8] text-[#293d32] placeholder:text-[#a1aaa3] focus:border-[#6d9b78] focus:outline-[3px] focus:outline-[rgba(98,147,111,0.2)] dark:border-line dark:bg-[#18211c] dark:text-ink dark:placeholder:text-[#95a59a] max-compact:min-h-32'
const storyErrorClasses = 'my-[13px] rounded-xl bg-[#f9e8e2] px-[14px] py-[11px] text-xs leading-[1.5] text-[#934b3d] dark:bg-[#4b2d27] dark:text-[#ffd9cc]'

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
    <section className="pt-2">
      <div className="mb-5 flex items-start justify-between gap-[18px] max-compact:flex-col">
        <div>
          <span className={eyebrowClasses}>{text.brand}</span>
          <h1 className={headingTitleClasses}>{text.myStoriesTitle}</h1>
          <p className="m-0 text-[13px] text-muted max-compact:text-xs">{text.myStoriesText}</p>
        </div>
        {!editorOpen && (
          <button className={`${primaryButtonClasses} mt-4 shrink-0 max-compact:mt-0`} type="button" onClick={startNewStory}>
            <span className="text-[17px] leading-none" aria-hidden="true">＋</span> {text.createStory}
          </button>
        )}
      </div>

      {message && <p className="my-[13px] rounded-xl bg-[#e9f2e7] px-[14px] py-[11px] text-xs leading-[1.5] text-[#456f51] dark:bg-[#284230] dark:text-[#d6ebd8]" role="status">{message}</p>}
      {error && <p className={storyErrorClasses} role="alert">{error}</p>}

      {editorOpen && (
        <form className="mt-6 mb-[30px] rounded-[23px] border border-[rgba(28,48,43,0.09)] bg-card p-[clamp(18px,3vw,30px)] shadow-[0_8px_24px_rgba(44,57,47,0.04)] dark:border-line max-compact:px-[14px] max-compact:py-[18px]" onSubmit={handleSave}>
          <div>
            <div>
              <span className={eyebrowClasses}>{text.writtenByYou}</span>
              <h2 className="mt-[5px] mb-[7px] font-story text-[25px] font-semibold text-green-dark">{editingId ? text.editStory : text.createStory}</h2>
              <p className="m-0 max-w-[690px] text-[13px] leading-[1.65] text-muted">{text.outlineHelp}</p>
            </div>
          </div>

          <div className="mt-6 mb-[29px] grid grid-cols-[1.4fr_0.8fr_1fr] gap-[15px] max-tablet:grid-cols-2 max-compact:gap-3 max-compact:grid-cols-1">
            <label className={`${storyFieldClasses} max-tablet:col-span-full max-compact:col-auto`}>
              <span>{text.storyTitle}</span>
              <input className={storyFieldControlClasses}
                autoFocus
                maxLength={90}
                aria-required="true"
                value={draft.title}
                onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
                placeholder={text.storyTitlePlaceholder}
              />
            </label>
            <label className={storyFieldClasses}>
              <span>{text.storyLanguage}</span>
              <select className={storyFieldControlClasses}
                value={draft.language}
                onChange={(event) => setDraft((current) => ({ ...current, language: event.target.value }))}
              >
                <option value="en">{text.english}</option>
                <option value="my">{text.burmese}</option>
              </select>
            </label>
            <label className={storyFieldClasses}>
              <span>{text.storyCategory}</span>
              <select className={storyFieldControlClasses}
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

          <div className="flex items-center justify-between gap-5 border-t border-ink/10 pt-5 pb-4 dark:border-line">
            <div><h3 className="mb-[5px] font-story text-[19px] text-green-dark">{text.outlineTitle}</h3><p className="m-0 max-w-[690px] text-[13px] leading-[1.65] text-muted">{text.outlineHelp}</p></div>
            <span className="text-[27px] text-[#d29a55]" aria-hidden="true">✦</span>
          </div>
          <div className="grid gap-[14px]">
            {storyParts.map((part, index) => (
              <label className={storyPartFieldClasses} key={part.id}>
                <span className="row-span-3 grid size-[29px] place-items-center rounded-[10px] bg-[#e8f0e2] text-xs font-extrabold text-[#426c50] dark:bg-[#304537] dark:text-[#d6ead9] max-compact:size-[25px]" aria-hidden="true">{index + 1}</span>
                <span className="mt-px mb-[3px] font-story text-base font-bold text-green-dark">{text[part.title]}</span>
                <span className="mb-[11px] text-xs leading-[1.5] text-[#718078] dark:text-[#b8c5bd]">{text[part.guide]}</span>
                <textarea
                  className={storyTextareaClasses}
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

          <p className="mt-[17px] mb-0 flex items-center gap-2 text-[11px] leading-[1.5] text-[#6d7d72]"><span className="text-[#659574]" aria-hidden="true">◉</span> {text.storyStoredLocally}</p>
          <div className="mt-[19px] flex justify-end gap-[10px] max-compact:justify-stretch">
            <button className={secondaryButtonClasses} type="button" onClick={cancelEditing} disabled={saving}>{text.cancel}</button>
            <button className={`${primaryButtonClasses} mt-0`} type="submit" disabled={saving}>
              {saving ? text.savingStory : text.saveStory}
            </button>
          </div>
        </form>
      )}

      {status === 'loading' ? (
        <p className="grid min-h-[350px] place-content-center text-center text-muted" role="status">{text.progressLoading}</p>
      ) : status === 'error' ? (
        <p className={storyErrorClasses} role="alert">{text.storyLoadError}</p>
      ) : stories.length === 0 && !editorOpen ? (
        <div className="mx-auto my-6 grid max-w-[560px] justify-items-center gap-[11px] rounded-[22px] border border-dashed border-ink/20 bg-[rgba(255,254,250,0.75)] px-6 py-[37px] text-center dark:border-line dark:bg-[rgba(32,43,37,0.85)]">
          <span className="grid size-[58px] place-items-center rounded-[18px] bg-[#e7efe1] text-[31px] text-[#557c60] dark:bg-[#304537] dark:text-[#c5e6cb]" aria-hidden="true">✎</span>
          <h2 className="mt-1 font-story text-[22px] text-green-dark">{text.emptyStoriesTitle}</h2>
          <p className="mb-[7px] max-w-[440px] text-[13px] leading-[1.7] text-muted">{text.emptyStoriesText}</p>
          <button className={secondaryButtonClasses} type="button" onClick={startNewStory}>{text.createFirstStory}</button>
        </div>
      ) : stories.length > 0 ? (
        <div className="mt-[21px] grid grid-cols-2 gap-4 max-tablet:grid-cols-1">
          {stories.map((story) => {
            const category = categories.find((item) => item.id === story.category)
            const partCount = story.pages.length
            return (
              <article className="min-w-0 overflow-hidden rounded-[19px] border border-[rgba(28,48,43,0.09)] bg-card shadow-[0_5px_18px_rgba(44,57,47,0.035)] dark:border-line" key={story.id}>
                <div className={`flex min-h-[105px] items-center justify-center gap-3 ${getStoryArtClass(story.art)}`} aria-hidden="true">
                  <span className="text-[37px]">{story.icon}</span><small className="text-[11px] font-extrabold text-[#54765b] dark:text-[#365743]">{text.writtenByYou}</small>
                </div>
                <div className="p-[15px_17px_16px] max-compact:p-[14px]">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#59806b] dark:text-[#a3d1ad]">{category?.label[language] || text.writtenByYou}</span>
                    <span className="text-[10px] font-bold text-[#849188] dark:text-[#b5c1b9]">{story.language === 'my' ? text.burmese : text.english}</span>
                  </div>
                  <div className="mt-[6px]"><AudioAvailabilityBadge story={story} language={story.language || language} text={text} /></div>
                  <h2 className="mt-2 mb-[5px] break-words font-story text-[19px] font-[650] leading-[1.35] text-green-dark">{story.title}</h2>
                  <p className="mb-2 min-h-[38px] break-words text-xs leading-[1.6] text-muted dark:text-[#b8c5bd]">{story.description}</p>
                  <small className="text-[10px] font-bold text-[#849188] dark:text-[#b5c1b9]">{partCount} {partCount === 1 ? text.storyPartOne : text.storyPartMany}</small>
                  <div className="mt-3 flex flex-wrap items-center gap-[11px] max-compact:gap-[7px]">
                    <button className={`${textButtonClasses} mr-auto max-compact:basis-full`} type="button" onClick={() => onChooseStory(story)}>{text.readYourStory} <span aria-hidden="true">→</span></button>
                    <button className={storyIconButtonClasses} type="button" onClick={() => startEditing(story)} aria-label={`${text.editStory}: ${story.title}`}>{text.editStory}</button>
                    <button className={`${storyIconButtonClasses} ${storyDeleteButtonClasses}`} type="button" onClick={() => { setDeleteId(story.id); setMessage('') }} aria-label={`${text.deleteStory}: ${story.title}`}>{text.deleteStory}</button>
                  </div>
                  {deleteId === story.id && (
                    <div className="mt-[13px] flex flex-wrap items-center gap-2 border-t border-[rgba(28,48,43,0.1)] pt-3 dark:border-line" role="group" aria-label={text.deleteStoryConfirm}>
                      <p className="mb-[3px] basis-full text-[11px] leading-[1.5] text-[#7b584e] dark:text-[#efd2c9]">{text.deleteStoryConfirm}</p>
                      <button className={`${storyIconButtonClasses} min-h-[34px] rounded-[9px] bg-white px-[9px] py-[6px] text-[10px] font-[750] dark:bg-[#18211c]`} type="button" onClick={() => handleDelete(story.id)}><span className={storyDeleteButtonClasses}>{text.confirmDeleteStory}</span></button>
                      <button className={`${storyIconButtonClasses} min-h-[34px] rounded-[9px] px-[9px] py-[6px] text-[10px] font-[750]`} type="button" onClick={() => setDeleteId(null)}>{text.keepStory}</button>
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
