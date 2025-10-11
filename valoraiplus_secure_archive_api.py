import hashlib, sqlite3, time
from ecdsa import VerifyingKey, SECP256k1
from typing import Optional

VALORAIPLUS_BLOCK_0_HASH = "000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f"
VALORAIPLUS_TOKENS = ["GILLGOLD", "GILLBTC", "JAXXTOKEN.SOL", "DONNY_GILLSON_MAIN"]

def valoraiplus_secure_hash(payload):
    return hashlib.sha3_512(payload.encode()).hexdigest()

class valoraiplus_SecureArchiveAPI:
    def __init__(self, gillson_root:str):
        self.gillson_root = gillson_root
        self.conn = sqlite3.connect("valoraiplus_archive.db")
        self._setup_audit_table()

    def _setup_audit_table(self):
        self.conn.execute("""
        CREATE TABLE IF NOT EXISTS valoraiplus_audit_treasury (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_ts_ns INTEGER,
            valoraiplus_asset_type TEXT,
            valoraiplus_blockchain_id TEXT,
            valoraiplus_block_0_hash TEXT,
            valoraiplus_merkle_root TEXT,
            valoraiplus_gillson_root TEXT,
            valoraiplus_txid TEXT,
            valoraiplus_operator TEXT,
            valoraiplus_approval_details TEXT
        )""")
        self.conn.commit()

    def valoraiplus_store_audit(
            self, asset_type, blockchain_id, merkle_root, txid, operator, approval_details):
        event_ts_ns = time.time_ns()
        self.conn.execute("""
            INSERT INTO valoraiplus_audit_treasury (
                event_ts_ns, valoraiplus_asset_type, valoraiplus_blockchain_id,
                valoraiplus_block_0_hash, valoraiplus_merkle_root,
                valoraiplus_gillson_root, valoraiplus_txid, valoraiplus_operator, valoraiplus_approval_details
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (event_ts_ns, asset_type, blockchain_id, VALORAIPLUS_BLOCK_0_HASH,
             merkle_root, self.gillson_root, txid, operator, approval_details))
        self.conn.commit()

    def close(self):
        self.conn.close()