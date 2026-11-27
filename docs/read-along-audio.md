# Adding prerecorded Read Along content

Story text stays in `src/data/storyPages.js` and the story source files it imports. Each story's `audioFiles` and `timingFiles` maps use the same language keys (`en` and `my`). The reader uses the selected app language for the text, recording, and timings.

Hare and Tortoise has prerecorded English and Burmese audio. Its English recording now has a word-level timing file aligned to all 169 words in the displayed story. Read Along highlights the spoken word and the next two timed words in a moving window, with a short color transition as the window advances. The first-pass times were aligned locally from that recording; listen through and correct any timing or recognition errors in `public/stories/hare-and-tortoise/timing-en.json` before treating them as fully reviewed. Burmese Read Along remains unavailable until Burmese-specific phrase timings are prepared.

## Add a language recording and timing file

1. Put the licensed, offline-ready recording under `public/stories/<story-id>/`, for example `audio-en.mp3` and `audio-my.mp3`.
2. Listen to each recording and note the start and end time for every word or phrase. A local alignment tool can create a first pass from the actual recording, but review its text and times against the audio. Prepare a separate JSON file for each language, such as `timing-en.json` and `timing-my.json`.
3. In `src/data/stories.js`, add both paths under the matching language keys:

   ```js
   audioFiles: {
     en: '/stories/example-story/audio-en.mp3',
     my: '/stories/example-story/audio-my.mp3',
   },
   timingFiles: {
     en: '/stories/example-story/timing-en.json',
     my: '/stories/example-story/timing-my.json',
   },
   ```

4. Keep each language's timing file aligned to that language's own recording and displayed story text. Never reuse English timings for Burmese.

## Timing JSON format

The following is a format-only example. These sample times do not correspond to any bundled story or recording:

```json
[
  { "text": "Once upon a time,", "start": 0, "end": 1.5 },
  { "text": "there was a little rabbit.", "start": 1.5, "end": 3.8 }
]
```

Each `text` value must appear exactly, in order, in the displayed story text. The reader joins page text with two newline characters when matching segments. Include punctuation in the segment text where it belongs. English can use one word or a phrase per entry. Burmese entries should be manually written phrases; the app does not split Burmese text on spaces or run automatic word alignment.

Times are seconds from the beginning of the matching recording. Keep entries ordered by start time, with no overlapping audio intervals. In a gap, the last segment stays highlighted until the next timed segment begins so the highlight window does not disappear between words. Before the first segment, no text is highlighted. A segment can be clicked or focused and activated with Enter/Space to seek to its start and play.

The reader checks the data shape, time ordering, and exact text matches. If a timing file is missing or invalid, recorded playback stays available and the reader shows a clear message without guessing a highlight.

## Offline behavior

The Vite build adds local cover images, page art, recordings, and any non-empty `timingFiles` paths from `src/data/stories.js` to the service worker's install precache. The first install/update needs a connection to download those assets; after the service worker has installed successfully, the recordings and timing files are served from the local cache offline. Add the audio and timing files before building and installing the updated PWA.
