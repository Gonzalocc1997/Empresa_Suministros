# inventario/views/views_compras.py

from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from django.views.generic import ListView, CreateView, UpdateView, DeleteView

from ..models import Compra, DetalleCompra
from ..forms import CompraForm, DetalleCompraFormSet

# -------------------------------------------------------------------
# 📋 Listar todas las compras (requiere autenticación)
# -------------------------------------------------------------------
class CompraListView(LoginRequiredMixin, ListView):
    login_url = 'login'                  # Ruta a la que redirige en caso de no estar autenticado
    redirect_field_name = 'next'
    model = Compra
    template_name = 'inventario/lista_compras.html'
    context_object_name = 'compras'      # Nombre de la variable usada en la plantilla

# -------------------------------------------------------------------
# ➕ Crear una compra con líneas (formset) (requiere autenticación)
# -------------------------------------------------------------------
class CompraCreateView(LoginRequiredMixin, CreateView):
    login_url = 'login'
    redirect_field_name = 'next'
    model = Compra
    form_class = CompraForm
    template_name = 'inventario/crear_compra.html'
    success_url = reverse_lazy('lista_compras')

    def get_context_data(self, **kwargs):
        # Incluimos el formset en el contexto para renderizar líneas de detalle
        context = super().get_context_data(**kwargs)
        context['formset'] = DetalleCompraFormSet(
            self.request.POST or None,
            instance=self.object
        )
        return context

    def form_valid(self, form):
        # Validar tanto el formulario como el formset antes de guardar
        context = self.get_context_data()
        formset = context['formset']
        if form.is_valid() and formset.is_valid():
            messages.success(self.request, "✅ Compra creada correctamente.")
            self.object = form.save()
            formset.instance = self.object
            formset.save()
            return super().form_valid(form)
        else:
            messages.error(self.request, "❌ Revisa los errores del formulario.")
            return self.form_invalid(form)

# -------------------------------------------------------------------
# ✏️ Editar una compra existente con formset (requiere autenticación)
# -------------------------------------------------------------------
class CompraUpdateView(LoginRequiredMixin, UpdateView):
    login_url = 'login'
    redirect_field_name = 'next'
    model = Compra
    form_class = CompraForm
    template_name = 'inventario/crear_compra.html'
    success_url = reverse_lazy('lista_compras')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['formset'] = DetalleCompraFormSet(
            self.request.POST or None,
            instance=self.object
        )
        return context

    def form_valid(self, form):
        context = self.get_context_data()
        formset = context['formset']
        if form.is_valid() and formset.is_valid():
            messages.success(self.request, "✅ Compra actualizada correctamente.")
            self.object = form.save()
            formset.instance = self.object
            formset.save()
            return super().form_valid(form)
        else:
            messages.error(self.request, "❌ Revisa los errores del formulario.")
            return self.form_invalid(form)

# -------------------------------------------------------------------
# 🗑️ Eliminar una compra (requiere autenticación)
# -------------------------------------------------------------------
class CompraDeleteView(LoginRequiredMixin, DeleteView):
    login_url = 'login'
    redirect_field_name = 'next'
    model = Compra
    template_name = 'inventario/compra_confirm_delete.html'
    success_url = reverse_lazy('lista_compras')

    def delete(self, request, *args, **kwargs):
        messages.success(self.request, "🗑️ Compra eliminada correctamente.")
        return super().delete(request, *args, **kwargs)
