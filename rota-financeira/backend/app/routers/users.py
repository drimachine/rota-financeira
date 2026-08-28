from fastapi import APIRouter, Depends, HTTPException

from ..database import get_supabase
from ..dependencies import get_current_user, CurrentUser
from ..models.schemas import ProfileOut, ProfileUpdate

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=ProfileOut)
def get_my_profile(user: CurrentUser = Depends(get_current_user)):
    db = get_supabase()
    result = db.table("profiles").select("*").eq("id", user.id).maybe_single().execute()

    if not result.data:
        # Primeiro acesso: cria o perfil automaticamente
        new_profile = {"id": user.id, "email": user.email}
        db.table("profiles").insert(new_profile).execute()
        return ProfileOut(**new_profile)

    return ProfileOut(**result.data)


@router.patch("/me", response_model=ProfileOut)
def update_my_profile(payload: ProfileUpdate, user: CurrentUser = Depends(get_current_user)):
    db = get_supabase()
    updates = {k: v for k, v in payload.model_dump(exclude_unset=True).items()}

    if not updates:
        raise HTTPException(status_code=400, detail="Nenhum campo para atualizar.")

    result = (
        db.table("profiles")
        .update(updates)
        .eq("id", user.id)
        .execute()
    )

    if not result.data:
        # Perfil ainda não existe — cria com os dados enviados
        result = db.table("profiles").insert({"id": user.id, "email": user.email, **updates}).execute()

    return ProfileOut(**result.data[0])
