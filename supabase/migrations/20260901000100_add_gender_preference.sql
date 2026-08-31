-- Store an explicit escort gender preference separately from the client's own gender.
alter table public.elderly_clients
    add column gender_preference char(1) check (gender_preference in ('M', 'F'));
