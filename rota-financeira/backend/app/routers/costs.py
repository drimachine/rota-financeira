from fastapi import APIRouter, Depends, HTTPException

from ..database import get_supabase
from ..dependencies import get_current_user, CurrentUser
from ..models.schemas import CostCreate, CostOut

router = APIRouter(prefix="/costs", tags=["costs"])


@router.get("", response_model=list[CostOut])
def list_costs(
    start: str | None = None,
    end: str | None = None,
    user: CurrentUser = Depends(get_current_user),
):
    db = get_supabase()
    query = db.table("costs").select("*").eq("user_id", user.id).order("date", desc=True)

    if start:
        query = query.gte("date", start)
    if end:
        query = query.lte("date", end)

    result = query.execute()
    return result.data


@router.post("", response_model=CostOut, status_code=201)
def create_cost(payload: CostCreate, user: CurrentUser = Depends(get_current_user)):
    db = get_supabase()
    record = {**payload.model_dump(mode="json"), "user_id": user.id}
    result = db.table("costs").insert(record).execute()
    return result.data[0]


@router.delete("/{cost_id}", status_code=204)
def delete_cost(cost_id: str, user: CurrentUser = Depends(get_current_user)):
    db = get_supabase()
    result = (
        db.table("costs")
        .delete()
        .eq("id", cost_id)
        .eq("user_id", user.id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Custo não encontrado.")
    return None
