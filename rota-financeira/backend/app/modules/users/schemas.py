from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class ProfileOut(BaseModel):
    id: str
    name: Optional[str] = None
    email: Optional[str] = None
    vehicle_type: Optional[str] = None
    platforms: list[str] = []
    city: Optional[str] = None
    created_at: Optional[datetime] = None


class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    vehicle_type: Optional[str] = Field(default=None, description="moto | bike | carro")
    platforms: Optional[list[str]] = Field(default=None, description="ifood | 99 | keeta")
    city: Optional[str] = None
