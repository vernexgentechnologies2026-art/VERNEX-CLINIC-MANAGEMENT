-- =====================================================================
-- Vernex Clinic OS - demo data seed
-- =====================================================================
-- Run this in the Supabase SQL editor (or psql) AFTER all migrations in
-- supabase/migrations have been applied.
--
-- PREREQUISITE - create these Auth users first
-- -------------------------------------------
-- Supabase Dashboard -> Authentication -> Users -> "Add user"
-- (tick "Auto Confirm User"). Use any password you like, the same one for all:
--
--   owner@vernex.test
--   reception@vernex.test
--   doctor@vernex.test
--   doctor2@vernex.test
--   doctor3@vernex.test
--   pharmacist@vernex.test
--   superadmin@vernex.test
--
-- Any user in that list that does not exist is simply skipped, so you can
-- start with just owner/reception/doctor/pharmacist if you prefer.
--
-- The script is idempotent: running it again refreshes the demo data and
-- re-dates it around today. It only ever touches the demo clinic
-- (slug = 'vernex-demo-clinic') and never deletes data from other clinics.
-- =====================================================================

begin;

-- ---------------------------------------------------------------------
-- 0. Guard: at least one demo Auth user must exist
-- ---------------------------------------------------------------------
do $$
begin
  if not exists (
    select 1 from auth.users
    where lower(email) in ('owner@vernex.test','reception@vernex.test','doctor@vernex.test',
                           'doctor2@vernex.test','doctor3@vernex.test','pharmacist@vernex.test',
                           'superadmin@vernex.test','super_admin@vernex.test')
  ) then
    raise exception using
      message = 'No demo Auth users found.',
      hint = 'Create owner@vernex.test (and the other demo users) under Authentication -> Users with "Auto Confirm User" ticked, then re-run this script.';
  end if;
end $$;

-- ---------------------------------------------------------------------
-- 1. Clinic, branch and enabled modules
-- ---------------------------------------------------------------------
-- The demo clinic is identified by its slug, not by a fixed id: an earlier
-- bootstrap script may already own that slug. Its real id and the main branch id
-- are published as session settings that the rest of this script reads.
do $$
declare
  v_clinic uuid;
  v_branch uuid;
  v_settings jsonb := jsonb_build_object(
    'demo', true,
    'booking_hours', 'Mon–Sat · 9:00 AM–8:00 PM',
    'map_url', 'https://maps.google.com/?q=Indiranagar+Bengaluru',
    'whatsapp', jsonb_build_object(
      'businessNumber', '+91 98765 43210',
      'displayName', 'Vernex Multispeciality Clinic',
      'businessProfileStatus', 'Verified (demo)',
      'clinicMode', 'multi_speciality',
      'enableBooking', true,
      'allowExistingPatientLookup', true,
      'requirePaymentBeforeConfirmation', false,
      'autoCreateAppointment', true,
      'sendReminderBeforeAppointment', true,
      'reminderTiming', '24 hours before',
      'reminderTemplate', 'appointment_reminder',
      'followUpReminder', true,
      'handoffOnStaff', true,
      'handoffAfterFailedAttempts', true,
      'receptionContactDisplay', '+91 98765 43210',
      'apiStatus', 'not_connected',
      'provider', 'meta_cloud_api'
    )
  );
begin
  select id into v_clinic from public.clinics where slug = 'vernex-demo-clinic';

  if v_clinic is null then
    insert into public.clinics (name, slug, clinic_mode, specialty, phone, whatsapp_number, email, address, status, settings)
    values ('Vernex Multispeciality Clinic', 'vernex-demo-clinic', 'multi_speciality',
            'General Medicine · Dental · Dermatology', '+91 98765 43210', '+91 98765 43210',
            'hello@vernexclinic.test', '12, 5th Main Road, Indiranagar, Bengaluru 560038', 'active', v_settings)
    returning id into v_clinic;
  else
    update public.clinics set
      name = 'Vernex Multispeciality Clinic',
      clinic_mode = 'multi_speciality',
      specialty = 'General Medicine · Dental · Dermatology',
      phone = '+91 98765 43210',
      whatsapp_number = '+91 98765 43210',
      email = 'hello@vernexclinic.test',
      address = '12, 5th Main Road, Indiranagar, Bengaluru 560038',
      status = 'active',
      settings = coalesce(settings, '{}'::jsonb) || v_settings
    where id = v_clinic;
  end if;

  -- Reuse the existing main branch if the clinic already has one.
  select id into v_branch from public.branches
  where clinic_id = v_clinic order by is_main desc nulls last, created_at limit 1;

  if v_branch is null then
    insert into public.branches (clinic_id, name, address, phone, is_main, status)
    values (v_clinic, 'Indiranagar (Main)', '12, 5th Main Road, Indiranagar, Bengaluru 560038', '+91 98765 43210', true, 'active')
    returning id into v_branch;
  else
    update public.branches set
      name = 'Indiranagar (Main)',
      address = '12, 5th Main Road, Indiranagar, Bengaluru 560038',
      phone = '+91 98765 43210', is_main = true, status = 'active'
    where id = v_branch;
  end if;

  perform set_config('vernex.clinic_id', v_clinic::text, false);
  perform set_config('vernex.branch_id', v_branch::text, false);
  raise notice 'Demo clinic % / branch %', v_clinic, v_branch;
end $$;

insert into public.clinic_modules (clinic_id, module_key, enabled)
select current_setting('vernex.clinic_id')::uuid, key, true from public.modules
on conflict (clinic_id, module_key) do update set enabled = true;

-- ---------------------------------------------------------------------
-- 2. Staff profiles linked to the Auth users that exist
-- ---------------------------------------------------------------------
do $$
declare
  v_clinic uuid := current_setting('vernex.clinic_id')::uuid;
  v_branch uuid := current_setting('vernex.branch_id')::uuid;
  v_staff record;
  v_auth_id uuid;
begin
  for v_staff in
    select * from (values
      -- Both spellings are listed because different bootstrap scripts used different
      -- addresses for the platform admin. Whichever exists gets the profile.
      ('superadmin@vernex.test',  'super_admin', 'Vernex Platform Admin',  'VNX-SUPER-001', '+91 90000 00001', '{}'::jsonb),
      ('super_admin@vernex.test', 'super_admin', 'Vernex Platform Admin',  'VNX-SUPER-002', '+91 90000 00001', '{}'::jsonb),
      ('owner@vernex.test',      'owner',        'Ananya Krishnan',        'VNX-OWNER-001', '+91 90000 00002', '{}'::jsonb),
      ('reception@vernex.test',  'receptionist', 'Sneha Rao',              'VNX-REC-001',   '+91 90000 00003', '{}'::jsonb),
      ('doctor@vernex.test',     'doctor',       'Dr. Priya Sharma',       'VNX-DOC-001',   '+91 90000 00004', '{"experience_years": 12}'::jsonb),
      ('doctor2@vernex.test',    'doctor',       'Dr. Rohan Mehta',        'VNX-DOC-002',   '+91 90000 00005', '{"experience_years": 9}'::jsonb),
      ('doctor3@vernex.test',    'doctor',       'Dr. Aisha Khan',         'VNX-DOC-003',   '+91 90000 00006', '{"experience_years": 10}'::jsonb),
      ('pharmacist@vernex.test', 'pharmacist',   'Vikram Shetty',          'VNX-PHAR-001',  '+91 90000 00007', '{}'::jsonb)
    ) as t(email, role_key, full_name, user_id, phone, metadata)
  loop
    select id into v_auth_id from auth.users where lower(email) = v_staff.email limit 1;
    continue when v_auth_id is null;

    insert into public.staff_profiles (id, clinic_id, branch_id, role_key, full_name, user_id, email, phone, status, metadata)
    values (
      v_auth_id,
      case when v_staff.role_key = 'super_admin' then null else v_clinic end,
      case when v_staff.role_key = 'super_admin' then null else v_branch end,
      v_staff.role_key, v_staff.full_name, v_staff.user_id, v_staff.email, v_staff.phone, 'active',
      v_staff.metadata || jsonb_build_object('demo', true)
    )
    on conflict (id) do update set
      clinic_id = excluded.clinic_id, branch_id = excluded.branch_id, role_key = excluded.role_key,
      full_name = excluded.full_name, user_id = excluded.user_id, email = excluded.email,
      phone = excluded.phone, status = 'active', metadata = excluded.metadata;

    -- Grant every module and permission the role is entitled to.
    insert into public.staff_modules (staff_id, module_key, enabled)
    select v_auth_id, rm.module_key, rm.enabled
    from public.role_modules rm where rm.role_key = v_staff.role_key
    on conflict (staff_id, module_key) do update set enabled = excluded.enabled;

    insert into public.staff_permissions (staff_id, permission_key, allowed)
    select v_auth_id, rp.permission_key, rp.allowed
    from public.role_permissions rp where rp.role_key = v_staff.role_key
    on conflict (staff_id, permission_key) do update set allowed = excluded.allowed;

    v_auth_id := null;
  end loop;
end $$;

-- ---------------------------------------------------------------------
-- 3. Doctor profiles + weekly availability
-- ---------------------------------------------------------------------
do $$
declare
  v_clinic uuid := current_setting('vernex.clinic_id')::uuid;
  v_branch uuid := current_setting('vernex.branch_id')::uuid;
  v_row record;
  v_staff_id uuid;
  v_doctor_id uuid;
  v_day int;
begin
  for v_row in
    select * from (values
      ('doctor@vernex.test',  'general_medicine', 'General Medicine', 'MBBS, MD',   600::numeric, 15),
      ('doctor2@vernex.test', 'dental',           'Dental Surgeon',   'BDS, MDS',   800::numeric, 20),
      ('doctor3@vernex.test', 'dermatology',      'Dermatology',      'MBBS, DDVL', 900::numeric, 20)
    ) as t(email, department, specialization, qualification, fee, slot_minutes)
  loop
    select sp.id into v_staff_id
    from public.staff_profiles sp
    join auth.users u on u.id = sp.id
    where lower(u.email) = v_row.email and sp.role_key = 'doctor'
    limit 1;
    continue when v_staff_id is null;

    insert into public.doctor_profiles (clinic_id, branch_id, staff_id, department, specialization, qualification, consultation_fee, slot_duration_minutes, max_appointments_per_slot, status)
    values (v_clinic, v_branch, v_staff_id, v_row.department, v_row.specialization, v_row.qualification, v_row.fee, v_row.slot_minutes, 1, 'active')
    on conflict (staff_id) do update set
      department = excluded.department, specialization = excluded.specialization,
      qualification = excluded.qualification, consultation_fee = excluded.consultation_fee,
      slot_duration_minutes = excluded.slot_duration_minutes, status = 'active'
    returning id into v_doctor_id;

    -- Monday to Saturday, 09:00-20:00 with a 13:00-17:00 break.
    delete from public.doctor_availability where doctor_id = v_doctor_id;
    for v_day in 1..6 loop
      insert into public.doctor_availability (clinic_id, branch_id, doctor_id, day_of_week, start_time, end_time, break_start, break_end, is_active)
      values (v_clinic, v_branch, v_doctor_id, v_day, '09:00', '20:00', '13:00', '17:00', true);
    end loop;

    v_staff_id := null;
  end loop;
end $$;

-- ---------------------------------------------------------------------
-- 4. Bookable services and lab tests
-- ---------------------------------------------------------------------
insert into public.clinic_services (clinic_id, name, description, department, duration_minutes, price, tax_rate, sort_order)
values
  (current_setting('vernex.clinic_id')::uuid, 'General Consultation', 'Fever, pain, infection, BP/diabetes review and general concerns.', 'general_medicine', 15, 600, 0, 1),
  (current_setting('vernex.clinic_id')::uuid, 'Dental Checkup', 'Tooth pain, cleaning, dental review and gum concerns.', 'dental', 20, 800, 0, 2),
  (current_setting('vernex.clinic_id')::uuid, 'Skin Consultation', 'Rashes, allergy, acne, skin infection and pigmentation.', 'dermatology', 20, 900, 0, 3),
  (current_setting('vernex.clinic_id')::uuid, 'Hair Consultation', 'Hair fall, dandruff, scalp care and treatment follow-up.', 'dermatology', 20, 1000, 0, 4),
  (current_setting('vernex.clinic_id')::uuid, 'Follow-up Visit', 'Review visit for an ongoing treatment plan.', 'general_medicine', 10, 300, 0, 5),
  (current_setting('vernex.clinic_id')::uuid, 'Dental Scaling', 'Professional cleaning and polishing.', 'dental', 30, 1500, 0, 6)
on conflict (clinic_id, name) do update set
  description = excluded.description, department = excluded.department,
  duration_minutes = excluded.duration_minutes, price = excluded.price, sort_order = excluded.sort_order,
  status = 'active';

insert into public.lab_tests (clinic_id, name, category, price, sort_order)
values
  (current_setting('vernex.clinic_id')::uuid, 'Complete Blood Count (CBC)', 'haematology', 350, 1),
  (current_setting('vernex.clinic_id')::uuid, 'Fasting Blood Sugar', 'biochemistry', 150, 2),
  (current_setting('vernex.clinic_id')::uuid, 'HbA1c', 'biochemistry', 550, 3),
  (current_setting('vernex.clinic_id')::uuid, 'Lipid Profile', 'biochemistry', 700, 4),
  (current_setting('vernex.clinic_id')::uuid, 'Thyroid Profile (T3 T4 TSH)', 'endocrinology', 650, 5),
  (current_setting('vernex.clinic_id')::uuid, 'Vitamin D', 'biochemistry', 1200, 6),
  (current_setting('vernex.clinic_id')::uuid, 'Urine Routine', 'pathology', 250, 7),
  (current_setting('vernex.clinic_id')::uuid, 'Dental X-Ray (IOPA)', 'radiology', 400, 8)
on conflict (clinic_id, name) do update set category = excluded.category, price = excluded.price, status = 'active';

-- ---------------------------------------------------------------------
-- 5. Patients
-- ---------------------------------------------------------------------
insert into public.patients (id, clinic_id, branch_id, patient_code, full_name, phone, whatsapp_number, email, age, gender, blood_group, address, emergency_contact_name, emergency_contact_phone, allergies, existing_conditions, current_medications, medical_history, source, whatsapp_consent, reminder_consent, status, created_at)
values
  ('22222222-2222-4222-8222-000000000001', current_setting('vernex.clinic_id')::uuid, current_setting('vernex.branch_id')::uuid, 'VNX-P-0001', 'Aarav Mehta',      '+919987654120', '+919987654120', 'aarav.mehta@example.test',    34, 'male',   'B+',  '204, Palm Grove, Indiranagar, Bengaluru', 'Riya Mehta',    '+919987654121', 'Penicillin',           'Hypertension',            'Amlodipine 5mg',        'Hypertension under control since 2023.', 'reception', true,  true,  'active', now() - interval '400 days'),
  ('22222222-2222-4222-8222-000000000002', current_setting('vernex.clinic_id')::uuid, current_setting('vernex.branch_id')::uuid, 'VNX-P-0002', 'Meera Krishnan',   '+919845022331', '+919845022331', 'meera.k@example.test',        28, 'female', 'O+',  '7, Lake View Apartments, Bengaluru',      'Suresh Krishnan','+919845022332', 'None known',           'None',                    'None',                  'No significant history.',                'whatsapp',  true,  true,  'active', now() - interval '12 days'),
  ('22222222-2222-4222-8222-000000000003', current_setting('vernex.clinic_id')::uuid, current_setting('vernex.branch_id')::uuid, 'VNX-P-0003', 'Rohan Kapoor',     '+919811147522', '+919811147522', 'rohan.kapoor@example.test',   42, 'male',   'A+',  '15, MG Road, Bengaluru',                  'Nisha Kapoor',  '+919811147523', 'Sulfa drugs',          'Type 2 Diabetes',         'Metformin 500mg',       'Diabetic since 2019, reviewed quarterly.', 'phone',   true,  true,  'active', now() - interval '220 days'),
  ('22222222-2222-4222-8222-000000000004', current_setting('vernex.clinic_id')::uuid, current_setting('vernex.branch_id')::uuid, 'VNX-P-0004', 'Sana Sheikh',      '+919702011884', '+919702011884', 'sana.sheikh@example.test',    31, 'female', 'AB+', '88, Koramangala 5th Block, Bengaluru',    'Imran Sheikh',  '+919702011885', 'Dust, pollen',         'Allergic rhinitis',       'Cetirizine as needed',  'Seasonal allergies.',                    'qr',        true,  false, 'active', now() - interval '90 days'),
  ('22222222-2222-4222-8222-000000000005', current_setting('vernex.clinic_id')::uuid, current_setting('vernex.branch_id')::uuid, 'VNX-P-0005', 'Neha Iyer',        '+919900112233', '+919900112233', 'neha.iyer@example.test',      26, 'female', 'B-',  '42, HSR Layout, Bengaluru',               'Lakshmi Iyer',  '+919900112234', 'None known',           'None',                    'None',                  'First visit.',                           'website',   true,  true,  'active', now() - interval '3 days'),
  ('22222222-2222-4222-8222-000000000006', current_setting('vernex.clinic_id')::uuid, current_setting('vernex.branch_id')::uuid, 'VNX-P-0006', 'Vikram Nair',      '+919845567788', '+919845567788', 'vikram.nair@example.test',    58, 'male',   'O-',  '9, Jayanagar 4th Block, Bengaluru',       'Anita Nair',    '+919845567789', 'Aspirin',              'Hypertension, Arthritis', 'Telmisartan 40mg',      'Reviewed monthly for BP.',               'reception', true,  true,  'active', now() - interval '500 days'),
  ('22222222-2222-4222-8222-000000000007', current_setting('vernex.clinic_id')::uuid, current_setting('vernex.branch_id')::uuid, 'VNX-P-0007', 'Kavya Reddy',      '+919966554433', '+919966554433', 'kavya.reddy@example.test',     8, 'female', 'A-',  '31, Whitefield, Bengaluru',               'Deepa Reddy',   '+919966554434', 'None known',           'None',                    'None',                  'Paediatric patient, routine care.',      'walk_in',   true,  false, 'active', now() - interval '45 days'),
  ('22222222-2222-4222-8222-000000000008', current_setting('vernex.clinic_id')::uuid, current_setting('vernex.branch_id')::uuid, 'VNX-P-0008', 'Imran Qureshi',    '+919723344556', '+919723344556', 'imran.q@example.test',        67, 'male',   'B+',  '5, Frazer Town, Bengaluru',               'Sofia Qureshi', '+919723344557', 'None known',           'Osteoarthritis',          'Calcium + Vitamin D3',  'Senior citizen, mobility support.',      'whatsapp',  true,  true,  'active', now() - interval '150 days'),
  ('22222222-2222-4222-8222-000000000009', current_setting('vernex.clinic_id')::uuid, current_setting('vernex.branch_id')::uuid, 'VNX-P-0009', 'Divya Menon',      '+919656778899', '+919656778899', 'divya.menon@example.test',    35, 'female', 'O+',  '77, Rajajinagar, Bengaluru',              'Arjun Menon',   '+919656778890', 'Latex',                'PCOS',                    'Myo-inositol',          'Under dermatology follow-up.',           'website',   true,  true,  'active', now() - interval '30 days'),
  ('22222222-2222-4222-8222-000000000010', current_setting('vernex.clinic_id')::uuid, current_setting('vernex.branch_id')::uuid, 'VNX-P-0010', 'Arjun Nair',       '+919812233445', '+919812233445', 'arjun.nair@example.test',     29, 'male',   'A+',  '18, Ulsoor, Bengaluru',                   'Maya Nair',     '+919812233446', 'None known',           'None',                    'None',                  'Dental treatment in progress.',          'reception', true,  false, 'active', now() - interval '60 days')
on conflict (id) do update set
  full_name = excluded.full_name, phone = excluded.phone, whatsapp_number = excluded.whatsapp_number,
  email = excluded.email, age = excluded.age, gender = excluded.gender, blood_group = excluded.blood_group,
  address = excluded.address, allergies = excluded.allergies, existing_conditions = excluded.existing_conditions,
  current_medications = excluded.current_medications, medical_history = excluded.medical_history,
  source = excluded.source, status = 'active';

insert into public.patient_notes (clinic_id, patient_id, note, visibility)
values
  (current_setting('vernex.clinic_id')::uuid, '22222222-2222-4222-8222-000000000001', 'Prefers early morning appointments. BP log maintained at home.', 'doctor'),
  (current_setting('vernex.clinic_id')::uuid, '22222222-2222-4222-8222-000000000003', 'Blood sugar trending down since diet change in the last quarter.', 'doctor'),
  (current_setting('vernex.clinic_id')::uuid, '22222222-2222-4222-8222-000000000006', 'Requires wheelchair access. Family member usually accompanies.', 'reception')
on conflict do nothing;

-- ---------------------------------------------------------------------
-- 6. Pharmacy: medicines, purchase entries and stock batches
-- ---------------------------------------------------------------------
insert into public.medicines (id, clinic_id, branch_id, name, generic_name, category, manufacturer, strength, unit, hsn_code, gst_rate, reorder_level, status)
values
  ('33333333-3333-4333-8333-000000000001', current_setting('vernex.clinic_id')::uuid, current_setting('vernex.branch_id')::uuid, 'Paracetamol 650mg',   'Paracetamol',        'general',    'Cipla',      '650mg', 'tablet', '3004', 12, 40, 'active'),
  ('33333333-3333-4333-8333-000000000002', current_setting('vernex.clinic_id')::uuid, current_setting('vernex.branch_id')::uuid, 'Amoxicillin 500mg',   'Amoxicillin',        'antibiotic', 'Sun Pharma', '500mg', 'capsule','3004', 12, 30, 'active'),
  ('33333333-3333-4333-8333-000000000003', current_setting('vernex.clinic_id')::uuid, current_setting('vernex.branch_id')::uuid, 'Cetirizine 10mg',     'Cetirizine',         'general',    'Dr Reddys',  '10mg',  'tablet', '3004', 12, 25, 'active'),
  ('33333333-3333-4333-8333-000000000004', current_setting('vernex.clinic_id')::uuid, current_setting('vernex.branch_id')::uuid, 'Pantoprazole 40mg',   'Pantoprazole',       'general',    'Alkem',      '40mg',  'tablet', '3004', 12, 20, 'active'),
  ('33333333-3333-4333-8333-000000000005', current_setting('vernex.clinic_id')::uuid, current_setting('vernex.branch_id')::uuid, 'Metformin 500mg',     'Metformin',          'general',    'USV',        '500mg', 'tablet', '3004', 12, 40, 'active'),
  ('33333333-3333-4333-8333-000000000006', current_setting('vernex.clinic_id')::uuid, current_setting('vernex.branch_id')::uuid, 'Amlodipine 5mg',      'Amlodipine',         'general',    'Torrent',    '5mg',   'tablet', '3004', 12, 30, 'active'),
  ('33333333-3333-4333-8333-000000000007', current_setting('vernex.clinic_id')::uuid, current_setting('vernex.branch_id')::uuid, 'Chlorhexidine Rinse', 'Chlorhexidine',      'dental',     'ICPA',       '0.2%',  'bottle', '3306', 18, 10, 'active'),
  ('33333333-3333-4333-8333-000000000008', current_setting('vernex.clinic_id')::uuid, current_setting('vernex.branch_id')::uuid, 'Mometasone Cream',    'Mometasone furoate', 'skin',       'Glenmark',   '0.1%',  'tube',   '3004', 12, 15, 'active'),
  ('33333333-3333-4333-8333-000000000009', current_setting('vernex.clinic_id')::uuid, current_setting('vernex.branch_id')::uuid, 'ORS Sachet',          'Oral rehydration',   'pediatric',  'FDC',        '21.8g', 'sachet', '3004',  5, 50, 'active'),
  ('33333333-3333-4333-8333-000000000010', current_setting('vernex.clinic_id')::uuid, current_setting('vernex.branch_id')::uuid, 'Vitamin D3 60K',      'Cholecalciferol',    'supplement', 'Mankind',    '60000IU','sachet','3004', 12, 20, 'active')
on conflict (id) do update set
  name = excluded.name, generic_name = excluded.generic_name, category = excluded.category,
  manufacturer = excluded.manufacturer, reorder_level = excluded.reorder_level, status = 'active';

insert into public.stock_purchases (id, clinic_id, branch_id, supplier_name, supplier_phone, invoice_number, purchase_date, total_amount, notes, status)
values
  ('44444444-4444-4444-8444-000000000001', current_setting('vernex.clinic_id')::uuid, current_setting('vernex.branch_id')::uuid, 'MedSupply Distributors', '+918040001111', 'PUR-2001', current_date - 40, 24850, 'Monthly general stock replenishment.', 'saved'),
  ('44444444-4444-4444-8444-000000000002', current_setting('vernex.clinic_id')::uuid, current_setting('vernex.branch_id')::uuid, 'Karnataka Pharma Agencies', '+918040002222', 'PUR-2002', current_date - 18, 15600, 'Dental and dermatology items.', 'saved'),
  ('44444444-4444-4444-8444-000000000003', current_setting('vernex.clinic_id')::uuid, current_setting('vernex.branch_id')::uuid, 'MedSupply Distributors', '+918040001111', 'PUR-2003', current_date - 5, 9200, 'Top-up for fast moving medicines.', 'saved')
on conflict (id) do update set total_amount = excluded.total_amount, purchase_date = excluded.purchase_date;

-- Batches are deliberately mixed: healthy stock, low stock, expiring soon and expired.
insert into public.medicine_stock_batches (clinic_id, branch_id, medicine_id, purchase_id, batch_no, expiry_date, quantity_available, purchase_price, selling_price, mrp, supplier_name, status)
values
  (current_setting('vernex.clinic_id')::uuid,current_setting('vernex.branch_id')::uuid,'33333333-3333-4333-8333-000000000001','44444444-4444-4444-8444-000000000001','PCM-A21', current_date + 300, 180, 1.80, 2.50, 2.80, 'MedSupply Distributors','active'),
  (current_setting('vernex.clinic_id')::uuid,current_setting('vernex.branch_id')::uuid,'33333333-3333-4333-8333-000000000002','44444444-4444-4444-8444-000000000001','AMX-B07', current_date + 210,  12, 6.40, 9.00, 10.00,'MedSupply Distributors','active'),
  (current_setting('vernex.clinic_id')::uuid,current_setting('vernex.branch_id')::uuid,'33333333-3333-4333-8333-000000000003','44444444-4444-4444-8444-000000000001','CTZ-C13', current_date +  25,  60, 1.10, 2.00, 2.20, 'MedSupply Distributors','active'),
  (current_setting('vernex.clinic_id')::uuid,current_setting('vernex.branch_id')::uuid,'33333333-3333-4333-8333-000000000004','44444444-4444-4444-8444-000000000001','PAN-D04', current_date + 420,  95, 3.20, 5.00, 5.50, 'MedSupply Distributors','active'),
  (current_setting('vernex.clinic_id')::uuid,current_setting('vernex.branch_id')::uuid,'33333333-3333-4333-8333-000000000005','44444444-4444-4444-8444-000000000003','MET-E09', current_date + 365, 140, 1.60, 2.60, 3.00, 'MedSupply Distributors','active'),
  (current_setting('vernex.clinic_id')::uuid,current_setting('vernex.branch_id')::uuid,'33333333-3333-4333-8333-000000000006','44444444-4444-4444-8444-000000000003','AML-F02', current_date + 280,   8, 2.10, 3.50, 4.00, 'MedSupply Distributors','active'),
  (current_setting('vernex.clinic_id')::uuid,current_setting('vernex.branch_id')::uuid,'33333333-3333-4333-8333-000000000007','44444444-4444-4444-8444-000000000002','CHX-G11', current_date + 190,  34, 78.00, 120.00, 135.00,'Karnataka Pharma Agencies','active'),
  (current_setting('vernex.clinic_id')::uuid,current_setting('vernex.branch_id')::uuid,'33333333-3333-4333-8333-000000000008','44444444-4444-4444-8444-000000000002','MOM-H05', current_date +  18,  22, 96.00, 148.00, 165.00,'Karnataka Pharma Agencies','active'),
  (current_setting('vernex.clinic_id')::uuid,current_setting('vernex.branch_id')::uuid,'33333333-3333-4333-8333-000000000009','44444444-4444-4444-8444-000000000001','ORS-I17', current_date + 500, 210, 12.00, 20.00, 22.00,'MedSupply Distributors','active'),
  (current_setting('vernex.clinic_id')::uuid,current_setting('vernex.branch_id')::uuid,'33333333-3333-4333-8333-000000000010','44444444-4444-4444-8444-000000000002','VD3-J08', current_date -  10,  15, 42.00, 68.00, 75.00,'Karnataka Pharma Agencies','expired')
on conflict (medicine_id, batch_no) do update set
  expiry_date = excluded.expiry_date, quantity_available = excluded.quantity_available,
  purchase_price = excluded.purchase_price, selling_price = excluded.selling_price, mrp = excluded.mrp,
  purchase_id = excluded.purchase_id, status = excluded.status;

-- Low-stock alerts are written directly: refresh_low_stock_alerts() requires an
-- authenticated staff session, which the SQL editor does not have.
delete from public.low_stock_alerts where clinic_id = current_setting('vernex.clinic_id')::uuid;
insert into public.low_stock_alerts (clinic_id, branch_id, medicine_id, current_stock, reorder_level, status)
select m.clinic_id,
       current_setting('vernex.branch_id')::uuid,
       m.id,
       coalesce(sum(b.quantity_available) filter (where b.status = 'active'), 0)::int,
       coalesce(m.reorder_level, 0),
       'active'
from public.medicines m
left join public.medicine_stock_batches b on b.medicine_id = m.id and b.clinic_id = m.clinic_id
where m.clinic_id = current_setting('vernex.clinic_id')::uuid and m.status = 'active'
group by m.id, m.clinic_id, m.reorder_level
having coalesce(sum(b.quantity_available) filter (where b.status = 'active'), 0)::int <= coalesce(m.reorder_level, 0)
   and coalesce(m.reorder_level, 0) > 0
on conflict (medicine_id, branch_id, status) do update set
  current_stock = excluded.current_stock, reorder_level = excluded.reorder_level, resolved_at = null;

-- ---------------------------------------------------------------------
-- 7. Prescription templates and doctor favourites
-- ---------------------------------------------------------------------
do $$
declare
  v_clinic uuid := current_setting('vernex.clinic_id')::uuid;
  v_template uuid;
  v_doctor uuid;
begin
  -- Clinic-wide templates (doctor_id null = shared with every doctor).
  delete from public.prescription_templates where clinic_id = v_clinic and doctor_id is null;

  insert into public.prescription_templates (clinic_id, doctor_id, name, description, advice)
  values (v_clinic, null, 'Viral Fever', 'Standard 3 day viral fever plan.', 'Plenty of fluids, rest, return if fever persists beyond 3 days.')
  returning id into v_template;
  insert into public.prescription_template_items (clinic_id, template_id, medicine_name, dosage, frequency, timing, duration, quantity, sort_order)
  values
    (v_clinic, v_template, 'Paracetamol 650mg', '1 tablet', '1-1-1', 'After food', '3 days', '9', 0),
    (v_clinic, v_template, 'Cetirizine 10mg',   '1 tablet', '0-0-1', 'Bedtime',    '3 days', '3', 1),
    (v_clinic, v_template, 'ORS Sachet',        '1 sachet', '1-0-1', 'Anytime',    '3 days', '6', 2);

  insert into public.prescription_templates (clinic_id, doctor_id, name, description, advice)
  values (v_clinic, null, 'Acute Bacterial Infection', 'Five day antibiotic course with gastric cover.', 'Complete the full antibiotic course even if symptoms improve.')
  returning id into v_template;
  insert into public.prescription_template_items (clinic_id, template_id, medicine_name, dosage, frequency, timing, duration, quantity, sort_order)
  values
    (v_clinic, v_template, 'Amoxicillin 500mg',  '1 capsule', '1-0-1', 'After food',    '5 days', '10', 0),
    (v_clinic, v_template, 'Pantoprazole 40mg',  '1 tablet',  '1-0-0', 'Before food',   '5 days', '5',  1),
    (v_clinic, v_template, 'Paracetamol 650mg',  '1 tablet',  '1-0-1', 'After food',    '3 days', '6',  2);

  insert into public.prescription_templates (clinic_id, doctor_id, name, description, advice)
  values (v_clinic, null, 'Diabetes Review', 'Routine quarterly diabetes review.', 'Continue diet and 30 minutes of walking daily. Repeat HbA1c in 3 months.')
  returning id into v_template;
  insert into public.prescription_template_items (clinic_id, template_id, medicine_name, dosage, frequency, timing, duration, quantity, sort_order)
  values
    (v_clinic, v_template, 'Metformin 500mg', '1 tablet', '1-0-1', 'After food', '90 days', '180', 0),
    (v_clinic, v_template, 'Vitamin D3 60K',  '1 sachet', 'Weekly', 'After food', '8 weeks', '8',   1);

  -- Seed each doctor's favourites with the medicines they prescribe most.
  for v_doctor in select id from public.doctor_profiles where clinic_id = v_clinic loop
    insert into public.doctor_favorite_medicines (clinic_id, doctor_id, medicine_name, default_dosage, default_frequency, default_timing, default_duration, usage_count, sort_order)
    values
      (v_clinic, v_doctor, 'Paracetamol 650mg', '1 tablet',  '1-0-1', 'After food',  '3 days', 24, 0),
      (v_clinic, v_doctor, 'Pantoprazole 40mg', '1 tablet',  '1-0-0', 'Before food', '5 days', 17, 1),
      (v_clinic, v_doctor, 'Cetirizine 10mg',   '1 tablet',  '0-0-1', 'Bedtime',     '5 days', 12, 2),
      (v_clinic, v_doctor, 'Amoxicillin 500mg', '1 capsule', '1-0-1', 'After food',  '5 days',  9, 3)
    on conflict do nothing;
  end loop;
end $$;

-- ---------------------------------------------------------------------
-- 8. Appointment slots for the next two weeks
-- ---------------------------------------------------------------------
do $$
declare
  v_doctor uuid;
  v_offset int;
begin
  for v_doctor in select id from public.doctor_profiles where clinic_id = current_setting('vernex.clinic_id')::uuid loop
    for v_offset in 0..13 loop
      perform public.ensure_doctor_slots(v_doctor, current_date + v_offset);
    end loop;
  end loop;
end $$;

-- ---------------------------------------------------------------------
-- 9. Appointments (today's queue + recent history)
-- ---------------------------------------------------------------------
do $$
declare
  v_clinic uuid := current_setting('vernex.clinic_id')::uuid;
  v_branch uuid := current_setting('vernex.branch_id')::uuid;
  v_doc_gm uuid; v_doc_dental uuid; v_doc_derm uuid;
  v_reception uuid;
  v_row record;
  v_doctor uuid;
  v_slot public.appointment_slots;
  v_appointment_id uuid;
  v_token int := 0;
begin
  select id into v_doc_gm     from public.doctor_profiles where clinic_id = v_clinic and department = 'general_medicine' limit 1;
  select id into v_doc_dental from public.doctor_profiles where clinic_id = v_clinic and department = 'dental' limit 1;
  select id into v_doc_derm   from public.doctor_profiles where clinic_id = v_clinic and department = 'dermatology' limit 1;
  select sp.id into v_reception from public.staff_profiles sp where sp.clinic_id = v_clinic and sp.role_key = 'receptionist' limit 1;

  if v_doc_gm is null then
    raise notice 'No doctor profile found - skipping appointment seed.';
    return;
  end if;

  -- Clear previously seeded demo data so re-runs stay clean. Deleting the
  -- appointments cascades to their consultations; prescriptions only lose the
  -- foreign key, so they are removed explicitly (which cascades to pharmacy
  -- orders and medicine reminders).
  delete from public.prescriptions where clinic_id = v_clinic and metadata->>'demo' = 'true';
  delete from public.appointments where clinic_id = v_clinic and metadata->>'demo' = 'true';

  -- Release the slots those appointments were holding.
  update public.appointment_slots s
  set booked_count = 0, status = 'available'
  where s.clinic_id = v_clinic
    and not exists (select 1 from public.appointments a where a.slot_id = s.id);

  for v_row in
    select * from (values
      -- patient,                                    dept,     day offset, status,            source,      problem
      ('22222222-2222-4222-8222-000000000001','general_medicine',  0, 'completed',       'reception', 'Recurring headache and mild fever'),
      ('22222222-2222-4222-8222-000000000002','dermatology',       0, 'in_consultation', 'whatsapp',  'Skin rash on both forearms'),
      ('22222222-2222-4222-8222-000000000003','general_medicine',  0, 'waiting',         'phone',     'Quarterly diabetes review'),
      ('22222222-2222-4222-8222-000000000010','dental',            0, 'arrived',         'walk_in',   'Tooth sensitivity while drinking cold water'),
      ('22222222-2222-4222-8222-000000000005','general_medicine',  0, 'booked',          'website',   'Sore throat and cough for three days'),
      ('22222222-2222-4222-8222-000000000007','general_medicine',  0, 'booked',          'whatsapp',  'Child fever since last night'),
      ('22222222-2222-4222-8222-000000000009','dermatology',       1, 'booked',          'website',   'Hair fall follow-up'),
      ('22222222-2222-4222-8222-000000000006','general_medicine',  1, 'booked',          'reception', 'Monthly blood pressure review'),
      ('22222222-2222-4222-8222-000000000008','dental',            2, 'booked',          'qr',        'Dental scaling appointment'),
      ('22222222-2222-4222-8222-000000000004','dermatology',      -6, 'completed',       'qr',        'Seasonal allergy flare-up'),
      ('22222222-2222-4222-8222-000000000006','general_medicine', -9, 'completed',       'reception', 'Blood pressure review'),
      ('22222222-2222-4222-8222-000000000003','general_medicine',-14, 'completed',       'phone',     'Diabetes review and prescription refill'),
      ('22222222-2222-4222-8222-000000000010','dental',          -20, 'completed',       'walk_in',   'Dental filling'),
      ('22222222-2222-4222-8222-000000000001','general_medicine',-25, 'completed',       'reception', 'Blood pressure and cholesterol review'),
      ('22222222-2222-4222-8222-000000000009','dermatology',      -4, 'cancelled',       'website',   'Rescheduled by patient'),
      ('22222222-2222-4222-8222-000000000007','general_medicine',  -2,'no_show',         'whatsapp',  'Did not attend')
    ) as t(patient_id, dept, day_offset, status, source, problem)
  loop
    v_doctor := case v_row.dept
      when 'dental' then coalesce(v_doc_dental, v_doc_gm)
      when 'dermatology' then coalesce(v_doc_derm, v_doc_gm)
      else v_doc_gm end;

    perform public.ensure_doctor_slots(v_doctor, current_date + v_row.day_offset);

    select * into v_slot
    from public.appointment_slots
    where doctor_id = v_doctor
      and slot_date = current_date + v_row.day_offset
      and booked_count < capacity
      and status = 'available'
    order by start_time
    limit 1;

    continue when v_slot.id is null;

    v_token := v_token + 1;

    insert into public.appointments (clinic_id, branch_id, patient_id, doctor_id, slot_id, token_number,
                                     appointment_date, appointment_time, department, main_problem, source,
                                     status, is_new_patient, created_by, assigned_by, metadata, created_at)
    values (v_clinic, v_branch, v_row.patient_id::uuid, v_doctor, v_slot.id, 'A' || lpad(v_token::text, 3, '0'),
            v_slot.slot_date, v_slot.start_time, v_row.dept, v_row.problem, v_row.source,
            v_row.status, false, v_reception, v_reception,
            jsonb_build_object('demo', true), now() + (v_row.day_offset || ' days')::interval)
    returning id into v_appointment_id;

    update public.appointment_slots
    set booked_count = booked_count + 1,
        status = case when booked_count + 1 >= capacity then 'full' else status end
    where id = v_slot.id;

    insert into public.appointment_status_history (clinic_id, appointment_id, old_status, new_status, changed_by, reason)
    values (v_clinic, v_appointment_id, null, v_row.status, v_reception, 'demo_seed');

    v_slot := null;
  end loop;
end $$;

-- ---------------------------------------------------------------------
-- 10. Consultations, vitals, prescriptions and medicine reminders
-- ---------------------------------------------------------------------
do $$
declare
  v_clinic uuid := current_setting('vernex.clinic_id')::uuid;
  v_branch uuid := current_setting('vernex.branch_id')::uuid;
  v_appointment record;
  v_consultation uuid;
  v_prescription uuid;
  v_doctor_staff uuid;
  v_index int := 0;
  v_diagnosis text;
  v_advice text;
  v_follow_up date;
begin
  for v_appointment in
    select a.*, dp.staff_id
    from public.appointments a
    join public.doctor_profiles dp on dp.id = a.doctor_id
    where a.clinic_id = v_clinic
      and a.metadata->>'demo' = 'true'
      and a.status in ('completed', 'in_consultation')
    order by a.appointment_date
  loop
    v_index := v_index + 1;
    v_doctor_staff := v_appointment.staff_id;

    v_diagnosis := case (v_index % 5)
      when 0 then 'Acute viral pharyngitis'
      when 1 then 'Essential hypertension - controlled'
      when 2 then 'Type 2 diabetes mellitus - review'
      when 3 then 'Allergic contact dermatitis'
      else 'Dental caries with sensitivity' end;

    v_advice := case (v_index % 5)
      when 0 then 'Warm saline gargles, plenty of fluids, rest for 3 days.'
      when 1 then 'Continue current medication. Low salt diet. Home BP log twice weekly.'
      when 2 then 'Continue Metformin. 30 minutes brisk walk daily. Repeat HbA1c in 3 months.'
      when 3 then 'Avoid the suspected allergen. Apply cream twice daily for 2 weeks.'
      else 'Use desensitising toothpaste. Avoid very cold food for 2 weeks.' end;

    v_follow_up := case
      when v_index % 3 = 0 then v_appointment.appointment_date + 7
      when v_index % 3 = 1 then v_appointment.appointment_date + 30
      else null end;

    insert into public.consultations (clinic_id, branch_id, appointment_id, patient_id, doctor_id, symptoms, diagnosis,
                                      clinical_notes, advice, follow_up_date, follow_up_reason, status, created_by,
                                      completed_at, metadata, created_at)
    values (v_clinic, v_branch, v_appointment.id, v_appointment.patient_id, v_appointment.doctor_id,
            v_appointment.main_problem, v_diagnosis,
            'Examination unremarkable apart from the presenting complaint. Vitals stable.',
            v_advice, v_follow_up,
            case when v_follow_up is null then null else 'Review response to treatment' end,
            case when v_appointment.status = 'completed' then 'completed' else 'draft' end,
            v_doctor_staff,
            case when v_appointment.status = 'completed'
                 then (v_appointment.appointment_date + time '10:20')::timestamptz else null end,
            jsonb_build_object('demo', true),
            (v_appointment.appointment_date + time '10:00')::timestamptz)
    returning id into v_consultation;

    insert into public.consultation_vitals (clinic_id, consultation_id, patient_id, height_cm, weight_kg, temperature_c,
                                            blood_pressure, pulse_rate, respiratory_rate, oxygen_saturation, blood_sugar, notes)
    values (v_clinic, v_consultation, v_appointment.patient_id,
            160 + (v_index % 20), 58 + (v_index % 25), 36.6 + ((v_index % 4) * 0.4),
            (110 + (v_index % 20))::text || '/' || (70 + (v_index % 10))::text,
            72 + (v_index % 14), 16 + (v_index % 4), 96 + (v_index % 4),
            (95 + (v_index % 40))::text || ' mg/dL', 'Recorded at check-in.');

    insert into public.consultation_notes (clinic_id, consultation_id, note_type, note, created_by)
    values (v_clinic, v_consultation, 'doctor', 'Patient counselled on the treatment plan and warning signs.', v_doctor_staff);

    -- Only completed consultations get a finalised prescription.
    continue when v_appointment.status <> 'completed';

    insert into public.prescriptions (clinic_id, branch_id, consultation_id, appointment_id, patient_id, doctor_id,
                                      diagnosis_summary, advice, follow_up_date, status, delivery_status, delivery_channel,
                                      send_to_pharmacy, pharmacy_status, created_by, finalized_at, metadata, created_at)
    values (v_clinic, v_branch, v_consultation, v_appointment.id, v_appointment.patient_id, v_appointment.doctor_id,
            v_diagnosis, v_advice, v_follow_up, 'finalized',
            case when v_index % 2 = 0 then 'delivered' else 'sent' end, 'whatsapp',
            true, 'sent_to_pharmacy', v_doctor_staff,
            (v_appointment.appointment_date + time '10:25')::timestamptz,
            jsonb_build_object('demo', true),
            (v_appointment.appointment_date + time '10:25')::timestamptz)
    returning id into v_prescription;

    insert into public.prescription_items (clinic_id, prescription_id, medicine_id, medicine_name, dosage, frequency, timing,
                                           duration, food_instruction, quantity, instructions, sort_order, reminder_enabled,
                                           reminder_frequency, reminder_start_date, reminder_end_date)
    values
      (v_clinic, v_prescription, '33333333-3333-4333-8333-000000000001', 'Paracetamol 650mg', '1 tablet', '1-0-1', 'After food', '3 days', 'after_food', '6', 'Take only if fever is above 100F.', 0, true, 'twice_daily', v_appointment.appointment_date, v_appointment.appointment_date + 3),
      (v_clinic, v_prescription, '33333333-3333-4333-8333-000000000004', 'Pantoprazole 40mg', '1 tablet', '1-0-0', 'Before food', '5 days', 'before_food', '5', 'Take 30 minutes before breakfast.', 1, false, null, null, null);

    insert into public.prescription_delivery_logs (clinic_id, prescription_id, channel, old_status, new_status, message, changed_by)
    values (v_clinic, v_prescription, 'whatsapp', 'queued', 'sent', 'Prescription shared with the patient.', v_doctor_staff);

    -- Active medicine reminders for the two most recent prescriptions.
    if v_appointment.appointment_date >= current_date - 10 then
      insert into public.medicine_reminders (clinic_id, patient_id, prescription_id, medicine_name, dosage, frequency, timing,
                                             start_date, end_date, next_run_at, status, delivery_status, consent_confirmed, created_by, metadata)
      values (v_clinic, v_appointment.patient_id, v_prescription, 'Paracetamol 650mg', '1 tablet', 'twice_daily', 'After food',
              current_date, current_date + 3, (current_date + 1 + time '09:00')::timestamptz,
              'active', 'queued', true, v_doctor_staff, jsonb_build_object('source', 'demo_seed'));
    end if;
  end loop;
end $$;

-- ---------------------------------------------------------------------
-- 11. Pharmacy orders for prescriptions routed to the pharmacy
-- ---------------------------------------------------------------------
-- Written directly rather than through create_pharmacy_order_from_prescription(),
-- which requires an authenticated staff session.
do $$
declare
  v_clinic uuid := current_setting('vernex.clinic_id')::uuid;
  v_prescription record;
  v_pharmacist uuid;
  v_order uuid;
  v_item record;
  v_dispensed boolean;
begin
  select id into v_pharmacist from public.staff_profiles where clinic_id = v_clinic and role_key = 'pharmacist' limit 1;

  for v_prescription in
    select p.* from public.prescriptions p
    where p.clinic_id = v_clinic
      and p.metadata->>'demo' = 'true'
      and p.send_to_pharmacy
      and not exists (select 1 from public.pharmacy_orders o where o.prescription_id = p.id)
    order by p.created_at
  loop
    -- Older prescriptions are already dispensed; the newest stay pending in the queue.
    v_dispensed := v_prescription.created_at < now() - interval '3 days';

    insert into public.pharmacy_orders (clinic_id, branch_id, prescription_id, patient_id, doctor_id, status, total_items,
                                        notes, created_by, dispensed_by, dispensed_at, created_at)
    values (v_clinic, v_prescription.branch_id, v_prescription.id, v_prescription.patient_id, v_prescription.doctor_id,
            case when v_dispensed then 'dispensed' else 'pending' end,
            (select count(*) from public.prescription_items where prescription_id = v_prescription.id),
            'Routed from the doctor prescription.', v_pharmacist,
            case when v_dispensed then v_pharmacist else null end,
            case when v_dispensed then v_prescription.created_at + interval '20 minutes' else null end,
            v_prescription.created_at + interval '5 minutes')
    returning id into v_order;

    for v_item in select * from public.prescription_items where prescription_id = v_prescription.id order by sort_order loop
      insert into public.pharmacy_order_items (clinic_id, pharmacy_order_id, prescription_item_id, medicine_id, medicine_name,
                                               requested_quantity, dispensed_quantity, status, notes)
      values (v_clinic, v_order, v_item.id, v_item.medicine_id, v_item.medicine_name,
              coalesce(nullif(regexp_replace(coalesce(v_item.quantity, '1'), '\D', '', 'g'), '')::int, 1),
              case when v_dispensed then coalesce(nullif(regexp_replace(coalesce(v_item.quantity, '1'), '\D', '', 'g'), '')::int, 1) else 0 end,
              case when v_dispensed then 'dispensed' else 'pending' end,
              v_item.instructions);
    end loop;

    if v_dispensed then
      update public.prescriptions set pharmacy_status = 'dispensed' where id = v_prescription.id;
    else
      update public.prescriptions set pharmacy_status = 'sent_to_pharmacy' where id = v_prescription.id;
    end if;
  end loop;
end $$;

-- ---------------------------------------------------------------------
-- 12. Invoices and collected payments (drives every revenue report)
-- ---------------------------------------------------------------------
do $$
declare
  v_clinic uuid := current_setting('vernex.clinic_id')::uuid;
  v_branch uuid := current_setting('vernex.branch_id')::uuid;
  v_biller uuid;
  v_consultation record;
  v_invoice_id uuid;
  v_invoice_no text;
  v_fee numeric;
  v_paid numeric;
  v_mode text;
  v_index int := 0;
begin
  select sp.id into v_biller from public.staff_profiles sp
  where sp.clinic_id = v_clinic and sp.role_key in ('receptionist','owner') order by sp.role_key limit 1;

  delete from public.invoices where clinic_id = v_clinic and metadata->>'demo' = 'true';

  for v_consultation in
    select c.*, a.appointment_date, dp.consultation_fee
    from public.consultations c
    join public.appointments a on a.id = c.appointment_id
    join public.doctor_profiles dp on dp.id = c.doctor_id
    where c.clinic_id = v_clinic and c.metadata->>'demo' = 'true' and c.status = 'completed'
    order by a.appointment_date
  loop
    v_index := v_index + 1;
    v_fee := coalesce(v_consultation.consultation_fee, 600);

    -- A realistic mix: mostly settled, some partial, one unpaid.
    v_paid := case (v_index % 4)
      when 0 then 0
      when 1 then round(v_fee / 2)
      else v_fee end;

    v_mode := case (v_index % 3) when 0 then 'cash' when 1 then 'upi' else 'card' end;
    v_invoice_no := 'INV-' || to_char(v_consultation.appointment_date, 'YYYYMMDD') || '-' || lpad(v_index::text, 3, '0');

    insert into public.invoices (clinic_id, branch_id, patient_id, appointment_id, consultation_id, invoice_number,
                                 invoice_type, subtotal, discount_amount, tax_amount, total_amount, paid_amount,
                                 balance_amount, payment_status, invoice_status, notes, created_by, metadata, created_at)
    values (v_clinic, v_branch, v_consultation.patient_id, v_consultation.appointment_id, v_consultation.id, v_invoice_no,
            'consultation', v_fee, 0, 0, v_fee, v_paid, v_fee - v_paid,
            case when v_paid = 0 then 'unpaid' when v_paid < v_fee then 'partial' else 'paid' end,
            'issued', 'Consultation charge.', v_biller,
            jsonb_build_object('demo', true),
            (v_consultation.appointment_date + time '11:00')::timestamptz)
    returning id into v_invoice_id;

    insert into public.invoice_items (clinic_id, invoice_id, item_type, description, quantity, unit_price, discount_amount, tax_rate, tax_amount, line_total)
    values (v_clinic, v_invoice_id, 'consultation', 'General Consultation', 1, v_fee, 0, 0, 0, v_fee);

    if v_paid > 0 then
      insert into public.manual_payment_records (clinic_id, branch_id, invoice_id, patient_id, amount, payment_mode, reference_number, payment_note, received_by, received_at)
      values (v_clinic, v_branch, v_invoice_id, v_consultation.patient_id, v_paid, v_mode,
              upper(v_mode) || '-' || lpad(v_index::text, 5, '0'), 'Collected at the front desk.', v_biller,
              (v_consultation.appointment_date + time '11:05')::timestamptz);
    end if;

    insert into public.invoice_status_history (clinic_id, invoice_id, old_status, new_status, old_payment_status, new_payment_status, reason, changed_by)
    values (v_clinic, v_invoice_id, null, 'issued', null,
            case when v_paid = 0 then 'unpaid' when v_paid < v_fee then 'partial' else 'paid' end,
            'demo_seed', v_biller);
  end loop;
end $$;

-- Pharmacy counter sales so the pharmacy revenue tile is not empty.
do $$
declare
  v_clinic uuid := current_setting('vernex.clinic_id')::uuid;
  v_branch uuid := current_setting('vernex.branch_id')::uuid;
  v_biller uuid;
  v_invoice_id uuid;
  v_row record;
begin
  select sp.id into v_biller from public.staff_profiles sp
  where sp.clinic_id = v_clinic and sp.role_key in ('pharmacist','receptionist') order by sp.role_key limit 1;

  for v_row in
    select * from (values
      ('22222222-2222-4222-8222-000000000001', 0, 'Paracetamol 650mg', 10, 2.50, 'cash'),
      ('22222222-2222-4222-8222-000000000003', 0, 'Metformin 500mg',   60, 2.60, 'upi'),
      ('22222222-2222-4222-8222-000000000004', 2, 'Cetirizine 10mg',   15, 2.00, 'upi'),
      ('22222222-2222-4222-8222-000000000010', 5, 'Chlorhexidine Rinse', 2, 120.00, 'card'),
      ('22222222-2222-4222-8222-000000000006', 8, 'Amlodipine 5mg',    30, 3.50, 'cash')
    ) as t(patient_id, days_ago, medicine, qty, rate, mode)
  loop
    v_invoice_id := gen_random_uuid();
    insert into public.invoices (id, clinic_id, branch_id, patient_id, invoice_number, invoice_type, subtotal,
                                 discount_amount, tax_amount, total_amount, paid_amount, balance_amount,
                                 payment_status, invoice_status, notes, created_by, metadata, created_at)
    values (v_invoice_id, v_clinic, v_branch, v_row.patient_id::uuid,
            'PH-' || to_char(current_date - v_row.days_ago, 'YYYYMMDD') || '-' || substr(v_invoice_id::text, 1, 4),
            'pharmacy', v_row.qty * v_row.rate, 0, 0, v_row.qty * v_row.rate, v_row.qty * v_row.rate, 0,
            'paid', 'issued', 'Pharmacy counter sale.', v_biller,
            jsonb_build_object('demo', true),
            (current_date - v_row.days_ago + time '16:30')::timestamptz);

    insert into public.invoice_items (clinic_id, invoice_id, item_type, description, quantity, unit_price, discount_amount, tax_rate, tax_amount, line_total)
    values (v_clinic, v_invoice_id, 'pharmacy', v_row.medicine, v_row.qty, v_row.rate, 0, 0, 0, v_row.qty * v_row.rate);

    insert into public.manual_payment_records (clinic_id, branch_id, invoice_id, patient_id, amount, payment_mode, reference_number, payment_note, received_by, received_at)
    values (v_clinic, v_branch, v_invoice_id, v_row.patient_id::uuid, v_row.qty * v_row.rate, v_row.mode,
            'PH-' || substr(v_invoice_id::text, 1, 6), 'Pharmacy counter.', v_biller,
            (current_date - v_row.days_ago + time '16:31')::timestamptz);
  end loop;
end $$;

-- One refund in each state so the Refunds screen is demonstrable.
do $$
declare
  v_clinic uuid := current_setting('vernex.clinic_id')::uuid;
  v_staff uuid;
  v_invoice record;
  v_index int := 0;
begin
  select sp.id into v_staff from public.staff_profiles sp where sp.clinic_id = v_clinic and sp.role_key = 'owner' limit 1;
  delete from public.invoice_refunds where clinic_id = v_clinic;

  for v_invoice in
    select * from public.invoices
    where clinic_id = v_clinic and payment_status = 'paid' and metadata->>'demo' = 'true'
    order by created_at desc limit 3
  loop
    v_index := v_index + 1;
    insert into public.invoice_refunds (clinic_id, branch_id, invoice_id, patient_id, original_amount, refund_amount,
                                        refund_mode, reason, status, requested_by, approved_by, processed_at)
    values (v_clinic, v_invoice.branch_id, v_invoice.id, v_invoice.patient_id, v_invoice.total_amount,
            round(v_invoice.total_amount / 2), 'upi',
            case v_index when 1 then 'Consultation cancelled after payment.'
                         when 2 then 'Duplicate payment collected at the counter.'
                         else 'Service not delivered as scheduled.' end,
            case v_index when 1 then 'requested' when 2 then 'approved' else 'processed' end,
            v_staff,
            case when v_index = 1 then null else v_staff end,
            case when v_index = 3 then now() - interval '1 day' else null end);
  end loop;
end $$;

-- ---------------------------------------------------------------------
-- 13. WhatsApp templates, conversations and consents
-- ---------------------------------------------------------------------
insert into public.whatsapp_templates (clinic_id, name, category, status, body, variables)
values
  (current_setting('vernex.clinic_id')::uuid, 'Welcome - Multi-speciality', 'booking', 'active',
   'Welcome to {{clinic_name}}. What type of care do you need? Reply with a department name.', '["{{clinic_name}}"]'),
  (current_setting('vernex.clinic_id')::uuid, 'Booking Confirmation', 'booking', 'active',
   'Hello {{patient_name}}, your appointment with {{doctor_name}} is confirmed for {{appointment_date}} at {{appointment_time}}. Token {{token}}.',
   '["{{patient_name}}","{{doctor_name}}","{{appointment_date}}","{{appointment_time}}","{{token}}"]'),
  (current_setting('vernex.clinic_id')::uuid, 'Appointment Reminder', 'reminder', 'active',
   'Reminder: {{patient_name}}, your appointment with {{doctor_name}} is tomorrow at {{appointment_time}}.',
   '["{{patient_name}}","{{doctor_name}}","{{appointment_time}}"]'),
  (current_setting('vernex.clinic_id')::uuid, 'Medicine Reminder', 'reminder', 'active',
   'Hello {{patient_name}}, time to take {{medicine_name}} ({{dosage}}).', '["{{patient_name}}","{{medicine_name}}","{{dosage}}"]'),
  (current_setting('vernex.clinic_id')::uuid, 'Prescription Delivery', 'prescription', 'needs_api_approval',
   'Hello {{patient_name}}, your prescription from {{doctor_name}} is attached.', '["{{patient_name}}","{{doctor_name}}"]'),
  (current_setting('vernex.clinic_id')::uuid, 'Payment Receipt', 'invoice', 'active',
   'Hello {{patient_name}}, we received {{amount}} against bill {{invoice_number}}. Thank you.',
   '["{{patient_name}}","{{amount}}","{{invoice_number}}"]'),
  (current_setting('vernex.clinic_id')::uuid, 'Follow-up Reminder', 'follow_up', 'active',
   'Hello {{patient_name}}, your follow-up with {{doctor_name}} is due on {{follow_up_date}}.',
   '["{{patient_name}}","{{doctor_name}}","{{follow_up_date}}"]'),
  (current_setting('vernex.clinic_id')::uuid, 'Cancellation Notice', 'cancellation', 'draft',
   'Hello {{patient_name}}, your appointment on {{appointment_date}} has been cancelled. Reason: {{reason}}.',
   '["{{patient_name}}","{{appointment_date}}","{{reason}}"]')
on conflict (clinic_id, name) do update set
  category = excluded.category, status = excluded.status, body = excluded.body, variables = excluded.variables;

do $$
declare
  v_clinic uuid := current_setting('vernex.clinic_id')::uuid;
  v_branch uuid := current_setting('vernex.branch_id')::uuid;
  v_conversation uuid;
  v_row record;
  v_message record;
begin
  delete from public.whatsapp_conversations where clinic_id = v_clinic and metadata->>'demo' = 'true';

  for v_row in
    select * from (values
      ('22222222-2222-4222-8222-000000000002', '+919845022331', 'Meera Krishnan',  'appointment_confirmed',    'confirmed',            'Appointment confirmed. Token A002.'),
      ('22222222-2222-4222-8222-000000000007', '+919966554433', 'Kavya Reddy',     'in_progress',              'collect_patient_details','Please share the patient age.'),
      ('22222222-2222-4222-8222-000000000008', '+919723344557', 'Imran Qureshi',   'waiting_for_patient',      'select_slot',           'Please choose a time slot.'),
      ('22222222-2222-4222-8222-000000000009', '+919656778899', 'Divya Menon',     'transferred_to_reception', 'transferred',           'Transferred to reception for a special request.'),
      (null,                                    '+919000011122', 'Unknown caller',  'new',                      'welcome',               'Hi')
    ) as t(patient_id, phone, patient_name, status, step, last_message)
  loop
    insert into public.whatsapp_conversations (clinic_id, branch_id, patient_id, phone_number, status, source, current_step, last_message, metadata)
    values (v_clinic, v_branch, v_row.patient_id::uuid, v_row.phone, v_row.status, 'whatsapp', v_row.step, v_row.last_message,
            jsonb_build_object('demo', true, 'patientName', v_row.patient_name))
    returning id into v_conversation;

    for v_message in
      select * from (values
        (1, 'inbound',  'patient', 'Hi'),
        (2, 'outbound', 'bot',     'Welcome to Vernex Multispeciality Clinic. Reply 1 to book an appointment, 2 to view an appointment, 3 to talk to reception.'),
        (3, 'inbound',  'patient', '1'),
        (4, 'outbound', 'bot',     'Please choose a department: General Medicine, Dental, Dermatology.')
      ) as m(seq, direction, sender, body)
    loop
      insert into public.whatsapp_messages (clinic_id, branch_id, conversation_id, patient_id, phone_number, status, direction,
                                            sender_type, message_type, body, delivery_status, metadata, created_at)
      values (v_clinic, v_branch, v_conversation, v_row.patient_id::uuid, v_row.phone,
              case when v_message.direction = 'inbound' then 'received' else 'delivered' end,
              v_message.direction, v_message.sender, 'text', v_message.body,
              case when v_message.direction = 'inbound' then 'received' else 'delivered' end,
              jsonb_build_object('demo', true), now() - ((10 - v_message.seq) || ' minutes')::interval);
    end loop;

    insert into public.whatsapp_patient_consents (clinic_id, branch_id, patient_id, phone_number, consent_status, consent_source, consented_at)
    values (v_clinic, v_branch, v_row.patient_id::uuid, v_row.phone, 'opted_in', 'patient', now() - interval '2 days')
    on conflict (clinic_id, phone_number) do update set consent_status = 'opted_in';
  end loop;
end $$;

-- ---------------------------------------------------------------------
-- 14. Monitoring samples so the Monitoring screen has rows
-- ---------------------------------------------------------------------
do $$
declare
  v_clinic uuid := current_setting('vernex.clinic_id')::uuid;
  v_actor uuid;
begin
  select id into v_actor from public.staff_profiles where clinic_id = v_clinic and role_key = 'owner' limit 1;

  insert into public.system_health_checks (clinic_id, event_type, status, message, metadata, created_at)
  values
    (v_clinic, 'health_check', 'ok', 'Database reachable.', '{"latency_ms": 42}', now() - interval '2 hours'),
    (v_clinic, 'health_check', 'ok', 'Storage reachable.', '{"latency_ms": 88}', now() - interval '1 hour'),
    (v_clinic, 'health_check', 'degraded', 'WhatsApp provider not connected.', '{"provider": "meta_cloud_api"}', now() - interval '30 minutes');

  insert into public.audit_logs (clinic_id, actor_id, user_id, event_type, entity_type, action, status, severity, message, metadata, created_at)
  values
    (v_clinic, v_actor, v_actor, 'appointment_created', 'appointments', 'create', 'success', 'info', 'Appointment created from reception.', '{"demo": true}', now() - interval '3 hours'),
    (v_clinic, v_actor, v_actor, 'invoice_created', 'invoices', 'create', 'success', 'info', 'Consultation invoice issued.', '{"demo": true}', now() - interval '2 hours'),
    (v_clinic, v_actor, v_actor, 'prescription_created', 'prescriptions', 'create', 'success', 'info', 'Prescription finalised and routed to pharmacy.', '{"demo": true}', now() - interval '1 hour');
exception when others then
  raise notice 'Monitoring seed skipped: %', sqlerrm;
end $$;

-- ---------------------------------------------------------------------
-- 15. Support tickets
-- ---------------------------------------------------------------------
do $$
declare
  v_clinic uuid := current_setting('vernex.clinic_id')::uuid;
  v_owner uuid;
begin
  select id into v_owner from public.staff_profiles where clinic_id = v_clinic and role_key = 'owner' limit 1;
  delete from public.support_tickets where clinic_id = v_clinic;

  insert into public.support_tickets (clinic_id, subject, description, category, priority, status, raised_by)
  values
    (v_clinic, 'WhatsApp provider connection', 'Need help connecting the official WhatsApp Business API.', 'whatsapp', 'high', 'open', v_owner),
    (v_clinic, 'Add a second branch', 'We are opening a Koramangala branch next month.', 'technical', 'normal', 'in_progress', v_owner),
    (v_clinic, 'Invoice numbering format', 'Can invoice numbers include the branch code?', 'billing', 'low', 'resolved', v_owner);
end $$;

commit;

-- ---------------------------------------------------------------------
-- Summary
-- ---------------------------------------------------------------------
select 'clinics' as entity, count(*) from public.clinics where slug = 'vernex-demo-clinic'
union all select 'staff_profiles', count(*) from public.staff_profiles where clinic_id = current_setting('vernex.clinic_id')::uuid
union all select 'doctor_profiles', count(*) from public.doctor_profiles where clinic_id = current_setting('vernex.clinic_id')::uuid
union all select 'clinic_services', count(*) from public.clinic_services where clinic_id = current_setting('vernex.clinic_id')::uuid
union all select 'patients', count(*) from public.patients where clinic_id = current_setting('vernex.clinic_id')::uuid
union all select 'appointment_slots', count(*) from public.appointment_slots where clinic_id = current_setting('vernex.clinic_id')::uuid
union all select 'appointments', count(*) from public.appointments where clinic_id = current_setting('vernex.clinic_id')::uuid
union all select 'consultations', count(*) from public.consultations where clinic_id = current_setting('vernex.clinic_id')::uuid
union all select 'prescriptions', count(*) from public.prescriptions where clinic_id = current_setting('vernex.clinic_id')::uuid
union all select 'pharmacy_orders', count(*) from public.pharmacy_orders where clinic_id = current_setting('vernex.clinic_id')::uuid
union all select 'medicines', count(*) from public.medicines where clinic_id = current_setting('vernex.clinic_id')::uuid
union all select 'stock_batches', count(*) from public.medicine_stock_batches where clinic_id = current_setting('vernex.clinic_id')::uuid
union all select 'invoices', count(*) from public.invoices where clinic_id = current_setting('vernex.clinic_id')::uuid
union all select 'payments', count(*) from public.manual_payment_records where clinic_id = current_setting('vernex.clinic_id')::uuid
union all select 'refunds', count(*) from public.invoice_refunds where clinic_id = current_setting('vernex.clinic_id')::uuid
union all select 'whatsapp_templates', count(*) from public.whatsapp_templates where clinic_id = current_setting('vernex.clinic_id')::uuid
union all select 'whatsapp_conversations', count(*) from public.whatsapp_conversations where clinic_id = current_setting('vernex.clinic_id')::uuid
order by 1;
