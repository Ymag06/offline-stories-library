/**
 * Maps manually timed segments to exact substrings in the displayed story text.
 * Segment text is matched literally, in order, so Burmese does not depend on
 * whitespace or browser word segmentation.
 */
export function mapTimingSegmentsToText(storyText, timingData) {
  if (!Array.isArray(timingData)) {
    throw new Error('Timing data must be an array of text/start/end segments.')
  }

  let textCursor = 0
  let previousStart = -1
  let previousEnd = 0

  return timingData.map((segment, index) => {
    const start = segment?.start
    const end = segment?.end
    const text = segment?.text

    if (typeof text !== 'string' || !text.length || typeof start !== 'number' || typeof end !== 'number' || !Number.isFinite(start) || !Number.isFinite(end) || start < 0 || end <= start) {
      throw new Error(`Timing segment ${index + 1} has invalid text or times.`)
    }
    if (start < previousStart || start < previousEnd) {
      throw new Error(`Timing segment ${index + 1} overlaps or is out of order.`)
    }

    const textStart = storyText.indexOf(text, textCursor)
    if (textStart < 0) {
      throw new Error(`Timing segment ${index + 1} does not match the displayed story text exactly.`)
    }

    const textEnd = textStart + text.length
    textCursor = textEnd
    previousStart = start
    previousEnd = end
    return { text, start, end, textStart, textEnd }
  })
}

export function findTimingSegmentAtTime(segments, seconds) {
  if (!segments.length || !Number.isFinite(seconds) || seconds < segments[0].start) return -1

  let low = 0
  let high = segments.length - 1

  while (low <= high) {
    const middle = Math.floor((low + high) / 2)
    const segment = segments[middle]
    if (seconds < segment.start) high = middle - 1
    else if (seconds >= segment.end) low = middle + 1
    else return middle
  }

  // Keep the most recent segment active through timing gaps so the visible
  // highlight window does not blink off between consecutive spoken words.
  return Math.max(0, high)
}
