# V2 preview verification — 2026-10-26

All results below are from the current development environment. No production deployment or fresh-cloud-task restoration was tested.

| Check | Result |
| --- | --- |
| `node --test tests/*.test.cjs` | 14 passed, 0 failed, 0 skipped |
| `node tests/legacy-seed.cjs` | Preserved historical snapshot: 136 original fields checked through migration and backup roundtrip; idempotency passed; no record values logged |
| `python build.py` | Five-file static preview built successfully |
| `tests/browser.cjs` against built preview | Passed at 390px and 1440px |
| `tests/workflows.cjs` against built preview | Passed at 390px and 1440px |
| `git diff --check` | Passed |

Browser recovery coverage includes actual application startup, whole-state import/export, unknown-module preservation, corrupt-primary preservation, original-byte recovery retention, previous-save restore, visible quota errors, recovery from IndexedDB after primary loss, and cross-tab save blocking.

Browser workflow coverage includes canonical action creation/completion, rollback on failed action persistence, repeated closeout without duplicate tomorrow actions, separate creator workspaces, no automatic revenue on WON stage changes, approved offers, content planning, activity outcomes, receipt-confirmed transactions, scoped paying-customer rows, recurring subscriptions, manual account balances, protected savings, meal-plan history, family commitments, practice actions, nutrition settings and persistence after reload. Form controls are checked against viewport bounds. Startup and workflow checks assert no JavaScript page errors. Mobile visual inspection found transient clipping from the legacy entry animation; animation is disabled for the new operational panel.

Unit coverage includes legacy schema and unknown-field preservation, unsupported-version rejection, malformed-shape rejection, failed-write recovery retention, idempotent inbox migration, preservation of idea/brand notes, verified-only customer classification, end-of-month recurrence, paid-occurrence exclusion, overdue bills in forecasts, ledger separation, protected savings, unknown opening balances and command ranking.

These checks use isolated synthetic browser profiles. They do not establish that every legacy feature is correct or that the user's current browser data has been migrated. The historical seed is a preserved repository artifact, not a copy of the user's current browser database.

No hosted preview target was supplied. The internal preview and downloadable static artifact are available; authenticated provider integrations, a full legacy accessibility audit, complete task-system consolidation and production release remain unverified/outstanding as documented in README.md.
