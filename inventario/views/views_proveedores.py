# inventario/views/views_proveedores.py

from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from django.views.generic import ListView, CreateView, UpdateView, DeleteView

from ..models import Proveedor
from ..forms import ProveedorForm

# -------------------------------------------------------------------
# 📋 Listar todos los proveedores (requiere login)
# -------------------------------------------------------------------
class ProveedorListView(LoginRequiredMixin, ListView):
    model = Proveedor
    template_name = 'inventario/proveedor_list.html'
    context_object_name = 'proveedores'
    login_url = 'login'              # Redirige aquí si no está autenticado
    redirect_field_name = 'next'

# -------------------------------------------------------------------
# ➕ Crear un nuevo proveedor (requiere login)
# -------------------------------------------------------------------
class ProveedorCreateView(LoginRequiredMixin, CreateView):
    model = Proveedor
    form_class = ProveedorForm     # Usamos formulario con validaciones
    template_name = 'inventario/proveedor_form.html'
    success_url = reverse_lazy('proveedor-list')
    login_url = 'login'
    redirect_field_name = 'next'

    def form_valid(self, form):
        messages.success(self.request, "✅ Proveedor creado correctamente.")
        return super().form_valid(form)

    def form_invalid(self, form):
        messages.error(self.request, "❌ Error al crear el proveedor. Revisa los datos.")
        return super().form_invalid(form)

# -------------------------------------------------------------------
# ✏️ Editar un proveedor existente (requiere login)
# -------------------------------------------------------------------
class ProveedorUpdateView(LoginRequiredMixin, UpdateView):
    model = Proveedor
    form_class = ProveedorForm     # Usamos mismo formulario
    template_name = 'inventario/proveedor_form.html'
    success_url = reverse_lazy('proveedor-list')
    login_url = 'login'
    redirect_field_name = 'next'

    def form_valid(self, form):
        messages.success(self.request, "✅ Proveedor actualizado correctamente.")
        return super().form_valid(form)

    def form_invalid(self, form):
        messages.error(self.request, "❌ Error al actualizar el proveedor.")
        return super().form_invalid(form)

# -------------------------------------------------------------------
# 🗑️ Eliminar un proveedor (requiere login)
# -------------------------------------------------------------------
class ProveedorDeleteView(LoginRequiredMixin, DeleteView):
    model = Proveedor
    template_name = 'inventario/proveedor_confirm_delete.html'
    success_url = reverse_lazy('proveedor-list')
    login_url = 'login'
    redirect_field_name = 'next'

    def delete(self, request, *args, **kwargs):
        messages.success(self.request, "🗑️ Proveedor eliminado correctamente.")
        return super().delete(request, *args, **kwargs)
