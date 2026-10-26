# Connected intelligence design — not implemented sync

The browser has no API credentials and makes no authenticated calendar or financial API calls. Morning and evening reviews use local records only.

Implement in this order:

1. Read-only calendar: a server application completes OAuth using authorization code plus PKCE, stores encrypted refresh tokens in a server-side vault and returns normalized events to the browser through an authenticated same-origin API. Bind provider IDs to local event IDs. Start with explicit import preview, idempotency tests and duplicate detection; do not overwrite manual events.
2. Financial import: use provider-hosted consent and read-only transaction/balance scopes. Keep bank and business ledgers distinct. Store provider transaction IDs and evidence timestamps separately from estimates. Reconcile pending/settled/reversed records with audit history, and test revocation and partial failure. Never mark historical manual records verified merely because an account was connected.
3. Scheduled briefings: a server job reads only consented data and assembles source-linked priorities. Show last successful authenticated fetch and freshness. Require the user's approval before sending a message or making any commercial commitment. A scheduled local summary does not establish live sync.

All integrations need tenant ownership checks, CSRF protection, restrictive CORS, scoped tokens, encrypted secrets, log redaction, expiration, audit trails, rate limits, deletion/revocation controls, retries with idempotency, and tests using provider sandboxes. Return capability/error status to the browser; never render a misleading connected badge after a failed refresh. No provider has been authenticated or tested in this preview.
