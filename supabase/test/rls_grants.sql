-- Run AFTER 002_android_rebuild.sql so all tables/functions exist.
grant usage on schema public to anon, authenticated;
grant select on all tables in schema public to anon;
grant select, insert, update on all tables in schema public to authenticated;
grant execute on all functions in schema public to anon, authenticated;
