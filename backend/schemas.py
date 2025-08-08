from pydantic import BaseModel, Field
from typing import Optional

class BeneficiaryCreate(BaseModel):
    tenant_id: int
    name: str
    iban: Optional[str] = None
    bank_code: Optional[str] = None
    country: str = "US"
    kyc_level: str = "basic"

class TransferCreate(BaseModel):
    tenant_id: int
    from_account_id: int
    beneficiary_id: int
    amount: float = Field(gt=0)
    currency: str = "USD"
    purpose: str | None = None
    created_by: int | None = None
    created_via_agent: bool = False

class TransferStatus(BaseModel):
    id: int
    status: str
    provider_ref: str | None = None
    risk_score: int | None = None
