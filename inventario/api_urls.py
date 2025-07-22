from django.urls import path

# Importamos todas las vistas de la API definidas en views_api.py
from .views.views_api import (
    ProductoListCreateView, ProductoRetrieveUpdateDestroyView,
    ClienteListCreateView, ClienteRetrieveUpdateDestroyView,
    ProveedorListCreateView, ProveedorRetrieveUpdateDestroyView,
    CompraListCreateView, CompraRetrieveUpdateDestroyView,
    DetalleCompraListCreateView, DetalleCompraRetrieveUpdateDestroyView,
    VentaListCreateView, VentaRetrieveUpdateDestroyView,
    DetalleVentaListCreateView, DetalleVentaRetrieveUpdateDestroyView,
)

# Definimos las rutas de la API, agrupadas por recurso
urlpatterns = [

    # ==================== PRODUCTOS ====================
    path('productos/', ProductoListCreateView.as_view(), name='api-producto-list-create'),
    path('productos/<int:pk>/', ProductoRetrieveUpdateDestroyView.as_view(), name='api-producto-detail'),

    # ==================== CLIENTES ====================
    path('clientes/', ClienteListCreateView.as_view(), name='api-cliente-list-create'),
    path('clientes/<int:pk>/', ClienteRetrieveUpdateDestroyView.as_view(), name='api-cliente-detail'),

    # ==================== PROVEEDORES ====================
    path('proveedores/', ProveedorListCreateView.as_view(), name='api-proveedor-list-create'),
    path('proveedores/<int:pk>/', ProveedorRetrieveUpdateDestroyView.as_view(), name='api-proveedor-detail'),

    # ==================== COMPRAS ====================
    path('compras/', CompraListCreateView.as_view(), name='api-compra-list-create'),
    path('compras/<int:pk>/', CompraRetrieveUpdateDestroyView.as_view(), name='api-compra-detail'),

    # ==================== DETALLES DE COMPRA ====================
    path('detalles-compra/', DetalleCompraListCreateView.as_view(), name='api-detalles-compra-list-create'),
    path('detalles-compra/<int:pk>/', DetalleCompraRetrieveUpdateDestroyView.as_view(), name='api-detalles-compra-detail'),

    # ==================== VENTAS ====================
    path('ventas/', VentaListCreateView.as_view(), name='api-venta-list-create'),
    path('ventas/<int:pk>/', VentaRetrieveUpdateDestroyView.as_view(), name='api-venta-detail'),

    # ==================== DETALLES DE VENTA ====================
    path('detalles-venta/', DetalleVentaListCreateView.as_view(), name='api-detalles-venta-list-create'),
    path('detalles-venta/<int:pk>/', DetalleVentaRetrieveUpdateDestroyView.as_view(), name='api-detalles-venta-detail'),

    # NUEVO ENDPOINT PARA VALIDACIÓN DE TOKEN (puede agregarse aquí si lo necesitas)
]
