"""
ASGI config for suministros_backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/
"""

import os  # Importa módulo para manipular variables del entorno del sistema

from django.core.asgi import get_asgi_application  # Importa la función para crear una app ASGI compatible

# Establece el módulo de configuración por defecto de Django.
# IMPORTANTE: Asegúrate de que el nombre coincida con tu proyecto real.
# Si tu proyecto se llama 'suministros_backend', cambia esto por: 'suministros_backend.settings'
os.environ.setdefault("DJANGO_SETTINGS_MODULE", 'Empresa_suministros.settings')

# Obtiene la aplicación ASGI lista para ser usada por servidores como Uvicorn o Daphne
application = get_asgi_application()

