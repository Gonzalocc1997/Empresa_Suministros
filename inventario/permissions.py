# inventario/permissions.py

from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAdminOrReadOnly(BasePermission):
    """
    Permite acceso completo solo a administradores.
    Usuarios normales o no autenticados solo pueden hacer métodos seguros (GET, HEAD, OPTIONS).
    """

    def has_permission(self, request, view):
        # Métodos seguros para cualquiera (GET, HEAD, OPTIONS)
        if request.method in SAFE_METHODS:
            return True
        # Otros métodos solo para usuarios staff (admins)
        return request.user and request.user.is_staff
