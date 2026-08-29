from typing import Union

from fastapi import APIRouter, HTTPException, status
from gotrue.errors import AuthApiError

from ...core.database import get_supabase_auth
from .schemas import (
    AuthSession,
    AuthUser,
    LoginRequest,
    LogoutRequest,
    SignupPending,
    SignupRequest,
)

router = APIRouter(prefix="/auth", tags=["auth"])

_ERROR_MESSAGES = {
    "user_already_exists": "Este e-mail já está cadastrado.",
    "invalid_credentials": "E-mail ou senha incorretos.",
    "email_not_confirmed": "Confirme seu e-mail antes de entrar.",
    "email_provider_disabled": "Cadastro/login por e-mail está desativado neste projeto.",
    "weak_password": "Senha muito fraca. Escolha uma senha diferente.",
}


def _raise_auth_error(exc: AuthApiError) -> None:
    message = _ERROR_MESSAGES.get(exc.code, exc.message)
    status_code = exc.status if exc.status in (400, 401, 403, 409, 422, 429) else status.HTTP_400_BAD_REQUEST
    raise HTTPException(status_code=status_code, detail=message)


def _to_session(auth_response) -> AuthSession | None:
    session = auth_response.session
    if session is None:
        return None
    return AuthSession(
        access_token=session.access_token,
        refresh_token=session.refresh_token,
        expires_in=session.expires_in,
        user=AuthUser(
            id=auth_response.user.id,
            email=auth_response.user.email,
            user_metadata=auth_response.user.user_metadata or {},
        ),
    )


@router.post("/signup", response_model=Union[AuthSession, SignupPending], status_code=status.HTTP_201_CREATED)
def signup(payload: SignupRequest):
    client = get_supabase_auth()
    try:
        result = client.auth.sign_up(
            {
                "email": payload.email,
                "password": payload.password,
                "options": {"data": {"name": payload.name}},
            }
        )
    except AuthApiError as exc:
        _raise_auth_error(exc)

    session = _to_session(result)
    if session is None:
        return SignupPending(message="Conta criada! Verifique seu e-mail para confirmar o cadastro antes de entrar.")
    return session


@router.post("/login", response_model=AuthSession)
def login(payload: LoginRequest):
    client = get_supabase_auth()
    try:
        result = client.auth.sign_in_with_password({"email": payload.email, "password": payload.password})
    except AuthApiError as exc:
        _raise_auth_error(exc)

    return _to_session(result)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(payload: LogoutRequest):
    client = get_supabase_auth()
    try:
        client.auth.set_session(payload.access_token, payload.refresh_token)
        client.auth.sign_out()
    except AuthApiError:
        pass
