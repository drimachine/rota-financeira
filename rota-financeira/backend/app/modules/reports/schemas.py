from typing import Optional
from pydantic import BaseModel

from ..goals.schemas import GoalOut


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
