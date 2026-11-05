import os
import re
from datetime import datetime
from typing import List, Optional, Dict, Any
import markdown
from app.core.config import settings

CONTENT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "content")


class ContentService:

    @staticmethod
    def _parse_article_file(file_path: str) -> Optional[Dict[str, Any]]:
        """Lê um arquivo Markdown e extrai metadados do cabeçalho e corpo renderizado."""
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()

            # Extração simples de metadados em estilo YAML / Header frontmatter
            metadata = {
                "slug": os.path.splitext(os.path.basename(file_path))[0],
                "titulo": "Sem título",
                "resumo": "",
                "data": datetime.utcnow().strftime("%d/%m/%Y"),
                "autor": "Daniel Takeo Aihara",
                "tempo_leitura": "5 min",
                "imagem_url": "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
                "publicado": True,
                "tags": []
            }

            body = content
            if content.startswith("---"):
                parts = content.split("---", 2)
                if len(parts) >= 3:
                    header = parts[1]
                    body = parts[2]
                    for line in header.strip().split("\n"):
                        if ":" in line:
                            k, v = line.split(":", 1)
                            k = k.strip().lower()
                            v = v.strip().strip('"').strip("'")
                            if k == "titulo":
                                metadata["titulo"] = v
                            elif k == "resumo":
                                metadata["resumo"] = v
                            elif k == "data":
                                metadata["data"] = v
                            elif k == "autor":
                                metadata["autor"] = v
                            elif k == "tempo_leitura":
                                metadata["tempo_leitura"] = v
                            elif k == "imagem_url":
                                metadata["imagem_url"] = v
                            elif k == "publicado":
                                metadata["publicado"] = v.lower() in ("true", "1", "sim", "yes")
                            elif k == "tags":
                                metadata["tags"] = [t.strip() for t in v.split(",") if t.strip()]

            html_body = markdown.markdown(
                body,
                extensions=["extra", "codehilite", "toc"]
            )

            metadata["html"] = html_body
            return metadata
        except Exception:
            return None

    @classmethod
    def listar_artigos(cls) -> List[Dict[str, Any]]:
        """Lista todos os artigos publicados em ordem cronológica (RF-05, US-02, RN-19)."""
        if not os.path.exists(CONTENT_DIR):
            return []

        artigos = []
        for file_name in os.listdir(CONTENT_DIR):
            if file_name.endswith(".md"):
                full_path = os.path.join(CONTENT_DIR, file_name)
                art = cls._parse_article_file(full_path)
                if art and art.get("publicado"):
                    artigos.append(art)

        # Ordena por data (mais recente primeiro)
        def parse_data(art):
            try:
                return datetime.strptime(art.get("data", ""), "%d/%m/%Y")
            except Exception:
                return datetime.min

        artigos.sort(key=parse_data, reverse=True)
        return artigos

    @classmethod
    def obter_artigo(cls, slug: str) -> Optional[Dict[str, Any]]:
        """Obtém um artigo específico pelo slug; se for rascunho, retorna None (RN-19)."""
        file_path = os.path.join(CONTENT_DIR, f"{slug}.md")
        if not os.path.exists(file_path):
            return None

        art = cls._parse_article_file(file_path)
        if not art or not art.get("publicado"):
            return None
        return art
