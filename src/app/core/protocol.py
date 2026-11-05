import random

# Conjunto de caracteres legíveis sem ambiguidades visuais (evitando 0, O, 1, I)
ALLOWED_CHARS = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"


def gerar_protocolo(tamanho: int = 4) -> str:
    """
    Gera um protocolo único legível (RN-01), ex.: 'PAL-4Q7K'.
    Utiliza caracteres alfanuméricos sem ambiguidades para fácil identificação verbal.
    """
    codigo = "".join(random.choices(ALLOWED_CHARS, k=tamanho))
    return f"PAL-{codigo}"
