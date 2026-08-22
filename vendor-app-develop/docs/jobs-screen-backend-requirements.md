# Jobs Screen — Backend Requirements

Source of truth for shape: `src/types/jobs.ts`, `src/data/jobsMock.ts`, `src/screens/dashboard/tabs/JobsTab.tsx`, `src/screens/jobs/JobDetailScreen.tsx`.
Backend surveyed: `/home/zadmin/Personal/zepnest-api/python-graphql-api` (Flask, REST blueprint `rest/routes.py`, customer-mobile blueprint `mobile/routes.py`, SQLAlchemy models in `api/models/`).

## TL;DR

The backend has the core commerce tables (`bookings`, `booking_items`, `technician_profiles`, `payments`, `reviews`) which cover ~60% of the `Job` / `JobDetail` shape. **There is no vendor/technician-facing API at all** — `mobile/routes.py` is customer-only (OTP auth keyed to a customer phone, cart, bookings-as-customer). `rest/routes.py` is the **admin portal's** API (no per-technician auth/session, returns all orders). To ship the Jobs screen for real we need a new technician-auth'd API surface, plus a handful of new tables for things the schema never tracked (status timeline, before/after photos, scope-change requests).

---

## 1. What already exists and is reusable

| Frontend need | Existing DB table / column | Notes |
|---|---|---|
| `Job.id`, `jobNumber` | `bookings.booking_id`, `bookings.booking_number` | ✅ |
| `Job.amount` | `bookings.total_amount` | ✅ |
| `Job.location` | `bookings.service_address` (or `addresses` via `address_id`) | ✅ |
| `Job.timeLabel` / period (today/tomorrow/thisWeek) | `bookings.scheduled_date`, `bookings.scheduled_slot` | ✅ columns exist (added via `scripts/alter_bookings_mobile_scheduling_address.sql`) but **not exposed on the SQLAlchemy `Booking` model** — only used via raw SQL in `mobile/routes.py`. Need to add to model or query directly. |
| `Job.technician` (name/initials/avatar) | `bookings.technician_id` → `technician_profiles` → `users.first_name/last_name` | ✅ name derivable; `initials`/`avatarColor` are presentation-only, compute in API or client |
| `JobDetail.customer`, `fullAddress` | `bookings.customer_id` → `users`; `bookings.service_address` / `addresses` | ✅ |
| `JobDetail.servicesBooked` | `booking_items` → `service_id` → service/price-mapping name | ✅ table exists, join needed |
| `JobDetail.detailPayment` (upiPaid/cashCollected/codPending/unpaid + amount) | `payments.payment_method`, `payments.status`, `payments.amount` | ✅ data present, needs a mapping function from `(payment_method, status)` → frontend enum |
| `JobDetail.customerRating` | `reviews.rating`, `reviews.review_text`, `reviews.customer_id` (join for `reviewerName`) | ✅ table exists; REST already has `/reviews` CRUD (admin-scoped) |
| Job lifecycle status (broad strokes) | `bookings.status` (free string, see `booking_status.py`) | ⚠️ only knows `pending/open/under_review/assigned/in_progress/escalated/cancelled` — no `enRoute`/`arrived`/`completed` labels defined yet (column is free-text so it *can* hold them, just isn't wired up anywhere) |

---

## 2. What's missing — needs to be built

### 2.1 Vendor/technician auth + scoping (blocking everything else)
There is no concept of "the technician currently logged into the vendor app" anywhere in this backend. `mobile/routes.py`'s `require_mobile_auth` resolves a **customer** via `_get_or_create_customer`. We need the equivalent for technicians:
- An OTP (or password) login that resolves to a `technician_profiles` row, issues a JWT (mirror `_issue_token`/`_decode_token` pattern), and exposes `g.technician_id` via a `require_technician_auth` decorator.
- All job endpoints below must filter `WHERE technician_id = g.technician_id` — nothing in the current REST `/orders` API does this (it's the admin's all-orders view).

### 2.2 New endpoints (vendor namespace, e.g. `/vendor/jobs`)
None of these exist today in any form:
- `GET /vendor/jobs?period=today|tomorrow|thisWeek` — list this technician's jobs for the period → `Job[]`
- `GET /vendor/jobs/:id` — job detail → `JobDetail`
- `PATCH /vendor/jobs/:id/status` — technician advances status (`enRoute` → `arrived` → `inProgress` → `completed`); should append to the new status-history table (2.3)
- `POST /vendor/jobs/:id/photos` — upload before/after photo (phase: `before`|`after`); should reuse the existing `presign_s3_upload` pattern from `mobile/routes.py:2519`
- `POST /vendor/jobs/:id/scope-change` — technician raises additional-work request (writes to new table 2.4)
- `PATCH /vendor/jobs/:id/scope-change/:scopeChangeId` — customer/admin approves (likely actually called from the **customer** app, not vendor — flag for product to confirm which app drives this)

### 2.3 New table: job status history (for `JobDetail.statusLog`)
`bookings.status` only stores the *current* status — there is no history of transitions or timestamps, but the UI needs a full timeline (`assigned 8:30 AM → enRoute 8:55 AM → arrived 9:10 AM → ...`).

```sql
CREATE TABLE booking_status_history (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER NOT NULL REFERENCES bookings(booking_id),
  status VARCHAR(50) NOT NULL,
  changed_at TIMESTAMP NOT NULL DEFAULT NOW(),
  changed_by_technician_id INTEGER REFERENCES technician_profiles(technician_id)
);
```
Write a row here every time `PATCH /vendor/jobs/:id/status` succeeds; `JobDetail.statusLog` is just this table ordered by `changed_at`, with `isCurrent` = latest row.

### 2.4 New table: scope change / additional work requests (for `JobDetail.scopeChange`)
Nothing in the schema models this at all.

```sql
CREATE TABLE booking_scope_changes (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER NOT NULL REFERENCES bookings(booking_id),
  change_type VARCHAR(120) NOT NULL,        -- e.g. "Additional work found"
  description TEXT NOT NULL,
  original_amount NUMERIC NOT NULL,
  additional_amount NUMERIC NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'awaitingCustomer',  -- 'approved' | 'awaitingCustomer'
  raised_by_technician_id INTEGER REFERENCES technician_profiles(technician_id),
  raised_at TIMESTAMP NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMP
);
```

### 2.5 New table (or reuse pattern): before/after job photos
`booking_items.image_url` is a single per-line-item *customer-submitted* photo (the problem photo at booking time) — not the technician's before/after evidence photos, and it can't hold multiple photos with a phase tag and a "minimum required" count.

```sql
CREATE TABLE booking_job_photos (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER NOT NULL REFERENCES bookings(booking_id),
  phase VARCHAR(10) NOT NULL CHECK (phase IN ('before', 'after')),
  photo_url TEXT NOT NULL,
  uploaded_by_technician_id INTEGER REFERENCES technician_profiles(technician_id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```
`PhotoSet.minimum` (currently hardcoded to 2 in mock data) should come from a config value (per service type, or a global constant) — confirm with product whether this varies by job type.

### 2.6 Job "type" classification (`typeKey: 'rateCard' | 'service' | 'highTicket'`)
Nothing in `categories` / `sub_categories` / `price_mappings` currently tags a service with this 3-tier classification (the closest existing field, `price_mappings.service_type`, is `labor|parts|service` — a different axis). Need either:
- a new column `price_mappings.job_tier` (`rateCard|service|highTicket`), or
- a derivation rule (e.g. by price bands) — needs product input on which is correct.

`typeLabel` ("TYPE 1"/"TYPE 2"/"TYPE 3") is presentation, derivable from `typeKey`.

### 2.7 `addressHidden` (privacy gating before technician accepts/arrives)
Not a stored field — appears to be a business rule ("hide full address until job reaches X status"). Recommend computing this in the API response rather than storing it: e.g. `addressHidden = jobStatus in ('assigned',)`. Needs product confirmation of the exact rule (mock data shows it tied to `assigned` status, hidden for `j-8`/`j-9` which are `assigned`, shown for everything past that).

### 2.8 `JobTechnician.liveStatus` (`available|enRoute|onJob`)
This is presentation of the *current job's* status, not the technician's profile `status` column (which is a general availability flag). Should be derived per-job from `bookings.status`, not stored separately — just needs a mapping function in the API response builder.

---

## 3. Task breakdown (one PR per task, in order)

Each task is scoped to land and be reviewed on its own — later tasks depend on earlier ones, so do them in order. All live in `zepnest-api/python-graphql-api`.

### Phase 0 — Auth foundation (deferred — see interim stub below)
**T1. Technician OTP auth + JWT issuance**
- New module, e.g. `api/vendor/auth.py` (or a `vendor_bp` blueprint).
- Mirror `mobile/routes.py`'s `request_otp`/`verify_otp`/`_issue_token`/`_decode_token`, but resolve against `technician_profiles` (via `users.phone`) instead of `_get_or_create_customer`. Do **not** auto-create a technician on OTP request — only customers get that convenience; a phone with no matching `technician_profiles` row should 404/403.
- Endpoints: `POST /vendor/auth/request-otp`, `POST /vendor/auth/verify-otp`.
- Acceptance: can log in as a seeded technician and get back a JWT containing `technician_id`.

**T2. `require_technician_auth` decorator**
- Mirror `require_mobile_auth`; decode JWT, set `g.technician_id`, 401 on missing/invalid/expired token.
- No new endpoints yet — just the decorator + a throwaway `GET /vendor/ping` to prove it works, removed once T3 lands.

**Decision: T1/T2 are deferred.** Phases 1–5 are built first against an unverified stand-in for technician identity (T0 below), and T1/T2 are slotted back in at the end to replace the stand-in with real auth. This unblocks parallel/faster progress on the Jobs screen at the cost of the API being open to identity spoofing until the swap happens — **acceptable for local/dev work against a seed DB, not acceptable if this API is reachable beyond your machine.**

**T0. Interim technician-identity stub (replaces T1/T2 for now)**
- One helper, e.g. `api/vendor/auth.py::current_technician_id()`, that reads `technician_id` from a request header (`X-Technician-Id`) or query param and returns it as an int — no token, no verification.
- Every Phase 1–5 endpoint calls this one helper to get the id, exactly the same way they'd call `g.technician_id` after T1/T2. **This is the only place that changes when T1/T2 land** — swap the helper's internals to decode a JWT instead of reading a header, leave every call site untouched.
- Acceptance: `GET /vendor/jobs` with `X-Technician-Id: 3` returns only bookings where `technician_id = 3`. Missing header → 400 (not 401 — there's no auth yet to fail).
- **Do not skip this for "just hardcode technician_id = 1 in the query"** — that would mean every endpoint needs a manual edit later instead of one. The header indirection is what keeps the eventual T1/T2 swap mechanical.

### Phase 1 — Read-only list/detail (existing tables only)
**T3. `Booking` model: expose `scheduled_date`, `scheduled_slot`, `address_id`**
- Add the three columns to `api/models/booking.py` (they exist in the DB already, per `mobile/routes.py` raw SQL) so they're queryable via ORM instead of raw SQL strings.
- Acceptance: existing mobile booking tests/flows still pass; new columns visible on `Booking` instances.

**T4. `GET /vendor/jobs?period=today|tomorrow|thisWeek`**
- New `api/vendor/jobs.py`, blueprint mounted under `/vendor`.
- Query `bookings WHERE technician_id = current_technician_id() AND scheduled_date` in the requested period (`current_technician_id()` is the T0 stub — every call site uses this one function, never reads the header directly, so the later T1/T2 swap touches only T0's internals).
- Map each row to the `Job` shape (§1 of this doc). Derive `liveStatus`/`addressHidden` per §2.7/§2.8 — no new columns.
- `statusLog`, `scopeChange`, photo counts are **not** in scope here — this is the list endpoint, `Job` doesn't need them.
- Acceptance: returns real rows for a seeded technician/booking, shape matches `src/types/jobs.ts#Job`.

**T5. `GET /vendor/jobs/:id`**
- Join `booking_items` (→ `servicesBooked`), `payments` (→ `detailPayment`), `reviews` (→ `customerRating`).
- `statusLog`: return a single synthesized entry from `bookings.status` (real history comes in T7) — mark this as a known stub in the PR description.
- `scopeChange`: omit/null (T9 wires it up).
- `beforePhotos`/`afterPhotos`: return `{ uploaded: 0, minimum: 2 }` placeholder (T8 wires it up).
- Acceptance: shape matches `JobDetail`; frontend can swap mock data for this endpoint and render without crashing.

*(T4 + T5 are the milestone where the Jobs screen runs on real data — everything after is incremental enrichment.)*

**T7's `PATCH /vendor/jobs/:id/status`, T10's photo upload, and T13/T14's scope-change endpoints all use `current_technician_id()` the same way** — for `changed_by_technician_id` / `uploaded_by_technician_id` / `raised_by_technician_id`.

### Phase 2 — Status timeline
**T6. `booking_status_history` table**
- Migration script (follow the existing convention in `scripts/`, e.g. `scripts/create_booking_status_history_table.sql`) + SQLAlchemy model `api/models/booking_status_history.py`.
- No endpoint changes yet.

**T7. `PATCH /vendor/jobs/:id/status`**
- Validates the requested transition is a legal next step (`assigned→enRoute→arrived→inProgress→completed`); rejects skips/backward moves with 400.
- On success: updates `bookings.status` and inserts a `booking_status_history` row.
- Acceptance: calling it in sequence walks a job through the full lifecycle; illegal transition returns 400.

**T8. Wire real `statusLog` into `GET /vendor/jobs/:id`**
- Replace the T5 stub with `booking_status_history` rows ordered by `changed_at`, `isCurrent` = latest.
- Acceptance: matches `StatusLogEntry[]` shape exactly, including `isCurrent`.

### Phase 3 — Photos
**T9. `booking_job_photos` table**
- Migration + model, per §2.5.

**T10. `POST /vendor/jobs/:id/photos`**
- Reuse the presign pattern from `mobile/routes.py:2519` (`presign_s3_upload`) — technician gets a presigned URL, uploads to S3, then calls this with `{ phase: 'before'|'after', photoUrl }` to record it.
- Acceptance: row appears in `booking_job_photos`; duplicate/excess uploads beyond a sane cap (confirm number with product) are rejected or just accepted — decide and note in PR.

**T11. Wire `beforePhotos`/`afterPhotos` into `GET /vendor/jobs/:id`**
- Replace the T5 placeholder with real counts from `booking_job_photos`; `minimum` comes from a config constant (confirm value/whether it varies by job type — flagged in §2.5).

### Phase 4 — Scope change
**T12. `booking_scope_changes` table**
- Migration + model, per §2.4.

**T13. `POST /vendor/jobs/:id/scope-change`**
- Technician raises additional work; writes a row with `status='awaitingCustomer'`.

**T14. `PATCH /vendor/jobs/:id/scope-change/:scopeChangeId`**
- Marks `approved`/sets `resolved_at`. **Confirm with product first** whether this is called from the vendor app, the customer app, or admin portal — wrong caller means wrong auth decorator.

**T15. Wire `scopeChange` into `GET /vendor/jobs/:id`**
- Replace the T5 `null` with the latest open (or most recent) `booking_scope_changes` row for the booking.

### Phase 5 — Job tier classification
**T16. Decide + add `typeKey` source of truth**
- Product decision needed first (new `price_mappings.job_tier` column vs. price-band derivation) — don't start the migration until this is settled.
- Migration + backfill of existing rows once decided.

**T17. Expose `typeKey`/`typeLabel` in list + detail responses**
- Small, mechanical once T16 lands.

### Phase 0 (revisited) — Swap in real auth
**T1, T2 (deferred from above)** — implement now that Phases 1–5 exist and are stable.
- T1: real OTP+JWT issuance, as originally specified.
- T2: `require_technician_auth` decorator, applied to every `/vendor/*` route.
- **T0 retirement**: change `current_technician_id()`'s internals to read `g.technician_id` (set by the new decorator) instead of the `X-Technician-Id` header. No other file changes — this is the payoff of routing every endpoint through the one helper in T0.
- Acceptance: every Phase 1–5 endpoint still passes its original test, now requiring a real bearer token; requests with a spoofed `X-Technician-Id` header and no valid token are rejected.

---

Suggested cadence: ship **T0** first (unblocks everything), then T3–T5 (Jobs screen off mock data), then T6–T17 in whatever order priorities dictate, then close with T1/T2 to retire the identity stub before this is exposed anywhere beyond local dev.
