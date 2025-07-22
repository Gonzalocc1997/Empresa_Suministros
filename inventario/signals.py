from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db.models import Sum
from .models import DetalleCompra, DetalleVenta, Producto, Compra, Venta

# -------------------------
# ACTUALIZACIÓN DE STOCK
# -------------------------

# Cuando se crea un DetalleCompra, aumenta el stock del producto
@receiver(post_save, sender=DetalleCompra)
def aumentar_stock_al_comprar(sender, instance, created, **kwargs):
    if created:
        producto = instance.producto
        producto.stock += instance.cantidad
        producto.save()

# Si se elimina un DetalleCompra, se resta el stock del producto
@receiver(post_delete, sender=DetalleCompra)
def restar_stock_al_eliminar_compra(sender, instance, **kwargs):
    producto = instance.producto
    producto.stock -= instance.cantidad
    if producto.stock < 0:
        producto.stock = 0
    producto.save()

# Cuando se crea un DetalleVenta, se descuenta el stock del producto
@receiver(post_save, sender=DetalleVenta)
def restar_stock_al_vender(sender, instance, created, **kwargs):
    if created:
        producto = instance.producto
        producto.stock -= instance.cantidad
        if producto.stock < 0:
            producto.stock = 0
        producto.save()

# Si se elimina un DetalleVenta, se devuelve el stock al producto
@receiver(post_delete, sender=DetalleVenta)
def devolver_stock_al_cancelar_venta(sender, instance, **kwargs):
    producto = instance.producto
    producto.stock += instance.cantidad
    producto.save()

# -------------------------
# ACTUALIZACIÓN DE TOTALES
# -------------------------

def actualizar_total_compra(compra):
    total = DetalleCompra.objects.filter(compra=compra).aggregate(suma=Sum('subtotal'))['suma'] or 0
    compra.total = total
    compra.save()

def actualizar_total_venta(venta):
    total = DetalleVenta.objects.filter(venta=venta).aggregate(suma=Sum('subtotal'))['suma'] or 0
    venta.total = total
    venta.save()

@receiver(post_save, sender=DetalleCompra)
def actualizar_total_compra_al_guardar(sender, instance, **kwargs):
    actualizar_total_compra(instance.compra)

@receiver(post_delete, sender=DetalleCompra)
def actualizar_total_compra_al_eliminar(sender, instance, **kwargs):
    actualizar_total_compra(instance.compra)

@receiver(post_save, sender=DetalleVenta)
def actualizar_total_venta_al_guardar(sender, instance, **kwargs):
    actualizar_total_venta(instance.venta)

@receiver(post_delete, sender=DetalleVenta)
def actualizar_total_venta_al_eliminar(sender, instance, **kwargs):
    actualizar_total_venta(instance.venta)
