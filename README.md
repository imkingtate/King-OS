# SOVEREIGN V2 — incremental development preview

This branch extends the existing single-page application. It does not replace the existing module data model or deploy to production.

## Run and verify

Requires Node 18+ and Python 3. No application dependencies are installed.

```sh
node --test tests/*.test.cjs
# Optional, when the private recovery artifact is available:
node tests/legacy-seed.cjs /workspace/legacy-recovery-seed.js
python build.py
python -m http.server 8765 --bind 127.0.0.1 --directory dist
```

With Playwright and Chromium installed, in another shell:

```sh
node tests/browser.cjs
node tests/workflows.cjs
node tests/design.cjs
```

Browser tests use `require('playwright')` and `/usr/bin/chromium`; override the executable with `CHROMIUM_PATH`. The cloud image supplies both. These tests use isolated browser contexts and synthetic records, never a user's real browser profile. The server is for internal development; do not expose it publicly.

## Architecture and storage

- `index.html`: retained application, inline Chart.js, legacy modules and UI layers.
- `storage.js`: shared decoding, structural validation, verified primary writes and recovery-copy preservation.
- `domain.js`: deterministic migration, command ranking, customer verification and recurrence/forecast calculations.
- `design.css`: shared midnight, ivory and copper visual system across all modules, navigation, dialogs and welcome.
- `v2.js` / `v2.css`: incremental operational workspace using the existing state and canonical `S.live` action store.
- `build.py`: explicit six-file static preview build; excludes backups, Git metadata and test data.

The authoritative device record remains `localStorage.sov_v3`. `sov_v3_prev` retains the previous revision; IndexedDB `sovereign_backup/kv/sov_v3` is a secondary full-state mirror. A corrupt primary pauses startup rather than being silently replaced. The recovery banner downloads original bytes and can restore a validated previous save while retaining the damaged original in `sov_v3_recovery_original`. Normal export serializes every current state field, including unknown modules and V2 records. Recovery artifacts are separate from normal exports. Save errors are visible; no browser storage system is a substitute for external backups.

Migration retains legacy inbox items and links them to canonical actions. Running migration again does not duplicate them. Historical revenue and customer notes remain intact. Historical manual revenue is not evidence of verified payment. New paying-customer classification requires a positive transaction with a human-checked receipt reference. This is manual verification, not bank authentication. A pipeline stage change cannot create revenue.

The original source contained an automatic personal-history seed. It is removed from served source; the original seed script is preserved at `/workspace/legacy-recovery-seed.js` for this environment only. The original Git history also retains it. Do not publish that artifact, or expose repository history as a static site. Real browser-held data has not been accessed or altered.

## Workflow

Command shows ranked actions, upcoming commitments, a local morning review and evening closeout. New inbox captures use `S.live`. Original command tools are retained behind a toggle. Reign Ops separates India/Yami leads, content, offers, activities, verified transactions and fulfillment. Offer approval and payment confirmation are explicit human actions; nothing sends external communications. Money tracks recurring bills, subscriptions, paydays, protected savings and estimated personal cash. Personal/family planning updates the existing meal and calendar records and canonical actions. Settings includes nutrition targets, all-record search and backup entry points.

## Limitations and follow-up work

This is an incremental V2 preview, not a completed replacement of every legacy workflow.

1. No hosted preview destination is configured. `dist` is built and the internal preview is tested; no public preview or production deployment has occurred.
2. Browser-local data remains limited by device quota/eviction. Recovery copies consume additional space. Add transactionally versioned IndexedDB storage with multi-device conflict resolution before authenticated sync. The current tab-change guard blocks subsequent saves but is not an atomic cross-tab locking protocol.
3. Migration tests cover structural preservation, canonical inbox migration, full-state restore and supported legacy schemas. They cannot recover data already pruned by older versions. Historical snapshots must be reconciled by a human; never automatically merge the preserved seed into current data.
4. Existing layered inline UI remains. New forms have labels, keyboard controls, focus visibility and mobile layout coverage. The entire legacy UI has not received a full accessibility or interaction audit. Administrative features remain accessible in their historical locations as well as Settings entry points.
5. Existing blueprint/habit checklists remain separate contextual records. Inbox capture is consolidated, but every older task-like subsystem has not been merged. Historical buyer-note keys remain readable as creator-unassigned notes; new notes and paying-customer rows are scoped by creator.
6. Legacy dashboards and quick revenue logs still use manually entered historical totals. They must not be interpreted as verified financial reports. The V2 workspace labels evidence explicitly. Business cash on hand is unknown. Forecast includes recorded unpaid overdue bills; unrecorded items and externally paid bills need manual reconciliation. Annual recurrence, taxes, refunds, currencies, debt amortization and automatic bank reconciliation are not implemented.
7. New offers and transaction references cannot authenticate bank evidence. Human verification is recorded; credential-based verification is future work. Customers can be recorded without a matching pipeline handle; identity resolution should be explicit rather than guessed.
8. Nutrition targets are configurable display goals. No medical recommendation or automatic meal nutrient analysis is performed. Meal history is preserved when the V2 editor replaces a plan.
9. No calendar/bank integration or scheduled external briefing exists. See `INTEGRATIONS.md`. Optional Google Fonts may fail under restricted networking; system fonts remain available.
10. Development commits are published on GitHub at `imkingtate/King-OS`, branch `dev/sovereign-v2`. Hosted preview status could not be verified because the GitHub API returned Forbidden. Review the branch and validate a Vercel preview before release. Fresh-cloud-task restoration has not been independently verified.

Before production: import a copy of the user's latest export into an isolated profile, reconcile every historical module, review financial labels across legacy screens, complete the remaining accessibility/task-consolidation work, and validate the hosted preview. Production requires explicit approval.
