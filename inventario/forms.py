from django import forms
from django.forms import inlineformset_factory
from django.contrib.auth.forms import AuthenticationForm
from django.core.exceptions import ValidationError
from .models import (
    Cliente, Proveedor, Producto,
    Compra, Venta,
    DetalleCompra, DetalleVenta
)

# ---------------------------------------------------------
# 📦 FORMULARIO DE CLIENTE
# ---------------------------------------------------------
class ClienteForm(forms.ModelForm):
    class Meta:
        model = Cliente
        fields = ['nombre', 'email', 'telefono']

    def clean_nombre(self):
        return self.cleaned_data.get('nombre', '').strip()

    def clean_telefono(self):
        telefono = self.cleaned_data.get('telefono', '').strip()
        if telefono and (not telefono.isdigit() or len(telefono) not in [9, 10]):
            raise ValidationError("El teléfono debe contener sólo números y tener 9 o 10 dígitos.")
        return telefono

    def clean_email(self):
        email = self.cleaned_data.get('email', '').strip()
        qs = Cliente.objects.filter(email=email)
        if self.instance.pk:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise ValidationError("Ya existe un cliente con este email.")
        return email

# ---------------------------------------------------------
# 📦 FORMULARIO DE PROVEEDOR
# ---------------------------------------------------------
class ProveedorForm(forms.ModelForm):
    class Meta:
        model = Proveedor
        fields = ['nombre', 'email', 'telefono']

    def clean_nombre(self):
        return self.cleaned_data.get('nombre', '').strip()

    def clean_telefono(self):
        telefono = self.cleaned_data.get('telefono', '').strip()
        if telefono and (not telefono.isdigit() or len(telefono) not in [9, 10]):
            raise ValidationError("El teléfono debe contener sólo números y tener 9 o 10 dígitos.")
        return telefono

    def clean_email(self):
        email = self.cleaned_data.get('email', '').strip()
        qs = Proveedor.objects.filter(email=email)
        if self.instance.pk:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise ValidationError("Ya existe un proveedor con este email.")
        return email

# ---------------------------------------------------------
# 📦 FORMULARIO DE PRODUCTO
# ---------------------------------------------------------
class ProductoForm(forms.ModelForm):
    class Meta:
        model = Producto
        fields = ['nombre', 'descripcion', 'precio', 'stock']

    def clean_nombre(self):
        return self.cleaned_data.get('nombre', '').strip()

    def clean_precio(self):
        precio = self.cleaned_data.get('precio')
        if precio < 0:
            raise ValidationError("El precio no puede ser negativo.")
        return precio

    def clean_stock(self):
        stock = self.cleaned_data.get('stock')
        if stock < 0:
            raise ValidationError("El stock no puede ser negativo.")
        return stock

# ---------------------------------------------------------
# 📦 FORMULARIO DE COMPRA
# ---------------------------------------------------------
class CompraForm(forms.ModelForm):
    class Meta:
        model = Compra
        fields = ['proveedor']

DetalleCompraFormSet = inlineformset_factory(
    Compra, DetalleCompra,
    fields=['producto', 'cantidad', 'precio_unitario'],
    extra=1, can_delete=True
)

# ---------------------------------------------------------
# 📤 FORMULARIO DE VENTA
# ---------------------------------------------------------
class VentaForm(forms.ModelForm):
    class Meta:
        model = Venta
        fields = ['cliente']

DetalleVentaFormSet = inlineformset_factory(
    Venta, DetalleVenta,
    fields=['producto', 'cantidad', 'precio_unitario'],
    extra=1, can_delete=True
)

# ---------------------------------------------------------
# 🔒 FORMULARIO DE LOGIN
# ---------------------------------------------------------
class LoginForm(AuthenticationForm):
    username = forms.CharField(
        label='Usuario',
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Usuario'})
    )
    password = forms.CharField(
        label='Contraseña',
        widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Contraseña'})
    )
