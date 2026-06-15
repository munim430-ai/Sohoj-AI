-- Seed two isolated tenants (run as superuser/service-role; bypasses RLS).
insert into organizations (id, name) values
  ('00000000-0000-0000-0000-0000000000aa', 'Org A'),
  ('00000000-0000-0000-0000-0000000000bb', 'Org B');

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000c1', 'u1@a.test'),
  ('00000000-0000-0000-0000-0000000000c2', 'u2@b.test');

insert into organization_members (organization_id, auth_id, email, role) values
  ('00000000-0000-0000-0000-0000000000aa', '00000000-0000-0000-0000-0000000000c1', 'u1@a.test', 'owner'),
  ('00000000-0000-0000-0000-0000000000bb', '00000000-0000-0000-0000-0000000000c2', 'u2@b.test', 'owner');

insert into android_devices (id, organization_id, auth_id, device_label, device_hash, status) values
  ('00000000-0000-0000-0000-0000000000da', '00000000-0000-0000-0000-0000000000aa', '00000000-0000-0000-0000-0000000000c1', 'Device A', 'hashA', 'active'),
  ('00000000-0000-0000-0000-0000000000db', '00000000-0000-0000-0000-0000000000bb', '00000000-0000-0000-0000-0000000000c2', 'Device B', 'hashB', 'active');

insert into bkash_transactions (organization_id, device_id, type, amount, fee, source, dedupe_hash) values
  ('00000000-0000-0000-0000-0000000000aa', '00000000-0000-0000-0000-0000000000da', 'cash_in', 100.00, 0, 'manual_paste', 'seedA'),
  ('00000000-0000-0000-0000-0000000000bb', '00000000-0000-0000-0000-0000000000db', 'cash_in', 200.00, 0, 'manual_paste', 'seedB');
