from fastapi import FastAPI
from starlette.responses import PlainTextResponse

app = FastAPI()

MERKLE_HISTORY = []

@app.get("/metrics")
async def metrics():
    return PlainTextResponse(
        f"saintpaul_merkle_depth {len(MERKLE_HISTORY)}\n"
        f"saintpaul_anchor_count {len(MERKLE_HISTORY)}\n"
    )

@app.get("/")
async def root():
    return {"message": "Saint-Paul Node is running"}
