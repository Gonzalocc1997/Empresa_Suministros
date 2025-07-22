from django.views.generic import ListView, CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy
from django.contrib import messages
from django.shortcuts import redirect
from inventario.models import Producto
from inventario.forms import ProductoForm
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import ListView, DeleteView, UpdateView, CreateView




# -------------------------------------------------------------------
# 📦 Vista para listar todos los productos
# -------------------------------------------------------------------
class ProductoListView(LoginRequiredMixin,ListView):
    model = Producto
    template_name = 'inventario/producto_list.html'
    context_object_name = 'productos'  # Nombre de la variable en la plantilla (opcional pero claro)


# -------------------------------------------------------------------
# 🆕 Vista para crear un nuevo producto usando ProductoForm
# -------------------------------------------------------------------
class ProductoCreateView(LoginRequiredMixin,CreateView):
    model = Producto
    form_class = ProductoForm  # ✅ Usamos nuestro formulario con validaciones
    template_name = 'inventario/producto_form.html'
    success_url = reverse_lazy('producto-list')

    def form_valid(self, form):
        messages.success(self.request, "✅ Producto creado exitosamente.")
        return super().form_valid(form)

    def form_invalid(self, form):
        messages.error(self.request, "❌ Error al crear el producto. Revisa los datos.")
        return super().form_invalid(form)


# -------------------------------------------------------------------
# ✏️ Vista para actualizar un producto usando ProductoForm
# -------------------------------------------------------------------
class ProductoUpdateView(LoginRequiredMixin,UpdateView):
    model = Producto
    form_class = ProductoForm  # ✅ También usamos el formulario con validaciones
    template_name = 'inventario/producto_form.html'
    success_url = reverse_lazy('producto-list')

    def form_valid(self, form):
        messages.success(self.request, "✅ Producto actualizado correctamente.")
        return super().form_valid(form)

    def form_invalid(self, form):
        messages.error(self.request, "❌ Error al actualizar el producto. Revisa los datos.")
        return super().form_invalid(form)


# -------------------------------------------------------------------
# 🗑️ Vista para eliminar un producto
# -------------------------------------------------------------------
class ProductoDeleteView(LoginRequiredMixin,DeleteView):
    model = Producto
    template_name = 'inventario/producto_confirm_delete.html'
    success_url = reverse_lazy('producto-list')

    def delete(self, request, *args, **kwargs):
        messages.success(self.request, "🗑️ Producto eliminado correctamente.")
        return super().delete(request, *args, **kwargs)
