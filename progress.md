# Project progress

Last updated: 2026-11-27

## Current status

The prototype includes a bilingual sample-story reader presented as a responsive 3D open book, guided on-device story writing, recommended categories, recently opened stories, local text-to-speech with current-word highlighting, responsive reader controls, connected scroll/page layouts, audio-availability states, and saved light/dark themes in a settings drawer. The Home screen now uses a blue-sky scrapbook structure with a hand-cut yellow title banner, direct Read/Create actions, paper-like category tabs, and an overlapping book-cover shelf. Primary navigation is Read, Create, and My reading, with Home on the brand mark and Settings separate. Responsive behavior and device voice behavior still need manual verification. Vercel is selected for production hosting, but deployment is deferred until the agreed MVP features are complete.

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
- **Story audio:** opening a story offers Read, Read and listen along, or Listen, with Read recommended. Read and listen along uses the matching installed local voice; Listen uses bundled local narration when present or a matching installed local voice otherwise. Save page and recording progress.
- **Spoken-word highlight:** Read and listen along highlights words from browser speech boundary events. Do not estimate word timing for bundled recordings; their Listen mode does not show word highlighting.
- **Audio controls:** support pause/resume, a seek bar, and approximately five-second skip buttons. Show approximate time because speech synthesis does not expose a consistent seekable audio timeline.
- **User-story voice:** use the language selected for the story, independent of the current interface language.
- **Audio availability labels:** story cards indicate whether the device has a matching locally installed offline TTS voice, not whether there is a pre-recorded audio file.
- **Audio fallback:** disable Listen when audio is unavailable; keep Read available. One sample is intentionally unavailable to exercise this state on every device.
- **Bundled narration:** when a built-in story includes local narration for its language, play that track instead of device text-to-speech. Keep both tracks and seekable timeline local/offline; save playback position with reading progress. Use local device text-to-speech for stories without a bundled track.
- **Reader controls:** place text sizing, page navigation, and page/scroll layout selection in a collapsible reader sidebar on wide screens; adapt the toolbar above the reading area on small screens. Continuous-scroll mode uses one connected reading surface with internal page landmarks and saves the visible page.
- **Reader presentation:** use a CSS 3D open-book spread containing story text only. Page mode shows two consecutive story pages and its arrows advance by one spread; continuous-scroll mode uses one connected surface across the spread. On wide screens, controls float at the right and expand to the right without reserving book width; on small screens, keep them above the book.
- **Styling ownership:** migrate visual rules into Tailwind utilities in the owning page/component. Keep the global stylesheet for the Tailwind entry, reset, and shared theme tokens; remove old selectors incrementally after each migration step.
- **UI direction:** keep screens calm and uncluttered, use clear child-friendly labels and generous touch targets, and reserve playful color/illustration for story artwork and key calls to action.
- **Visual reference:** use StoryWeaver's clear reading/creating pathways, illustrated banners, and book-cover discovery as inspiration while keeping this product's own layout, offline behavior, and content.
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
- Redesigned the reader as a responsive 3D open book with story content on both pages, spread navigation, a connected scroll surface, and a right-side floating control panel that does not resize the book; preserved narration and saved progress.
- `npm.cmd run build` passed after the story-only spread and right-opening floating controls update.
- Added Tailwind v4 theme mappings for shared colors, fonts, responsive breakpoints, and the `data-theme="dark"` variant; existing component styles remain in place for incremental migration. `npm.cmd run build` passed.
- Moved app-shell, header/navigation, and footer styling into their owning JSX files with Tailwind utilities; removed their legacy selectors and responsive/dark overrides. `npm.cmd run build` passed.
- Moved EmptyPage, LanguageSwitcher, and AudioAvailabilityBadge styling into their owning JSX files and removed their legacy selectors, including dark-theme and responsive overrides. `npm.cmd run build` and `git diff --check` passed.
- Migrated ReaderPage's book spread, right-floating controls, responsive layout, progress states, and dark-theme treatment to Tailwind utilities in `ReaderPage.jsx`; removed its page-specific selectors from `styles.css`. `npm.cmd run build` and `git diff --check` passed.
- Migrated the narration controls and Read/Listen dialog, including their responsive, dark-theme, and voice-unavailable states, to Tailwind utilities in their components; removed their legacy selectors. `npm.cmd run build` and `git diff --check` passed.
- Migrated Home, Library, Progress, My Stories, Settings, and the reusable story/progress/recommendation cards to component-owned Tailwind utilities. The shared stylesheet now holds only the Tailwind entry, shared tokens, base reset, reduced-motion rule, and light/dark theme variables. `npm.cmd run build` and `git diff --check` passed.
- `npm.cmd run build` passed after the latest audio, content, reader-scroll, and Settings drawer updates.
- Added the user-supplied bilingual Hare and Tortoise story, its cover and five page illustrations, and English/Burmese MP3 narrations. Story cards and the story choice now recognize bundled tracks, the reader displays the page art and uses a real seekable audio timeline, and audio position is saved with reading progress. The service worker precaches the story assets and supports byte-range audio requests for offline playback and seeking. Build and offline playback still need verification.
- Stabilized and enlarged the page-turn book so page text and illustrations do not resize the spread. The reader keeps the same larger book frame while pages turn, with the leaves stacked vertically on narrow screens and no inner page scrolling. `npm.cmd run build` passed.
- Moved page-layout previous/next buttons onto the left and right edges of the book, centered vertically on desktop and aligned with each stacked page on narrow screens. The page count remains centered below the book; scroll-layout navigation remains below its reading surface. Updated the spec and project guidance. Build still needs to be run for this adjustment.
- Recorded narration plays inside the reader. To avoid IDM treating the MP3 as a direct media download, the app now fetches it in the background and plays it through a temporary in-memory object URL; the production service worker still pre-caches the MP3 for offline playback. No user-initiated file download is part of the app flow.
- Added Read, Read and listen along, and Listen choices. Read and listen along uses local browser speech with word-boundary highlighting; Listen retains bundled narration. The first recording-based highlight was approximate and did not track backward seeking reliably, so it was removed in favor of true speech word boundaries. Updated the bilingual choice labels and product guidance. `npm.cmd run build` passed.
- Pushed commit `004d9be` (`Add local story audio and reader controls`) to `origin/main`; the production build passed and no type-check script is configured. Vercel deployment remains deferred pending MVP manual review.
- Added current-word highlighting during local narration, with English/Burmese word segmentation and a theme-aware marker. Browsers without word-boundary events leave the story text unmarked.
- `npm.cmd run build` passed after the current-word highlighting update; manual voice-boundary behavior still needs device verification.
- Pushed commit `89f9dcf` (`Highlight spoken words during story audio`) to `origin/main`. No type-check script is configured; Vercel deployment remains deferred until MVP review.
- Refined the shared UI with larger touch targets and type, clearer active navigation, more readable story cards and category choices, and a simpler home overview. This is a visual polish milestone; responsive and dark-theme behavior still needs manual review.
- Reworked the Home hero with a locally rendered storybook landscape illustration and clear Explore/Write actions, removed the redundant stat strip, and restyled built-in story cards with stronger cover art and full-width Read actions. `npm.cmd run build` passed; responsive and dark-theme visuals remain for manual review.
- Redesigned the visual language toward a bright blue, yellow, and coral picture-book library: updated light/dark tokens, header surfaces, book-cover art palettes, category tiles, hero, and section labels. Inspired by StoryWeaver's read/create pathways and illustrated story discovery without copying its assets. `npm.cmd run build` passed; responsive and dark-theme visuals remain for manual review.
- Simplified primary navigation to Read, Create, and My reading, with Home on the brand mark and Settings as a separate accessible button. On narrow screens, primary choices become three equal-width, full-height touch targets; the hero actions expand to full width. `npm.cmd run build` passed.
- Replaced the split illustrated Home banner and multi-panel landing layout with a discovery page structured around a prominent search entry, featured book grid, optional resume list, and compact category links. On mobile, the create and search actions use full-width touch targets. `npm.cmd run build` passed.
- Reworked Home again to follow the provided StoryWeaver screenshot's scrapbook composition: blue sky scene, a paper-cut yellow headline ribbon, direct Read/Create buttons, a warm paper panel, category tabs, and slightly layered story-cover cards. Expanded the Home canvas full-width and preserved responsive layouts. `npm.cmd run build` passed.
- Added a continuously left-moving featured story shelf on Home, with pause/play control, pause-on-hover/focus, hidden inert duplicate cards for seamless looping, and reduced-motion support. `npm.cmd run build` passed.
- Improved button press, hover, and focus feedback; changed the small-screen primary navigation to stacked icon/label touch targets and shortened its Burmese reading label. Added consistent global press feedback for custom buttons. `npm.cmd run build` passed; physical device layout review remains.
- Added a 3D page-turn animation to page/spread navigation and narration page advances, with a vertical responsive book stack on small screens preserved; scroll mode remains smooth scrolling. Increased reading-control labels, button size, and focus feedback for easier use. `npm.cmd run build` passed.
- Fixed completed-story page counts: completed cards now display the final page as the saved count, and completed reader records persist the final page index even when the last two-page spread opened from its first page. `npm.cmd run build` passed.
- Corrected premature completion: entering the final two-page spread no longer marks a story finished. In page mode, the reader now offers an explicit finish action on the final spread; legacy records flagged complete before reaching the final page are shown as in progress and are corrected when reopened. `npm.cmd run build` passed.
- Explicitly cancel browser speech synthesis when navigating from the reader to another section or returning to stories, in addition to the reader component's cleanup. Opening Settings still pauses narration. `npm.cmd run build` passed.
- Added lightweight, one-time fade-and-rise scroll reveals to Home sections and Library/Progress cards, with short staggered timing, IntersectionObserver cleanup, and reduced-motion handling. `npm.cmd run build` passed.
- Tuned scroll reveals to pop into place with a gentle scale-up and spring-like easing, while retaining reduced-motion behavior. `npm.cmd run build` passed.
- Applied the scroll pop specifically to each reading-progress card, with a small tilt/wobble and stagger when cards enter view; the Progress page uses the same card treatment. `npm.cmd run build` passed.
- Updated the Home sky for dark mode: deep navy sky and wave colors, a crescent moon replacing the sun, and a 700 ms color/opacity transition across the sky and header. `npm.cmd run build` passed.
- Shifted the moon left on the dark-mode sky with a smooth transform transition; the light-mode sun remains in its original position. `npm.cmd run build` passed.
- Refined the sun-to-moon transition to glide farther from the edge with a slight rotation and a one-second crescent reveal. `npm.cmd run build` passed.
- Moved the dark-mode moon back toward the center and lengthened the glide/fade to 1.5 seconds with a gentle easing curve. `npm.cmd run build` passed.
- Made the sun-to-moon change more visible with a 2.2-second glide, a full gentle crescent rotation, and a soft glow that fades in; final placement mirrors the inset sun position. `npm.cmd run build` passed.
- Fixed the Tailwind base-layer button reset so component text color/font utilities are no longer overridden by global button defaults; strengthened Home category labels to dark navy in both themes. `npm.cmd run build` passed.

## Next steps

1. Manually verify light/dark contrast and responsive reader layouts, including Settings drawer fit, sidebar collapse, disabled Listen states, and scroll-page progress.
2. Listen to both bundled Hare and Tortoise MP3s and verify their text/language match; check play/pause, precise seeking, completion, and saved-audio resume. Try local English and Burmese voices for other stories on representative devices.
3. Check the production PWA offline after install and review the writing flow across phone/tablet/desktop layouts.
4. Review bilingual copy and get Burmese placeholder copy checked by a fluent reader before distribution.
5. After the agreed MVP features are complete, connect the GitHub repository to Vercel and deploy the production PWA; after prototype feedback, decide Android packaging/distribution.

## Open decisions and manual follow-up

- Manual UI review remains pending: the local preview started at `127.0.0.1:5174` because port 5173 was occupied, but the browser access host is unavailable and native Chrome control timed out. Resume the reader, theme, responsive layout, Settings drawer, disabled Listen, and scroll-progress checks when preview control is available.
- A separate Android package is optional and undecided; Play Store distribution is not planned.
- Once the MVP is complete, import `Ymag06/offline-stories-library` into Vercel, use `main` as the production branch, confirm the Vite build command is `npm run build` with output directory `dist`, and create the first deployment.
- Verify first-visit caching and offline relaunch in a browser after the site is live.
- If a separate Android package is pursued later, choose a direct distribution route outside the Play Store. Set any required secrets through the provider or local secure storage; never place them in source control.
- Review fictional placeholders before publishing; any future curated stories need appropriate distribution rights. Burmese copy should receive a fluent-language review before release.
- Choose a Burmese-capable font strategy that works offline and confirm the font license before bundling a font file.

