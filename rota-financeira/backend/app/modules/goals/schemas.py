from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, Field


class GoalCreate(BaseModel):
    title: str
    target_amount: float = Field(gt=0)
    deadline: Optional[date] = None


class GoalUpdate(BaseModel):
    title: Optional[str] = None
    target_amount: Optional[float] = Field(default=None, gt=0)
    current_amount: Optional[float] = Field(default=None, ge=0)
    deadline: Optional[date] = None


class GoalOut(BaseModel):
    id: str
    user_id: str
    title: str
    target_amount: float
    current_amount: float
    deadline: Optional[date] = None
    created_at: Optional[datetime] = None
