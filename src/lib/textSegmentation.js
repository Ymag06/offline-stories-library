export function getWordRanges(text, language) {
  if (!text) return []

  try {
    if (typeof Intl.Segmenter === 'function') {
      const locale = language === 'my' ? 'my-MM' : 'en-US'
      const ranges = [...new Intl.Segmenter(locale, { granularity: 'word' }).segment(text)]
        .filter((part) => part.isWordLike)
        .map((part) => ({ start: part.index, end: part.index + part.segment.length }))
      if (ranges.length > 0) return ranges
    }
  } catch {
    // Fall back to whitespace-separated words on browsers without Segmenter support.
  }

  return [...text.matchAll(/\S+/gu)].map((match) => ({ start: match.index, end: match.index + match[0].length }))
}

export function wordRangeAtCharacter(wordRanges, characterIndex) {
  if (!Number.isFinite(characterIndex) || wordRanges.length === 0) return null
  return wordRanges.find(({ start, end }) => characterIndex >= start && characterIndex < end)
    || wordRanges.find(({ start }) => start >= characterIndex)
    || null
}
