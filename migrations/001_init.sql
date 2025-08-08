CREATE TABLE IF NOT EXISTS fi_accounts (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  provider VARCHAR(32) NOT NULL,
  provider_account_id VARCHAR(64),
  holder_name VARCHAR(128),
  currency VARCHAR(8),
  status VARCHAR(32)
);
CREATE TABLE IF NOT EXISTS beneficiaries (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  name VARCHAR(128),
  iban VARCHAR(64),
  bank_code VARCHAR(32),
  country VARCHAR(2),
  kyc_level VARCHAR(16)
);
CREATE TABLE IF NOT EXISTS transfers (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  from_account_id INTEGER REFERENCES fi_accounts(id),
  beneficiary_id INTEGER REFERENCES beneficiaries(id),
  amount NUMERIC(18,2),
  currency VARCHAR(8),
  purpose TEXT,
  status VARCHAR(16),
  provider_ref VARCHAR(64),
  created_by INTEGER,
  created_via_agent BOOLEAN,
  risk_score INTEGER
);
CREATE TABLE IF NOT EXISTS transfer_approvals (
  id SERIAL PRIMARY KEY,
  transfer_id INTEGER REFERENCES transfers(id),
  approver_id INTEGER,
  level INTEGER,
  decision VARCHAR(8),
  reason TEXT,
  ts TIMESTAMP DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS compliance_cases (
  id SERIAL PRIMARY KEY,
  transfer_id INTEGER REFERENCES transfers(id),
  rule_id VARCHAR(64),
  disposition VARCHAR(8),
  notes TEXT,
  ts TIMESTAMP DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS ledger_entries (
  id SERIAL PRIMARY KEY,
  transfer_id INTEGER REFERENCES transfers(id),
  side VARCHAR(8),
  amount NUMERIC(18,2),
  currency VARCHAR(8),
  ts TIMESTAMP DEFAULT NOW(),
  hash VARCHAR(64),
  prev_hash VARCHAR(64)
);
CREATE TABLE IF NOT EXISTS webhook_events (
  id SERIAL PRIMARY KEY,
  provider VARCHAR(32),
  event_type VARCHAR(32),
  payload_json JSONB,
  signature_ok BOOLEAN,
  processed_ts TIMESTAMP
);
