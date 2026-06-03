# Task: Clean up current-state guidance after M17

## Goal

Make `docs-dev/planning/current_state.md` accurately reflect that the M17 board-game feel work has already been completed and that the next work is the Jones-style simplification/fun-factor pass.

## Scope

Update planning documentation only. Implement only the work described in this prompt. Do not implement adjacent systems or future prompts.

## Context

Read:
- `AGENTS.md`
- `docs-dev/agent/prompt_execution_guide.md`
- `docs-dev/planning/current_state.md`
- `docs-dev/reference/primary_authoritative/specification.md`

The current state document describes M17 as complete, but the recommended next prompt still refers to running M17 prompts. This can mislead future coding-agent sessions.

## Required changes

1. Update `docs-dev/planning/current_state.md` so the recommended next work no longer says to run already-completed M17 prompts.
2. Add a concise new section stating that the next planned work is a player-facing simplification and fun-factor pass inspired by *Jones in the Fast Lane*.
3. Summarise the intent of the pass:
   - simplify the default HUD;
   - make board actions more concrete;
   - make each turn's immediate objective clearer;
   - make rivals and diary recaps more prominent;
   - preserve the existing simulation systems underneath.
4. Do not change the binding specification unless you find a direct contradiction that must be resolved.
5. If you discover that this prompt has been renumbered when added to the repository, keep the scope unchanged and use the actual prompt filename for the commit message.

## Do not implement

Do not implement:
- gameplay changes;
- UI changes;
- new prompt files;
- speculative future roadmap items beyond the simplification/fun-factor pass.

## Acceptance criteria

The task is complete when:
- `current_state.md` no longer tells agents to run already-completed M17 prompts;
- the next recommended work clearly points to the simplification/fun-factor pass;
- the document remains concise and useful as a session-start orientation file;
- no application code has been changed.

## Checks

Run `npm run check`. Also manually review `current_state.md` for internal consistency.

## Commit and push

If and only if the scope was followed and checks pass, create one commit on `main` using this file's exact filename as the commit message, then push.

Do not create a branch. Do not open a pull request unless explicitly instructed.

Do not commit or push partially completed work unless explicitly instructed.

## Final report

End with the required final report specified in `AGENTS.md`.
