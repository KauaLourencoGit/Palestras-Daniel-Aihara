import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

# Ajuste automático para URLs do PostgreSQL do Supabase/Railway (postgres:// -> postgresql://)
db_url = settings.DATABASE_URL
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

connect_args = {}
if db_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
    # Garante que o diretório data exista para o arquivo sqlite
    db_path = db_url.replace("sqlite:///", "")
    dir_name = os.path.dirname(db_path)
    if dir_name:
        os.makedirs(dir_name, exist_ok=True)

engine = create_engine(
    db_url,
    connect_args=connect_args,
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Dependência para obter sessão de banco de dados com fechamento automático."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
