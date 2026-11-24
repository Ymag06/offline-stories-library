# Project progress

Last updated: 2026-11-25

## Current status

The prototype includes a bilingual sample-story reader, a guided story-writing flow that saves stories on-device, and recommended category cards on Home. Vercel is selected for production hosting, but deployment is deferred until the agreed MVP features are complete. Offline behavior still needs browser verification.

## Decisions

- **Platforms:** build a browser-installable PWA prototype first; Android remains a target, with packaging/distribution to be decided later.
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
- Ran `npm.cmd run build` successfully during the push workflow. No type-check script is configured.
- Pushed commit `fe47bd0` (`Add bilingual reader and local progress`) to `origin/main`.
- Selected Vercel as the production host for the public PWA because Cloudflare requires a VPN for the user.

## Next steps

1. Add a recently opened built-in stories section to Home using saved reading progress.
2. Check the production PWA offline after install and refine behavior based on representative phone/tablet/desktop layouts.
3. Review the authoring flow and bilingual copy on phone, tablet, and desktop; Burmese placeholder copy still needs fluent review before distribution.
4. After the agreed MVP features are complete, connect the GitHub repository to Vercel and deploy the production PWA; after prototype feedback, decide Android packaging/distribution.

## Open decisions and manual follow-up

- Android packaging/distribution is intentionally undecided for the first working prototype.
- Once the MVP is complete, import `Ymag06/offline-stories-library` into Vercel, use `main` as the production branch, confirm the Vite build command is `npm run build` with output directory `dist`, and create the first deployment.
- Verify first-visit caching and offline relaunch in a browser after the site is live.
- When ready to publish, choose a hosting provider for the PWA and a distribution route for Android. Set required secrets through the provider or local secure storage; never place them in source control.
- Review fictional placeholders before publishing; any future curated stories need appropriate distribution rights. Burmese copy should receive a fluent-language review before release.
- Choose a Burmese-capable font strategy that works offline and confirm the font license before bundling a font file.

