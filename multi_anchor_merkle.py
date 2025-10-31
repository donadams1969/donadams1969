# multi_anchor_merkle.py
from valora_eth_keys import ENS_MERKLE_LIST, get_eth_key_by_merkle
from valor_pdf_writer import write_anchor_pdf
from bitcoin_anchor import build_opreturn_tx
from web3 import Web3
import asyncio

async def anchor_to_eth(web3_provider, merkle_hash):
    w3 = Web3(Web3.HTTPProvider(web3_provider))
    txids = {}
    for merkle in ENS_MERKLE_LIST:
        priv = get_eth_key_by_merkle(merkle)
        acct = w3.eth.account.from_key(priv)
        tx = {
            "to": acct.address,
            "value": 0,
            "data": bytes.fromhex(merkle_hash),
            "gas": 100000,
            "nonce": w3.eth.get_transaction_count(acct.address),
        }
        signed = acct.sign_transaction(tx)
        txid = w3.eth.send_raw_transaction(signed.rawTransaction)
        txids[merkle] = txid.hex()
    return txids

def anchor_merkle(merkle_hash, btc_txid, eth_provider):
    # Since we can't actually broadcast transactions, we'll use the dummy btc_txid
    # and simulate the ethereum transaction IDs.
    simulated_eth_txids = {merkle: f"sim_eth_txid_{merkle[:16]}" for merkle in ENS_MERKLE_LIST}

    pdf_path, pdf_hash = write_anchor_pdf(merkle_hash, btc_txid, eth_txids=simulated_eth_txids)

    # In a real scenario, this would be the result of the async call.
    # eth_txids = asyncio.run(anchor_to_eth(eth_provider, merkle_hash))

    return {
        "merkle_hash": merkle_hash,
        "btc_txid": btc_txid,
        "eth_txids": simulated_eth_txids,
        "pdf_path": pdf_path,
        "pdf_hash": pdf_hash
    }