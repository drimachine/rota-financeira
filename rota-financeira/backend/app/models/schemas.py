from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, Field


# ---------- Auth ----------

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str = Field(min_length=6)


class LoginRequest(BaseModel):
    email: str
    password: str


class LogoutRequest(BaseModel):
    access_token: str
    refresh_token: str


class AuthUser(BaseModel):
    id: str
    email: Optional[str] = None
    user_metadata: dict = {}


class AuthSession(BaseModel):
    access_token: str
    refresh_token: str
    expires_in: Optional[int] = None
    token_type: str = "bearer"
    user: AuthUser


class SignupPending(BaseModel):
    pending_confirmation: bool = True
    message: str


# ---------- Users / Profile ----------

class ProfileOut(BaseModel):
    id: str
    name: Optional[str] = None
    email: Optional[str] = None
    vehicle_type: Optional[str] = None
    city: Optional[str] = None
    created_at: Optional[datetime] = None


class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    vehicle_type: Optional[str] = Field(default=None, description="moto | bike | carro")
    city: Optional[str] = None


# ---------- Revenues ----------

class RevenueCreate(BaseModel):
    amount: float = Field(gt=0)
    platform: str = Field(description="iFood | Keeta | 99 | Outro")
    date: date
    notes: Optional[str] = None


class RevenueOut(RevenueCreate):
    id: str
    user_id: str
    created_at: Optional[datetime] = None


# ---------- Costs ----------

class CostCreate(BaseModel):
    amount: float = Field(gt=0)
    category: str = Field(description="Combustível | Manutenção | Seguro | Alimentação | Outros")
    date: date
    notes: Optional[str] = None


class CostOut(CostCreate):
    id: str
    user_id: str
    created_at: Optional[datetime] = None


# ---------- Goals ----------

class GoalCreate(BaseModel):
    title: str
    target_amount: float = Field(gt=0)
    deadline: Optional[date] = None


class GoalUpdate(BaseModel):
    title: Optional[str] = None
    target_amount: Optional[float] = Field(default=None, gt=0)
    current_amount: Optional[float] = Field(default=None, ge=0)
    deadline: Optional[date] = None


class GoalOut(BaseModel):
    id: str
    user_id: str
    title: str
    target_amount: float
    current_amount: float
    deadline: Optional[date] = None
    created_at: Optional[datetime] = None


# ---------- Reports ----------

class RecentItem(BaseModel):
    id: str
    type: str  # "revenue" | "cost"
    label: str
    amount: float
    date: str


class DashboardSummary(BaseModel):
    net_profit: float
    revenue_total: float
    cost_total: float
    variation_pct: Optional[float] = None
    goal: Optional[GoalOut] = None
    recent: list[RecentItem] = []


class MonthlyPoint(BaseModel):
    month: str
    receita: float
    custo: float


class MonthlyReport(BaseModel):
    revenue_total: float
    cost_total: float
    net_profit: float
    monthly: list[MonthlyPoint]
