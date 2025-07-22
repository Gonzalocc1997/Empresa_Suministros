from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
#Response
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    """
    GET /api/me/ → devuelve 200 + { id, username }
    si el JWT es válido, o 401 si no lo es.
    """
    user = request.user
    return Response({
        'id': user.id,
        'username': user.username,
    })


# Importamos los modelos que vamos a gestionar desde la API
from inventario.models import (
    Producto, Cliente, Proveedor,
    Compra, DetalleCompra,
    Venta, DetalleVenta
)

# Importamos los serializers que transforman los modelos en JSON y viceversa
from inventario.serializers import (
    ProductoSerializer, ClienteSerializer, ProveedorSerializer,
    CompraSerializer, DetalleCompraSerializer,
    VentaSerializer, DetalleVentaSerializer
)

# ==================== PRODUCTOS ====================
class ProductoListCreateView(generics.ListCreateAPIView):
    """
    Vista para listar todos los productos o crear uno nuevo.
    Usamos ListCreateAPIView que maneja GET para lista y POST para crear.
    Ordenamos los productos por 'id' para asegurar un orden consistente en la lista.
    Solo usuarios autenticados pueden acceder.
    """
    queryset = Producto.objects.all().order_by('id')  # Orden explícito por 'id'
    serializer_class = ProductoSerializer
    permission_classes = [IsAuthenticated]

class ProductoRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    Vista para obtener, actualizar o eliminar un producto específico por su ID.
    Solo usuarios autenticados pueden acceder.
    """
    queryset = Producto.objects.all().order_by('id')
    serializer_class = ProductoSerializer
    permission_classes = [IsAuthenticated]

# ==================== CLIENTES ====================
class ClienteListCreateView(generics.ListCreateAPIView):
    """
    Vista para listar todos los clientes o crear uno nuevo.
    Ordenamos los clientes por 'nombre' para que la lista sea más amigable al usuario.
    Solo usuarios autenticados pueden acceder.
    """
    queryset = Cliente.objects.all().order_by('nombre')  # Orden explícito por 'nombre'
    serializer_class = ClienteSerializer
    permission_classes = [IsAuthenticated]

class ClienteRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    Vista para obtener, actualizar o eliminar un cliente específico por su ID.
    Solo usuarios autenticados pueden acceder.
    """
    queryset = Cliente.objects.all().order_by('nombre')
    serializer_class = ClienteSerializer
    permission_classes = [IsAuthenticated]

# ==================== PROVEEDORES ====================
class ProveedorListCreateView(generics.ListCreateAPIView):
    """
    Vista para listar todos los proveedores o crear uno nuevo.
    Ordenamos los proveedores por 'nombre' para facilitar su búsqueda.
    Solo usuarios autenticados pueden acceder.
    """
    queryset = Proveedor.objects.all().order_by('nombre')
    serializer_class = ProveedorSerializer
    permission_classes = [IsAuthenticated]

class ProveedorRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    Vista para obtener, actualizar o eliminar un proveedor específico por su ID.
    Solo usuarios autenticados pueden acceder.
    """
    queryset = Proveedor.objects.all().order_by('nombre')
    serializer_class = ProveedorSerializer
    permission_classes = [IsAuthenticated]

# ==================== COMPRAS ====================

class CompraListCreateView(generics.ListCreateAPIView):
    """
    Vista para listar todas las compras o registrar una nueva compra.
    Ordenamos las compras por 'fecha' para mostrar primero las más antiguas o recientes.
    Solo usuarios autenticados pueden acceder.
    """
    queryset = Compra.objects.all().order_by('fecha')
    # Consulta todas las compras, ordenadas por fecha

    serializer_class = CompraSerializer
    # Se usa este serializer para transformar las compras a JSON y viceversa

    permission_classes = [IsAuthenticated]
    # Solo usuarios autenticados pueden acceder a esta vista (GET y POST)

class CompraRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    Vista para obtener, actualizar o eliminar una compra específica por su ID.
    Solo usuarios autenticados pueden acceder.
    """
    queryset = Compra.objects.all().order_by('fecha')
    # Consulta todas las compras, necesario para poder buscar por ID

    serializer_class = CompraSerializer
    # Serializer que se encarga de la validación y transformación de datos

    permission_classes = [IsAuthenticated]
    # Se requiere estar autenticado para acceder (GET, PUT, DELETE)


# ==================== DETALLES DE COMPRA ====================
class DetalleCompraListCreateView(generics.ListCreateAPIView):
    """
    Vista para listar todos los detalles de compra o crear uno nuevo.
    Ordenamos por 'id' para mantener un orden estable.
    Solo usuarios autenticados pueden acceder.
    """
    queryset = DetalleCompra.objects.all().order_by('id')
    serializer_class = DetalleCompraSerializer
    permission_classes = [IsAuthenticated]

class DetalleCompraRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    Vista para obtener, actualizar o eliminar un detalle de compra específico por su ID.
    Solo usuarios autenticados pueden acceder.
    """
    queryset = DetalleCompra.objects.all().order_by('id')
    serializer_class = DetalleCompraSerializer
    permission_classes = [IsAuthenticated]

# ==================== VENTAS ====================
class VentaListCreateView(generics.ListCreateAPIView):
    """
    Vista para listar todas las ventas o registrar una nueva venta.
    Ordenamos por 'fecha' para mostrar ventas cronológicamente.
    Solo usuarios autenticados pueden acceder.
    """
    queryset = Venta.objects.all().order_by('fecha')
    serializer_class = VentaSerializer
    permission_classes = [IsAuthenticated]

class VentaRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    Vista para obtener, actualizar o eliminar una venta específica por su ID.
    Solo usuarios autenticados pueden acceder.
    """
    queryset = Venta.objects.all().order_by('fecha')
    serializer_class = VentaSerializer
    permission_classes = [IsAuthenticated]

# ==================== DETALLES DE VENTA ====================
class DetalleVentaListCreateView(generics.ListCreateAPIView):
    """
    Vista para listar todos los detalles de venta o crear uno nuevo.
    Ordenamos por 'id' para mantener orden consistente.
    Solo usuarios autenticados pueden acceder.
    """
    queryset = DetalleVenta.objects.all().order_by('id')
    serializer_class = DetalleVentaSerializer
    permission_classes = [IsAuthenticated]

class DetalleVentaRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    Vista para obtener, actualizar o eliminar un detalle de venta específico por su ID.
    Solo usuarios autenticados pueden acceder.
    """
    queryset = DetalleVenta.objects.all().order_by('id')
    serializer_class = DetalleVentaSerializer
    permission_classes = [IsAuthenticated]
