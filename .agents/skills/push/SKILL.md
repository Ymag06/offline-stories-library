---
name: push
description: Check build and type errors, fix relevant issues, then commit, push to GitHub, and deploy using configured project targets.
---

# Check, push, and deploy

Use this workflow when the user invokes `push` for this project. Read `AGENTS.md`, `progress.md`, repository instructions, and deployment documentation before acting.

1. Inspect `git status`, the current branch, remotes, package manager lockfiles, available build/type-check scripts, and the configured deployment workflow. Do not expose secret values.
2. Run the project's existing build and type-check commands when available. Fix failures that are in scope, then rerun the failed checks. Keep fixes targeted; do not hide errors or broaden the change into unrelated refactoring. Do not add or run tests unless the user asks for testing.
3. Review the diff and stage only changes for this task. Preserve unrelated user changes and never include credentials, signing keys, private content, or local environment files. Commit scoped changes with a clear message when there is something to commit.
4. Push to the configured GitHub upstream without force-pushing or rewriting history. Then deploy using the existing documented provider/workflow.
5. Update `progress.md` with the checks and publish outcome.

If the repository, upstream branch, or deployment target is missing or unclear, complete local checks and applicable fixes, then ask for the missing destination through `askmefirst`. Do not guess a remote, create billable infrastructure, or publish to an unconfigured destination. If checks remain failing or deployment cannot complete safely, stop and report the concrete blocker and changes made.

