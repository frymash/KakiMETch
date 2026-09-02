from fastapi import APIRouter

from app.api.routes.assessments import router as assessments_router
from app.api.routes.health import router as health_router
from app.api.routes.matches import router as matches_router
from app.api.routes.matching_workspace import router as matching_workspace_router
from app.api.routes.schedule import router as schedule_router
from app.api.routes.trips import router as trips_router

api_router = APIRouter()
api_router.include_router(health_router)
api_router.include_router(assessments_router)
api_router.include_router(matches_router)
api_router.include_router(matching_workspace_router)
api_router.include_router(trips_router)
api_router.include_router(schedule_router)
