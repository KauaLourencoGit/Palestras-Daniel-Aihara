import os
import warnings
from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Site e Gestão de Palestras — Daniel Aihara"
    ENVIRONMENT: str = "development"
    SECRET_KEY: str = "chave-secreta-desenvolvimento-unitri-grupo4-2026"
    DATABASE_URL: str = "sqlite:///./data/palestras.db"

    # Administrador inicial
    ADMIN_NAME: str = "Daniel Takeo Aihara"
    ADMIN_EMAIL: str = "daniel.aihara@exemplo.com"
    ADMIN_PASSWORD: str = "admin123456"

    # Parâmetros de negócio (RN-02, RN-04, P-01, P-02, P-09)
    PALESTRAS_POR_DIA: int = 1
    DIAS_PRE_RESERVA: int = 7
    ANTECEDENCIA_MINIMA_DIAS: int = 7
    HORIZONTE_MAXIMO_MESES: int = 18
    LIMIT_REQUESTS_PER_IP_HOUR: int = 5
    TIMEZONE: str = "America/Sao_Paulo"

    # Sessão de login do Daniel (RNF-07: expira após 2h sem uso)
    SESSION_COOKIE_NAME: str = "aihara_session"
    SESSION_EXPIRE_HOURS: int = 2

    @model_validator(mode="after")
    def validate_production_secrets(self):
        if self.ENVIRONMENT == "production":
            if self.SECRET_KEY == "chave-secreta-desenvolvimento-unitri-grupo4-2026":
                raise ValueError("CRÍTICO: SECRET_KEY padrão não pode ser utilizada em ambiente de produção!")
            if self.ADMIN_PASSWORD == "admin123456":
                warnings.warn("AVISO: A senha padrão de administrador está configurada para ambiente de produção.")
        return self

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
