import os

class PlaidLink:
    def __init__(self):
        self.client_id = os.getenv("PLAID_CLIENT_ID", "")
        self.secret = os.getenv("PLAID_SECRET", "")

    def start_link(self, user_id: int):
        # STUB: return link token payload
        return {"link_token": "stub_link_token", "user_id": user_id}
