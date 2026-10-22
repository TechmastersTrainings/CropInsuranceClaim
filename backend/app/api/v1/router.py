from fastapi import APIRouter
from backend.app.api.v1 import (
    auth,
    farms,
    policies,
    claims,
    telemetry,
    blockchain,
    admin,
    audit
)

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(farms.router)
api_router.include_router(policies.router)
api_router.include_router(claims.router)
api_router.include_router(telemetry.router)
api_router.include_router(blockchain.router)
api_router.include_router(admin.router)
api_router.include_router(audit.router)
