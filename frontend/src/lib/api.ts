export type GenderPreference = "M" | "F";

export interface MatchingQueueItem {
  trip_id: string;
  elderly_id: string;
  elderly_name: string;
  appt_date: string;
  appt_time: string;
  destination: string;
  dialect: string | null;
  weight_kg: number | null;
  gender_preference: GenderPreference | null;
  wheelchair_required: boolean;
}

export interface EscortSuggestion {
  escort_id: string;
  name: string;
  gender: "M" | "F";
  score: number;
  flairs: string[];
}

export interface MatchResult {
  suggestions: EscortSuggestion[];
  warning: string | null;
}

export interface MatchingProfileUpdate {
  dialect: string | null;
  weight_kg: number | null;
  gender_preference: GenderPreference | null;
}

export interface MatchingProfile extends MatchingProfileUpdate {
  elderly_id: string;
}

export interface EscortOption {
  escort_id: string;
  name: string;
  gender: "M" | "F";
  dialects: string[];
  available_days: string[];
  available_timeslot: string;
  wheelchair_handling_capable: boolean;
  issues: string[];
}

export interface TripConfirmation {
  trip_id: string;
  escort_id: string;
  status: "scheduled";
  assignment_override: boolean;
}

export interface TripCancellation {
  trip_id: string;
  status: "accepted";
}

export interface ScheduledTrip extends MatchingQueueItem {
  escort_id: string;
  escort_name: string;
}

interface ApiErrorPayload {
  detail?: string | { message?: string; issues?: string[] };
}

export class ApiError extends Error {
  status: number;
  issues: string[];

  constructor(status: number, payload: ApiErrorPayload | null) {
    const detail = payload?.detail;
    super(
      typeof detail === "string"
        ? detail
        : detail?.message ?? "Something went wrong. Please try again.",
    );
    this.name = "ApiError";
    this.status = status;
    this.issues = typeof detail === "object" ? detail.issues ?? [] : [];
  }
}

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"
).replace(/\/$/, "");

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    let payload: ApiErrorPayload | null = null;
    try {
      payload = (await response.json()) as ApiErrorPayload;
    } catch {
      payload = null;
    }
    throw new ApiError(response.status, payload);
  }

  return (await response.json()) as T;
}

export const getMatchingQueue = () => request<MatchingQueueItem[]>("/matching-queue");

export const getScheduledTrips = () => request<ScheduledTrip[]>("/schedule");

export const getEscortSuggestions = (tripId: string) =>
  request<MatchResult>(`/trips/${tripId}/escort-suggestions?limit=3`);

export const getEscortOptions = (tripId: string) =>
  request<EscortOption[]>(`/trips/${tripId}/escort-options`);

export const updateMatchingProfile = (
  elderlyId: string,
  update: MatchingProfileUpdate,
) =>
  request<MatchingProfile>(`/elderly-clients/${elderlyId}/matching-profile`, {
    method: "PATCH",
    body: JSON.stringify(update),
  });

export const confirmEscort = (
  tripId: string,
  escortId: string,
  overrideReason?: string,
) =>
  request<TripConfirmation>(`/trips/${tripId}/confirm-escort`, {
    method: "POST",
    body: JSON.stringify({
      escort_id: escortId,
      assignment_override: Boolean(overrideReason),
      assignment_override_reason: overrideReason || null,
    }),
  });

export const cancelAssignment = (tripId: string) =>
  request<TripCancellation>(`/trips/${tripId}/cancel-assignment`, {
    method: "POST",
  });
