# Project progress

Last updated: 2026-11-24

## Current status

The first responsive app prototype is scaffolded. Its production build succeeds. The workspace is not yet a Git repository.

## Decisions

- **Platforms:** build a browser-installable PWA prototype first; Android remains a target, with packaging/distribution to be decided later.
- **Languages:** English and Burmese UI; default to English with an instant switch. Save the selected language on this device.
- **Layout:** responsive across phone, tablet, and desktop.
- **Initial content:** fictional placeholder stories for development, with English and Burmese sample titles/descriptions. Burmese copy is provisional and needs fluent review; replace placeholders with reviewed, appropriately licensed content before real-world distribution.
- **Skills:** keep the four project skills in `.agents/skills/`.
- **GitHub and deployment:** decide later; no remote or hosting provider is configured.
- **Product constraints:** offline-first core use, no account, ads, or tracking; local story and progress storage, following `spec.md`.

## Completed

- Reviewed `spec.md` and clarified the target platforms, languages, responsive layout, content approach, skill location, and deployment deferral.
- Added `AGENTS.md` with project decisions and implementation constraints.
- Added the `continue`, `askmefirst`, `push`, and `pull` project skills.
- Scaffolded a React + JavaScript + Vite + Tailwind app with a responsive home/library shell, sample stories, instant English/Burmese switching, category filtering, and search.
- Added a PWA manifest and build-generated service worker that precaches the production app shell and same-origin assets.
- Organized the UI into reusable components under `src/components/` and screen-level pages under `src/pages/`.
- Ran `npm run build` successfully.

## Next steps

1. Build the story reader and page controls for bundled sample stories; save and resume local reading position.
2. Implement PDF validation/import, IndexedDB persistence, imported-story management, and reading progress.
3. Check the production PWA offline after install and refine behavior based on representative phone/tablet/desktop layouts.
4. After prototype feedback, decide Android packaging/distribution, then choose a GitHub repository/default branch and deployment provider before publishing.

## Open decisions and manual follow-up

- Android packaging/distribution is intentionally undecided for the first working prototype.
- When ready to collaborate, initialize Git, create or select the GitHub repository, then provide its URL and default branch so the remote can be configured.
- When ready to publish, choose a hosting provider for the PWA and a distribution route for Android. Set required secrets through the provider or local secure storage; never place them in source control.
- Provide story files and confirm their distribution rights before replacing fictional placeholders. Burmese copy should receive a fluent-language review before release.
- Choose a Burmese-capable font strategy that works offline and confirm the font license before bundling a font file.

