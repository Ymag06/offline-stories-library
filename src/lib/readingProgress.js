import { openLocalDatabase, PROGRESS_STORE } from './localDatabase.js'

export async function getReadingProgress(storyId) {
  const database = await openLocalDatabase()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(PROGRESS_STORE, 'readonly')
    const request = transaction.objectStore(PROGRESS_STORE).get(storyId)
    request.onsuccess = () => resolve(request.result || null)
    request.onerror = () => reject(request.error || new Error('Could not read local progress.'))
    transaction.onabort = () => reject(transaction.error || new Error('Reading progress lookup was interrupted.'))
  })
}

export async function getAllReadingProgress() {
  const database = await openLocalDatabase()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(PROGRESS_STORE, 'readonly')
    const request = transaction.objectStore(PROGRESS_STORE).getAll()
    request.onsuccess = () => resolve(request.result || [])
    request.onerror = () => reject(request.error || new Error('Could not read local progress.'))
    transaction.onabort = () => reject(transaction.error || new Error('Reading progress lookup was interrupted.'))
  })
}

export async function saveReadingProgress(progress) {
  const database = await openLocalDatabase()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(PROGRESS_STORE, 'readwrite')
    transaction.objectStore(PROGRESS_STORE).put(progress)
    transaction.oncomplete = () => resolve(progress)
    transaction.onerror = () => reject(transaction.error || new Error('Could not save local progress.'))
    transaction.onabort = () => reject(transaction.error || new Error('Saving reading progress was interrupted.'))
  })
}

