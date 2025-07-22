from django.db import models

# -------------------------------
# MODELO DE PRODUCTO
# -------------------------------
class Producto(models.Model):
    nombre = models.CharField(max_length=100)  # Nombre del producto
    descripcion = models.TextField(blank=True)  # Descripción (opcional)
    precio = models.DecimalField(max_digits=10, decimal_places=2)  # Precio por unidad
    stock = models.PositiveIntegerField(default=0)  # Cantidad disponible en stock

    def __str__(self):
        return self.nombre


# -------------------------------
# MODELO DE CLIENTE
# -------------------------------
class Cliente(models.Model):
    nombre = models.CharField(max_length=100)
    email = models.EmailField(max_length=100, unique=True)
    telefono = models.CharField(max_length=10, blank=True)
    direccion = models.TextField(blank=True)

    def __str__(self):
        return self.nombre


# -------------------------------
# MODELO DE PROVEEDOR
# -------------------------------
class Proveedor(models.Model):
    nombre = models.CharField(max_length=100)
    contacto = models.CharField(max_length=100, blank=True)
    telefono = models.CharField(max_length=10, blank=True)
    email = models.EmailField(max_length=100, blank=True)

    def __str__(self):
        return self.nombre


# -------------------------------
# MODELO DE COMPRA
# -------------------------------
class Compra(models.Model):
    proveedor = models.ForeignKey(Proveedor, on_delete=models.CASCADE)
    fecha = models.DateField(auto_now_add=True)
    total = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)

    def actualizar_total(self):
        # Suma de subtotales de todos los detalles relacionados
        total = sum([dc.subtotal for dc in self.detalles.all()])
        self.total = total
        self.save()

    def __str__(self):
        return f'Compra #{self.id} - {self.proveedor.nombre}'


# -------------------------------
# MODELO DE DETALLE DE COMPRA
# -------------------------------
class DetalleCompra(models.Model):
    compra = models.ForeignKey(Compra, on_delete=models.CASCADE, related_name='detalles')
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, editable=False)

    def save(self, *args, **kwargs):
        self.subtotal = self.cantidad * self.precio_unitario
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.cantidad} x {self.producto.nombre}'


# -------------------------------
# MODELO DE VENTA
# -------------------------------
class Venta(models.Model):
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name="ventas")
    fecha = models.DateTimeField(auto_now_add=True)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def actualizar_total(self):
        total = sum([dv.subtotal for dv in self.detalles.all()])
        self.total = total
        self.save()

    def __str__(self):
        return f"Venta #{self.id} - {self.cliente.nombre}"


# -------------------------------
# MODELO DE DETALLE DE VENTA
# -------------------------------
class DetalleVenta(models.Model):
    venta = models.ForeignKey(Venta, on_delete=models.CASCADE, related_name="detalles")
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, editable=False)

    def save(self, *args, **kwargs):
        self.subtotal = self.cantidad * self.precio_unitario
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.cantidad} x {self.producto.nombre}"
