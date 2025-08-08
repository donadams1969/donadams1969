from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from routers import payments

load_dotenv()
app = FastAPI(title="VALORAI Fiat API", version="0.1.0")

origins = os.getenv("ALLOWED_ORIGINS", "").split(",") if os.getenv("ALLOWED_ORIGINS") else ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(payments.router, prefix="/payments", tags=["payments"])

@app.get("/healthz")
def healthz():
    return {"ok": True}
