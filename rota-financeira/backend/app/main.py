from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .core.config import get_settings
from .modules.auth.router import router as auth_router
from .modules.users.router import router as users_router
from .modules.revenues.router import router as revenues_router
from .modules.costs.router import router as costs_router
from .modules.goals.router import router as goals_router
from .modules.reports.router import router as reports_router

settings = get_settings()

app = FastAPI(
    title="Rota Financeira API",
    description="API de planejamento financeiro para motoboys e entregadores de app.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(revenues_router)
app.include_router(costs_router)
app.include_router(goals_router)
app.include_router(reports_router)


@app.get("/", tags=["health"])
def health_check():
    return {"status": "ok", "service": "Rota Financeira API"}
