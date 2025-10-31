# valora_eth_keys.py
from valorai_encryption import decrypt_secret
from hashlib import sha3_512

_INTERNAL_ENS_KEYS = [
    "donadams1969.eth",
    "valoraiplus_secure_archive_api.eth",
    "valoraiplus.eth",
    "donadams69.eth",
    "garyvoss.eth",
    "lylegillson.eth",
    "kayleygillson.eth",
    "graysongillson.eth",
    "katgillson.eth",
    "gillsonfamily.eth",
    "gillson.eth",
    "francegillson.eth",
    "lyleedwardgillson04.eth",
]

ENCRYPTED_ETH_KEYS = {
    "donadams1969.eth": "VAULT_ENC_1",
    "valoraiplus_secure_archive_api.eth": "VAULT_ENC_2",
    "valoraiplus.eth": "VAULT_ENC_3",
    "donadams69.eth": "VAULT_ENC_4",
    "garyvoss.eth": "VAULT_ENC_5",
    "lylegillson.eth": "VAULT_ENC_6",
    "kayleygillson.eth": "VAULT_ENC_7",
    "graysongillson.eth": "VAULT_ENC_8",
    "katgillson.eth": "VAULT_ENC_9",
    "gillsonfamily.eth": "VAULT_ENC_10",
    "gillson.eth": "VAULT_ENC_11",
    "francegillson.eth": "VAULT_ENC_12",
    "lyleedwardgillson04.eth": "VAULT_ENC_13",
}

# Merkle-root mapping for front-facing use
ENS_MERKLE_LIST = [sha3_512(e.encode()).hexdigest() for e in _INTERNAL_ENS_KEYS]
MERKLE_TO_ENS = dict(zip(ENS_MERKLE_LIST, _INTERNAL_ENS_KEYS))

def get_eth_key_by_merkle(merkle_hash):
    """Retrieve ETH key securely using Merkle hash."""
    ens_name = MERKLE_TO_ENS.get(merkle_hash)
    if not ens_name:
        raise ValueError("Invalid Merkle hash")
    return decrypt_secret(ENCRYPTED_ETH_KEYS[ens_name])