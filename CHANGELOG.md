# Changelog

## Observatory visual refresh

- Unify all modules with midnight-blue surfaces, ivory typography, copper highlights and teal focus states.
- Replace the plain operational panel with an editorial masthead, real status tiles and responsive workspace cards.
- Restyle shared cards, inputs, buttons, navigation, Atlas, dialogs and welcome screen.
- Keep mobile navigation intentional, retain 44px operational controls and respect reduced motion.
- Verify all five operational workspaces and eight retained modules at phone, tablet and desktop widths.
- Preserve storage schemas and business logic; development preview only.

## V2 development preview

- Preserve unreadable primary records; show save/recovery failures and verified write errors.
- Add previous-save recovery, original-byte download, structural validation and tab-change protection.
- Remove automatic personal-history seeding from new profiles; preserve the source seed outside the served checkout.
- Retain score, closeout and action-event history; archive daily journal text and priorities before rollover.
- Link legacy inbox records to canonical actions with an idempotent migration.
- Add a simpler command workspace, local morning briefing and idempotent evening closeout.
- Add separate India/Yami operations, draft/approved offers, content planning, activity outcomes, human-verified transactions and fulfillment.
- Block automatic revenue generation on WON stage changes; retain historical revenue and notes.
- Add recurring obligations, subscriptions and paydays, scope separation, protected savings and labeled estimates.
- Preserve the 60/20/15/5 living/savings/investment/buffer framework.
- Add meal-plan history, family calendar entry, canonical practice/home actions, configurable nutrition goals and all-record search.
- Document secure integration design and remaining limitations; no live synchronization is claimed.
- Add automated domain, storage, recovery and mobile/desktop browser workflows; add an explicit static preview build.

The development branch is published to GitHub. No production deployment or modification of actual browser-held user data was performed. Vercel preview status remains unverified.

## Operational overhaul

- Consolidate Hunt, linked Blueprint actions, habits, home checklists and side quests into source-linked canonical daily actions; preserve earlier days and all historical records.
- Add all-action editing, rescheduling, archive/reopen, daily wake-up, briefing reminders and downloadable briefings.
- Upgrade IndexedDB without dropping its original store; maintain a transactional current mirror plus recovery checkpoints, full recovery exports and revision restore. Wait for the recovery transaction before completing imports.
- Reject unsafe nested data, nonfinite values and invalid refunds; detect conflicting primary updates before writes.
- Link content plans and acquisition outcomes to canonical actions and follow-ups. Keep paying customers creator-scoped and net of refunds; require verified payments for new revenue milestones.
- Add explicit personal/business/unassigned account ledgers, annual/biweekly schedules, balance-confirmation rules and statement imports that never fabricate bank balances.
- Add physical check-ins backed by existing charts, journal records, measured skill practice, ingredients/shopping lists and family commitment completion.
- Move season/data administration into Settings, remove destructive reset, and retain achievement records without blocking routine work with a modal.
- Repair accessible names, legacy keyboard activation, focus handling, zoom and contrast; verify all tested screens with axe-core and keyboard workflows.
- Add server-side Google Calendar OAuth with PKCE and encrypted HttpOnly sessions, plus Apple Calendar file import and standardized Chime/statement CSV import. Live Google authorization still requires Vercel configuration; live iCloud/Chime access and background delivery remain external prerequisites.
