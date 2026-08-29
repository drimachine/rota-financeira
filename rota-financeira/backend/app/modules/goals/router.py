from fastapi import APIRouter, Depends, HTTPException

from ...core.database import get_supabase
from ...core.dependencies import get_current_user, CurrentUser
from .schemas import GoalCreate, GoalOut, GoalUpdate

router = APIRouter(prefix="/goals", tags=["goals"])


@router.get("", response_model=list[GoalOut])
def list_goals(user: CurrentUser = Depends(get_current_user)):
    db = get_supabase()
    result = (
        db.table("goals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", desc=True)
        .execute()
    )
    return result.data


@router.post("", response_model=GoalOut, status_code=201)
def create_goal(payload: GoalCreate, user: CurrentUser = Depends(get_current_user)):
    db = get_supabase()
    record = {
        **payload.model_dump(mode="json"),
        "user_id": user.id,
        "current_amount": 0,
    }
    result = db.table("goals").insert(record).execute()
    return result.data[0]


@router.patch("/{goal_id}", response_model=GoalOut)
def update_goal(goal_id: str, payload: GoalUpdate, user: CurrentUser = Depends(get_current_user)):
    db = get_supabase()
    updates = payload.model_dump(mode="json", exclude_unset=True)

    if not updates:
        raise HTTPException(status_code=400, detail="Nenhum campo para atualizar.")

    result = (
        db.table("goals")
        .update(updates)
        .eq("id", goal_id)
        .eq("user_id", user.id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Meta não encontrada.")
    return result.data[0]
