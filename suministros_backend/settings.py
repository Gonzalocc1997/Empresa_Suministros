"""
Configuración principal de Django para el proyecto suministros_backend.

Este archivo fue generado por 'django-admin startproject' y ha sido modificado
para incluir soporte a APIs con Django REST Framework, JWT, CORS, filtros y Swagger.
"""

from pathlib import Path
from datetime import timedelta
from django.contrib.messages import constants as messages
MESSAGE_STORAGE = 'django.contrib.messages.storage.session.SessionStorage'


# Ruta base del proyecto, útil para unir con archivos como la base de datos
BASE_DIR = Path(__file__).resolve().parent.parent

# --- SEGURIDAD ---
# ¡Nunca publiques esta clave en producción!
SECRET_KEY = "django-insecure-ozt8z#jwlj#n*fl)su2mde6che7320isw0=c)w!6-+m6nxs%3s"

# En producción, esto debe ser False para ocultar errores
DEBUG = True

# Lista de dominios permitidos (vacía en desarrollo)
ALLOWED_HOSTS = []

# --- APLICACIONES INSTALADAS ---
INSTALLED_APPS = [
    "django.contrib.admin",            # Panel de administración
    "django.contrib.auth",             # Sistema de usuarios
    "django.contrib.contenttypes",     # Tipado de modelos
    "django.contrib.sessions",         # Soporte de sesiones
    "django.contrib.messages",         # Sistema de mensajes
    "django.contrib.staticfiles",      # Soporte para archivos estáticos

    "rest_framework",                  # Django REST Framework
    "rest_framework.authtoken",        # Autenticación por token clásico (opcional)
    "rest_framework_simplejwt",        # Autenticación con JWT
    "django_filters",                  # Filtros para API (por ejemplo, ?cliente=1)
    "corsheaders",                     # Soporte para CORS (React o frontend externo)
    "drf_yasg",                        # Documentación Swagger automática
    "inventario.apps.InventarioConfig" # Tu app personalizada del proyecto
]

# --- MIDDLEWARES ---
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",           # CORS: debe ir primero
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",  # Mensajes flash
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# --- CORS: permitir peticiones desde el frontend React ---
CORS_ALLOW_ALL_ORIGINS = True
# Para producción, restringir:
# CORS_ALLOWED_ORIGINS = ["http://localhost:3000", "http://localhost:5173"]

# --- ENRUTAMIENTO PRINCIPAL ---
ROOT_URLCONF = "suministros_backend.urls"

# --- CONFIGURACIÓN DE PLANTILLAS (Django Templates) ---
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],  # Puedes añadir rutas de templates globales aquí
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",  # Para request en plantillas
                "django.contrib.auth.context_processors.auth", # Para user y perms
                "django.contrib.messages.context_processors.messages", # Para messages
            ],
        },
    },
]

# --- PUNTO DE ENTRADA WSGI PARA DESPLIEGUE ---
WSGI_APPLICATION = "suministros_backend.wsgi.application"

# --- BASE DE DATOS ---
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",   # SQLite para desarrollo
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# --- VALIDACIÓN DE CONTRASEÑAS ---
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# --- INTERNACIONALIZACIÓN ---
LANGUAGE_CODE = 'es'         # Idioma en español
TIME_ZONE = 'Europe/Madrid'  # Zona horaria de Madrid
USE_I18N = True              # Internacionalización activada
USE_L10N = True              # Formato local para fechas/números
USE_TZ = True                # Soporte de zona horaria (recomendado)

# --- ARCHIVOS ESTÁTICOS ---
STATIC_URL = "static/"

# --- CLAVE PRIMARIA POR DEFECTO ---
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# --- DJANGO REST FRAMEWORK ---
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework.authentication.TokenAuthentication",
        "rest_framework.authentication.SessionAuthentication",
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticatedOrReadOnly",
    ),
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 10,
    "DEFAULT_FILTER_BACKENDS": ("django_filters.rest_framework.DjangoFilterBackend",),
}

# --- CONFIGURACIÓN DE JWT (SimpleJWT) ---
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=30),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "ROTATE_REFRESH_TOKENS": False,
    "BLACKLIST_AFTER_ROTATION": False,
    "AUTH_HEADER_TYPES": ("Bearer",),
}

# --- REDIRECCIONES DE AUTENTICACIÓN ---
# URL a la que se redirige si no estás logueado
LOGIN_URL = "login"
# Tras iniciar sesión, ir al inicio
LOGIN_REDIRECT_URL = "inicio"
# Tras cerrar sesión, volver al login
LOGOUT_REDIRECT_URL = "login"
