import { openLocalDatabase, PROGRESS_STORE, USER_STORIES_STORE } from './localDatabase.js'

export async function getAllUserStories() {
  const database = await openLocalDatabase()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(USER_STORIES_STORE, 'readonly')
    const request = transaction.objectStore(USER_STORIES_STORE).getAll()
    request.onsuccess = () => {
      const stories = request.result || []
      stories.sort((first, second) => new Date(second.updatedAt) - new Date(first.updatedAt))
      resolve(stories)
    }
    request.onerror = () => reject(request.error || new Error('Could not load your stories.'))
    transaction.onabort = () => reject(transaction.error || new Error('Loading your stories was interrupted.'))
  })
}

export async function saveUserStory(story) {
  const database = await openLocalDatabase()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(USER_STORIES_STORE, 'readwrite')
    transaction.objectStore(USER_STORIES_STORE).put(story)
    transaction.oncomplete = () => resolve(story)
    transaction.onerror = () => reject(transaction.error || new Error('Could not save your story.'))
    transaction.onabort = () => reject(transaction.error || new Error('Saving your story was interrupted.'))
  })
}

export async function removeUserStory(storyId) {
  const database = await openLocalDatabase()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([USER_STORIES_STORE, PROGRESS_STORE], 'readwrite')
    transaction.objectStore(USER_STORIES_STORE).delete(storyId)
    transaction.objectStore(PROGRESS_STORE).delete(storyId)
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error || new Error('Could not remove your story.'))
    transaction.onabort = () => reject(transaction.error || new Error('Removing your story was interrupted.'))
  })
}
