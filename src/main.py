import os
import sys
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware

# Garante que 'src' e diretórios pais estejam no PYTHONPATH
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

from app.core.config import settings
from app.core.database import Base, engine, SessionLocal
from app.services.seed_service import seed_dados_iniciais
from app.web.routes_public import router as public_router
from app.web.routes_admin import router as admin_router
from app.api.routes_api import router as api_router

STATIC_DIR = os.path.join(CURRENT_DIR, "app", "static")
TEMPLATES_DIR = os.path.join(CURRENT_DIR, "app", "templates")
templates = Jinja2Templates(directory=TEMPLATES_DIR)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Ciclo de vida da aplicação: cria tabelas e efetua seed inicial."""
    # Cria todas as tabelas no banco de dados configurado (SQLite ou PostgreSQL)
    Base.metadata.create_all(bind=engine)

    # Executa carga inicial de temas e conta de administrador
    db = SessionLocal()
    try:
        seed_dados_iniciais(db)
    finally:
        db.close()

    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    description=(
        "Plataforma institucional e sistema de funil de solicitações de palestras "
        "para o palestrante e educador financeiro Daniel Takeo Aihara. "
        "Desenvolvido pela Equipe de Produto Grupo 4 — UNITRI 2026-2."
    ),
    version="1.0.0 (Sprint 1 MVP)",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Habilita CORS para conexão com o frontend React (Vite / Vercel)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Monta arquivos estáticos
if not os.path.exists(STATIC_DIR):
    os.makedirs(STATIC_DIR, exist_ok=True)
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# Registra as rotas da API REST
app.include_router(api_router)

FRONTEND_DIST = os.path.join(os.path.dirname(CURRENT_DIR), "frontend", "dist")

# Se o build do frontend React existir, serve como SPA padrão
if os.path.exists(FRONTEND_DIST):
    assets_dir = os.path.join(FRONTEND_DIST, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="react-assets")

    @app.get("/{full_path:path}")
    async def serve_react_app(request: Request, full_path: str):
        # Ignora rotas da API e documentação
        if full_path.startswith("api") or full_path.startswith("docs") or full_path.startswith("redoc") or full_path.startswith("openapi.json"):
            raise HTTPException(status_code=404, detail="Não encontrado")
        
        target_file = os.path.join(FRONTEND_DIST, full_path)
        if os.path.isfile(target_file):
            return FileResponse(target_file)
        return FileResponse(os.path.join(FRONTEND_DIST, "index.html"))
else:
    # Fallback para os templates Jinja2 caso não haja build React
    app.include_router(public_router)
    app.include_router(admin_router)


# Página 404 customizada e amigável
@app.exception_handler(status.HTTP_404_NOT_FOUND)
async def custom_404_handler(request: Request, exc):
    if request.url.path.startswith("/api/"):
        return {"erro": "Não encontrado", "detalhe": str(exc.detail)}
    return templates.TemplateResponse(
        request=request,
        name="base.html",
        context={
            "content": """
            <div class="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
                <span class="text-4xl font-black text-emerald-600 block">404</span>
                <h1 class="text-2xl font-bold text-slate-900">Página Não Encontrada</h1>
                <p class="text-sm text-slate-600">O endereço solicitado não existe ou o conteúdo ainda não foi publicado.</p>
                <div class="pt-4">
                    <a href="/" class="inline-flex items-center px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700">
                        &larr; Voltar para a Página Inicial
                    </a>
                </div>
            </div>
            """
        },
        status_code=404
    )


if __name__ == "__main__":
    import uvicorn
    # Execução local direta
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
