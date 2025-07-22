# inventario/urls.py

from django.urls import path
from django.contrib.auth import views as auth_views
from .forms import LoginForm

# Vista de inicio (home)
from .views.views_inicio import inicio

# ——— CRUD Productos ———
from .views.views_productos import (
    ProductoListView,
    ProductoCreateView,
    ProductoUpdateView,
    ProductoDeleteView,
)

# ——— CRUD Clientes ———
from .views.views_clientes import (
    ClienteListView,
    ClienteCreateView,
    ClienteUpdateView,
    ClienteDeleteView,
)

# ——— CRUD Proveedores ———
from .views.views_proveedores import (
    ProveedorListView,
    ProveedorCreateView,
    ProveedorUpdateView,
    ProveedorDeleteView,
)

# ——— CRUD Compras (interfaz HTML) ———
from .views.views_compras import (
    CompraListView,
    CompraCreateView,    # Clase basada en vistas
    CompraUpdateView,
    CompraDeleteView,
)

# ——— CRUD Ventas (interfaz HTML) ———
from .views.views_ventas import (
    VentaListView,
    VentaCreateView,     # Función decorada con @login_required
    VentaUpdateView,     # Función decorada con @login_required
    VentaDeleteView,
)

urlpatterns = [
    # -------------------------------
    # RUTA DE INICIO (HOME)
    # -------------------------------
    path('', inicio, name='inicio'),

    # -------------------------------
    # RUTAS DE PRODUCTOS
    # -------------------------------
    path('productos/',                   ProductoListView.as_view(),   name='producto-list'),
    path('productos/nuevo/',             ProductoCreateView.as_view(), name='producto-create'),
    path('productos/<int:pk>/editar/',   ProductoUpdateView.as_view(), name='producto-update'),
    path('productos/<int:pk>/eliminar/', ProductoDeleteView.as_view(), name='producto-delete'),

    # -------------------------------
    # RUTAS DE CLIENTES
    # -------------------------------
    path('clientes/',                   ClienteListView.as_view(),   name='cliente-list'),
    path('clientes/nuevo/',             ClienteCreateView.as_view(), name='cliente-create'),
    path('clientes/<int:pk>/editar/',   ClienteUpdateView.as_view(), name='cliente-update'),
    path('clientes/<int:pk>/eliminar/', ClienteDeleteView.as_view(), name='cliente-delete'),

    # -------------------------------
    # RUTAS DE PROVEEDORES
    # -------------------------------
    path('proveedores/',                   ProveedorListView.as_view(),   name='proveedor-list'),
    path('proveedores/nuevo/',             ProveedorCreateView.as_view(), name='proveedor-create'),
    path('proveedores/<int:pk>/editar/',   ProveedorUpdateView.as_view(), name='proveedor-update'),
    path('proveedores/<int:pk>/eliminar/', ProveedorDeleteView.as_view(), name='proveedor-delete'),

    # -------------------------------
    # RUTAS DE COMPRAS (INTERFAZ HTML)
    # -------------------------------
    path('compras/',                   CompraListView.as_view(),   name='lista_compras'),
    path('compras/nuevo/',             CompraCreateView.as_view(), name='crear_compra'),
    path('compras/<int:pk>/editar/',   CompraUpdateView.as_view(), name='editar_compra'),
    path('compras/<int:pk>/eliminar/', CompraDeleteView.as_view(), name='eliminar_compra'),

    # -------------------------------
    # RUTAS DE VENTAS (INTERFAZ HTML)
    # -------------------------------
    path('ventas/',                   VentaListView.as_view(),   name='lista_ventas'),
    path('ventas/nuevo/',             VentaCreateView,           name='crear_venta'),
    path('ventas/<int:pk>/editar/',   VentaUpdateView,           name='editar_venta'),
    path('ventas/<int:pk>/eliminar/', VentaDeleteView.as_view(), name='eliminar_venta'),

    # -------------------------------
    # AUTENTICACIÓN (Login / Logout)
    # -------------------------------
    # Login con formulario personalizado
    path('login/',
         auth_views.LoginView.as_view(
             template_name='inventario/login.html',
             authentication_form=LoginForm
         ),
         name='login'
    ),
    # Logout por POST desde el form en base.html
    path('logout/',
         auth_views.LogoutView.as_view(),
         name='logout'
    ),
]
