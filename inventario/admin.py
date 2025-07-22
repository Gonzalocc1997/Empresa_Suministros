# Importamos el módulo admin para registrar modelos en el panel de administración
from django.contrib import admin

# Importamos todos los modelos que hemos definido en models.py
from .models import Producto, Cliente, Proveedor, Compra, DetalleCompra, Venta, DetalleVenta

# Registramos el modelo Producto para que aparezca en el admin
@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    # Campos que se mostrarán en la lista principal del admin para Productos
    list_display = ('nombre', 'precio', 'stock')
    # Campos por los que se podrá realizar búsqueda rápida
    search_fields = ('nombre',)
    # Filtros laterales para filtrar productos por precio
    list_filter = ('precio',)

# Registramos el modelo Cliente en el admin
@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    # Campos visibles en la lista de clientes
    list_display = ('nombre', 'email', 'telefono')
    # Búsqueda rápida por nombre o email
    search_fields = ('nombre', 'email')
    # Filtro lateral por nombre del cliente
    list_filter = ('nombre',)

# Registramos el modelo Proveedor
@admin.register(Proveedor)
class ProveedorAdmin(admin.ModelAdmin):
    # Campos visibles en la lista de proveedores
    list_display = ('nombre', 'contacto', 'telefono')
    # Búsqueda por nombre del proveedor o contacto
    search_fields = ('nombre', 'contacto')
    # Filtro lateral por nombre del proveedor
    list_filter = ('nombre',)

# Registramos el modelo Compra
@admin.register(Compra)
class CompraAdmin(admin.ModelAdmin):
    # Mostramos id de compra, proveedor, fecha y total
    list_display = ('id', 'proveedor', 'fecha', 'total')
    # Permitimos buscar por nombre del proveedor (relación ForeignKey)
    search_fields = ('proveedor__nombre',)
    # Filtro lateral por fecha de la compra
    list_filter = ('fecha',)

# Registramos DetalleCompra, que guarda cada producto comprado en una compra
@admin.register(DetalleCompra)
class DetalleCompraAdmin(admin.ModelAdmin):
    # Campos visibles: la compra relacionada, el producto, cantidad y precio unitario
    list_display = ('compra', 'producto', 'cantidad', 'precio_unitario')
    # Búsqueda por nombre del producto
    search_fields = ('producto__nombre',)
    # Filtramos por la compra a la que pertenece el detalle
    list_filter = ('compra',)

# Registramos el modelo Venta
@admin.register(Venta)
class VentaAdmin(admin.ModelAdmin):
    # Mostramos id de venta, cliente, fecha y total
    list_display = ('id', 'cliente', 'fecha', 'total')
    # Búsqueda por nombre del cliente (relación ForeignKey)
    search_fields = ('cliente__nombre',)
    # Filtrar por fecha de venta
    list_filter = ('fecha',)

# Registramos DetalleVenta, que guarda cada producto vendido en una venta
@admin.register(DetalleVenta)
class DetalleVentaAdmin(admin.ModelAdmin):
    # Mostramos la venta relacionada, producto, cantidad, precio unitario y subtotal
    list_display = ('venta', 'producto', 'cantidad', 'precio_unitario', 'subtotal')
    # Búsqueda por nombre de producto vendido
    search_fields = ('producto__nombre',)
    # Filtrar por la venta a la que pertenece el detalle
    list_filter = ('venta',)
