from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .routers import auth, users, revenues, costs, goals, reports

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

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(revenues.router)
app.include_router(costs.router)
app.include_router(goals.router)
app.include_router(reports.router)


@app.get("/", tags=["health"])
def health_check():
    return {"status": "ok", "service": "Rota Financeira API"}
