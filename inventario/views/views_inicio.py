from django.shortcuts import render

def inicio(request):
    """
    Vista inicial de la aplicación.
    Renderiza una plantilla HTML de bienvenida.
    """
    return render(request, 'inventario/inicio.html')
