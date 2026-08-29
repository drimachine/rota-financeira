from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, Field


class RevenueCreate(BaseModel):
    amount: float = Field(gt=0)
    platform: str = Field(description="iFood | Keeta | 99 | Outro")
    date: date
    notes: Optional[str] = None


class RevenueOut(RevenueCreate):
    id: str
    user_id: str
    created_at: Optional[datetime] = None
