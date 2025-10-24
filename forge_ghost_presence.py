# VALORAIPLUS //e - $GHOST Protocol Presence Forge
# © 2025 Poppa Donny Gillson, That's Edutainment LLC, 32D LLC. All Rights Reserved.
# SPDX-License-Identifier: "VALORAIPLUS-OMEGA-FINAL"

import os
import hashlib
from bitcoinlib.wallets import Wallet
from bitcoinlib.services.services import Service
from dotenv import load_dotenv

# --- CONFIGURATION ---
# Load environment variables from .env file
load_dotenv()

# Securely fetch the Wallet Import Format (WIF) key from environment variables
# CRITICAL: This key must be set in the environment and have a small amount of testnet Bitcoin.
WIF_KEY = os.getenv("WIF_KEY")
if not WIF_KEY:
    raise ValueError("FATAL: WIF_KEY environment variable not set. Cannot proceed with transaction.")

WALLET_NAME = "valor_ghost_wallet"
NETWORK = "testnet"

# --- CORE FUNCTIONS ---

def get_or_create_wallet(wallet_name, wif_key):
    """Gets an existing wallet or creates a new one from a WIF key."""
    try:
        # Try to open the wallet if it exists
        wallet = Wallet(wallet_name)
        print(f"INFO: Opened existing wallet '{wallet_name}'.")
    except FileNotFoundError:
        # If not, create it by importing the WIF key
        print(f"INFO: Wallet '{wallet_name}' not found. Creating new wallet by importing WIF key.")
        wallet = Wallet.create(wallet_name, keys=wif_key, network=NETWORK)
        print(f"SUCCESS: Wallet '{wallet_name}' created and key imported.")
    return wallet

def create_op_return_transaction(wallet, data, fee_kb=1000):
    """Creates and sends a transaction with an OP_RETURN output containing the given data."""
    if len(data.encode('utf-8')) > 80:
        raise ValueError("Error: Data for OP_RETURN cannot exceed 80 bytes.")

    print(f"INFO: Preparing OP_RETURN transaction...")
    print(f"INFO: Data to embed: '{data}'")

    # Update wallet balance and UTXOs
    wallet.scan()
    balance = wallet.balance()
    print(f"INFO: Current wallet balance: {balance / 10**8} tBTC")

    if balance == 0:
        print("ERROR: Wallet has zero balance. Please fund the address below on a testnet faucet.")
        print(f"Funding Address: {wallet.get_key().address}")
        return None

    # Create the transaction with the OP_RETURN output
    tx = wallet.send_to(
        outputs=[],  # No standard outputs, only OP_RETURN
        message=data,
        fee=fee_kb,
        network=NETWORK
    )

    print(f"SUCCESS: Transaction created.")
    print(f"Raw TX: {tx.raw_hex}")
    return tx

def broadcast_transaction(tx):
    """Broadcasts the transaction to the network."""
    print("INFO: Broadcasting transaction to the network...")
    try:
        service = Service(network=NETWORK)
        tx_id = service.sendrawtransaction(tx.raw_hex)
        print(f"SUCCESS: Transaction broadcasted!")
        print(f"Transaction ID (TXID): {tx_id}")
        print(f"View on block explorer: https://live.blockcypher.com/btc-testnet/tx/{tx_id}")
        return tx_id
    except Exception as e:
        print(f"ERROR: Failed to broadcast transaction: {e}")
        return None

def sha256_hash(text):
    """Computes the SHA-256 hash of a given text and returns it as a hex string."""
    return hashlib.sha256(text.encode('utf-8')).hexdigest()

# --- MAIN EXECUTION ---

if __name__ == "__main__":
    print("--- VALORAIPLUS //e - $GHOST PROTOCOL PRESENCE FORGE ---")

    # 1. Define the data to be anchored on-chain
    # This data represents a cryptographic commitment or proof of existence.
    merkle_root = "0db32d07a670f5a9e525381a8e86f563582e33621183f6f1c71c4c9e4a5e8c1f"
    ghost_root = "6c465a114227c293633d02e7ad5e955f0a06660b8d5ea6938096f9a5f7f3f3e1"
    combined_hash = sha256_hash(merkle_root + ghost_root)

    # 2. Get or create the wallet
    ghost_wallet = get_or_create_wallet(WALLET_NAME, WIF_KEY)

    # 3. Create and broadcast the OP_RETURN transaction
    transaction = create_op_return_transaction(ghost_wallet, combined_hash)

    if transaction:
        broadcast_transaction(transaction)

    print("--- FORGE COMPLETE ---")
