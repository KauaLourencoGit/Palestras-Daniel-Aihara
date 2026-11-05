from typing import List, Optional
from sqlalchemy.orm import Session
from app.domain.models import PalestraTema


class TemaService:

    @staticmethod
    def listar_ativos(db: Session) -> List[PalestraTema]:
        """Retorna todos os temas ativos ordenados pela prioridade de exibição (RF-03, RN-18)."""
        return (
            db.query(PalestraTema)
            .filter(PalestraTema.ativo == True)
            .order_by(PalestraTema.ordem.asc(), PalestraTema.id.asc())
            .all()
        )

    @staticmethod
    def obter_por_slug(db: Session, slug: str) -> Optional[PalestraTema]:
        """Busca um tema ativo pelo seu slug amigável (RF-04)."""
        return (
            db.query(PalestraTema)
            .filter(PalestraTema.slug == slug, PalestraTema.ativo == True)
            .first()
        )

    @staticmethod
    def obter_por_id(db: Session, tema_id: int) -> Optional[PalestraTema]:
        return db.query(PalestraTema).filter(PalestraTema.id == tema_id).first()
