# Job Detail — Scope Change Backend Requirements

Source of truth for shape: `src/types/job.ts` (`ScopeChange`), `src/types/jobs.ts` (`ScopeChange`), `src/services/jobs/api.types.ts` (`ApiScopeChange`).
Backend: `/home/zadmin/Personal/zepnest-api/python-graphql-api`, `api/mobile/partner_routes.py` + `api/mobile/srs_phase1_routes.py`. SRS §9.

## Status: built and live

Unlike the Jobs/Team screen gap-analyses in this folder (written before any partner API existed), the scope-change backend was built alongside this frontend slice — see `SCOPE_CHANGE_IMPLEMENTATION_PLAN.md` at the repo root of `/home/zadmin/Personal` for the full cross-repo plan and Phase A verification notes.

## Endpoints

| Endpoint | Auth | Purpose |
|---|---|---|
| `POST /mobile/technician/jobs/:id/scope-change` | technician | Raise a scope change on an `in_progress` job (FR-SC-001). 409 if one is already pending. |
| `POST /mobile/bookings/:id/scope-change/approve` | customer | Approve — bumps `bookings.total_amount` (FR-SC-005), notifies the technician. |
| `POST /mobile/bookings/:id/scope-change/decline` | customer | Decline — no amount change, notifies the technician. |

Both approve/decline are `410` if the 10-minute window (`expiresAt`) has lapsed — the backend has no scheduler, so expiry is computed lazily on every read rather than by a background job.

## Read-path field

`GET /mobile/technician/jobs`, `GET /mobile/vendor/jobs*`, `GET /mobile/bookings/:id` (customer-side) all include a `scopeChange` object (`null` if none raised yet) with the **latest** scope change for that booking only — `id, reason, description, additionalMinutes, originalAmount, additionalAmount, revisedTotal, photoUrl, status, raisedAt, expiresAt`. `status` is one of `pending | approved | declined | expired`.

## Known gaps (not built this pass)

- **No multi-row history endpoint.** `booking_scope_changes` retains every row a technician has ever raised on a booking, but no endpoint returns the full list — only the latest. FR-VEND-002's "vendor can see... history" is satisfied for the latest change only. A `GET /mobile/vendor/jobs/:id/scope-changes` (or similar) would be needed for a true history view.
- **No escalate-to-ops endpoint** (SRS §9.2 step 5C). The existing `/api/orders/escalate/:id` is unauthenticated and writes a `bookings.status` value outside `booking_status_enum` — reusing it would corrupt the booking's real status. No ops-queue/ops-user model exists elsewhere to notify instead.
- **No masked calling.** No customer-phone field is exposed to technicians anywhere in this stack, and no telephony/masking provider is integrated.
- The "close at original scope" 5C option needs no endpoint — once `expiresAt` lapses, the row lazily reads as `expired` and the backend's completion gate stops blocking on its own.
