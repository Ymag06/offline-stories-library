const DATABASE_NAME = 'offline-story-library'
const DATABASE_VERSION = 2

export const PROGRESS_STORE = 'reading-progress'
export const USER_STORIES_STORE = 'user-stories'

let databasePromise

export function openLocalDatabase() {
  if (!globalThis.indexedDB) {
    return Promise.reject(new Error('IndexedDB is not available in this browser.'))
  }

  if (!databasePromise) {
    databasePromise = new Promise((resolve, reject) => {
      const request = globalThis.indexedDB.open(DATABASE_NAME, DATABASE_VERSION)

      request.onupgradeneeded = () => {
        const database = request.result
        if (!database.objectStoreNames.contains(PROGRESS_STORE)) {
          database.createObjectStore(PROGRESS_STORE, { keyPath: 'storyId' })
        }
        if (!database.objectStoreNames.contains(USER_STORIES_STORE)) {
          database.createObjectStore(USER_STORIES_STORE, { keyPath: 'id' })
        }
      }

      request.onsuccess = () => {
        const database = request.result
        database.onversionchange = () => {
          database.close()
          databasePromise = undefined
        }
        resolve(database)
      }

      request.onerror = () => reject(request.error || new Error('Could not open local story storage.'))
      request.onblocked = () => reject(new Error('Close other open Story Library tabs to update local storage.'))
    }).catch((error) => {
      databasePromise = undefined
      throw error
    })
  }

  return databasePromise
}
