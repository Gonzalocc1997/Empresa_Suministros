# apps.py dentro de la app 'inventario'

from django.apps import AppConfig

class InventarioConfig(AppConfig):
    # Definimos el tipo de campo automático para las claves primarias
    default_auto_field = 'django.db.models.BigAutoField'

    # Nombre de la app (debe coincidir con la carpeta)
    name = 'inventario'

    # Este método se ejecuta cuando Django carga la app
    def ready(self):
        # Importamos el módulo de señales para activar la lógica automática (como actualizar stock, totales, etc.)
        import inventario.signals
