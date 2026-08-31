# KakiMETch backend

## Setup

1. Create a local `.env` file using `.env.example` and add the Supabase database password.
2. Install the packages in `requirements.txt` in the selected Python environment.
3. Apply the SQL files in `../supabase/migrations/` through the Supabase SQL Editor, in filename order.
4. Run the demo import from the `backend` directory with `python -m scripts.load_demo_data`.
5. Start the API with `uvicorn app.main:app --reload`.

## API endpoints

- `GET /health`
- `POST /trips/{trip_id}/assessment`
- `GET /trips/{trip_id}/escort-suggestions?limit=3`
- `POST /trips/{trip_id}/confirm-escort`
- `GET /schedule`

## Important notes

- The importer creates initial AIC and LH mobility statuses from wheelchair and walking-frame fields because the demo workbook does not include separate source assessments.
- Re-running the importer updates clients and escorts and avoids creating duplicate trips.
- The backend connects directly to Supabase Postgres. Do not commit the local `.env` file or database password.
- Enable Row Level Security and add authenticated-admin policies before connecting direct Supabase browser CRUD in the frontend.
