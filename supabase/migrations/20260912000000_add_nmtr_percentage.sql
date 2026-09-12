-- Store the NMTR subsidy percentage from the LH master data export as a 0-1 fraction.
alter table public.elderly_clients
    add column nmtr_percentage numeric(5, 4)
        check (nmtr_percentage is null or (nmtr_percentage >= 0 and nmtr_percentage <= 1));
