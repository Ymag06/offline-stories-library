# Project progress

Last updated: 2026-11-24

## Current status

The prototype now includes a bilingual sample-story reader with local reading-position persistence. Its production build succeeds. GitHub `origin` is configured and local `main` tracks `origin/main`; deployment hosting is still undecided.

## Decisions

- **Platforms:** build a browser-installable PWA prototype first; Android remains a target, with packaging/distribution to be decided later.
- **Languages:** English and Burmese UI; default to English with an instant switch. Save the selected language on this device.
- **Sample reader content:** bilingual placeholder pages follow the selected app language.
- **Layout:** responsive across phone, tablet, and desktop.
- **Initial content:** fictional placeholder stories for development, with English and Burmese sample titles/descriptions. Burmese copy is provisional and needs fluent review; replace placeholders with reviewed, appropriately licensed content before real-world distribution.
- **Skills:** keep the four project skills in `.agents/skills/`.
- **GitHub:** `origin` points to `https://github.com/Ymag06/offline-stories-library.git`; local `main` tracks `origin/main`.
- **Deployment:** provider is still undecided.
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
- Ran `npm run build` successfully.

## Next steps

1. Implement PDF validation/import, store imported PDFs in IndexedDB, and let users manage imported stories.
2. Extend reading progress to imported PDFs and preserve it safely when stories are removed.
3. Check the production PWA offline after install and refine behavior based on representative phone/tablet/desktop layouts.
4. After prototype feedback, decide Android packaging/distribution and choose a deployment provider before publishing.

## Open decisions and manual follow-up

- Android packaging/distribution is intentionally undecided for the first working prototype.
- When ready to publish, choose a hosting provider for the PWA and a distribution route for Android. Set required secrets through the provider or local secure storage; never place them in source control.
- Provide story files and confirm their distribution rights before replacing fictional placeholders. Burmese copy should receive a fluent-language review before release.
- Choose a Burmese-capable font strategy that works offline and confirm the font license before bundling a font file.

