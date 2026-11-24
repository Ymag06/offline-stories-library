---
name: askmefirst
description: Resolve material project ambiguities with the user before implementing work that depends on their answer.
---

# Ask before implementing

Use this skill when the user asks to clarify first or when an unresolved choice materially affects architecture, privacy, data safety, content rights, target platforms, or publishing.

- Read `AGENTS.md`, `spec.md`, `progress.md`, and inspect the relevant code so questions use known project context.
- Ask only decision-making questions that cannot be answered from the project files or prior conversation. Prefer a small set of concise questions with clear options and sensible defaults.
- Use `functions.request_user_input_async` for user-input modals when available. If the user says the modal is not visible, or the tool is unavailable, ask the same questions directly in chat.
- Wait for answers before implementing work that depends on them. Do independent, non-dependent work where useful.
- Record new decisions in `progress.md`, then continue the requested work if the user asked for implementation.

