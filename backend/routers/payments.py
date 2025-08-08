from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import SessionLocal, engine
from models import Base, Beneficiary, Transfer, LedgerEntry
from schemas import BeneficiaryCreate, TransferCreate, TransferStatus
from adapters.stripe import StripeRail
from adapters.wise import WiseRail
from adapters.plaid import PlaidLink
from risk_engine import risk_score
import hashlib, json

router = APIRouter()
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_payment_rail(provider: str):
    if provider == "stripe":
        return StripeRail()
    if provider == "wise":
        return WiseRail()
    raise HTTPException(400, f"Unsupported provider {provider}")

@router.post("/link/start")
def link_start(user_id: int):
    return PlaidLink().start_link(user_id)

@router.post("/beneficiaries")
def create_beneficiary(body: BeneficiaryCreate, db: Session = Depends(get_db)):
    ben = Beneficiary(**body.model_dump())
    db.add(ben)
    db.commit()
    db.refresh(ben)
    return {"id": ben.id, "name": ben.name, "country": ben.country, "kyc_level": ben.kyc_level}

@router.post("/transfers", response_model=TransferStatus)
def create_transfer(body: TransferCreate, db: Session = Depends(get_db), provider: str = "stripe"):
    t = Transfer(**body.model_dump())
    ctx = {
        "amount": float(t.amount or body.amount),
        "tenant_limits": {"high_value": 10000},
        "counterparty_country": "US",
        "created_via_agent": body.created_via_agent,
        "beneficiary": body.beneficiary_id,
        "user_id": body.created_by or 0
    }
    score = risk_score(ctx)
    if score == "BLOCK":
        t.status = "BLOCKED"
        t.risk_score = 100
        db.add(t); db.commit(); db.refresh(t)
        raise HTTPException(403, "Transfer blocked by sanctions/risk policy")
    t.risk_score = score if isinstance(score, int) else 0
    db.add(t); db.commit(); db.refresh(t)

    if (isinstance(score, int) and score < 30):
        rail = get_payment_rail(provider)
        res = rail.create_transfer({
            "amount": body.amount, "currency": body.currency,
            "from_account_id": body.from_account_id, "beneficiary_id": body.beneficiary_id
        })
        t.provider_ref = res.get("provider_ref")
        t.status = "PROCESSING"
        db.commit(); db.refresh(t)

        # ledger append (hash chain)
        prev = db.query(LedgerEntry).order_by(LedgerEntry.id.desc()).first()
        prev_hash = prev.hash if prev else "0"*64
        payload = f"{t.id}:{t.amount}:{t.currency}:{t.status}:{prev_hash}".encode()
        entry = LedgerEntry(transfer_id=t.id, side="debit", amount=t.amount, currency=t.currency,
                            hash=hashlib.sha256(payload).hexdigest(), prev_hash=prev_hash)
        db.add(entry); db.commit()

    else:
        t.status = "REVIEW"; db.commit()

    return TransferStatus(id=t.id, status=t.status, provider_ref=t.provider_ref, risk_score=t.risk_score)

@router.get("/transfers/{id}", response_model=TransferStatus)
def get_transfer(id: int, db: Session = Depends(get_db)):
    t = db.get(Transfer, id)
    if not t: raise HTTPException(404, "Not found")
    return TransferStatus(id=t.id, status=t.status, provider_ref=t.provider_ref, risk_score=t.risk_score)
