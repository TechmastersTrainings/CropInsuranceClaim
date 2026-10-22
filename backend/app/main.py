import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text

from backend.app.core.config import settings
from backend.app.db.base import Base
from backend.app.db.session import engine, get_db, SessionLocal
from backend.app.db.seed_data import seed_database
from backend.app.api.v1.router import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle startup handler: ensures storage directories exist, creates database schema and seeds initial records."""
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    
    # Initialize DB Schema
    Base.metadata.create_all(bind=engine)
    
    # Seed safe demo dataset
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
        
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=(
        "Production-grade API for the AI, IoT & Blockchain-Based Real-Time Crop Insurance "
        "Claim Automation Platform. Implements parametric policy evaluation, in-situ IoT telemetry "
        "ingestion, and Hyperledger Fabric audit ledger anchoring."
    ),
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS configuration
if settings.CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Include API v1 Router
app.include_router(api_router, prefix=settings.API_V1_PREFIX)


@app.get("/", tags=["Root"])
def root_status():
    """Platform root endpoint providing service metadata."""
    return {
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "status": "operational",
        "docs_url": "/docs"
    }


@app.get(f"{settings.API_V1_PREFIX}/health", tags=["Health Diagnostics"])
def health_check(db: Session = Depends(get_db)):
    """Health diagnostic endpoint verifying database connectivity and environment status."""
    db_status = "connected"
    try:
        db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    return {
        "status": "healthy" if db_status == "connected" else "degraded",
        "database": db_status,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "blockchain_channel": settings.FABRIC_CHANNEL_NAME
    }
