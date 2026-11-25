# Project guidance

## Project

Build the Offline Digital Story Library described in [spec.md](spec.md). It is an offline-first library for children to browse and read stories, write their own stories, and resume reading without accounts or network access.

The initial app shell is scaffolded and implementation is proceeding in small steps. Treat `spec.md` as the product requirements and `progress.md` as the record of agreed decisions and work completed. Update `progress.md` when a decision changes or an implementation milestone is completed.

## Confirmed decisions

- The responsive, installable PWA at the same website URL is the mobile version. Play Store distribution is not planned; a separate Android package is optional and undecided.
- Support English and Burmese, with layouts responsive across phone, tablet, and desktop screen sizes. Default to English and provide an immediate language switch; keep the choice in small local settings.
- Use clearly identified fictional placeholder stories for the initial implementation. The prototype may include Burmese placeholder copy, but it needs fluent review before distribution. Do not imply that placeholder stories are published or licensed reading material.
- Sample reader pages should be bilingual and follow the selected app language.
- Keep project skills in `.agents/skills/` so they can be shared with collaborators.
- GitHub origin is `https://github.com/Ymag06/offline-stories-library.git`, with `main` as the collaboration branch. Vercel is the selected production host for the static PWA, but deployment is deferred until the agreed MVP features are complete. Do not change the remote or deployment provider without the user's direction.

## Product and technical constraints

- Follow the specified React, JavaScript, Vite, and Tailwind stack unless a concrete implementation constraint requires revisiting it.
- Core reading, library browsing, user-written content, and progress must work offline. Do not make core functionality depend on a backend, external API, CDN, remotely hosted font, script, or image.
- Keep user-written stories and durable reading data local in IndexedDB. Use local storage only for small settings.
- Preserve the no-account, no-advertising, no-tracking privacy model. Render user-authored stories as plain text and avoid exposing children to unguarded external destinations.
- In v1, provide guided story writing instead of arbitrary file imports, with beginning, middle, and ending prompts in English and Burmese.
- Keep user-written stories in My Stories; do not add them to the main Library unless the user changes this decision.
- Use bundled/local assets and readable, child-friendly layouts. Keep English and Burmese text support in mind in components and typography; do not rely on an internet font service.
- Removing one user-written story may remove its own progress, but must not delete unrelated stories or reading progress.
- When a story opens, offer Read or Listen and recommend Read. Listening must use a locally installed browser speech voice matching the story language; never send story text to a remote TTS service.
- During Listen, highlight the currently spoken word using browser word-boundary events. Support English and Burmese segmentation, and do not show a misleading approximate word highlight when the browser provides no word boundaries.
- Show simple Audio available/unavailable status on story cards based on device text-to-speech support for the story language; do not expose technical voice details to readers.
- When audio is unavailable, disable Listen in the story choice and keep Read available. If speech fails after it starts, offer a direct switch to reading.
- Keep one fictional sample story intentionally unavailable for audio as a prototype state, even when the device supports narration.
- Include pause/resume, about-five-second skip controls, and a seek bar for speech. Label playback time and seeking as approximate; browser speech synthesis does not expose a reliable, seekable audio timeline.
- Save page-level reading progress and resume at the saved page. For user-written stories, choose the voice using the story's language rather than the interface language.
- Keep the language switch in Settings only. Provide light and dark themes there, save the preference locally, and keep foreground/background text readable in both themes.
- Reader controls should sit beside the story in a collapsible toolbar and include text sizing, page/scroll layout selection, and page navigation. Continuous-scroll mode should display one connected reading surface while tracking internal page landmarks.
- Settings should open as a compact side drawer with language and theme choices rather than a full-page settings layout.
- A separate Android package may be reconsidered later, but it is outside the current MVP. Record options and tradeoffs in `progress.md` before making a project-wide commitment.

## Working approach

- Before implementing, read `spec.md`, `progress.md`, and the relevant existing code. Follow the next agreed step in `progress.md`.
- If an unresolved choice materially affects architecture, data safety, child privacy, licensing, or publishing, use the `askmefirst` skill and wait for the answer before dependent work. Make routine reversible implementation choices without interrupting the user.
- Keep changes scoped to the current step. Do not add real story content, third-party services, or unrequested product features.
- Use existing project scripts and conventions once the app scaffold exists. Never commit credentials, signing keys, or private story files.

