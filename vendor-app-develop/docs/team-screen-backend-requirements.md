# My Team Screen — Backend Requirements

Source of truth for shape: `src/types/technician.ts`, `src/data/dashboardMock.ts`, `src/screens/dashboard/tabs/MyTeamTab.tsx`, `src/components/technician/TechnicianCard.tsx`, `app/technician/[id].tsx`, `src/screens/technician/TechnicianDetailScreen.tsx`.
Product spec: `Zepnest_Partner_App_Phase1_SRS.docx.pdf` §4.1–4.2 (Vendor Dashboard, Tab 1 — My Team).
Backend surveyed: `/home/zadmin/Personal/zepnest-api/python-graphql-api` (Flask, REST blueprint `rest/routes.py`, SQLAlchemy models in `api/models/`).

## TL;DR

**There is no vendor↔technician relationship anywhere in the backend** — no `vendor_id` column, no join table, no `vendors` table. `technician_profiles` and what the SRS calls a "Vendor" are the same underlying row, distinguished only by the parent `users.user_type` string (`'technician'` vs `'vendor'`). The SRS itself flags this as an unresolved open point (§14.1, item 6: *"Vendor onboarding flow — how vendors are linked to technicians in the backend"* — decision needed from Dev Team, blocks the "multi-technician vendor model").

Today `GET /api/technicians` returns **every** `technician_profiles` row regardless of `user_type`, with no vendor filter possible even in principle. The current app calls this endpoint with no scoping at all.

Two separate problems to solve, in order:
1. **Model the relationship** — decide and build how a vendor "owns" a set of technicians (2.1 below). Nothing downstream works without this.
2. **Everything else** (per-technician live job/earnings enrichment, technician detail screen) is mostly derivable from existing tables once (1) exists — see §2.3–2.5.

---

## 1. What already exists and is reusable

| Frontend need | Existing DB table / column | Notes |
|---|---|---|
| `Technician.name`, `.initials` | `users.first_name`, `users.last_name` (via `technician_profiles.user_id`) | ✅ |
| `Technician.skills` | `technician_profiles.specialization` (comma-joined single string) | ✅ already parsed by `services/technician/index.ts` |
| `Technician.status` | `technician_profiles.status` (`available/busy/en_route/off_duty/offline`) | ✅ already mapped by `resolveStatus()` in the frontend service |
| `TechnicianDetail.rating`, `.totalReviews` | `technician_profiles.rating`, `technician_profiles.total_reviews` | ✅ |
| `TechnicianDetail.recentReviews` | `reviews` table (`rating`, `review_text`, `customer_id`) | ✅ table exists (confirmed in jobs-screen doc §1); needs join for reviewer name/masking |
| `TechnicianDetail.joinedDate` | `technician_profiles.created_at` | ✅ |
| `Technician.currentJobName` / next job / today's counts | `bookings` (`technician_id`, `status`, `scheduled_date`, `scheduled_slot`) + `payments` (`amount`, `status`) | ✅ derivable via query, no new columns — see §2.3 |

---

## 2. What's missing — needs to be built

### 2.1 Vendor↔technician relationship (blocking everything else) — DECIDED
No column, table, or FK expresses "technician X belongs to vendor Y." **Decision (product owner, 2026-07-05): one-to-many column.** A technician belongs to at most one vendor; mirrors the jobs-screen doc's philosophy of the simplest thing that unblocks Phase 1 without foreclosing the SRS's Phase 2 plan (§14.3: *"Multi-zone vendor support — vendor managing technicians across multiple pincodes"*, which implies one vendor → many technicians, not the reverse):

```sql
ALTER TABLE technician_profiles
  ADD COLUMN vendor_user_id INTEGER REFERENCES users(user_id);

CREATE INDEX ix_technician_profiles_vendor_user_id
  ON technician_profiles (vendor_user_id);
```

- `vendor_user_id` points at a `users` row where `user_type = 'vendor'`. Nullable — a technician can exist unassigned before onboarding, and Phase 1 is one-vendor-per-technician (SRS doesn't scope shared/multi-vendor technicians).
- **Backfill/linking (decided, product owner 2026-07-05):** manually seeded for now — ops/dev sets `vendor_user_id` directly via SQL/seed script on existing rows. No vendor-facing "add/invite technician" onboarding screen is being built in this phase; that UI stays deferred per SRS §14.1 until product decides the flow.
- A vendor querying their own vendor row (`/api/vendors/:id`) does **not** need this column — it's only consumed from the technician side (`WHERE vendor_user_id = :vendorId`).

### 2.2 Vendor auth + scoping — DECIDED (interim)
Same gap as the jobs-screen doc identified for technicians (§2.1 there) — there is no vendor-authenticated identity in the backend at all. `src/services/auth/index.ts` in the frontend is 100% mocked (`sendOtp`/`verifyOtp` just `setTimeout` and fake a role from the phone number's last digit).

**Decision (product owner, 2026-07-05): interim header stub now, real auth later** — same pattern already specified in `docs/jobs-screen-backend-requirements.md` (§2.1/T0–T2), applied to vendor identity:
- **VT1 (interim stub, building now):** `current_vendor_id()` helper reads `X-Vendor-Id` header/query param, no verification. Every vendor-scoped endpoint calls this one helper.
- **VT7 (deferred):** real OTP+JWT vendor auth, resolving to a `users` row with `user_type='vendor'`, mirroring `_issue_token`/`_decode_token`/`require_mobile_auth` in `mobile/routes.py`. Swaps `current_vendor_id()`'s internals only, per the jobs-screen doc's "don't hardcode, route through one helper" rule.
- If a single technician OTP/JWT auth module ends up covering both roles (a phone number can be dual-role per SRS §3.2), VT7 may end up being the *same* auth module as the jobs-screen doc's T1/T2, just resolving to a different profile table depending on which role the caller picked. Worth deciding jointly with whoever builds that, to avoid two parallel OTP systems.

### 2.3 `GET /vendor/technicians` (new endpoint)
Replaces the current unscoped `GET /api/technicians?limit=100` call in `src/services/technician/index.ts`.

- `WHERE tp.vendor_user_id = current_vendor_id()` (§2.1 + §2.2).
- Base fields: reuse existing `/api/technicians` mapping (name, initials, skills, status, rating, etc.) — no changes needed there.
- Per SRS §4.2.1, also join per-technician **today's** live job info:
  - `currentJobName` / `statusDetail`: latest `bookings` row for this technician where `status IN ('en_route','in_progress')` → service name + address.
  - `nextJobLabel`: next `bookings` row today with `status = 'assigned'` ordered by `scheduled_slot`.
  - `completedToday`: `COUNT(bookings) WHERE technician_id = tp.technician_id AND status = 'completed' AND scheduled_date = today`.
  - `earningsToday`: `SUM(payments.amount) WHERE payments.status = 'confirmed' AND payments.booking_id IN (today's completed bookings for this technician)`. SRS §4.2.1 notes this is **vendor-only visible** — do not expose it on any technician-facing endpoint.
- Acceptance: `GET /vendor/technicians` with `X-Vendor-Id: 7` returns only technicians where `vendor_user_id = 7`, each enriched with today's job/earnings snapshot; a technician with no bookings today returns `currentJobName`/`nextJobLabel` as `null` and counts as `0`.

This retires both mock fallbacks in `MyTeamTab.tsx` — `SAMPLE_JOB_DETAILS` (fake per-technician job info) and `MOCK_ONJOB_TECHNICIANS` (fake technicians appended when none are real) — since real data will always be present or legitimately zero.

### 2.4 `GET /vendor/technicians/:id` (new endpoint)
Replaces `app/technician/[id].tsx`'s current lookup into the hardcoded `MOCK_TECHNICIAN_DETAILS` map (keyed only on `'sample-1'`/`'sample-2'` — real technician ids from `/api/technicians` never match, so every real technician currently 404s on this screen).

- `WHERE tp.technician_id = :id AND tp.vendor_user_id = current_vendor_id()` — a vendor must not be able to fetch another vendor's technician by guessing an id.
- Fields already derivable from existing tables (§1): `rating`, `totalReviews`, `joinedDate`, `recentReviews` (join `reviews`).
- Fields the SRS wants (§4.2.2, §12.4) that have **no backing column today** — needs new schema, flagged for product/dev-team confirmation on exact shape before building:
  - `zone` (SRS: "assigned zone") — no zone/pincode assignment table for technicians exists; `addresses.zip_code` is for customer/user addresses, not technician service-area assignment.
  - `partnerId` (SRS: "Zepnest Partner ID") — not the same as `technician_id`; appears to be a separate display id, needs a column or derivation rule.
  - `isBgvVerified` (background verification status), `isCertifiedPartner` (tier flag) — `certification` column is a free-text list, not a verified/tiered boolean.
  - `locationAddress` / `locationUpdatedAgo` (live GPS) — no location-tracking table exists; SRS §13.3 (NFR-SEC-004) expects GPS data retained max 30 days, implying a dedicated table, not a single last-known column.
  - `weeklyEarnings` / `monthlyEarnings` — derivable via `payments` aggregation once §2.1 exists, same pattern as `earningsToday`.
  - `todaysSchedule` / `totalJobsToday` / `jobsDoneToday` — derivable from `bookings` for this technician, same query family as §2.3.
- Acceptance: shape matches `TechnicianDetail` in `src/types/technician.ts`; fields without backing data return `null`/`0` rather than throwing, with each stubbed field noted in the PR description (mirrors the jobs-screen doc's T5 convention).

### 2.5 `PUT /vendor/technicians/:id/reassign` (referenced by SRS, not yet scoped here)
SRS §4.2.2 and §4.4.2 mention a vendor "Reassign Job" action from both the technician detail screen and job detail screen. This is really a **jobs-domain** endpoint (`PATCH` on a booking's `technician_id`, constrained to `vendor_user_id`-owned technicians only) rather than a team-domain one — flagging here so it isn't duplicated if/when `docs/jobs-screen-backend-requirements.md` is extended to cover vendor-side job actions (that doc currently only covers the technician's own job flow, not the vendor's dashboard view of jobs).

---

## 3. Task breakdown (one PR per task, in order)

Numbered `VT#` (Vendor-Technician) to avoid colliding with the jobs-screen doc's `T#`/`FR-*` numbering — these can land independently of that doc's tasks, but VT2 and the jobs-screen doc's T1/T2 should be coordinated (see §2.2).

### Phase 0 — Relationship + scoping
**VT0. `vendor_user_id` migration** — per §2.1. No endpoint changes yet; just the column, index, and model field on `api/models/technician.py`.

**VT1. Interim vendor-identity stub** — per §2.2 (`current_vendor_id()` reading `X-Vendor-Id`). Acceptance: a throwaway `GET /vendor/ping` proves the header round-trips; removed once VT3 lands.

### Phase 1 — Read-only list/detail (milestone: My Team screen off mock data)
**VT2. `GET /vendor/technicians`** — per §2.3. This is the milestone where `MyTeamTab.tsx` can drop `SAMPLE_JOB_DETAILS` and `MOCK_ONJOB_TECHNICIANS` entirely.

**VT3. `GET /vendor/technicians/:id`** — per §2.4, with the explicitly-listed stub fields (`zone`, `partnerId`, `isBgvVerified`, `isCertifiedPartner`, `locationAddress`, `locationUpdatedAgo`) returned as `null` until Phase 2. This is the milestone where `app/technician/[id].tsx` can call the real API instead of `MOCK_TECHNICIAN_DETAILS`.

### Phase 2 — Fields with no backing schema today
**VT4. Zone/service-area assignment** — needs a decision (new table vs. reusing an existing geo concept) before a migration is written; blocks `zone`.

**VT5. Partner ID + BGV/certified-partner tier** — needs product confirmation on what `partnerId` is (generated? assigned by ops?) and how BGV status is sourced (manual admin flag vs. third-party integration) before schema is finalized.

**VT6. Live location tracking table** — per SRS NFR-SEC-004 (30-day retention cap). Needed for `locationAddress`/`locationUpdatedAgo` here and for the Vendor Dashboard's live Map tab (SRS §4.3) — worth scoping once, shared by both.

### Phase 0 (revisited) — Swap in real auth
**VT7 (= deferred VT1/VT2 auth work).** Real OTP+JWT vendor auth, coordinated with the jobs-screen doc's T1/T2 per §2.2. Retires the `X-Vendor-Id` header stub — no other file changes, since every endpoint above already routes through `current_vendor_id()`.

---

Suggested cadence: **VT0 → VT1 → VT2** unblocks the My Team list (the highest-value milestone — it's the vendor dashboard's default tab per SRS §4.1). **VT3** unblocks the detail screen for everything except the four schema-less fields, which sit in Phase 2 pending product decisions. Close with **VT7** before this is exposed anywhere beyond local dev, same caveat the jobs-screen doc gives for technician auth.
