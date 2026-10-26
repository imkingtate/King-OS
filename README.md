# SOVEREIGN V2

An incremental overhaul of the existing personal/business operating system. Existing modules and records remain available. Work is on `dev/sovereign-v2`; production deployment requires explicit approval.

## Run and test

Node 18+ and Python 3 are required. Application code adds no third-party runtime packages. Vercel serves `dist` and the Node server endpoint in `api/google.js`.

```sh
node --test tests/*.test.cjs
python build.py
python -m http.server 8766 --bind 127.0.0.1 --directory dist
```

Browser tests require Playwright and Chromium (supplied by this cloud image). Set `CHROMIUM_PATH` if Chromium is elsewhere; set `SOVEREIGN_TEST_URL` if using a different server port.

```sh
node tests/browser.cjs
node tests/workflows.cjs
node tests/design.cjs
node tests/overhaul.cjs
node tests/vault.cjs
```

For the accessibility suite, install test-only axe-core outside the application and set `AXE_SOURCE` to its `axe.min.js`:

```sh
npm install --prefix /tmp/sovereign-test-tools --cache /tmp/sovereign-npm-cache --save-exact axe-core@4.14.0
AXE_SOURCE=/tmp/sovereign-test-tools/node_modules/axe-core/axe.min.js node tests/accessibility.cjs
```

The installed axe version is recorded in TEST_RESULTS.md; use that version if different. Optional private historical-fixture verification: `node tests/legacy-seed.cjs /workspace/legacy-recovery-seed.js`. The fixture is not served or committed again.

## Modules

- **Command:** ranked priorities, all-action editing/rescheduling/archive/reopen, one canonical daily checklist, upcoming commitments, obligation/content/fulfillment reminders, morning review, evening closeout and downloadable briefing.
- **Reign Ops:** isolated India/Yami leads, approved offers, planned content linked to actions, acquisition outcomes linked to pipeline changes and follow-ups, receipt-confirmed payments, refunds and fulfillment. Prospect stages never create payments. Customer totals are creator-scoped and net of refunds.
- **Money:** personal/business/unassigned account classifications, manually confirmed balances, protected savings, unpaid and overdue obligations, subscriptions, weekly/biweekly/monthly/yearly schedules and paydays. Legacy personal totals exclude explicitly business/unassigned accounts. The 60/20/15/5 living/savings/investment/buffer framework is retained.
- **Personal/family:** one daily physical check-in feeding existing charts, configurable protein/water targets, searchable reflections, skill practice targets/outcomes, weekly meals with preserved revisions, an ingredient shopping list and family commitments.
- **Settings:** complete-state exports, full recovery archives, validated file restore, revision browser, all-record search, nutrition goals, integration status/imports and season administration. The old destructive reset button is removed; ordinary history remains intact.
- **Retained modules:** Physical, Mind, Family, Chronicle, Home and the original contextual tools remain in navigation. Dynamic labels, keyboard access, focus handling, contrast and zoom have been repaired across the tested screens. Achievement records remain; routine completion no longer opens a blocking achievement modal.

## Storage and compatibility

`localStorage.sov_v3` remains the synchronous working record for compatibility with the retained handlers. Writes validate data, preserve the previous record, read back the result and check for conflicting updates. Unknown module fields are retained. Corrupt records pause startup and expose recovery controls instead of being replaced by defaults.

IndexedDB `sovereign_backup` upgrades from version 1 to 2 without removing its `kv` mirror. The latest mirror and minute-scale recovery checkpoints are written in one transaction; explicit exports create a fresh checkpoint. Restore operations force before/after snapshots and await the mirror transaction before reloading. Full recovery exports contain the entire state, retained local recovery originals and journal revisions; legacy plain JSON backups remain accepted. Imported journal entries are deduplicated. No automatic history pruning occurs. Quota failures remain visible and require external backup/space management.

Daily routines are canonical `S.live` entries with stable source references. Linked Blueprint/Hunt actions share one record; contextual legacy completion flags are synchronized at the persistence boundary. Prior daily records remain, and missed daily windows are marked skipped rather than falsely completed. Historic inbox captures, side quests, logs, notes and unknown data fields are retained. Reflections and daily rollover archives preserve original text.

The original repository contained an automatic personal-history seed. It was removed from served source and preserved at `/workspace/legacy-recovery-seed.js`; Git history also retains it. Never serve or automatically import this artifact. No real user browser profile was accessed by these tests.

## Code map

`index.html` retains the original app. `storage.js` validates compatibility/persistence; `domain.js` calculates forecasts and command ranking; `operations.js` handles canonical lifecycle, import formats, refund logic and reminders; `vault.js` manages recovery archives; `v2.js` contains operational UI; `accessibility.js` repairs dynamic legacy semantics; `design.css` is the shared visual system. `build.py` copies nine explicit static assets, excluding backups, Git metadata, test tools and credentials.

## Remaining external prerequisites and limits

1. **Google:** server OAuth exists, but Preview needs the four Vercel variables and actual user authorization described in [INTEGRATIONS.md](INTEGRATIONS.md). Mocked tests do not establish a live connection.
2. **Apple/Chime:** file imports work. Live iCloud and bank access are not configured; they need approved provider access and secure credential/storage design. Chime PDFs and calendar RRULE expansion are not silently guessed.
3. **Real data:** automated historical verification covers the preserved 136-field repository snapshot and synthetic browser profiles. The user's latest browser export has not been supplied or reconciled. Data pruned by older app versions cannot be reconstructed automatically.
4. **Durability:** local working storage is retained for compatibility; the tab conflict guard is not an atomic distributed database lock. Versioned IndexedDB recovery protects snapshots, but cloud/multi-device synchronization, server-owned user records and background delivery are not implemented. Export externally before changing browsers/devices. Full recovery imports accept up to 64 MB; larger archives need a separate reviewed recovery procedure.
5. **Finances:** balances are manual; source imports are labeled, not bank-verified. Classify accounts before relying on forecasts. Update current balances before marking an obligation paid. Financial statements may need transfer/refund reconciliation; forecasts exclude unrecorded items, taxes and obligations not entered. Stable statement references are preferred for imports.
6. **Accessibility:** automated WCAG checks and keyboard workflows cover the tested default screens at mobile/desktop sizes. They do not replace a human screen-reader audit of every populated historical state.
7. **Deployment:** development Preview is separate from production. Before production, authenticate/test enabled providers, validate the latest real-data export in an isolated profile, review risks and obtain explicit approval.

See [TEST_RESULTS.md](TEST_RESULTS.md) and [CHANGELOG.md](CHANGELOG.md) for evidence and changes.
