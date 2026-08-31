from datetime import date, time
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, model_validator


class ConfirmEscortRequest(BaseModel):
    escort_id: UUID
    assignment_override: bool = False
    assignment_override_reason: str | None = None

    @model_validator(mode="after")
    def require_override_reason(self) -> "ConfirmEscortRequest":
        if self.assignment_override and not (
            self.assignment_override_reason and self.assignment_override_reason.strip()
        ):
            raise ValueError("Override reason is required when assignment_override is true.")
        return self


class TripConfirmation(BaseModel):
    trip_id: UUID
    escort_id: UUID
    status: Literal["scheduled"]
    assignment_override: bool


class ScheduledTrip(BaseModel):
    trip_id: UUID
    elderly_name: str
    escort_name: str
    appt_date: date
    appt_time: time
    destination: str
