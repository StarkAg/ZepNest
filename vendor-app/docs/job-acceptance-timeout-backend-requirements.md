# Job Acceptance Timeout Backend Requirements

Source of truth for shape: `src/types/job.ts` / `src/types/jobs.ts` (`assignedAt`, `acceptDeadline`, `acceptedAt`), `src/services/jobs/api.types.ts` (`ApiJob`).
Backend: `/home/zadmin/Personal/zepnest-api/python-graphql-api`, `api/mobile/partner_routes.py` + `api/mobile/srs_helpers.py` + `api/mobile/routes.py`.

## Status: built and live

Covers three related fixes:
1. Customer-facing Order Details (`lk-app`) no longer shows the assigned technician's identity until they've accepted the job (Partner App SRS §5.2).
2. The technician has a **5-minute** window to accept/decline a newly assigned job (an intentional product deviation from the SRS's stated 15-minute figure, confirmed with product — not a bug).
3. If the technician doesn't respond within 5 minutes, the vendor is notified and can reassign.

## Endpoints

| Endpoint | Auth | Purpose |
|---|---|---|
| `POST /mobile/technician/jobs/:id/accept` | technician | Sets `technician_accepted_at = NOW()`. Does not change `bookings.status`. |
| `POST /mobile/technician/jobs/:id/decline` | technician | Resets `technician_id`, `technician_accepted_at`, `assigned_at`, `assignment_timeout_notified_at` to `NULL`; `status` back to `pending`. |
| `POST /mobile/vendor/jobs/:id/assign` | vendor | Also used for the timeout-reassign case — no separate endpoint needed. Sets `assigned_at = NOW()` and clears `technician_accepted_at`/`assignment_timeout_notified_at`, starting a fresh 5-minute cycle for the new technician. |

## Read-path fields

`GET /mobile/technician/jobs`, `GET /mobile/vendor/jobs*` now include, per job:
- `assignedAt` — when the current technician was assigned/reassigned; `null` if declined/unassigned.
- `acceptDeadline` — `assignedAt + 5min`, computed server-side; `null` if `assignedAt` is `null`.

`GET /mobile/bookings/:id` (customer-side, via `enrich_booking_detail`) now withholds the `technician` object (`null`) while `status = 'assigned'` and `technician_accepted_at IS NULL` — `lk-app`'s existing `technicianPendingAcceptance` derivation (`status === 'ASSIGNED' && !technician`) picks this up with no frontend changes.

## Vendor timeout notification

No scheduler/cron exists in this stack. Detection is a **lazy scan** (`_notify_expired_assignments` in `partner_routes.py`) run at the top of `GET /vendor/technicians`, `GET /vendor/jobs`, and `GET /vendor/jobs/:id` — all already polled by vendor-app every 30s regardless of active tab. A job qualifies once `status='assigned' AND technician_accepted_at IS NULL AND assigned_at <= NOW() - 5min AND assignment_timeout_notified_at IS NULL`; matching rows get a `"Technician didn't respond"` notification (via the existing `insert_notification` helper, delivered through the same `GET /mobile/notifications` polling vendor-app already has) and are stamped `assignment_timeout_notified_at` so they aren't renotified.

## Known gaps

- **~30s detection latency.** Worst case, the vendor sees the timeout notification up to ~30s after the 5-minute mark — bounded by the existing poll interval, not exact. Acceptable given 30s is 6% of the 5-minute window.
- **No push infra.** If the vendor's app isn't open/polling, no notification fires until they reopen it — same limitation the scope-change feature already accepts.
- **GraphQL gated for consistency, not urgency.** `TicketType.resolve_technician` / `AssignTechnicianToOrder` (used only by `zepnest-admin-portal`, not by any mobile client) got the same `technician_accepted_at` gate on the `Booking` model's `assigned_technician` property, but this was lowest priority since no mobile client depends on it.
