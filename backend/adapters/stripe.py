import os, requests

class StripeRail:
    def __init__(self):
        self.key = os.getenv("STRIPE_API_KEY", "")

    def create_transfer(self, dto):
        # STUB: map fields to Stripe API /v1/payouts or Treasury transfers
        return {"provider_ref": "stub_stripe_123", "status": "processing"}

    def get_transfer(self, provider_id: str):
        return {"provider_ref": provider_id, "status": "processing"}

    def webhook_event_types(self):
        return ["payout.paid", "payout.failed"]
