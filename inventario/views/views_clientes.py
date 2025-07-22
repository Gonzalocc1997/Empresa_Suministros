# inventario/views/views_clientes.py

from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from django.views.generic import ListView, CreateView, UpdateView, DeleteView

from ..models import Cliente
from ..forms import ClienteForm

# -------------------------------------------------------------------
# 📋 Listar todos los clientes (requiere login)
# -------------------------------------------------------------------
class ClienteListView(LoginRequiredMixin, ListView):
    model = Cliente
    template_name = 'inventario/cliente_list.html'
    context_object_name = 'clientes'
    login_url = 'login'            # Redirige a login si no está autenticado
    redirect_field_name = 'next'

# -------------------------------------------------------------------
# ➕ Crear un cliente (requiere login)
# -------------------------------------------------------------------
class ClienteCreateView(LoginRequiredMixin, CreateView):
    model = Cliente
    form_class = ClienteForm
    template_name = 'inventario/cliente_form.html'
    success_url = reverse_lazy('cliente-list')
    login_url = 'login'
    redirect_field_name = 'next'

    def form_valid(self, form):
        messages.success(self.request, "✅ Cliente creado correctamente.")
        return super().form_valid(form)

    def form_invalid(self, form):
        messages.error(self.request, "❌ Error al crear el cliente. Revisa los datos.")
        return super().form_invalid(form)

# -------------------------------------------------------------------
# ✏️ Editar un cliente (requiere login)
# -------------------------------------------------------------------
class ClienteUpdateView(LoginRequiredMixin, UpdateView):
    model = Cliente
    form_class = ClienteForm
    template_name = 'inventario/cliente_form.html'
    success_url = reverse_lazy('cliente-list')
    login_url = 'login'
    redirect_field_name = 'next'

    def form_valid(self, form):
        messages.success(self.request, "✅ Cliente actualizado correctamente.")
        return super().form_valid(form)

    def form_invalid(self, form):
        messages.error(self.request, "❌ Error al actualizar el cliente.")
        return super().form_invalid(form)

# -------------------------------------------------------------------
# 🗑️ Eliminar un cliente (requiere login)
# -------------------------------------------------------------------
class ClienteDeleteView(LoginRequiredMixin, DeleteView):
    model = Cliente
    template_name = 'inventario/cliente_confirm_delete.html'
    success_url = reverse_lazy('cliente-list')
    login_url = 'login'
    redirect_field_name = 'next'

    def delete(self, request, *args, **kwargs):
        messages.success(self.request, "🗑️ Cliente eliminado correctamente.")
        return super().delete(request, *args, **kwargs)
