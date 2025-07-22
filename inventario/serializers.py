from rest_framework import serializers
from django.db import transaction  # Para manejar transacciones atómicas
from .models import (
    Producto, Cliente, Proveedor,
    Compra, DetalleCompra,
    Venta, DetalleVenta
)

# =======================
# Serializador para Producto
# =======================
class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'

    def validate_nombre(self, value):
        if not value.strip():
            raise serializers.ValidationError('Debe ingresar un nombre válido')
        return value

    def validate_precio(self, value):
        if value <= 0:
            raise serializers.ValidationError('El precio debe ser mayor a 0')
        return value

    def validate_stock(self, value):
        if value < 0:
            raise serializers.ValidationError('El stock no puede ser negativo')
        return value


# =======================
# Serializador para Cliente
# =======================
class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'

    def validate_nombre(self, value):
        if not value.strip():
            raise serializers.ValidationError("El nombre no puede estar vacío")
        cliente_id = self.instance.id if self.instance else None
        if Cliente.objects.filter(nombre__iexact=value).exclude(id=cliente_id).exists():
            raise serializers.ValidationError("El nombre ya existe en la lista de clientes")
        return value


# =======================
# Serializador para Proveedor
# =======================
class ProveedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proveedor
        fields = '__all__'

    def validate_nombre(self, value):
        if not value.strip():
            raise serializers.ValidationError("El nombre no puede estar vacío")
        proveedor_id = self.instance.id if self.instance else None
        if Proveedor.objects.filter(nombre__iexact=value).exclude(id=proveedor_id).exists():
            raise serializers.ValidationError("El nombre ya existe en la lista de proveedores")
        return value


# =======================
# Serializador para DetalleCompra
# =======================
class DetalleCompraSerializer(serializers.ModelSerializer):
    # subtotal no debe ser editable, se calcula automáticamente
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = DetalleCompra
        fields = '__all__'  # compra, producto, cantidad, precio_unitario, subtotal

    def validate_cantidad(self, value):
        if value <= 0:
            raise serializers.ValidationError("La cantidad debe ser mayor a 0")
        return value

    def validate_precio_unitario(self, value):
        if value < 0:
            raise serializers.ValidationError("El precio unitario no puede ser negativo")
        return value

    def validate(self, data):
        # Calculamos el subtotal y validamos que sea correcto
        cantidad = data.get('cantidad')
        precio_unitario = data.get('precio_unitario')
        subtotal_calculado = cantidad * precio_unitario
        # No permitimos que el subtotal enviado sea diferente del calculado (en este caso es read_only, así que viene vacío)
        # Simplemente nos aseguramos que los datos estén consistentes
        if subtotal_calculado < 0:
            raise serializers.ValidationError("El subtotal calculado no puede ser negativo")
        return data

    def create(self, validated_data):
        # Calculamos subtotal automáticamente
        validated_data['subtotal'] = validated_data['cantidad'] * validated_data['precio_unitario']
        detalle_compra = super().create(validated_data)
        # Actualizamos stock del producto sumando la cantidad comprada
        producto = detalle_compra.producto
        producto.stock += detalle_compra.cantidad
        producto.save()
        return detalle_compra

    def update(self, instance, validated_data):
        # Para actualizar stock correctamente, calculamos diferencia entre nueva y vieja cantidad
        old_cantidad = instance.cantidad
        new_cantidad = validated_data.get('cantidad', instance.cantidad)
        validated_data['subtotal'] = new_cantidad * validated_data.get('precio_unitario', instance.precio_unitario)

        detalle_compra = super().update(instance, validated_data)

        diferencia = new_cantidad - old_cantidad
        producto = detalle_compra.producto
        producto.stock += diferencia  # sumamos diferencia (puede ser negativo)
        if producto.stock < 0:
            raise serializers.ValidationError("No se puede dejar stock negativo")
        producto.save()
        return detalle_compra

# =======================
# Serializador para compra
# =======================
from rest_framework import serializers
from .models import Compra, DetalleCompra

class DetalleCompraSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetalleCompra
        fields = ['producto', 'cantidad', 'precio_unitario']

class CompraSerializer(serializers.ModelSerializer):
    # Relación anidada: una compra contiene varios detalles
    detalles = DetalleCompraSerializer(many=True)

    class Meta:
        model = Compra
        fields = ['id', 'proveedor', 'fecha', 'total', 'detalles']

    def validate(self, data):
        """
        Validar que el total coincida con la suma de subtotales de cada detalle.
        """
        total_calculado = sum(
            d['cantidad'] * d['precio_unitario'] for d in data['detalles']
        )
        if round(data['total'], 2) != round(total_calculado, 2):
            raise serializers.ValidationError(
                f"El total no coincide con la suma de los subtotales. Debería ser: {total_calculado:.2f}"
            )
        return data

    def create(self, validated_data):
        """
        Crear una compra con detalles anidados.
        """
        detalles_data = validated_data.pop('detalles')
        compra = Compra.objects.create(**validated_data)
        for detalle in detalles_data:
            DetalleCompra.objects.create(compra=compra, **detalle)
        return compra

    def update(self, instance, validated_data):
        """
        Actualizar una compra y reemplazar todos sus detalles.
        """
        detalles_data = validated_data.pop('detalles')
        instance.proveedor = validated_data.get('proveedor', instance.proveedor)
        instance.fecha = validated_data.get('fecha', instance.fecha)
        instance.total = validated_data.get('total', instance.total)
        instance.save()

        # Eliminar todos los detalles existentes antes de volver a crear
        instance.detalles.all().delete()

        for detalle in detalles_data:
            DetalleCompra.objects.create(compra=instance, **detalle)

        return instance



# =======================
# Serializador para DetalleVenta
# =======================
class DetalleVentaSerializer(serializers.ModelSerializer):
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = DetalleVenta
        fields = '__all__'  # venta, producto, cantidad, precio_unitario, subtotal

    def validate_cantidad(self, value):
        if value <= 0:
            raise serializers.ValidationError("La cantidad debe ser mayor a 0")
        return value

    def validate_precio_unitario(self, value):
        if value < 0:
            raise serializers.ValidationError("El precio unitario no puede ser negativo")
        return value

    def validate(self, data):
        cantidad = data.get('cantidad')
        precio_unitario = data.get('precio_unitario')
        subtotal_calculado = cantidad * precio_unitario
        if subtotal_calculado < 0:
            raise serializers.ValidationError("El subtotal calculado no puede ser negativo")
        return data

    def create(self, validated_data):
        validated_data['subtotal'] = validated_data['cantidad'] * validated_data['precio_unitario']
        detalle_venta = super().create(validated_data)

        # Al crear una venta, restamos stock del producto
        producto = detalle_venta.producto
        if producto.stock < detalle_venta.cantidad:
            raise serializers.ValidationError("No hay suficiente stock para realizar la venta")
        producto.stock -= detalle_venta.cantidad
        producto.save()

        return detalle_venta

    def update(self, instance, validated_data):
        old_cantidad = instance.cantidad
        new_cantidad = validated_data.get('cantidad', instance.cantidad)
        validated_data['subtotal'] = new_cantidad * validated_data.get('precio_unitario', instance.precio_unitario)

        detalle_venta = super().update(instance, validated_data)

        diferencia = new_cantidad - old_cantidad
        producto = detalle_venta.producto
        if producto.stock < diferencia:
            raise serializers.ValidationError("No hay suficiente stock para actualizar la venta")
        producto.stock -= diferencia  # restamos la diferencia al stock
        if producto.stock < 0:
            raise serializers.ValidationError("No se puede dejar stock negativo")
        producto.save()
        return detalle_venta


# =======================
# Serializador para Venta
# =======================
from rest_framework import serializers
from .models import Venta, DetalleVenta

class DetalleVentaSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetalleVenta
        fields = ['producto', 'cantidad', 'precio_unitario']

class VentaSerializer(serializers.ModelSerializer):
    # Usamos 'detalles' porque ese es el related_name en el modelo
    detalles = DetalleVentaSerializer(many=True)

    class Meta:
        model = Venta
        fields = ['id', 'cliente', 'fecha', 'total', 'detalles']

    def validate(self, data):
        """
        Validar que el total sea igual a la suma de subtotales de los detalles.
        """
        total_calculado = sum(
            d['cantidad'] * d['precio_unitario'] for d in data['detalles']
        )
        if round(data['total'], 2) != round(total_calculado, 2):
            raise serializers.ValidationError(
                f"El total no coincide con la suma de los subtotales. Debería ser: {total_calculado:.2f}"
            )
        return data

    def create(self, validated_data):
        """
        Crear una venta con detalles anidados.
        """
        detalles_data = validated_data.pop('detalles')
        venta = Venta.objects.create(**validated_data)
        for detalle in detalles_data:
            DetalleVenta.objects.create(venta=venta, **detalle)
        return venta

    def update(self, instance, validated_data):
        """
        Actualizar una venta y reemplazar sus detalles.
        """
        detalles_data = validated_data.pop('detalles')
        instance.cliente = validated_data.get('cliente', instance.cliente)
        instance.fecha = validated_data.get('fecha', instance.fecha)
        instance.total = validated_data.get('total', instance.total)
        instance.save()

        # Borra los detalles anteriores
        instance.detalles.all().delete()

        # Crea los nuevos detalles
        for detalle in detalles_data:
            DetalleVenta.objects.create(venta=instance, **detalle)

        return instance
