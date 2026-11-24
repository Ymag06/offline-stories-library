# Project progress

Last updated: 2026-11-25

## Current status

The prototype includes a bilingual sample-story reader, guided on-device story writing, recommended categories, recently opened stories, local text-to-speech, responsive reader controls, connected scroll/page layouts, audio-availability states, and saved light/dark themes in a settings drawer. The production build passes; visual and device voice behavior still need manual verification. Vercel is selected for production hosting, but deployment is deferred until the agreed MVP features are complete.

## Decisions

- **Mobile version:** use the responsive, installable PWA at the same website URL on phones; no Play Store release is planned. A separate Android package remains optional and undecided.
- **Languages:** English and Burmese UI; default to English with an instant switch. Save the selected language on this device.
- **Sample reader content:** bilingual placeholder pages follow the selected app language.
- **Layout:** responsive across phone, tablet, and desktop.
- **Initial content:** fictional placeholder stories for development, with English and Burmese sample titles/descriptions. Burmese copy is provisional and needs fluent review; replace placeholders with reviewed, appropriately licensed content before real-world distribution.
- **Skills:** keep the four project skills in `.agents/skills/`.
- **GitHub:** `origin` points to `https://github.com/Ymag06/offline-stories-library.git`; local `main` tracks `origin/main`.
- **Deployment:** Vercel for the static PWA; no backend is planned for the core product.
- **Offline first visit:** a device needs an online visit to download and cache the app; after the service worker finishes installing, it should reopen the last cached version offline. User-written stories and progress remain local to that device.
- **User-written stories:** story writing replaces arbitrary PDF imports in v1. Stories are saved locally and include guided beginning, middle, and ending sections. PDF layout choices and the 25 MB file limit are no longer applicable.
- **User story placement:** user-written stories appear only in My Stories; they are not included in the built-in Library.
- **Home recents:** show only unfinished built-in stories in the recently opened section.
- **Story audio:** opening a story offers Read or Listen, with Read recommended. Listen uses only an installed local voice matching the story language; if unavailable, explain and offer Read instead. Page-level progress is saved so listening resumes at the saved page.
- **Audio controls:** support pause/resume, a seek bar, and approximately five-second skip buttons. Show approximate time because speech synthesis does not expose a consistent seekable audio timeline.
- **User-story voice:** use the language selected for the story, independent of the current interface language.
- **Audio availability labels:** story cards indicate whether the device has a matching locally installed offline TTS voice, not whether there is a pre-recorded audio file.
- **Audio fallback:** disable Listen when audio is unavailable; keep Read available. One sample is intentionally unavailable to exercise this state on every device.
- **Reader controls:** place text sizing, page navigation, and page/scroll layout selection in a collapsible reader sidebar on wide screens; adapt the toolbar above the reading area on small screens. Continuous-scroll mode uses one connected reading surface with internal page landmarks and saves the visible page.
- **Display preferences:** keep language selection in Settings only. Provide light and dark themes, default to light, and save both preferences on this device.
- **Settings presentation:** show language and theme preferences in a compact side drawer rather than a full-page settings screen.
- **Settings audio behavior:** pause any active narration while the settings drawer is open; the reader remains in place behind it.
- **Product constraints:** offline-first core use, no account, ads, or tracking; local story and progress storage, following `spec.md`.

## Completed

- Reviewed `spec.md` and clarified the target platforms, languages, responsive layout, content approach, skill location, and deployment deferral.
- Added `AGENTS.md` with project decisions and implementation constraints.
- Added the `continue`, `askmefirst`, `push`, and `pull` project skills.
- Scaffolded a React + JavaScript + Vite + Tailwind app with a responsive home/library shell, sample stories, instant English/Burmese switching, category filtering, and search.
- Added a PWA manifest and build-generated service worker that precaches the production app shell and same-origin assets.
- Organized the UI into reusable components under `src/components/` and screen-level pages under `src/pages/`.
- Connected the local `main` branch to the GitHub repository and confirmed it is synchronized.
- Added a bilingual reader for the bundled sample stories with page navigation, text-size controls, completion state, and saved reading position.
- Added IndexedDB reading-progress records and a Progress page with last-opened details and a continue-reading action.
- Added a bilingual guided story editor with beginning, middle, and ending prompts; stories can be saved, edited, read, and removed locally.
- Added an IndexedDB user-stories store while preserving existing reading progress through a database version upgrade.
- Added bilingual recommended-category cards on Home that open the built-in Library with the chosen category selected.
- Added a Home section for up to three recently opened, unfinished built-in stories with saved progress and a continue-reading action.
- Ran `npm.cmd run build` successfully after the recent-stories update; no type-check script is configured.
- Ran `npm.cmd run build` successfully during the push workflow. No type-check script is configured.
- Pushed commit `fe47bd0` (`Add bilingual reader and local progress`) to `origin/main`.
- Ran `npm.cmd run build` successfully for the guided story-writing and home-category update; no type-check script is configured.
- Pushed commit `3fedcf6` (`Add guided story writing and home recommendations`) to `origin/main`.
- Deferred Vercel production deployment as requested until the agreed MVP features are complete.
- Selected Vercel as the production host for the public PWA because Cloudflare requires a VPN for the user.
- Added a story mode choice with Read recommended and Listen as an option across Home, Library, My Stories, and saved progress.
- Added local-only speech synthesis controls with voice availability fallback, pause/resume, approximate seek slider, and five-second skip buttons. Listening advances page by page and uses the story's language for user-authored content.
- Updated `spec.md` and `AGENTS.md` with the local voice, fallback, approximate seeking, and saved-page requirements.
- `npm.cmd run build` passed after the listening feature was added. Device-specific speech voice behavior still needs verification.
- Added a voice-availability badge to sample, user-written, and saved-progress story cards; it reflects a matching offline device voice for the story's language.
- Moved the language switcher out of the header and added a locally persisted light/dark theme choice in Settings.
- Enlarged the reader back button and moved text size, page navigation, and page/scroll layout selection into a collapsible responsive toolbar beside the story on wide screens.
- Added continuous-scroll reading with visible-page progress tracking and dark-theme text/surface contrast overrides.
- `npm.cmd run build` passed after these card, reader, and theme updates; visual and device-specific behavior still need manual verification.
- Simplified audio labels and disabled Listen when a matching audio path is unavailable; the Paper Boat sample is the intentional unavailable-audio example and uses a red status treatment.
- Merged continuous-scroll pages into one connected story surface while retaining internal page landmarks for saved reading progress.
- Lengthened all four bilingual placeholder stories to exercise continuous scrolling.
- Changed Settings into a compact slide-in side drawer and updated selected-state colors for layout/category controls.
- Simplified visible audio messages to plain language and pause narration while the Settings drawer is open.
- Increased selected-state contrast in dark mode for the reader layout buttons and category chips using white text on dark green.
- `npm.cmd run build` passed after the latest audio, content, reader-scroll, and Settings drawer updates.

## Next steps

1. Manually verify light/dark contrast and responsive reader layouts, including Settings drawer fit, sidebar collapse, disabled Listen states, and scroll-page progress.
2. Try local English and Burmese voices on representative devices; confirm the card availability indicator, missing-voice fallback, pause/resume, approximate seeking, page advance, and saved-page resume.
3. Check the production PWA offline after install and review the writing flow across phone/tablet/desktop layouts.
4. Review bilingual copy and get Burmese placeholder copy checked by a fluent reader before distribution.
5. After the agreed MVP features are complete, connect the GitHub repository to Vercel and deploy the production PWA; after prototype feedback, decide Android packaging/distribution.

## Open decisions and manual follow-up

- A separate Android package is optional and undecided; Play Store distribution is not planned.
- Once the MVP is complete, import `Ymag06/offline-stories-library` into Vercel, use `main` as the production branch, confirm the Vite build command is `npm run build` with output directory `dist`, and create the first deployment.
- Verify first-visit caching and offline relaunch in a browser after the site is live.
- If a separate Android package is pursued later, choose a direct distribution route outside the Play Store. Set any required secrets through the provider or local secure storage; never place them in source control.
- Review fictional placeholders before publishing; any future curated stories need appropriate distribution rights. Burmese copy should receive a fluent-language review before release.
- Choose a Burmese-capable font strategy that works offline and confirm the font license before bundling a font file.

