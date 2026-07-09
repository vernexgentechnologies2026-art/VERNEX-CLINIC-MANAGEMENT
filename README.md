# Vernex Clinic OS

Frontend foundation for a role-based clinic operating system. All data and authentication are mocked and isolated for straightforward backend integration later.

## Current Model

- Internal roles: Owner, Receptionist, Doctor, Pharmacist, Super Admin.
- The patient login role and patient portal module have been removed.
- Patients interact through WhatsApp and the optional public booking/QR flow only.
- Patient records remain clinical data used by reception, doctors, billing, pharmacy, appointments, prescriptions, reminders, and WhatsApp conversations.
- Route-level lazy loading and Suspense skeletons keep the initial shell fast and readable.
- Typed mock data, service interfaces, mock implementations, hooks, and access-control helpers now provide the backend replacement boundary.

## Architecture

- Shared domain contracts: `src/shared/types/domain.ts`.
- Central typed mocks: `src/mocks/`.
- Service interfaces: `src/services/interfaces/`.
- Mock implementations: `src/services/mock/`.
- Active service registry: `src/services/serviceProvider.ts`.
- Role/module/permission controls: `src/access-control/`.
- Backend handoff docs: `docs/MOCK_DATA_GUIDE.md`, `docs/FRONTEND_BACKEND_CONTRACT.md`, `docs/SUPABASE_REPLACEMENT_GUIDE.md`.

## Reception

- Reception dashboard with patient search, stats, quick actions, queue preview, upcoming appointments, pending billing, and WhatsApp booking awareness.
- Appointment management with search, doctor/status/source/date filters, add/reschedule/cancel placeholders, and payment/status badges.
- Live queue board, new patient registration, and billing shortcut workflows.

## Doctor

- Doctor queue with WhatsApp appointment badge, department, appointment time, main problem, new/existing patient state, WhatsApp details action, and start consultation action.
- Doctor availability management at `/doctor/availability` for working days, slot duration, breaks, blocked dates, emergency leave, and max appointment limits.
- Patient profile, consultation, prescription, follow-up, and patient reminder workflows.
- Prescription builder includes Save Prescription, Send Prescription to WhatsApp modal, Send to Pharmacy, Print, Enable Medicine Reminders, and Complete Consultation.
- Patient Reminders at `/doctor/patient-reminders` are doctor-controlled WhatsApp reminder placeholders. Patients do not manage reminders in a portal.
- Follow-ups show WhatsApp reminder delivery status, sent date, patient response status, and booking action placeholders.

## WhatsApp Booking

- WhatsApp booking module lives under `src/modules/whatsapp-booking`.
- Simulator supports multi-speciality and single-speciality clinic modes.
- Multi-speciality flow: Hi, department, doctor, date, slot, patient details, problem, summary, confirmation.
- Single-speciality flow: Hi, Book Appointment/View Appointment/Talk to Reception, doctor/date/slot, details, confirmation.
- Confirmed WhatsApp appointment mock data appears in the doctor queue.
- Service placeholders in `src/services/whatsappBooking.service.ts` are typed for later Supabase and official WhatsApp API integration.

## Public Booking

- Public booking remains under `src/modules/patient-booking`.
- `/book/:clinicSlug`, booking flow, success page, and booking status lookup remain available as optional QR/public-link alternatives.
- Doctor, service, and slot selectors use larger mobile-friendly tap targets and clearer selected states.

## Pharmacy And Billing

- Pharmacy dashboard, prescription queue, stock, billing, purchase entry, low-stock, and expiry workflows remain unchanged.
- Billing dashboard, bill creation, invoices, receipts, pending payments, refunds, and reports remain available.

## Phase 9 UI/UX Polish

- Design tokens were standardized for brand, surface, border, muted text, success, warning, danger, and info states.
- Shared UI primitives were polished: Button, Input, Select, Textarea, Modal, Badge, StatusPill, PageHeader, StatsCard, EmptyState.
- New shared helpers were added for LoadingSkeleton, ErrorState, ConfirmationDialog, Tabs, Pagination, FilterBar, and DateRangePicker.
- App shell now supports a collapsible desktop sidebar, mobile drawer, cleaner topbar search, clearer active nav, and accessible tap targets.
- Status colors were expanded across appointments, payments, prescription delivery, medicine reminders, and stock states.
- Reception queue no-show uses a confirmation dialog.
- WhatsApp simulator uses a Vernex-branded chat surface with safer mobile bubble widths and a sticky action area.
- Public booking cards and slot buttons were tightened for mobile/tablet/desktop consistency.
- Modals now support Escape-to-close, descriptions, scrollable content, sticky footers, and near-full-width mobile layout.

## Validation

- `npm run build` passes.
- Strict scans found no patient portal routes or patient portal service imports.
- The broad word "patient" remains in clinical records, patient booking, doctor workflows, billing, pharmacy, and WhatsApp contexts by design.

## Run Locally

```bash
npm install
npm run dev
```

Use any email/password and select Owner, Receptionist, Doctor, Pharmacist, or Super Admin on the demo login page.

## Production Check

```bash
npm run build
npm run preview
```
