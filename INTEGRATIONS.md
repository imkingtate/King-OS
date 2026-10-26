# Connections and authentication

## Available now

- **Google Calendar:** `/api/google` implements server-side OAuth with PKCE, state validation, read-only calendar scope, encrypted HttpOnly/Secure/SameSite cookies and a same-origin disconnect guard. Explicit refresh imports expanded primary-calendar events from the last 7 days through the next 90 days, up to 1,000 events. Larger results fail closed rather than silently importing only part of a calendar. Cancelled events are retained and marked cancelled. Imported events are snapshots; no continuous sync is claimed.
- **Apple Calendar:** export an `.ics` file from Calendar and import it in Settings. UID-based updates preserve completed commitments and retain replaced values. This is private file import, not iCloud authentication or live CalDAV. Recurring series containing RRULE are rejected with a visible explanation; export individual occurrences first.
- **Chime / other financial records:** Settings accepts a standardized CSV with `date,description,amount` and optional `reference`. Dates use YYYY-MM-DD; expenses are negative and income positive. Quoted commas/newlines work. Review the validated row count before confirming. Import keys prevent repeating the same file from duplicating entries; identical rows without references are retained using their occurrence number. Overlapping partial exports without stable references require manual reconciliation. Imported rows never authenticate balances or mark payments verified. Chime statement PDFs are not parsed; a PDF must be reviewed/converted privately into the documented table before importing.

No browser code contains API keys, OAuth client secrets or plaintext provider tokens. File imports are processed locally and are not uploaded to a third-party parser.

## Google setup still required in Vercel

The machine's existing `GOOGLE_APPLICATION_CREDENTIALS` binding is platform authentication, not authorization to the user's personal calendar, and is intentionally unused.

Configure these **server environment variables** in the Vercel project's Preview environment; never place them in frontend code or chat:

| Variable | Required configuration |
| --- | --- |
| `SOVEREIGN_APP_ORIGIN` | Stable HTTPS branch-preview origin from Vercel, no trailing slash; must be the origin used to open the app |
| `SOVEREIGN_GOOGLE_CLIENT_ID` | Google OAuth web client ID |
| `SOVEREIGN_GOOGLE_CLIENT_SECRET` | Matching web client secret, stored securely in Vercel |
| `SOVEREIGN_SESSION_SECRET` | Cryptographically random 32-byte key, base64 encoded, stored securely in Vercel |

In [Google Cloud credentials](https://console.cloud.google.com/apis/credentials), enable Calendar API, configure the OAuth consent screen/test users, and register the exact redirect URI `<SOVEREIGN_APP_ORIGIN>/api/google?op=callback`. Follow Google's consent/verification requirements for the chosen distribution. Redeploy Preview after setting variables, open the stable configured origin, then choose Connect Google Calendar and Refresh. The UI records the last successful fetch. Do not configure production until explicitly approved.

Server-side tests use synthetic credentials and simulated token/event responses; they do **not** establish live Google authentication. Until the actual OAuth flow and event fetch succeed, the connection remains awaiting configuration. Cookies last at most seven days; reconnection is required after expiry. Disconnect clears the local encrypted session; remove the app in Google Account permissions to revoke the underlying provider grant. Rate limiting and request monitoring should be enabled through the hosting project before public multi-user distribution.

## Live Apple and Chime access

Live iCloud access needs an explicitly authorized CalDAV integration and secure server-side credential storage; it has not been implemented here. Never enter an Apple account password into this app. Live Chime access needs an authorized financial-data provider with confirmed Chime institution support, production approval and user consent. No supported direct consumer Chime API or provider binding is configured in this project. Do not substitute scraping, invented credentials or a fake connected badge.

## Briefings

Command derives reminders from unpaid obligations, planned content, pending fulfillment, overdue commitments and canonical actions. It refreshes while the app is open, pauses automatic refresh while editing, and rolls over days without deleting historical records. A briefing can be downloaded. Background delivery, push notifications and external email/SMS schedules require a hosted user-data store, authenticated scheduler and explicit delivery consent; they are not claimed or enabled.
