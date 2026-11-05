from typing import Optional
from fastapi import Request, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_session_token
from app.core.config import settings
from app.domain.models import Usuario


def get_current_admin(
    request: Request,
    db: Session = Depends(get_db)
) -> Usuario:
    """
    Verifica se o usuário está autenticado via cookie de sessão HttpOnly seguro (RNF-04, RNF-05).
    Se for rota de API (/api/...) retorna 401 Unauthorized.
    Se for navegação web (/admin/...) redireciona para a tela de login.
    """
    session_cookie = request.cookies.get(settings.SESSION_COOKIE_NAME)
    valido, user_id, email = verify_session_token(session_cookie) if session_cookie else (False, 0, "")

    if not valido:
        if request.url.path.startswith("/api/"):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Acesso não autorizado. Sessão inválida ou expirada."
            )
        # Para rotas de navegação administrativa, redireciona ao login com parâmetro next
        next_url = request.url.path
        raise HTTPException(
            status_code=status.HTTP_307_TEMPORARY_REDIRECT,
            headers={"Location": f"/admin/login?next={next_url}"}
        )

    user = db.query(Usuario).filter(Usuario.id == user_id).first()
    if not user:
        if request.url.path.startswith("/api/"):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Usuário associado à sessão não encontrado."
            )
        raise HTTPException(
            status_code=status.HTTP_307_TEMPORARY_REDIRECT,
            headers={"Location": "/admin/login"}
        )

    return user
