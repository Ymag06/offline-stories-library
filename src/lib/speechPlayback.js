export function matchingVoice(voices, language) {
  const languageCode = language === 'my' ? 'my' : 'en'
  return voices
    .filter((voice) => voice.localService === true && voice.lang?.toLowerCase().split('-')[0] === languageCode)
    .sort((first, second) => Number(second.default) - Number(first.default))[0] || null
}

export function waitForLocalVoice(synthesis, language, timeoutMs = 1400) {
  return new Promise((resolve) => {
    let finished = false
    let timeoutId

    const finish = () => {
      if (finished) return
      const voice = matchingVoice(synthesis.getVoices(), language)
      if (!voice && Date.now() < expiresAt) return
      finished = true
      synthesis.removeEventListener?.('voiceschanged', checkVoices)
      window.clearTimeout(timeoutId)
      resolve(voice)
    }

    const expiresAt = Date.now() + timeoutMs
    const checkVoices = () => finish()
    synthesis.addEventListener?.('voiceschanged', checkVoices)
    timeoutId = window.setTimeout(finish, timeoutMs)
    finish()
  })
}

export function createSpeechTiming(text, language) {
  let wordStarts = []

  try {
    if (Intl.Segmenter) {
      const locale = language === 'my' ? 'my-MM' : 'en-US'
      wordStarts = [...new Intl.Segmenter(locale, { granularity: 'word' }).segment(text)]
        .filter((part) => part.isWordLike)
        .map((part) => part.index)
    }
  } catch {
    wordStarts = []
  }

  if (wordStarts.length === 0) {
    wordStarts = [...text.matchAll(/\S+/gu)].map((match) => match.index)
  }

  const duration = Math.max(1, Math.ceil(wordStarts.length / 2.6))
  return { duration, wordStarts }
}

export function characterAtApproximateTime(seconds, timing) {
  if (timing.wordStarts.length === 0) return 0
  const fraction = Math.max(0, Math.min(1, seconds / timing.duration))
  const wordIndex = Math.min(timing.wordStarts.length - 1, Math.floor(fraction * timing.wordStarts.length))
  return timing.wordStarts[wordIndex]
}

export function approximateTimeAtCharacter(characterIndex, text, timing) {
  if (timing.wordStarts.length === 0 || text.length === 0) return 0
  const wordIndex = timing.wordStarts.findIndex((start) => start >= characterIndex)
  const boundedIndex = wordIndex === -1 ? timing.wordStarts.length : wordIndex
  return Math.round((boundedIndex / timing.wordStarts.length) * timing.duration)
}
