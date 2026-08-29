from typing import Optional
from pydantic import BaseModel, Field


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
