from functools import lru_cache

import httpx
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError

from .config import get_settings

bearer_scheme = HTTPBearer(auto_error=False)


class CurrentUser:
    def __init__(self, id: str, email: str | None):
        self.id = id
        self.email = email


@lru_cache
def _fetch_jwks() -> dict:
    settings = get_settings()
    response = httpx.get(f"{settings.supabase_url}/auth/v1/.well-known/jwks.json", timeout=5)
    response.raise_for_status()
    return response.json()


def _find_signing_key(kid: str | None) -> dict | None:
    if kid is None:
        return None
    for key in _fetch_jwks().get("keys", []):
        if key.get("kid") == kid:
            return key
    # Chave pode ter sido rotacionada — busca de novo, ignorando o cache.
    _fetch_jwks.cache_clear()
    for key in _fetch_jwks().get("keys", []):
        if key.get("kid") == kid:
            return key
    return None


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
) -> CurrentUser:
    """Valida o JWT emitido pelo Supabase Auth e retorna o usuário atual.

    O frontend envia o access_token da sessão Supabase no header
    Authorization: Bearer <token>. O Supabase assina os tokens com uma
    chave assimétrica (ES256) — validamos com a chave pública exposta
    em {SUPABASE_URL}/auth/v1/.well-known/jwks.json (Project Settings >
    API > JWT Settings), identificada pelo "kid" no header do token.
    """
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de autenticação ausente.",
        )

    try:
        header = jwt.get_unverified_header(credentials.credentials)
        signing_key = _find_signing_key(header.get("kid"))
        if signing_key is None:
            raise JWTError("Chave de assinatura desconhecida.")

        payload = jwt.decode(
            credentials.credentials,
            signing_key,
            algorithms=[signing_key.get("alg", "ES256")],
            audience="authenticated",
        )
    except (JWTError, httpx.HTTPError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido ou expirado.",
        )

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token não contém um usuário válido.",
        )

    return CurrentUser(id=user_id, email=payload.get("email"))
