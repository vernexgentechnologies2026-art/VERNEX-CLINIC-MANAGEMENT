# Vernex Clinic OS

Phase 1 frontend foundation for a role-based clinic operating system. All data and authentication are mocked and isolated for straightforward backend integration later.

## Phase 2 — Reception Workflow Module

Phase 2 adds a frontend-only, mock-backed reception module under `src/modules/reception`.

- Reception dashboard with patient search, stats, quick actions, live queue preview, upcoming appointments, pending billing, and WhatsApp “Hi” booking preview.
- Appointment management with search, doctor/status/source/date filters, responsive list/card views, add/reschedule/cancel modal placeholders, and payment/status badges.
- Live queue board with waiting, in-consultation, completed, and no-show/cancelled lanes.
- New patient registration form using React Hook Form + Zod validation.
- Billing shortcut UI for pending consultation payments and receipt preview.
- Mock-backed service placeholders live in `src/services/reception.service.ts` for later Supabase replacement.

## Phase 3 — Doctor Workflow Module

Phase 3 adds a frontend-only, mock-backed doctor module under `src/modules/doctor`.

- Doctor queue with clinical stats, readable token cards, patient tags, waiting time, and start consultation actions.
- Patient profile with summary, allergy alert, timeline, past prescriptions, report placeholders, and internal notes.
- Consultation screen with sticky patient summary, complaint capture, vitals, diagnosis, notes, follow-up scheduling, and draft/completion actions.
- Prescription builder with medicine rows, favorites, prescription templates, lab-test suggestions, follow-up/preview areas, and WhatsApp/print/pharmacy placeholders.
- Follow-ups page with search, status filters, reminder status, and follow-up actions.
- Mock-backed service placeholders live in `src/services/doctor.service.ts` for later Supabase replacement.

## Phase 4 — Pharmacy Workflow Module

Phase 4 adds a frontend-only, mock-backed pharmacy module under `src/modules/pharmacy`.

- Pharmacy dashboard with prescription queue, sales stats, low-stock warnings, expiry alerts, and today’s bills.
- Prescription queue with search/filter controls, responsive table/cards, prescription detail modal, stock availability indicators, and billing/dispense placeholders.
- Medicine stock page with inventory filters, medicine table/cards, add/edit medicine modal, and stock adjustment modal.
- Pharmacy billing workflow with prescription-to-bill builder, editable medicine rows, payment status/mode, and bill preview.
- Purchase entry form using React Hook Form + Zod with recent purchase entries.
- Low-stock and expiry-alert pages for reorder and batch-risk workflows.
- Mock-backed service placeholders live in `src/services/pharmacy.service.ts` for later Supabase replacement.

## Phase 5 — Billing & Reports Module

Phase 5 adds a frontend-only, mock-backed billing module under `src/modules/billing`.

- Billing dashboard with revenue stats, payment mode split, recent invoices, pending payments, and top services.
- Create bill workflow with React Hook Form + Zod, editable bill items, payment mode/status, receipt/payment placeholders, and invoice preview.
- Invoice and receipt management with responsive list/card layouts and preview modals.
- Pending payments with record-payment modal and payment link/WhatsApp reminder placeholders.
- Refunds placeholder workflow for requested, processed, rejected, and approved refunds.
- Reports page with revenue, appointments, doctor performance, pharmacy sales, patients, follow-ups, pending payments, charts, filters, and export placeholders.
- Mock-backed service placeholders live in `src/services/billing.service.ts` for later Supabase replacement.

## Phase 6 — Patient Booking Portal Module

Phase 6 adds a frontend-only, mock-backed public booking module under `src/modules/patient-booking`.

- Public clinic booking page for QR/public links with clinic profile, doctors, services, trust badges, WhatsApp preview, and QR awareness card.
- Step-by-step booking flow for doctor, service, date/slot, patient details, and confirmation.
- Patient details form uses React Hook Form + Zod validation.
- Appointment success page with token, booking ID, reminder, WhatsApp, calendar, print/download placeholders.
- Booking status lookup page with mock result and reschedule/cancel/call/WhatsApp placeholders.
- Mock-backed service placeholders live in `src/services/patientBooking.service.ts` for later Supabase replacement.

## Phase 7 — WhatsApp Booking Flow Module

Phase 7 adds a frontend-only, mock-backed internal WhatsApp booking module under `src/modules/whatsapp-booking`.

- WhatsApp booking dashboard with demo/API status, stats, how-it-works flow, recent conversations, chat preview, and template status.
- Booking simulator showing the “Hi” flow from patient greeting through doctor/service/date/slot selection and token confirmation.
- Template management page with template cards, statuses, variables, and editor modal placeholder.
- Conversation management page with filters, responsive conversation list, chat preview modal, booking summary, and handoff/action placeholders.
- Settings page for future WhatsApp Business number, booking flow, reminders, handoff, and official provider API integration.
- Mock-backed service placeholders live in `src/services/whatsappBooking.service.ts` for later Supabase and official WhatsApp provider API replacement.

## Phase 8 - Patient Portal & Follow-up Module

Phase 8 adds a frontend-only, mock-backed mobile-first patient portal module under `src/modules/patient-portal`.

- Patient phone/OTP placeholder login at `/patient/login`.
- Patient dashboard with next appointment, medicine reminders, recent prescription, pending bill, quick actions, and contact placeholders.
- Patient appointment, prescription, bill, follow-up, medicine reminder, profile, and family member pages.
- Prescription and receipt detail modals with print/download/payment/WhatsApp placeholders only.
- Profile edit placeholder uses React Hook Form + Zod validation.
- `/patient/portal` is preserved as an alias and redirects to `/patient/dashboard`.
- Mock-backed service placeholders live in `src/services/patientPortal.service.ts` for later Supabase/auth replacement.

## Run locally

```bash
npm install
npm run dev
```

Use any email/password and select a role on the demo login page. The public booking flow is available at `/book/vernex-dental`.

## Production check

```bash
npm run build
npm run preview
```
