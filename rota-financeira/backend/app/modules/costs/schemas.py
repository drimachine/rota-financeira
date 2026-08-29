from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, Field


class CostCreate(BaseModel):
    amount: float = Field(gt=0)
    category: str = Field(description="Combustível | Manutenção | Seguro | Alimentação | Outros")
    date: date
    notes: Optional[str] = None


class CostOut(CostCreate):
    id: str
    user_id: str
    created_at: Optional[datetime] = None
