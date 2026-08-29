from fastapi import APIRouter, Depends, HTTPException

from ...core.database import get_supabase
from ...core.dependencies import get_current_user, CurrentUser
from .schemas import RevenueCreate, RevenueOut

router = APIRouter(prefix="/revenues", tags=["revenues"])


@router.get("", response_model=list[RevenueOut])
def list_revenues(
    start: str | None = None,
    end: str | None = None,
    user: CurrentUser = Depends(get_current_user),
):
    db = get_supabase()
    query = db.table("revenues").select("*").eq("user_id", user.id).order("date", desc=True)

    if start:
        query = query.gte("date", start)
    if end:
        query = query.lte("date", end)

    result = query.execute()
    return result.data


@router.post("", response_model=RevenueOut, status_code=201)
def create_revenue(payload: RevenueCreate, user: CurrentUser = Depends(get_current_user)):
    db = get_supabase()
    record = {**payload.model_dump(mode="json"), "user_id": user.id}
    result = db.table("revenues").insert(record).execute()
    return result.data[0]


@router.delete("/{revenue_id}", status_code=204)
def delete_revenue(revenue_id: str, user: CurrentUser = Depends(get_current_user)):
    db = get_supabase()
    result = (
        db.table("revenues")
        .delete()
        .eq("id", revenue_id)
        .eq("user_id", user.id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Receita não encontrada.")
    return None
