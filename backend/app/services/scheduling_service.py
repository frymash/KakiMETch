from collections.abc import Mapping
from uuid import UUID

from app.database import get_connection
from app.schemas.trip import ConfirmEscortRequest, ScheduledTrip, TripConfirmation
from app.services.matching_service import get_hard_filter_issues


class TripNotFoundError(Exception):
    pass


class ConfirmationNotAllowedError(Exception):
    pass


class EscortNotFoundError(Exception):
    pass


class AssignmentOverrideRequiredError(Exception):
    def __init__(self, issues: list[str]) -> None:
        self.issues = issues


def confirm_escort(
    trip_id: UUID,
    request: ConfirmEscortRequest,
) -> TripConfirmation:
    """Confirm an admin-selected escort after a final, transaction-safe conflict check."""
    with get_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                select
                    trips.appt_date,
                    trips.appt_time,
                    trips.status,
                    elderly_clients.wheelchair_required
                from public.trips
                join public.elderly_clients on elderly_clients.id = trips.elderly_id
                where trips.id = %s
                for update of trips
                """,
                (trip_id,),
            )
            trip = cursor.fetchone()
            if trip is None:
                raise TripNotFoundError
            if trip["status"] != "accepted":
                raise ConfirmationNotAllowedError

            # Locking this row makes concurrent confirmations for the same escort run in order.
            cursor.execute(
                """
                select
                    escorts.id,
                    escorts.available_days,
                    escorts.available_timeslot,
                    escorts.wheelchair_handling_capable,
                    exists (
                        select 1
                        from public.trips assigned_trips
                        where assigned_trips.escort_id = escorts.id
                          and assigned_trips.appt_date = %s
                          and assigned_trips.appt_time = %s
                          and assigned_trips.status = 'scheduled'
                          and assigned_trips.id <> %s
                    ) as has_conflict
                from public.escorts as escorts
                where escorts.id = %s
                for update
                """,
                (trip["appt_date"], trip["appt_time"], trip_id, request.escort_id),
            )
            escort = cursor.fetchone()
            if escort is None:
                raise EscortNotFoundError

            issues = get_hard_filter_issues(
                trip,
                trip["appt_date"],
                trip["appt_time"],
                escort,
            )
            if issues and not request.assignment_override:
                raise AssignmentOverrideRequiredError(issues)

            cursor.execute(
                """
                update public.trips
                set
                    escort_id = %s,
                    status = 'scheduled',
                    assignment_override = %s,
                    assignment_override_reason = %s,
                    confirmed_at = now(),
                    updated_at = now()
                where id = %s
                """,
                (
                    request.escort_id,
                    request.assignment_override,
                    request.assignment_override_reason,
                    trip_id,
                ),
            )

    return TripConfirmation(
        trip_id=trip_id,
        escort_id=request.escort_id,
        status="scheduled",
        assignment_override=request.assignment_override,
    )


def get_scheduled_trips() -> list[ScheduledTrip]:
    with get_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                select
                    trips.id as trip_id,
                    elderly_clients.name as elderly_name,
                    escorts.name as escort_name,
                    trips.appt_date,
                    trips.appt_time,
                    trips.destination
                from public.trips
                join public.elderly_clients on elderly_clients.id = trips.elderly_id
                join public.escorts on escorts.id = trips.escort_id
                where trips.status = 'scheduled'
                order by trips.appt_date, trips.appt_time, elderly_clients.name
                """
            )
            trips: list[Mapping[str, object]] = cursor.fetchall()

    return [ScheduledTrip.model_validate(trip) for trip in trips]
