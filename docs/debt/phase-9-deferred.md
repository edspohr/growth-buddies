# Phase 9 — Deferred Items

This file tracks work that surfaced during Phase 9 implementation but was deferred for safety, scope, or external dependency reasons. Edmundo decides when each item gets resolved.

## Commit message format anomaly — Task 1
- The first commit on this branch (`c925db5`) uses the legacy format `Phase 9.1: ...` instead of the new convention `refactor(phase-9): ...` introduced in the updated runbook.
- Decision: NOT amended (per repo policy of preferring new commits over amending). Functionally identical work.
- Recommended action: squash-merge the branch on PR; the squash message can use the canonical format.

## Pre-existing uncommitted modifications (NOT touched in Phase 9)
At the start of Phase 9 the working tree had three pre-existing modifications carried in from prior work:
- `.DS_Store`
- `functions/package.json` (firebase-functions bumped 6.0.0 → 7.2.5)
- `functions/package-lock.json`

These remain uncommitted on the branch and were excluded from every Phase 9 commit. Edmundo should resolve them out-of-band (commit on main, or stash) before merging Phase 9.

