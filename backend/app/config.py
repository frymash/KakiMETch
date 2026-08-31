import os
from pathlib import Path

from dotenv import load_dotenv


# Load only the backend environment file so frontend settings stay separate.
load_dotenv(Path(__file__).resolve().parents[1] / ".env")


def get_database_url() -> str:
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        raise RuntimeError("DATABASE_URL is not set. Add it to backend/.env.")

    return database_url
