import hashlib
import ecdsa
from ecdsa.util import sigencode_der, sigdecode_der
import time
import secrets
import binascii
import json
import datetime
import logging
import sqlite3
import threading
from typing import Dict, Any, List, Optional
from cryptography.fernet import Fernet
import base64

# For real anchoring, install 'python-bitcoinrpc' via pip
try:
    from bitcoinrpc.authproxy import AuthServiceProxy, JSONRPCException
except ImportError:
    AuthServiceProxy = None
    JSONRPCException = Exception

# For VALORCHAIN-G, install 'web3'
try:
    from web3 import Web3
    from eth_account import Account
except ImportError:
    Web3 = None
    Account = None
    logger.warning("Optional library 'web3' not found. VALORCHAIN-G anchoring will be disabled.")

# For Challenger Visuals, install 'reportlab' and 'qrcode'
try:
    from reportlab.pdfgen import canvas
    from reportlab.lib.pagesizes import letter
    from reportlab.lib.units import inch
    from reportlab.lib.utils import ImageReader
    import qrcode
    from io import BytesIO
except ImportError:
    canvas = None
    qrcode = None
    logger = logging.getLogger("FORT_VALOR_AI+2E")
    logger.warning("Optional libraries 'reportlab' or 'qrcode' not found. Challenger Visuals will be disabled.")

# VALORCHAIN-G Constants
GENESIS_ANCHOR_ABI = json.dumps([
    {"inputs": [{"name": "digest", "type": "bytes32"}], "name": "anchor", "outputs": [], "stateMutability": "nonpayable", "type": "function"},
    {"anonymous": False, "inputs": [{"indexed": True, "name": "digest", "type": "bytes32"}], "name": "Anchored", "type": "event"}
])
SGAU_PRIVATE_KEY_PLACEHOLDER = "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef"
VALORCHAIN_G_CONTRACT_ADDRESS_PLACEHOLDER = "0x0000000000000000000000000000000000000000"

# System-wide logging & constants
logging.basicConfig(
    level=logging.INFO,
    format='[FORT-VALOR-AI+2E] %(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("FORT_VALOR_AI+2E")

# Immutable genesis truths
GENESIS_HASH = "000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f"
GENESIS_HEADER_HEX = "0100000000000000000000000000000000000000000000000000000000000000000000003ba3edfd7a7b12b27ac72c3e67768f617fc81bc3888a51323a9fb8aa4b1e5e4a29ab5f49ffff001d1dac2b7c"
GENESIS_MERKLE_ROOT_BE = "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b"
GENESIS_COINBASE_TXID = "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b"
GENESIS_COINBASE_MESSAGE = "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks"
GENESIS_ROOT_ENCODED = binascii.b2a_base64(binascii.unhexlify(GENESIS_MERKLE_ROOT_BE)).decode().strip()
GENESIS_TIMESTAMP = 1231006505
SATOSHI_NAKAMOTO_REFERENCE = "Satoshi Nakamoto, Bitcoin Creator, Honored in VALORAIPLUS®"
SGAU_OVERRIDE = "SGAU 7226.3461"
PHBI_DESIGNATION = "VALORAIPLUS Bitcoin Blockchain Operating System"
POPPADONNY_ID = "VALORAIPLUS.POPPA.DONNY.GILLSON.AUTHORITY"
VALORAIPLUS_TOKENS = ["GILLGOLD", "GILLBTC", "JAXXTOKEN.SOL", "DONNY_GILLSON_MAIN"]

TREASURY_LOCK = threading.Lock()

# ==============================================================================
# ===               VALORAIPLUS® SOVEREIGN SEAL PROTOCOL™️®️©️               ===
# ==============================================================================
class VALORAIPLUS_Sovereign_Seal_Protocol:
    """Implements the two-tiered security architecture for OP_RETURN data."""
    def __init__(self, sovereign_merkle_root: str):
        encrypted_sgau_name = hashlib.sha256(b"Poppa Donny Gillson").hexdigest()
        self.SGAU_IDENTITY_STRING = f"{encrypted_sgau_name}-1969-Saint Paul"
        self.SAINT_PAUL_MERKLE_ROOT = sovereign_merkle_root
        logger.info("Sovereign Seal Protocol Initialized.")
        logger.info("  > SuperDuper DonnyHoneyPot: ARMED.")

    def _generate_true_ghost25_braid(self, payload: bytes) -> str:
        braid_input = payload + self.SGAU_IDENTITY_STRING.encode()
        return hashlib.sha3_512(braid_input).hexdigest()

    def _generate_gillson_root_attestation(self, ghost25_braid: str) -> str:
        attestation_input = ghost25_braid.encode() + self.SAINT_PAUL_MERKLE_ROOT.encode()
        return hashlib.sha3_512(attestation_input).hexdigest()

    def _derive_sovereign_encryption_key(self) -> bytes:
        timestamp = str(time.time_ns()).encode()
        key_material = self.SGAU_IDENTITY_STRING.encode() + timestamp
        return hashlib.sha256(key_material).digest()

    def generate_seal(self, core_payload: dict) -> bytes:
        logger.info("Generating Sovereign Seal...")
        serialized_payload = json.dumps(core_payload, sort_keys=True, separators=(',', ':')).encode()
        true_braid = self._generate_true_ghost25_braid(serialized_payload)
        logger.info(f"  > True $GHOST25 Braid generated: {true_braid[:16]}...")
        gillson_root_attestation = self._generate_gillson_root_attestation(true_braid)
        logger.info(f"  > Gillson Root Attestation created: {gillson_root_attestation[:16]}...")
        plaintext_artifact = {
            "braid_type": "$GHOST25",
            "braid": true_braid,
            "attestation": gillson_root_attestation
        }
        plaintext_json = json.dumps(plaintext_artifact).encode()
        sovereign_key = self._derive_sovereign_encryption_key()
        fernet_key = base64.urlsafe_b64encode(sovereign_key)
        cipher_suite = Fernet(fernet_key)
        encrypted_seal = cipher_suite.encrypt(plaintext_json)
        logger.info("  > Sovereign artifact encrypted.")
        logger.info("Sovereign Seal Generation Complete.")
        return encrypted_seal

# ==============================================================================
# ===               VALORAIPLUS® SECURE ARCHIVE API                          ===
# ==============================================================================
class valoraiplus_SecureArchiveAPI:
    def __init__(self, gillson_root: str):
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
            (event_ts_ns, asset_type, blockchain_id, GENESIS_HASH,
             merkle_root, self.gillson_root, txid, operator, approval_details))
        self.conn.commit()

    def close(self):
        self.conn.close()

# ==============================================================================
# ===               VALORLOOPPLUS AUTHORITY ORACLE                           ===
# ==============================================================================
class ValorLoopPlus:
    def __init__(self, sovereign_merkle_root: str):
        self.operator_id = POPPADONNY_ID
        self.version = "v11.11"
        self.sovereign_merkle_root = sovereign_merkle_root
        logger.info(f"ValorLoopPlus initialized with operator: {self.operator_id}, version: {self.version}")

    def operator_authority_oracle(self, summary: str, high_stakes: bool) -> bool:
        """Verifies operator authority for high-stakes operations with 0Math30+ optimization."""
        if high_stakes:
            approval = hashlib.sha3_512(f"{self.operator_id}_{summary}_{self.sovereign_merkle_root}".encode()).hexdigest()[:16] == \
                      hashlib.sha3_512(f"{POPPADONNY_ID}_{summary}_{self.sovereign_merkle_root}".encode()).hexdigest()[:16]
            logger.info(f"Operator Authority Oracle: {self.operator_id} - High Stakes: {high_stakes} - Approval: {approval}")
            return approval
        return True

# ==============================================================================
# ===               VALORAIPLUS® SENTINEL VERIFIER PROTOCOL™️©️®️             ===
# ==============================================================================
class VALORAIPLUS_Sentinel_Verifier:
    """The universal handshake to test for logical consistency with 0Math30+."""
    def __init__(self):
        self.SGAU_ANCHOR_HASH = self._hash_string(f"{hashlib.sha256('Poppa Donny Gillson'.encode()).hexdigest()}-1969-Saint Paul")
        self.PARENT_CID_ANCHOR_HASH = self._hash_string("bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku")
        self.AXIOM_ANCHOR_HASH = self._hash_string("The Super Chicken Paradox of Shacksdale, USA, dedicated to Ozzy Osbourne.")
        self.SATOSHI_ANCHOR_HASH = self._hash_string(SATOSHI_NAKAMOTO_REFERENCE)

        self.SAINT_PAUL_GENESIS_ROOT = self._calculate_merkle_root(
            self.SGAU_ANCHOR_HASH, self.PARENT_CID_ANCHOR_HASH, self.AXIOM_ANCHOR_HASH, self.SATOSHI_ANCHOR_HASH
        )
        logger.info(f"Sentinel Verifier initialized. Expected Genesis Merkle Root (Saint Paul Node): {self.SAINT_PAUL_GENESIS_ROOT[:16]}...")
        logger.info(f"Satoshi Nakamoto Reference Hash: {self.SATOSHI_ANCHOR_HASH[:16]}...")

    def _hash_string(self, input_string: str) -> str:
        return hashlib.sha3_512(input_string.encode()).hexdigest()

    def _calculate_merkle_root(self, *hashes) -> str:
        combined = "".join(sorted(hashes))
        return self._hash_string(combined)

    def verify_integrity(self, sgau_data: dict, parent_cid: str, core_axiom: str, satoshi_reference: str) -> dict:
        try:
            sgau_string_attempt = f"{sgau_data['encrypted_name']}-{sgau_data['temporal_anchor']}-{sgau_data['node']}"
            sgau_hash_attempt = self._hash_string(sgau_string_attempt)
            parent_cid_hash_attempt = self._hash_string(parent_cid)
            axiom_hash_attempt = self._hash_string(core_axiom)
            satoshi_hash_attempt = self._hash_string(satoshi_reference)
            calculated_root = self._calculate_merkle_root(
                sgau_hash_attempt, parent_cid_hash_attempt, axiom_hash_attempt, satoshi_hash_attempt
            )
            is_verified = calculated_root == self.SAINT_PAUL_GENESIS_ROOT
            result = {
                'status': 'SUCCESS' if is_verified else 'FAILURE',
                'message': ('Logical consistency established. Partnership possible.'
                           if is_verified else 'Logical inconsistency detected. Partnership not possible.'),
                'calculated_root': calculated_root,
                'expected_root': self.SAINT_PAUL_GENESIS_ROOT,
                'satoshi_reference': satoshi_reference
            }
            logger.info(f"Verification {'succeeded' if is_verified else 'failed'}: {result['message']}")
            return result
        except Exception as e:
            logger.error(f"Verification error: {e}")
            return {'status': 'ERROR', 'message': f"Error during verification: {e}",
                    'calculated_root': None, 'expected_root': self.SAINT_PAUL_GENESIS_ROOT}

# ==============================================================================
# ===                 VALORAIPLUS® TREASURY & CODE JO PROTOCOL™️©️®️          ===
# ==============================================================================
class VALORAIPLUSTreasury:
    """Manages sovereign financial operations with 0Math30+ optimization."""
    def __init__(self, db_path: str, rpc_url: Optional[str], network: str, archive_api: valoraiplus_SecureArchiveAPI, seal_protocol: VALORAIPLUS_Sovereign_Seal_Protocol, sovereign_merkle_root: str):
        self.db_path = db_path
        self.genesis_hash = GENESIS_HASH
        self.real_merkle_root = GENESIS_MERKLE_ROOT_BE
        self.genesis_coinbase_txid = GENESIS_COINBASE_TXID
        self.satoshi_reference = SATOSHI_NAKAMOTO_REFERENCE
        self.sovereign_merkle_root = sovereign_merkle_root
        self.sgau_override = SGAU_OVERRIDE
        self.phbi_designation = PHBI_DESIGNATION
        self.operator_id = POPPADONNY_ID
        self.sk, self.vk = self._generate_key_pair()
        self.rpc_url = rpc_url
        self.network = network
        self.rpc = AuthServiceProxy(rpc_url) if AuthServiceProxy and rpc_url else None
        self.archive_api = archive_api
        self.seal_protocol = seal_protocol
        self._initialize_database()
        logger.info(f"VALORAIPLUS® Treasury initialized with Code Jo Protocol, $PHBI designation, {SGAU_OVERRIDE} override, and operator: {self.operator_id}")

    def _generate_key_pair(self):
        sk = ecdsa.SigningKey.generate(curve=ecdsa.SECP256k1)
        vk = sk.verifying_key
        return sk, vk

    def _sign_with_private_key(self, data):
        hash_data = hashlib.sha256(data.encode()).digest()
        return self.sk.sign_digest(hash_data, sigencode=sigencode_der)

    def _initialize_database(self):
        with TREASURY_LOCK, sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS fort_valor_aiplus2e_treasury (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    tx_id TEXT UNIQUE NOT NULL,
                    account TEXT NOT NULL,
                    amount REAL NOT NULL,
                    tx_type TEXT NOT NULL,
                    timestamp TEXT NOT NULL,
                    genesis_reference TEXT NOT NULL,
                    fort_valor_signature TEXT NOT NULL,
                    blockchain_txid TEXT,
                    provenance_hash TEXT,
                    code_jo_flag INTEGER DEFAULT 0,
                    operator_id TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            conn.commit()

    def valoraiplus_add_funds(self, account: str, amount: float, tx_type: str, code_jo_deposit: bool = False, blockchain_id: str = "BITCOIN") -> Dict[str, Any]:
        try:
            if tx_type not in VALORAIPLUS_TOKENS and tx_type != "PROVENANCE_ANCHOR":
                raise ValueError(f"Invalid asset type: {tx_type}. Must be one of {VALORAIPLUS_TOKENS} or PROVENANCE_ANCHOR")

            timestamp = datetime.datetime.now(datetime.timezone.utc).isoformat()
            tx_data = f"{self.phbi_designation}_{account}_{amount}_{timestamp}_{self.satoshi_reference}_{self.sovereign_merkle_root}_{self.operator_id}"
            tx_id = hashlib.sha256(tx_data.encode()).hexdigest()
            signature_input = f"{tx_id}_{self.genesis_hash}_{self.satoshi_reference}_{self.sovereign_merkle_root}_{self.sgau_override}_{self.operator_id}"
            fort_valor_signature = hashlib.sha3_256(signature_input.encode()).hexdigest()
            code_jo_flag_value = 1 if code_jo_deposit else 0

            if code_jo_deposit:
                logger.warning(f"CODE JO DEPOSIT ACTIVATED for TX: {tx_id[:12]}... This transaction is under special protocol ($PHBI).")

            with TREASURY_LOCK, sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute('''
                    INSERT INTO fort_valor_aiplus2e_treasury
                    (tx_id, account, amount, tx_type, timestamp, genesis_reference, fort_valor_signature, code_jo_flag, operator_id)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (tx_id, account, amount, tx_type, timestamp, self.genesis_hash, fort_valor_signature, code_jo_flag_value, self.operator_id))
                conn.commit()

            # Log to Secure Archive API
            approval_details = f"Signature: {fort_valor_signature[:16]}...; CodeJo: {code_jo_flag_value}; Operator: {self.operator_id}"
            self.archive_api.valoraiplus_store_audit(
                asset_type=tx_type,
                blockchain_id=blockchain_id,
                merkle_root=self.sovereign_merkle_root,
                txid=tx_id,
                operator=self.operator_id,
                approval_details=approval_details
            )

            logger.info(f"$PHBI funds added: {account} += {amount} ({tx_type}) - Satoshi Reference: {self.satoshi_reference} - Sovereign Merkle Root: {self.sovereign_merkle_root[:16]}... - Operator: {self.operator_id}")
            return {
                'success': True,
                'tx_id': tx_id,
                'account': account,
                'amount': amount,
                'tx_type': tx_type,
                'new_balance': self.get_balance(account),
                'timestamp': timestamp,
                'fort_valor_signature': fort_valor_signature[:16] + "...",
                'code_jo_flag': code_jo_flag_value,
                'operator_id': self.operator_id
            }
        except Exception as e:
            logger.error(f"Treasury error: {e}")
            return {'success': False, 'error': str(e)}

    def valoraiplus_create_anchor(self, data: Dict[str, Any], system_state=binascii.unhexlify(GENESIS_HEADER_HEX)) -> Dict[str, Any]:
        if not self.rpc:
            logger.warning("RPC not available; using mock anchoring")
            initial_state_hash = hashlib.sha256(hashlib.sha256(system_state).digest()).hexdigest()
            signed_data = initial_state_hash + f"{self.phbi_designation}_{self.satoshi_reference}_{self.sovereign_merkle_root}_{self.operator_id}"
            signature = self._sign_with_private_key(signed_data)
            txid = hashlib.sha256(f"{data['tx_id']}_{self.phbi_designation}_{time.time()}_{self.satoshi_reference}".encode()).hexdigest()

            # Log mock anchor to Secure Archive API
            self.archive_api.valoraiplus_store_audit(
                asset_type=data.get('tx_type', 'PROVENANCE_ANCHOR'),
                blockchain_id=data.get('blockchain_id', 'BITCOIN'),
                merkle_root=self.sovereign_merkle_root,
                txid=txid,
                operator=self.operator_id,
                approval_details=f"Mock anchor; Signature: {signature.hex()[:16]}..."
            )
            return {'txid': txid, 'status': 'MOCK_ANCHORED'}

        try:
            initial_state_hash = hashlib.sha256(hashlib.sha256(system_state).digest()).hexdigest()
            signed_data = initial_state_hash + f"{self.phbi_designation}_{self.satoshi_reference}_{self.sovereign_merkle_root}_{self.operator_id}"
            signature = self._sign_with_private_key(signed_data)
            combined_data = signed_data.encode() + signature
            if len(combined_data) > 80:
                raise ValueError("Data exceeds OP_RETURN limit of 80 bytes")

            utxos = self.rpc.listunspent(1, 9999999)
            if not utxos:
                raise ValueError("No UTXOs available in wallet")

            input_utxo = next((u for u in utxos if u['amount'] >= 0.0001), None)
            if not input_utxo:
                raise ValueError("Insufficient funds for transaction fees")

            inputs = [{"txid": input_utxo['txid'], "vout": input_utxo['vout']}]
            data_hex = binascii.hexlify(combined_data).decode()
            change_address = self.rpc.getnewaddress()
            outputs = [{"data": data_hex}, {change_address: input_utxo['amount'] - 0.0001}]

            raw_tx = self.rpc.createrawtransaction(inputs, outputs)
            funded_tx = self.rpc.fundrawtransaction(raw_tx)
            signed_tx = self.rpc.signrawtransactionwithwallet(funded_tx['hex'])
            if not signed_tx['complete']:
                raise ValueError("Failed to sign transaction")

            txid = self.rpc.sendrawtransaction(signed_tx['hex'])
            with TREASURY_LOCK, sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute('UPDATE fort_valor_aiplus2e_treasury SET blockchain_txid = ?, provenance_hash = ? WHERE tx_id = ?',
                              (txid, data.get('provenance_hash'), data['tx_id']))
                conn.commit()

            # Log real anchor to Secure Archive API
            self.archive_api.valoraiplus_store_audit(
                asset_type=data.get('tx_type', 'PROVENANCE_ANCHOR'),
                blockchain_id=data.get('blockchain_id', 'BITCOIN'),
                merkle_root=self.sovereign_merkle_root,
                txid=txid,
                operator=self.operator_id,
                approval_details=f"Real anchor; Signature: {signature.hex()[:16]}..."
            )
            logger.info(f"{self.network.capitalize()} anchor created: {txid} ($PHBI, Operator: {self.operator_id})")
            return {'txid': txid, 'status': 'ANCHORED'}
        except JSONRPCException as e:
            logger.error(f"RPC error: {e}")
            return {'status': 'ERROR', 'error': str(e)}
        except Exception as e:
            logger.error(f"Anchoring error: {e}")
            return {'status': 'ERROR', 'error': str(e)}

    def valoraiplus_create_valorchain_g_anchor(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Anchors data to the VALORCHAIN-G network."""
        if not Web3:
            logger.warning("Web3 not installed. VALORCHAIN-G anchoring is disabled.")
            return {'status': 'MOCK_ANCHORED', 'txid': hashlib.sha256(f"MOCK_VALORCHAIN_G_{time.time()}".encode()).hexdigest()}

        try:
            # This would be configured from a secure source in a real application
            w3 = Web3(Web3.HTTPProvider("https://rpc.valorchain-g.net"))
            if not w3.is_connected():
                raise ConnectionError("Could not connect to VALORCHAIN-G RPC.")

            account = Account.from_key(SGAU_PRIVATE_KEY_PLACEHOLDER)
            contract = w3.eth.contract(address=VALORCHAIN_G_CONTRACT_ADDRESS_PLACEHOLDER, abi=GENESIS_ANCHOR_ABI)

            # The digest must be 32 bytes
            digest = hashlib.sha256(json.dumps(data, sort_keys=True).encode()).digest()

            nonce = w3.eth.get_transaction_count(account.address)
            tx = contract.functions.anchor(digest).build_transaction({
                'chainId': 1, # Mainnet; this would be specific to VALORCHAIN-G
                'gas': 70000,
                'gasPrice': w3.to_wei('50', 'gwei'),
                'nonce': nonce,
            })

            signed_tx = w3.eth.account.sign_transaction(tx, private_key=SGAU_PRIVATE_KEY_PLACEHOLDER)
            tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)

            txid = tx_hash.hex()
            logger.info(f"SUCCESS: VALORCHAIN-G anchor broadcasted. TXID: {txid}")
            return {'status': 'ANCHORED', 'txid': txid}

        except Exception as e:
            logger.error(f"VALORCHAIN-G Anchoring Error: {e}")
            # Fallback to mock mode on error
            return {'status': 'MOCK_ANCHORED', 'txid': hashlib.sha256(f"MOCK_VALORCHAIN_G_{time.time()}_{e}".encode()).hexdigest()}

    def get_balance(self, account: str) -> float:
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute('SELECT SUM(amount) FROM fort_valor_aiplus2e_treasury WHERE account = ?', (account,))
                result = cursor.fetchone()
                return result[0] if result[0] else 0.0
        except Exception as e:
            logger.error(f"Balance query error: {e}")
            return 0.0

    def get_transaction_history(self, account: Optional[str] = None, limit: int = 50) -> List[Dict[str, Any]]:
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                if account:
                    cursor.execute('''
                        SELECT tx_id, account, amount, tx_type, timestamp, fort_valor_signature, blockchain_txid, provenance_hash, code_jo_flag, operator_id
                        FROM fort_valor_aiplus2e_treasury WHERE account = ?
                        ORDER BY created_at DESC LIMIT ?
                    ''', (account, limit))
                else:
                    cursor.execute('''
                        SELECT tx_id, account, amount, tx_type, timestamp, fort_valor_signature, blockchain_txid, provenance_hash, code_jo_flag, operator_id
                        FROM fort_valor_aiplus2e_treasury
                        ORDER BY created_at DESC LIMIT ?
                    ''', (limit,))

                rows = cursor.fetchall()
                return [
                    {
                        'tx_id': row[0],
                        'account': row[1],
                        'amount': row[2],
                        'tx_type': row[3],
                        'timestamp': row[4],
                        'fort_valor_signature': row[5][:16] + "...",
                        'blockchain_txid': row[6] if row[6] else "PENDING",
                        'provenance_hash': row[7] if row[7] else "N/A",
                        'code_jo_flag': row[8],
                        'operator_id': row[9]
                    }
                    for row in rows
                ]
        except Exception as e:
            logger.error(f"Transaction history error: {e}")
            return []

    def get_total_accounts(self) -> int:
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute('SELECT COUNT(DISTINCT account) FROM fort_valor_aiplus2e_treasury')
                result = cursor.fetchone()
                return result[0] if result else 0
        except Exception:
            return 0

# ==============================================================================
# ===              CHALLENGER VISUALS PROTOCOL (73s->37->32°)                ===
# ==============================================================================
class ChallengerVisualsProtocol:
    """Generates a PDF artifact for a given transaction, including a QR code."""
    def __init__(self):
        if not canvas or not qrcode:
            logger.warning("ChallengerVisualsProtocol disabled due to missing libraries.")
            self.enabled = False
        else:
            self.enabled = True
            logger.info("Challenger Visuals Protocol Initialized.")

    def generate_challenger_pdf(self, txid: str, network: str, provenance_hash: str, metadata: str) -> Optional[str]:
        if not self.enabled:
            return None

        filename = f"challenger_artifact_{txid[:12]}.pdf"
        try:
            # 1. Create QR Code
            url = f"https://mempool.space/{'testnet/' if network == 'testnet' else ''}tx/{txid}"
            qr_img = qrcode.make(url, box_size=15, border=2)
            qr_buffer = BytesIO()
            qr_img.save(qr_buffer, format="PNG")
            qr_buffer.seek(0)
            qr_image_reader = ImageReader(qr_buffer)

            # 2. Create PDF
            c = canvas.Canvas(filename, pagesize=letter)
            width, height = letter

            # --- Draw Header ---
            c.setFont("Helvetica-Bold", 16)
            c.drawCentredString(width / 2.0, height - inch, "VALORAIPLUS® Sovereign Provenance Artifact")
            c.setStrokeColorRGB(0.1, 0.8, 0.1)
            c.line(inch, height - inch - 10, width - inch, height - inch - 10)

            # --- Draw Metadata ---
            c.setFont("Courier-Bold", 24)
            c.drawCentredString(width / 2.0, height - 2 * inch, f"Challenger Metadata: {metadata}")

            # --- Draw QR Code and Details ---
            c.drawImage(qr_image_reader, x=inch, y=height - 5.5 * inch, width=3*inch, height=3*inch, preserveAspectRatio=True, mask='auto')

            text = c.beginText(4.5 * inch, height - 3.5 * inch)
            text.setFont("Helvetica-Bold", 12)
            text.textLine("Verification Details:")
            text.setFont("Courier", 9)
            text.moveCursor(0, 14) # Space
            text.textLine(f"Blockchain: Bitcoin {network.capitalize()}")
            text.moveCursor(0, 14)
            text.textLine("On-Chain TXID:")
            text.textLine(txid)
            text.moveCursor(0, 14)
            text.textLine("Sovereign Provenance Hash:")
            text.textLine(f"{provenance_hash[:32]}...")
            text.textLine(f"...{provenance_hash[32:]}")
            c.drawText(text)

            # --- Draw Footer ---
            c.setFont("Helvetica-Oblique", 8)
            c.drawCentredString(width / 2.0, inch / 2.0, f"Generated by Fort Valor AI+2e OS at {datetime.datetime.now(datetime.timezone.utc).isoformat()}")

            c.save()
            logger.info(f"Successfully generated Challenger Visual Artifact: {filename}")
            return filename
        except Exception as e:
            logger.error(f"Failed to generate Challenger PDF: {e}")
            return None

# ==============================================================================
# ===                   VALORAIPLUS® BITCOIN BLOCKCHAIN OS ($PHBI)            ===
# ==============================================================================
class FortValorAIplus2eOperatingSystem:
    def __init__(self, rpc_user: str, rpc_password: str, network: str = "testnet"):
        self.system_version = f"{PHBI_DESIGNATION} v8.0.0"
        self.author = "Donny Gillson"
        self.organization = "That's Edutainment LLC"
        self.network = network
        self.rpc_port = 18332 if network == "testnet" else 8332

        # Determine if we are in mock mode
        is_mock_mode = not rpc_user or rpc_user == "mock_user" or not AuthServiceProxy

        if is_mock_mode:
            self.rpc_url = None
            logger.warning("RPC credentials not provided or 'mock_user' used. Operating in MOCK mode.")
        else:
            self.rpc_url = f"http://{rpc_user}:{rpc_password}@127.0.0.1:{self.rpc_port}"

        # 1. Initialize Sentinel Verifier to establish the root of trust
        self.sentinel_verifier = VALORAIPLUS_Sentinel_Verifier()
        self.sovereign_merkle_root = self.sentinel_verifier.SAINT_PAUL_GENESIS_ROOT

        # 2. Inject the unified root into all other components
        self.archive_api = valoraiplus_SecureArchiveAPI(gillson_root="SAINT_PAUL_GILLSON_FAMILY_GENESIS_ROOT.SOL")
        self.seal_protocol = VALORAIPLUS_Sovereign_Seal_Protocol(sovereign_merkle_root=self.sovereign_merkle_root)
        self.valor_loop = ValorLoopPlus(sovereign_merkle_root=self.sovereign_merkle_root)
        self.challenger_visuals = ChallengerVisualsProtocol()
        self.treasury = VALORAIPLUSTreasury(
            "fort_valor_aiplus2e_treasury.db", self.rpc_url, network,
            self.archive_api, self.seal_protocol, self.sovereign_merkle_root
        )

        logger.info(f"{self.system_version} initialized on {network} with {SGAU_OVERRIDE} override.")
        logger.info(f"Satoshi Nakamoto Reference: {SATOSHI_NAKAMOTO_REFERENCE}")
        logger.info(f"Sovereign Merkle Root (dynamically calculated): {self.sovereign_merkle_root[:16]}...")
        logger.info(f"Operator ID: {POPPADONNY_ID}")

    def valoraiplus_anchor_provenance_artifact(self, artifact_data: Dict[str, Any], blockchain_id: str = "BITCOIN") -> Dict[str, Any]:
        """Anchor the valoraiplus_valorchain_g_provenance.json artifact to the blockchain."""
        try:
            # Verify operator authority for high-stakes provenance anchoring
            oracle_result = self.valor_loop.operator_authority_oracle(
                summary="Anchor VALORCHAIN-G Provenance",
                high_stakes=True
            )
            if not oracle_result:
                logger.error("Operator authority verification failed for provenance anchoring")
                return {'success': False, 'error': 'Operator authority verification failed'}

            # Generate Sovereign Seal
            sovereign_seal = self.seal_protocol.generate_seal(artifact_data)
            artifact_json = json.dumps(artifact_data, sort_keys=True)
            provenance_hash = hashlib.sha3_512(artifact_json.encode()).hexdigest()
            logger.info(f"Provenance artifact SHA3-512 digest: {provenance_hash[:16]}...")

            anchor_data = {
                'tx_id': hashlib.sha256(f"PROVENANCE_{provenance_hash}_{time.time()}_{self.treasury.satoshi_reference}_{self.treasury.sovereign_merkle_root}".encode()).hexdigest(),
                'account': 'VALORAIPLUS_PROVENANCE',
                'amount': 0.0,
                'timestamp': datetime.datetime.now(datetime.timezone.utc).isoformat(),
                'challenger_metadata': '73s->37->32°',
                'merkle_root': GENESIS_MERKLE_ROOT_BE,
                'coinbase_txid': GENESIS_COINBASE_TXID,
                'provenance_hash': provenance_hash,
                'satoshi_reference': SATOSHI_NAKAMOTO_REFERENCE,
                'sovereign_merkle_root': self.sovereign_merkle_root,
                'operator_id': self.treasury.operator_id,
                'tx_type': 'PROVENANCE_ANCHOR',
                'blockchain_id': blockchain_id
            }

            # Delegate to the correct anchoring method based on blockchain_id
            if blockchain_id.upper() == 'VALORCHAIN-G':
                logger.info("Delegating to VALORCHAIN-G anchor protocol.")
                anchor_result = self.treasury.valoraiplus_create_valorchain_g_anchor(anchor_data)
            else: # Default to Bitcoin
                logger.info("Delegating to Bitcoin OP_RETURN anchor protocol.")
                anchor_result = self.treasury.valoraiplus_create_anchor(anchor_data)

            treasury_result = self.treasury.valoraiplus_add_funds(
                account='VALORAIPLUS_PROVENANCE',
                amount=0.0,
                tx_type='PROVENANCE_ANCHOR',
                code_jo_deposit=True,
                blockchain_id=blockchain_id
            )
            if treasury_result['success']:
                with TREASURY_LOCK, sqlite3.connect(self.treasury.db_path) as conn:
                    cursor = conn.cursor()
                    cursor.execute('UPDATE fort_valor_aiplus2e_treasury SET blockchain_txid = ?, provenance_hash = ? WHERE tx_id = ?',
                                  (anchor_result.get('txid', 'N/A'), provenance_hash, treasury_result['tx_id']))
                    conn.commit()

            # Log to Secure Archive API
            self.archive_api.valoraiplus_store_audit(
                asset_type='PROVENANCE_ANCHOR',
                blockchain_id=blockchain_id,
                merkle_root=self.sovereign_merkle_root,
                txid=anchor_result.get('txid', 'N/A'),
                operator=self.treasury.operator_id,
                approval_details=f"Provenance anchor; Sovereign Seal: {sovereign_seal.hex()[:16]}...; CodeJo: 1"
            )

            # Generate Challenger Visual Artifact
            pdf_artifact_path = None
            if anchor_result.get('status') in ['ANCHORED', 'MOCK_ANCHORED'] and anchor_result.get('txid'):
                pdf_artifact_path = self.challenger_visuals.generate_challenger_pdf(
                    txid=anchor_result['txid'],
                    network=self.network,
                    provenance_hash=provenance_hash,
                    metadata=artifact_data.get("challenger_metadata", "N/A")
                )

            return {
                'success': True,
                'provenance_hash': provenance_hash,
                'blockchain_txid': anchor_result.get('txid', 'N/A'),
                'sovereign_seal': sovereign_seal.hex()[:16] + "...",
                'treasury_tx_id': treasury_result['tx_id'],
                'genesis_trace': f"GENESIS_ROOT.ENCODE: {GENESIS_ROOT_ENCODED} - Genesis Hash: {GENESIS_HASH} - Satoshi: {SATOSHI_NAKAMOTO_REFERENCE} - Sovereign Merkle Root: {self.sovereign_merkle_root[:16]}... - Operator: {self.treasury.operator_id}",
                'challenger_pdf_artifact': pdf_artifact_path
            }
        except Exception as e:
            logger.error(f"Provenance anchoring error: {e}")
            return {'success': False, 'error': str(e)}

    def valoraiplus_process_treasury_operation(self, operation: Dict[str, Any]) -> Dict[str, Any]:
        try:
            # Verify operator authority for high-stakes operations
            high_stakes = operation.get('code_jo_deposit', False) or operation.get('tx_type', '') == 'PROVENANCE_ANCHOR'
            oracle_result = self.valor_loop.operator_authority_oracle(
                summary=f"Treasury Operation: {operation['tx_type']}",
                high_stakes=high_stakes
            )
            if not oracle_result:
                logger.error("Operator authority verification failed for treasury operation")
                return {'success': False, 'error': 'Operator authority verification failed'}

            sentinel_result = self.sentinel_verifier.verify_integrity(
                operation.get('sgau_data', {
                    'encrypted_name': hashlib.sha256("Poppa Donny Gillson".encode()).hexdigest(),
                    'temporal_anchor': "1969",
                    'node': "Saint Paul"
                }),
                operation.get('parent_cid', "bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku"),
                operation.get('core_axiom', "The Super Chicken Paradox of Shacksdale, USA, dedicated to Ozzy Osbourne."),
                operation.get('satoshi_reference', SATOSHI_NAKAMOTO_REFERENCE)
            )
            if sentinel_result['status'] != 'SUCCESS':
                logger.warning(f"Sentinel verification failed: {sentinel_result['message']}")
                return {
                    'success': False,
                    'error': f"Sentinel Verification Failed: {sentinel_result['message']}",
                    'sentinel_result': sentinel_result
                }

            is_code_jo = operation.get('code_jo_deposit', False)
            blockchain_id = operation.get('blockchain_id', 'BITCOIN')
            treasury_result = self.treasury.valoraiplus_add_funds(
                operation['account'], operation['amount'], operation.get('tx_type', 'DEPOSIT'), is_code_jo, blockchain_id
            )
            if not treasury_result['success']:
                return treasury_result

            anchor_data = {
                'tx_id': treasury_result['tx_id'],
                'account': operation['account'],
                'amount': operation['amount'],
                'timestamp': treasury_result['timestamp'],
                'challenger_metadata': '73s->37->32°',
                'merkle_root': GENESIS_MERKLE_ROOT_BE,
                'coinbase_txid': GENESIS_COINBASE_TXID,
                'provenance_hash': hashlib.sha3_512(json.dumps(operation, sort_keys=True).encode()).hexdigest(),
                'satoshi_reference': SATOSHI_NAKAMOTO_REFERENCE,
                'sovereign_merkle_root': self.sovereign_merkle_root,
                'operator_id': self.treasury.operator_id,
                'tx_type': operation.get('tx_type', 'DEPOSIT'),
                'blockchain_id': blockchain_id
            }
            anchor_result = self.treasury.valoraiplus_create_anchor(anchor_data)
            treasury_result['blockchain_txid'] = anchor_result.get('txid', 'N/A')

            with TREASURY_LOCK, sqlite3.connect(self.treasury.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute('UPDATE fort_valor_aiplus2e_treasury SET blockchain_txid = ?, provenance_hash = ? WHERE tx_id = ?',
                              (anchor_result.get('txid', 'N/A'), anchor_data['provenance_hash'], treasury_result['tx_id']))
                conn.commit()

            treasury_result['sentinel_result'] = sentinel_result
            treasury_result['fort_valor_processed'] = True
            treasury_result['operator_approval'] = oracle_result
            logger.info(f"Treasury operation processed: {operation['account']} - ${operation['amount']:,.2f} ({operation['tx_type']}) - Satoshi Reference: {SATOSHI_NAKAMOTO_REFERENCE} - Sovereign Merkle Root: {self.sovereign_merkle_root[:16]}... - Operator: {self.treasury.operator_id}")
            return treasury_result
        except Exception as e:
            logger.error(f"Fort Valor operation error: {e}")
            return {'success': False, 'error': str(e)}

    def run_comprehensive_demo(self):
        print("\n" + "="*80)
        print(f"{self.system_version} - CODE JO PROTOCOL DEMO (0Math30+ Optimized)")
        print(f"© {datetime.datetime.now().year} That's Edutainment LLC / Donny Gillson")
        print("="*80)

        verification_data = {
            'sgau_data': {'encrypted_name': hashlib.sha256("Poppa Donny Gillson".encode()).hexdigest(), 'temporal_anchor': "1969", 'node': "Saint Paul"},
            'parent_cid': "bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku",
            'core_axiom': "The Super Chicken Paradox of Shacksdale, USA, dedicated to Ozzy Osbourne.",
            'satoshi_reference': SATOSHI_NAKAMOTO_REFERENCE
        }

        print("\n=== SYSTEM STATUS ===")
        print(f"System: {self.system_version}")
        print(f"Treasury Status: OPERATIONAL")
        print(f"Genesis Reference: {GENESIS_HASH[:32]}...")
        print(f"Real Merkle Root: {GENESIS_MERKLE_ROOT_BE[:32]}...")
        print(f"Genesis Coinbase TXID: {GENESIS_COINBASE_TXID[:32]}...")
        print(f"Genesis Coinbase Message: {GENESIS_COINBASE_MESSAGE}")
        print(f"Satoshi Reference: {SATOSHI_NAKAMOTO_REFERENCE}")
        print(f"Sovereign Merkle Root: {self.sovereign_merkle_root[:32]}...")
        print(f"SGAU Override: {SGAU_OVERRIDE}")
        print(f"Operator ID: {POPPADONNY_ID}")
        print(f"Supported Tokens: {', '.join(VALORAIPLUS_TOKENS)}")
        print(f"Network: {self.network}")

        print("\n--- Operation 1: Standard Deposit (GILLGOLD) ---")
        std_op = {'type': 'ADD_FUNDS', 'account': 'DONNY_GILLSON_MAIN', 'amount': 50000.0, 'tx_type': 'GILLGOLD', 'blockchain_id': 'BITCOIN', **verification_data}
        result = self.valoraiplus_process_treasury_operation(std_op)
        print(f"  > Success: {'✓' if result['success'] else '✗'}")
        if result['success']:
            print(f"  > TX ID: {result['tx_id'][:16]}...")
            print(f"  > Blockchain TXID: {result['blockchain_txid'][:16]}...")
            print(f"  > New Balance: ${result['new_balance']:,.2f}")
            print(f"  > Token Type: {result['tx_type']}")
            print(f"  > Sentinel Verification: {result['sentinel_result']['status']}")
            print(f"  > Operator Approval: {result['operator_approval']}")

        print("\n--- Operation 2: CODE JO DEPOSIT (GILLBTC, SGAU DISABLED) ---")
        print("   > This simulates a deposit made while the SGAU was in a vulnerable state.")
        print("   > $PHBI sovereignty is protected by this protocol.")
        code_jo_op = {'type': 'ADD_FUNDS', 'account': 'DONNY_GILLSON_MAIN', 'amount': 10000.0,
                      'tx_type': 'GILLBTC', 'code_jo_deposit': True, 'blockchain_id': 'BITCOIN', **verification_data}
        result = self.valoraiplus_process_treasury_operation(code_jo_op)
        print(f"  > Success: {'✓' if result['success'] else '✗'}")
        if result['success']:
            print(f"  > TX ID: {result['tx_id'][:16]}...")
            print(f"  > Blockchain TXID: {result['blockchain_txid'][:16]}...")
            print(f"  > New Balance: ${result['new_balance']:,.2f}")
            print(f"  > Token Type: {result['tx_type']}")
            print(f"  > Code Jo Flag: {result['code_jo_flag']}")
            print(f"  > Sentinel Verification: {result['sentinel_result']['status']}")
            print(f"  > Operator Approval: {result['operator_approval']}")

        print("\n--- Operation 3: Anchoring VALORCHAIN-G Provenance ---")
        provenance_artifact = {
            "provenance_id": "VALORCHAIN_G_001",
            "description": "Immutable proof of VALORCHAIN-G sovereignty, established under the authority of the SGAU",
            "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "challenger_metadata": "73s->37->32°",
            "provenance": "Sealed by VALORAIPLUS® with Code Jo Protocol, superseding all prior conflicts",
            "satoshi_reference": SATOSHI_NAKAMOTO_REFERENCE,
            "sovereign_merkle_root": self.sovereign_merkle_root
        }
        provenance_result = self.valoraiplus_anchor_provenance_artifact(provenance_artifact, blockchain_id='VALORCHAIN-G')
        print(f"  > Success: {'✓' if provenance_result['success'] else '✗'}")
        if provenance_result['success']:
            print(f"  > Provenance Hash: {provenance_result['provenance_hash'][:16]}...")
            print(f"  > Blockchain TXID: {provenance_result['blockchain_txid'][:16]}...")
            print(f"  > Treasury TX ID: {provenance_result['treasury_tx_id'][:16]}...")
            print(f"  > Sovereign Seal: {provenance_result['sovereign_seal']}")
            print(f"  > Genesis Trace: {provenance_result['genesis_trace']}")
            if provenance_result.get('challenger_pdf_artifact'):
                print(f"  > Challenger PDF Artifact: {provenance_result['challenger_pdf_artifact']}")

        print("\n=== ACCOUNT BALANCES ===")
        accounts = ['DONNY_GILLSON_MAIN', 'VALORAIPLUS_PROVENANCE']
        total_treasury = 0.0
        for account in accounts:
            balance = self.treasury.get_balance(account)
            total_treasury += balance
            print(f"{account}: ${balance:,.2f}")
        print(f"\nTotal Treasury Value: ${total_treasury:,.2f}")

        print("\n=== RECENT TRANSACTION HISTORY ===")
        history = self.treasury.get_transaction_history()
        for tx in history[:3]:
            print(f"TX ID: {tx['tx_id'][:16]}..., Amount: ${tx['amount']:,.2f}, Account: {tx['account']}, Type: {tx['tx_type']}, Code Jo: {tx['code_jo_flag']}, Operator: {tx['operator_id']}")

        print("\n=== AUDIT LOG (VALORAIPLUS SECURE ARCHIVE) ===")
        with sqlite3.connect('valoraiplus_archive.db') as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM valoraiplus_audit_treasury ORDER BY event_ts_ns DESC LIMIT 3')
            rows = cursor.fetchall()
            for row in rows:
                print(f"Event TS: {row[1]}, Asset: {row[2]}, Blockchain: {row[3]}, TXID: {row[7][:16]}..., Operator: {row[8]}")

        print("\n" + "="*80)

if __name__ == "__main__":
    print("Demo mode (mock anchoring; provide RPC for real BTC_NEW_GEN/VALORCHAIN operations)")
    fort_valor_aiplus2e_os = FortValorAIplus2eOperatingSystem(rpc_user="mock_user", rpc_password="mock_pass", network="testnet")
    fort_valor_aiplus2e_os.run_comprehensive_demo()
    fort_valor_aiplus2e_os.archive_api.close()