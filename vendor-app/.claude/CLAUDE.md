# CLAUDE.md

> Project context for AI-assisted development. Keep this file lean.
> See @README.md for full project overview.

---

## Project

**ZepNest Vendor App** — Expo Router (file-based routing) React Native app with TypeScript. Vendor-facing counterpart to the ZepNest customer app (`lk-app`), sharing the same tech stack and conventions.

**Status:** actively built out. Vendor dashboard (jobs, my team, earnings) and the technician job-lifecycle flow (accept/decline, en-route/arrived/in-progress/completed, before/after photo capture, work summary, customer OTP close-out) are live against the real backend — see `BOOKING_FLOW_IMPLEMENTATION_PLAN.md` at the repo root of `/home/zadmin/Personal` for the cross-repo status. Business logic lives in `src/` (see Architecture below), not just `app/` and `lib/apiClient.ts`.

**Key tech:** Expo SDK 56 · Expo Router · Zustand · TypeScript (strict) · NativeWind 4 · Zod · @rn-primitives/* · lucide-react-native

**SRS reference:** Before making any change related to vendor-app screens/data, or any related backend API work (`/home/zadmin/Personal/zepnest-api/python-graphql-api`), read `Zepnest_Partner_App_Phase1_SRS.docx.pdf` at the repo root — it's the authoritative Phase 1 Software Requirements Specification (roles, screens, functional requirements, flows) for the Vendor + Technician partner app. Treat it as the source of truth for intended product behavior. `docs/*-backend-requirements.md` are supplementary backend gap-analyses derived from it per screen (currently: Jobs screen, My Team screen) — check for one before starting backend-facing work on a given screen, and add one if it doesn't exist yet.

**Run commands:**

```bash
npm run dev             # Expo dev server (Expo Go / dev client)
npm run android         # native Android build (android/ is committed)
npm run ios             # native iOS build (macOS only, run prebuild first)
npx tsc --noEmit        # type check
npm run lint            # ESLint
npm run format          # Prettier write
```

---

## Architecture

```
app/          # Routes only — no business logic. File name = route path.
lib/
  apiClient.ts  # fetch wrapper — injects auth token from expo-secure-store, JSON-only
  utils.ts      # pure utility functions (e.g. formatRupees)
src/
  screens/      # Screen components rendered by app/ routes, one subfolder per flow
  components/   # Feature-scoped UI components (modals, cards, badges)
  services/     # API call logic, one file per domain (jobs, technicianDashboard, ...)
  store/        # Zustand stores, one file per domain
  types/        # Shared TypeScript types
  theme/        # Design tokens (colors.ts) — never hardcode hex outside this file
  data/         # Static/mock data and predefined constants
assets/       # Icons, splash images
android/      # Native Android project (generated via expo prebuild, committed)
```

**Canonical locations (no duplicates):**

- Types → `src/types/`
- Service logic → `src/services/`
- State → `src/store/`
- Design tokens → `src/theme/colors.ts`

---

## Code Principles

**Apply to all new and touched code. Do not rewrite files outside the current task.**

- **Single responsibility:** Route files in `app/` orchestrate only — no business logic or styles. Components call store actions; store actions call services; services call `lib/apiClient.ts`. Components never call the API client directly.
- **DRY:** extract logic used in more than one place into `lib/utils/` or a shared hook.
- **Composition over inheritance.** New components take all dynamic content via props/store — no hard-coded data.
- If a component exceeds ~150 lines, split it.

---

## Styling

- Use NativeWind `className` props. **Do not write `StyleSheet.create` blocks.**
- Design tokens (colors) are defined as CSS variables in `global.css` and consumed via `tailwind.config.js` (e.g. `bg-background`, `text-foreground`, `bg-primary`). Use these tokens instead of hard-coded hex values.
- `cva` (class-variance-authority) + `clsx`/`tailwind-merge` are available for variant-based component styling.

---

## What NOT to do

- Do not commit `.env` — `EXPO_PUBLIC_API_URL` is read from a local, gitignored `.env` (see README).
- Do not add `StyleSheet.create` to new or modified components.
- Do not bypass `lib/apiClient.ts` for JSON network calls (raw `fetch` is expected only for direct-to-S3 presigned-URL uploads, which must not carry Zepnest auth/app headers).
- Do not lower `minSdkVersion` (currently `24` in `android/build.gradle`) without confirming with the team.
- Do not make sweeping refactors when only a small change was requested.
- Do not invent product features, screens, or API endpoints without checking the Partner App SRS and `docs/*-backend-requirements.md` first — this app has real, non-trivial product scope; check with the user before expanding it further.
