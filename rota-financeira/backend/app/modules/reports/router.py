from collections import OrderedDict
from datetime import date, datetime

from fastapi import APIRouter, Depends

from ...core.database import get_supabase
from ...core.dependencies import get_current_user, CurrentUser
from ..goals.schemas import GoalOut
from .schemas import DashboardSummary, MonthlyPoint, MonthlyReport, RecentItem

router = APIRouter(prefix="/reports", tags=["reports"])

MONTH_LABELS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]


def _month_key(d: str) -> tuple[int, int]:
    parsed = datetime.strptime(d, "%Y-%m-%d").date()
    return parsed.year, parsed.month


@router.get("/summary", response_model=DashboardSummary)
def get_summary(user: CurrentUser = Depends(get_current_user)):
    db = get_supabase()
    today = date.today()
    month_start = today.replace(day=1).isoformat()

    revenues = (
        db.table("revenues")
        .select("*")
        .eq("user_id", user.id)
        .gte("date", month_start)
        .order("date", desc=True)
        .execute()
        .data
    )
    costs = (
        db.table("costs")
        .select("*")
        .eq("user_id", user.id)
        .gte("date", month_start)
        .order("date", desc=True)
        .execute()
        .data
    )
    goal_result = (
        db.table("goals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", desc=True)
        .limit(1)
        .execute()
    )

    revenue_total = sum(r["amount"] for r in revenues)
    cost_total = sum(c["amount"] for c in costs)
    net_profit = revenue_total - cost_total

    recent_items = [
        RecentItem(id=r["id"], type="revenue", label=r["platform"], amount=r["amount"], date=r["date"])
        for r in revenues[:5]
    ] + [
        RecentItem(id=c["id"], type="cost", label=c["category"], amount=c["amount"], date=c["date"])
        for c in costs[:5]
    ]
    recent_items.sort(key=lambda i: i.date, reverse=True)

    goal = GoalOut(**goal_result.data[0]) if goal_result.data else None

    return DashboardSummary(
        net_profit=net_profit,
        revenue_total=revenue_total,
        cost_total=cost_total,
        variation_pct=None,
        goal=goal,
        recent=recent_items[:5],
    )


@router.get("/monthly", response_model=MonthlyReport)
def get_monthly_report(user: CurrentUser = Depends(get_current_user)):
    db = get_supabase()

    revenues = db.table("revenues").select("amount,date").eq("user_id", user.id).execute().data
    costs = db.table("costs").select("amount,date").eq("user_id", user.id).execute().data

    buckets: "OrderedDict[tuple[int, int], dict]" = OrderedDict()

    def bucket_for(d: str) -> dict:
        key = _month_key(d)
        if key not in buckets:
            buckets[key] = {"receita": 0.0, "custo": 0.0}
        return buckets[key]

    for r in revenues:
        bucket_for(r["date"])["receita"] += r["amount"]
    for c in costs:
        bucket_for(c["date"])["custo"] += c["amount"]

    ordered_keys = sorted(buckets.keys())[-6:]  # últimos 6 meses com movimentação
    monthly = [
        MonthlyPoint(
            month=MONTH_LABELS[month - 1],
            receita=buckets[(year, month)]["receita"],
            custo=buckets[(year, month)]["custo"],
        )
        for year, month in ordered_keys
    ]

    revenue_total = sum(m.receita for m in monthly)
    cost_total = sum(m.custo for m in monthly)

    return MonthlyReport(
        revenue_total=revenue_total,
        cost_total=cost_total,
        net_profit=revenue_total - cost_total,
        monthly=monthly,
    )
