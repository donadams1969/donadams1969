import os
import requests
import json

def send_alert(message):
    """
    Sends an alert to the webhook URL specified in the environment variables.
    """
    webhook_url = os.getenv("ALERT_WEBHOOK_URL")
    if not webhook_url:
        print("[Alert] ALERT_WEBHOOK_URL environment variable not set. Cannot send alert.")
        return

    print(f"[Alert] Sending alert to {webhook_url}: {message}")
    try:
        payload = {"text": message}
        # In a real scenario, this would send a POST request.
        # We will simulate this to avoid actual network calls in this environment.
        print(f"[Alert] Simulating POST request with payload: {json.dumps(payload)}")
        # requests.post(webhook_url, json=payload, timeout=5)
        print("[Alert] Simulated alert sent successfully.")
    except requests.exceptions.RequestException as e:
        print(f"[Alert] Failed to send alert: {e}")