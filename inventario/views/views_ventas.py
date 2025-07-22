# inventario/views/views_ventas.py

from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse_lazy
from django.views.generic import ListView, DeleteView

from ..models import Venta, DetalleVenta
from ..forms import VentaForm, DetalleVentaFormSet

# 📋 Listar ventas (requiere login)
class VentaListView(LoginRequiredMixin, ListView):
    login_url = 'login'
    redirect_field_name = 'next'
    model = Venta
    template_name = 'inventario/lista_ventas.html'
    context_object_name = 'ventas'

# ➕ Crear venta con formset (requiere login)
@login_required(login_url='login')
def VentaCreateView(request):
    venta = Venta()
    form = VentaForm(request.POST or None, instance=venta)
    formset = DetalleVentaFormSet(request.POST or None, instance=venta)

    if request.method == 'POST':
        if form.is_valid() and formset.is_valid():
            venta = form.save()
            formset.instance = venta
            formset.save()
            messages.success(request, "✅ Venta creada correctamente.")
            return redirect('lista_ventas')
        else:
            messages.error(request, "❌ Revisa los errores del formulario.")

    return render(request, 'inventario/crear_venta.html', {
        'form': form,
        'formset': formset
    })

# ✏️ Editar venta con formset (requiere login)
@login_required(login_url='login')
def VentaUpdateView(request, pk):
    venta = get_object_or_404(Venta, pk=pk)
    form = VentaForm(request.POST or None, instance=venta)
    formset = DetalleVentaFormSet(request.POST or None, instance=venta)

    if request.method == 'POST':
        if form.is_valid() and formset.is_valid():
            form.save()
            formset.save()
            messages.success(request, "✅ Venta actualizada correctamente.")
            return redirect('lista_ventas')
        else:
            messages.error(request, "❌ Revisa los errores del formulario.")

    return render(request, 'inventario/crear_venta.html', {
        'form': form,
        'formset': formset
    })

# 🗑️ Eliminar venta (requiere login)
class VentaDeleteView(LoginRequiredMixin, DeleteView):
    login_url = 'login'
    redirect_field_name = 'next'
    model = Venta
    template_name = 'inventario/venta_confirm_delete.html'
    success_url = reverse_lazy('lista_ventas')

    def delete(self, request, *args, **kwargs):
        messages.success(self.request, "🗑️ Venta eliminada correctamente.")
        return super().delete(request, *args, **kwargs)
