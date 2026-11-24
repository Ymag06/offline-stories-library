const DATABASE_NAME = 'offline-story-library'
const DATABASE_VERSION = 1
const PROGRESS_STORE = 'reading-progress'

let databasePromise

function openDatabase() {
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
      }

      request.onsuccess = () => {
        const database = request.result
        database.onversionchange = () => database.close()
        resolve(database)
      }

      request.onerror = () => reject(request.error || new Error('Could not open local reading storage.'))
    }).catch((error) => {
      databasePromise = undefined
      throw error
    })
  }

  return databasePromise
}

export async function getReadingProgress(storyId) {
  const database = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(PROGRESS_STORE, 'readonly')
    const request = transaction.objectStore(PROGRESS_STORE).get(storyId)
    request.onsuccess = () => resolve(request.result || null)
    request.onerror = () => reject(request.error || new Error('Could not read local progress.'))
    transaction.onabort = () => reject(transaction.error || new Error('Reading progress lookup was interrupted.'))
  })
}

export async function getAllReadingProgress() {
  const database = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(PROGRESS_STORE, 'readonly')
    const request = transaction.objectStore(PROGRESS_STORE).getAll()
    request.onsuccess = () => resolve(request.result || [])
    request.onerror = () => reject(request.error || new Error('Could not read local progress.'))
    transaction.onabort = () => reject(transaction.error || new Error('Reading progress lookup was interrupted.'))
  })
}

export async function saveReadingProgress(progress) {
  const database = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(PROGRESS_STORE, 'readwrite')
    transaction.objectStore(PROGRESS_STORE).put(progress)
    transaction.oncomplete = () => resolve(progress)
    transaction.onerror = () => reject(transaction.error || new Error('Could not save local progress.'))
    transaction.onabort = () => reject(transaction.error || new Error('Saving reading progress was interrupted.'))
  })
}

