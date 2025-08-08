from sqlalchemy import Column, Integer, String, Numeric, Boolean, ForeignKey, Text, TIMESTAMP
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from db import Base

class FIAccount(Base):
    __tablename__ = "fi_accounts"
    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, nullable=False)
    provider = Column(String(32), nullable=False)
    provider_account_id = Column(String(64))
    holder_name = Column(String(128))
    currency = Column(String(8))
    status = Column(String(32))

class Beneficiary(Base):
    __tablename__ = "beneficiaries"
    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, nullable=False)
    name = Column(String(128))
    iban = Column(String(64))
    bank_code = Column(String(32))
    country = Column(String(2))
    kyc_level = Column(String(16))

class Transfer(Base):
    __tablename__ = "transfers"
    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, nullable=False)
    from_account_id = Column(Integer, ForeignKey("fi_accounts.id"))
    beneficiary_id = Column(Integer, ForeignKey("beneficiaries.id"))
    amount = Column(Numeric(18,2))
    currency = Column(String(8))
    purpose = Column(Text)
    status = Column(String(16), default="PENDING")
    provider_ref = Column(String(64))
    created_by = Column(Integer)
    created_via_agent = Column(Boolean, default=False)
    risk_score = Column(Integer)

class TransferApproval(Base):
    __tablename__ = "transfer_approvals"
    id = Column(Integer, primary_key=True)
    transfer_id = Column(Integer, ForeignKey("transfers.id"))
    approver_id = Column(Integer)
    level = Column(Integer)
    decision = Column(String(8))
    reason = Column(Text)
    ts = Column(TIMESTAMP(timezone=True), server_default=func.now())

class ComplianceCase(Base):
    __tablename__ = "compliance_cases"
    id = Column(Integer, primary_key=True)
    transfer_id = Column(Integer, ForeignKey("transfers.id"))
    rule_id = Column(String(64))
    disposition = Column(String(8))
    notes = Column(Text)
    ts = Column(TIMESTAMP(timezone=True), server_default=func.now())

class LedgerEntry(Base):
    __tablename__ = "ledger_entries"
    id = Column(Integer, primary_key=True)
    transfer_id = Column(Integer, ForeignKey("transfers.id"))
    side = Column(String(8))
    amount = Column(Numeric(18,2))
    currency = Column(String(8))
    ts = Column(TIMESTAMP(timezone=True), server_default=func.now())
    hash = Column(String(64))
    prev_hash = Column(String(64))

class WebhookEvent(Base):
    __tablename__ = "webhook_events"
    id = Column(Integer, primary_key=True)
    provider = Column(String(32))
    event_type = Column(String(32))
    payload_json = Column(Text)
    signature_ok = Column(Boolean)
    processed_ts = Column(TIMESTAMP(timezone=True))
