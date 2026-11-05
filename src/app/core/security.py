import time
import bcrypt
import hmac
import hashlib
from typing import Dict, List, Tuple
from app.core.config import settings

# Controle de rate limiting em memória para requisições por IP (RN-16, RNF-08)
_ip_requests: Dict[str, List[float]] = {}

# Controle de tentativas de login falhas por e-mail/IP (RNF-07)
# chave: ip_ou_email -> lista de timestamps de falhas
_login_failures: Dict[str, List[float]] = {}
LOGIN_MAX_FAILURES = 5
LOGIN_LOCKOUT_SECONDS = 15 * 60  # 15 minutos


def hash_password(password: str) -> str:
    """Gera hash seguro de senha utilizando bcrypt com salt (RNF-05)."""
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica senha em texto puro contra o hash bcrypt."""
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except Exception:
        return False


def create_session_token(user_id: int, email: str) -> str:
    """Cria token assinado seguro para cookie de sessão HTTP-only (RNF-06)."""
    now = int(time.time())
    payload = f"{user_id}:{email}:{now}"
    signature = hmac.new(
        settings.SECRET_KEY.encode("utf-8"),
        payload.encode("utf-8"),
        hashlib.sha256
    ).hexdigest()
    return f"{payload}:{signature}"


def verify_session_token(token: str) -> Tuple[bool, int, str]:
    """
    Verifica a autenticidade e validade temporal do cookie de sessão.
    Retorna (valido, user_id, email).
    """
    if not token or ":" not in token:
        return False, 0, ""
    try:
        parts = token.split(":")
        if len(parts) != 4:
            return False, 0, ""
        user_id_str, email, timestamp_str, signature = parts
        payload = f"{user_id_str}:{email}:{timestamp_str}"
        expected_sig = hmac.new(
            settings.SECRET_KEY.encode("utf-8"),
            payload.encode("utf-8"),
            hashlib.sha256
        ).hexdigest()

        if not hmac.compare_digest(signature, expected_sig):
            return False, 0, ""

        created_at = int(timestamp_str)
        now = int(time.time())
        max_age_seconds = settings.SESSION_EXPIRE_HOURS * 3600

        # Expira se passar do tempo limite (RNF-07: 2 horas de inatividade)
        if now - created_at > max_age_seconds:
            return False, 0, ""

        return True, int(user_id_str), email
    except Exception:
        return False, 0, ""


def check_rate_limit_ip(ip: str) -> bool:
    """
    Verifica se o IP excedeu o limite de requisições por hora (RN-16, RNF-08).
    Retorna True se permitido, False se bloqueado por excesso de requisições.
    """
    now = time.time()
    one_hour_ago = now - 3600
    timestamps = _ip_requests.get(ip, [])
    # Filtra apenas a última 1 hora
    timestamps = [t for t in timestamps if t > one_hour_ago]
    if len(timestamps) >= settings.LIMIT_REQUESTS_PER_IP_HOUR:
        _ip_requests[ip] = timestamps
        return False
    timestamps.append(now)
    _ip_requests[ip] = timestamps
    return True


def check_login_attempts(identifier: str) -> Tuple[bool, int]:
    """
    Verifica se o identificador (IP ou e-mail) está bloqueado por excesso de falhas (RNF-07).
    Retorna (pode_tentar, minutos_restantes).
    """
    now = time.time()
    window_start = now - LOGIN_LOCKOUT_SECONDS
    failures = _login_failures.get(identifier, [])
    recent_failures = [t for t in failures if t > window_start]
    _login_failures[identifier] = recent_failures

    if len(recent_failures) >= LOGIN_MAX_FAILURES:
        oldest_relevant = min(recent_failures)
        remaining = int((oldest_relevant + LOGIN_LOCKOUT_SECONDS - now) / 60) + 1
        return False, max(1, remaining)
    return True, 0


def record_login_failure(identifier: str):
    """Registra uma falha de tentativa de login."""
    now = time.time()
    failures = _login_failures.get(identifier, [])
    failures.append(now)
    _login_failures[identifier] = failures


def clear_login_failures(identifier: str):
    """Limpa as tentativas após sucesso no login."""
    if identifier in _login_failures:
        del _login_failures[identifier]
