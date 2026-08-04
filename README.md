# Vernex Clinic OS

A role-based clinic management system for Indian clinics: appointments, consultations,
prescriptions, pharmacy, billing, reports and WhatsApp-first patient booking.

Every screen reads and writes **live Supabase data**. There is no mock layer — the
service registry in `frontend/src/services/serviceProvider.ts` points at Supabase
implementations only, and row-level security scopes every query to the signed-in
staff member's clinic.

---

## Stack

| Layer | Choice |
| --- | --- |
| Frontend | React 19, TypeScript, Vite 6, Tailwind CSS 3 |
| Routing | React Router 7 with lazy routes and module guards |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| Backend | Supabase (PostgreSQL, Auth, RLS, RPC) |

---

## Architecture

```
frontend/src/
  services/
    interfaces/        typed service contracts (the backend boundary)
    supabase/          the only implementations — one per domain
    serviceProvider.ts single registry every screen imports
  modules/             feature modules: reception, doctor, pharmacy,
                       billing, whatsapp-booking, patient-booking
  access-control/      role, module and permission guards
  shared/types/        domain types + generated database.types.ts
supabase/
  migrations/          schema, RLS policies and RPCs (phases 1-15)
  seed/demo_seed.sql   demo data, safe to re-run
```

**Access control is enforced twice.** The UI hides what a role cannot use
(`ModuleGuard`, `PermissionGuard`), and PostgreSQL RLS independently rejects
anything the UI might have let through. The database is the authority.

**Patients never log in.** They reach the clinic through WhatsApp or the public
booking link. Patient records are clinical data owned by staff.

---

## Setup

### 1. Environment

```bash
cd frontend
cp .env.example .env
```

Fill in from your Supabase project (Settings → API):

```
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key>
```

`frontend/.env` is git-ignored. Never commit it. The anon key is safe in the
browser precisely because RLS is enforced — do not put the service role key here.

### 2. Database

Apply every migration in `supabase/migrations/` in filename order, either with
the Supabase CLI:

```bash
supabase db push
```

or by pasting each file into the SQL editor. All migrations are idempotent and
safe to re-run.

### 3. Demo data (optional)

Create these users under **Authentication → Users** with *Auto Confirm User*
ticked, all sharing one password:

```
owner@vernex.test        reception@vernex.test    pharmacist@vernex.test
doctor@vernex.test       doctor2@vernex.test      doctor3@vernex.test
super_admin@vernex.test
```

Then run `supabase/seed/demo_seed.sql`. It identifies the demo clinic by its
slug (`vernex-demo-clinic`), adopts an existing one if present, re-dates itself
around today and skips any user you chose not to create. Re-running refreshes
the data rather than duplicating it.

### 4. Run

```bash
cd frontend
npm install
npm run dev     # http://localhost:5173
npm run build   # production build
```

---

## Demo accounts

Sign in with **either the email or the staff ID** — the login screen resolves a
staff ID to its email through the `resolve_staff_login_email` RPC.

| Login | Staff ID | Role | Lands on |
| --- | --- | --- | --- |
| `owner@vernex.test` | `VNX-OWNER-001` | Owner | `/owner/dashboard` |
| `reception@vernex.test` | `VNX-REC-001` | Receptionist | `/reception/dashboard` |
| `doctor@vernex.test` | `VNX-DOC-001` | Doctor · General Medicine | `/doctor/queue` |
| `doctor2@vernex.test` | `VNX-DOC-002` | Doctor · Dental | `/doctor/queue` |
| `doctor3@vernex.test` | `VNX-DOC-003` | Doctor · Dermatology | `/doctor/queue` |
| `pharmacist@vernex.test` | `VNX-PHAR-001` | Pharmacist | `/pharmacy/dashboard` |
| `super_admin@vernex.test` | `VNX-SUPER-002` | Super Admin | `/super-admin/dashboard` |

> Passwords are **not** stored in this repository. You choose them when you
> create the users. These are disposable test accounts — never reuse them, or
> the `@vernex.test` addresses, for anything real.

The public patient page needs no login: `/book/vernex-demo-clinic`.

---

## Modules

**Reception** — dashboard with live queue and today's appointments; appointment
search and filters; booking, rescheduling and cancellation with WhatsApp notice;
walk-in registration; a billing shortcut that records real payments against open
invoices.

**Doctor** — queue with WhatsApp-booking context; consultation capture (symptoms,
vitals, diagnosis, advice, follow-up); prescription builder with clinic medicine
autocomplete, saved templates, learned favourites and lab tests; WhatsApp
delivery and pharmacy routing; follow-up tracking; medicine reminder schedules;
weekly availability and blocked dates.

**Pharmacy** — prescription queue with dispensing; medicine stock with batch,
expiry and low-stock tracking; multi-row purchase entry that creates or tops up
batches and records stock movements; counter billing.

**Billing** — invoice builder driven by the clinic service catalogue; invoices,
receipts, pending payments with reminders; refunds with a request → approve →
process workflow; seven reports with date/doctor/branch filters and CSV export.

**WhatsApp booking** — booking console that walks a patient through department →
doctor → date → slot → details and creates a real appointment with source
`whatsapp`, persisting the conversation; message templates; conversation
tracking; clinic-level settings stored on the clinic record.

**Public booking** — `/book/:clinicSlug` runs unauthenticated through
security-definer RPCs (`public_clinic_doctors`, `public_doctor_available_slots`,
`public_create_booking`, …). Anonymous visitors can browse doctors, services and
open slots and book an appointment, but **cannot read patient, appointment or
billing tables directly** — RLS returns nothing. Booking status lookup requires
both the phone number and the token.

**Owner / Super Admin** — clinic overview with revenue trend, appointment mix,
doctor-wise revenue and low-stock alerts; monitoring (audit, errors, security,
health); clinic, branch, staff and module administration.

---

## Security notes

- RLS is enabled on all tables; policies scope reads and writes to
  `current_clinic_id()` and check per-module permissions.
- The anonymous booking path never touches a table directly — only
  `security definer` RPCs that return a curated payload.
- Slot booking takes a row lock and rejects double-booking.
- Booking status requires phone **and** reference; a matching token alone
  returns nothing.
- WhatsApp sends are recorded in `whatsapp_messages` and
  `whatsapp_delivery_logs` but **no message leaves the system** until an official
  WhatsApp Business API provider is connected. Do not use unofficial WhatsApp
  automation for patient health data.
- Never commit `frontend/.env`, a service role key, or the Supabase CLI
  `.temp/` link state.

---

## Documentation

Phase-by-phase build notes live in [docs/](docs/), including the
[frontend/backend contract](docs/FRONTEND_BACKEND_CONTRACT.md) and the
[Supabase integration guide](docs/SUPABASE_REPLACEMENT_GUIDE.md).
