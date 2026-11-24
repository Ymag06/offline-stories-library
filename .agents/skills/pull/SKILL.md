---
name: pull
description: Safely fetch and integrate the configured GitHub branch to keep this project current for collaboration.
---

# Sync from GitHub

Read `AGENTS.md`, `progress.md`, and repository instructions, then inspect the current branch, upstream, remotes, and `git status`.

- If no GitHub remote or upstream is configured, ask for the repository and branch through `askmefirst`; do not invent a destination.
- Preserve uncommitted user changes. If local changes could be affected by the update, stop and ask how the user wants to handle them; never discard or reset them.
- Fetch from the configured remote and integrate the intended branch using a fast-forward-only update when possible. If histories have diverged or conflicts arise, inspect and explain the situation before choosing a merge/rebase strategy. Never force-push or rewrite shared history.
- After syncing, summarize the update and any conflicts, and update `progress.md` if shared decisions or project status changed.

