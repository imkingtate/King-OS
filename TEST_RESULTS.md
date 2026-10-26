# SOVEREIGN V2 verification — 2026-10-26

Validation uses this development environment and isolated synthetic browser profiles. It does not access or modify the user's browser data.

| Check | Result |
| --- | --- |
| `node --test tests/*.test.cjs` | 31 passed, 0 failed, 0 skipped |
| `node tests/legacy-seed.cjs` | 136 original historical fields preserved through migration/full-state roundtrip; migration idempotent |
| `python build.py` | Nine explicit static assets built |
| `tests/browser.cjs` | Startup, whole-state import/export, corrupt recovery, quota errors, IndexedDB recovery and tab conflicts passed at 390/1440px |
| `tests/workflows.cjs` | Command, closeout, creator isolation, offers/content/activity/payments, scope separation, finances, meals/family/practice and nutrition persistence passed at 390/1440px |
| `tests/overhaul.cjs` | Action edit/archive, linked routines, physical records, journal/skills, Apple import, Chime CSV, revision browsing and admin safety passed at 390/1440px |
| `tests/vault.cjs` | Atomic mirror/journal transaction, full recovery archive, idempotent journal restoration, version-1→2 IndexedDB upgrade and module recovery passed |
| `tests/design.cjs` | Five operational workspaces and eight retained modules passed bounds/error checks at 390/768/1440px |
| `tests/accessibility.cjs` | axe-core 4.14.0: zero detected WCAG 2 A/AA and 2.1 AA violations across 13 tested screens at 390/1440px; keyboard search passed |
| `git diff --check` | Passed |

New pure tests cover canonical routine identity and linked actions, lifecycle history and deferred wake-up, CSV quoting/signs/deduplication, repeated legitimate statement rows, account-scope isolation, refund bounds/net customer classification, annual leap dates, biweekly recurrence, calendar replacement/cancellation and unsupported-series rejection, source-linked acquisition/follow-ups, invalid financial data, and nested unsafe-key rejection. Imported transactions cannot establish an opening bank balance.

Google endpoint tests use **synthetic** credentials and simulated provider responses. They verify encrypted token tamper rejection, fail-closed missing configuration, OAuth state checks, PKCE, read-only scope, encrypted HttpOnly/Secure/SameSite cookies, sanitized event responses and disconnect CSRF rejection. Actual Google authorization, token refresh against a live account, Apple CalDAV and Chime provider authentication have not run. See INTEGRATIONS.md for the precise external setup requirements.

Recovery checkpoints are minute-scale plus explicit/restore checkpoints, not every keystroke. Every normal save updates the current mirror transactionally. No automatic historical pruning is enabled. Real current-browser-data reconciliation, fresh cloud snapshot restoration and a human screen-reader audit of every populated legacy state remain unverified. The preserved historical fixture is a repository artifact, not the user's latest browser export.

Production deployment remains prohibited without explicit approval. Hosted Preview deployment results are reported in chat after GitHub/Vercel confirms the pushed commit.
