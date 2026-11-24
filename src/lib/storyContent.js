import { storyPages } from '../data/storyPages.js'

export function getStoryTitle(story, language) {
  return typeof story.title === 'string' ? story.title : (story.title?.[language] || story.title?.en || '')
}

export function getStoryDescription(story, language) {
  return typeof story.description === 'string'
    ? story.description
    : (story.description?.[language] || story.description?.en || '')
}

export function getStoryPages(story, language) {
  if (Array.isArray(story.pages)) {
    return story.pages
      .map((page) => (typeof page === 'string' ? page : page?.text))
      .filter((page) => typeof page === 'string' && page.trim())
  }
  const pageSet = storyPages[story.id]
  return pageSet?.[language] || pageSet?.en || []
}
