import os

class WiseRail:
    def __init__(self):
        self.key = os.getenv("WISE_API_KEY", "")

    def create_transfer(self, dto):
        return {"provider_ref": "stub_wise_123", "status": "processing"}

    def get_transfer(self, provider_id: str):
        return {"provider_ref": provider_id, "status": "processing"}

    def webhook_event_types(self):
        return ["transfers#state-change"]
