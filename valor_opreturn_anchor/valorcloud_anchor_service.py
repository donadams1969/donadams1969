# valorcloud_anchor_service.py
from flask import Flask, request, jsonify
from prometheus_client import Counter, Histogram, make_wsgi_app
from werkzeug.middleware.dispatcher import DispatcherMiddleware
import time
import sys
import os

# Add the parent directory to the path to allow imports from the root
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from multi_anchor_merkle import anchor_merkle

app = Flask(__name__)

anchor_counter = Counter("valor_multi_anchor_total", "Total anchors", ["status"])
anchor_latency = Histogram("valor_multi_anchor_duration_seconds", "Anchor duration")

@app.route("/anchor", methods=["POST"])
def anchor():
    data = request.json
    merkle_hash = data["merkle_hash"]
    # The btc_txid will be a dummy value from our placeholder
    btc_txid = data.get("btc_txid", f"dummy_btc_txid_{merkle_hash[:16]}")
    # The eth_provider is not used in our simulated version
    eth_provider = data.get("eth_provider", "http://localhost:8545")

    start = time.time()
    try:
        # The out_dir for PDFs needs to be accessible from the service's perspective.
        # We'll map a volume in docker-compose to handle this.
        record = anchor_merkle(merkle_hash, btc_txid, eth_provider)
        anchor_counter.labels(status="success").inc()
        anchor_latency.observe(time.time() - start)
        return jsonify(record)
    except Exception as e:
        anchor_counter.labels(status="failure").inc()
        return jsonify({"error": str(e)}), 500

# Prometheus metrics endpoint
app.wsgi_app = DispatcherMiddleware(app.wsgi_app, {
    "/metrics": make_wsgi_app()
})

if __name__ == "__main__":
    # The PDF writer will try to write to data/audit/anchors.
    # We need to ensure this directory exists before running the app.
    output_dir = "data/audit/anchors"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    app.run(host="0.0.0.0", port=5000)