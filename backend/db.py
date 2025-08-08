import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DSN = os.getenv("POSTGRES_DSN", "postgresql+psycopg2://valorai:valorai@localhost:5432/valorai")
engine = create_engine(DSN, future=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, future=True)
Base = declarative_base()
