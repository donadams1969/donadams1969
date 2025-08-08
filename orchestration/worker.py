import os
from celery import Celery

broker = os.getenv("BROKER_URL", "redis://localhost:6379/0")
backend = os.getenv("RESULT_BACKEND", "redis://localhost:6379/1")
app = Celery("worker", broker=broker, backend=backend)

@app.task
def reconcile():
    # TODO: compare provider statements vs ledger entries
    return {"ok": True}
