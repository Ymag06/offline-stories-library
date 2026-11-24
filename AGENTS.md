# Project guidance

## Project

Build the Offline Digital Story Library described in [spec.md](spec.md). It is an offline-first library for children to browse and read stories, import PDFs, and resume reading without accounts or network access.

The initial app shell is scaffolded and implementation is proceeding in small steps. Treat `spec.md` as the product requirements and `progress.md` as the record of agreed decisions and work completed. Update `progress.md` when a decision changes or an implementation milestone is completed.

## Confirmed decisions

- Target both an installable browser PWA and an Android release.
- Support English and Burmese, with layouts responsive across phone, tablet, and desktop screen sizes. Default to English and provide an immediate language switch; keep the choice in small local settings.
- Use clearly identified fictional placeholder stories for the initial implementation. The prototype may include Burmese placeholder copy, but it needs fluent review before distribution. Do not imply that placeholder stories are published or licensed reading material.
- Sample reader pages should be bilingual and follow the selected app language.
- Keep project skills in `.agents/skills/` so they can be shared with collaborators.
- GitHub origin is `https://github.com/Ymag06/offline-stories-library.git`, with `main` as the collaboration branch. The deployment provider remains undecided. Do not change the remote or configure a deployment target without the user's direction.

## Product and technical constraints

- Follow the specified React, JavaScript, Vite, and Tailwind stack unless a concrete implementation constraint requires revisiting it.
- Core reading, library browsing, imported content, and progress must work offline. Do not make core functionality depend on a backend, external API, CDN, remotely hosted font, script, or image.
- Keep imported stories and durable reading data local, using IndexedDB as specified. Use local storage only for small settings.
- Preserve the no-account, no-advertising, no-tracking privacy model. Validate imported PDFs and avoid exposing children to unguarded external destinations.
- Use bundled/local assets and readable, child-friendly layouts. Keep English and Burmese text support in mind in components and typography; do not rely on an internet font service.
- Removing one imported story must not delete unrelated stories or reading progress.
- Android remains a longer-term target, but packaging and distribution are deferred while the first working web prototype is built. Record options and tradeoffs in `progress.md` before making a project-wide commitment.

## Working approach

- Before implementing, read `spec.md`, `progress.md`, and the relevant existing code. Follow the next agreed step in `progress.md`.
- If an unresolved choice materially affects architecture, data safety, child privacy, licensing, or publishing, use the `askmefirst` skill and wait for the answer before dependent work. Make routine reversible implementation choices without interrupting the user.
- Keep changes scoped to the current step. Do not add real story content, third-party services, or unrequested product features.
- Use existing project scripts and conventions once the app scaffold exists. Never commit credentials, signing keys, or private story files.

