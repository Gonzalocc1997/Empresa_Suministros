from django.test import TestCase
from inventario.models import Cliente
from django.urls import reverse

# Importamos para testing de API REST con JWT
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User

# ----------------------------
# Test modelo Cliente (DB)
# ----------------------------
class ClienteModelTest(TestCase):
    def setUp(self):
        """
        Método que se ejecuta antes de cada test.
        Creamos un cliente de prueba en la base de datos.
        """
        self.cliente = Cliente.objects.create(
            nombre="Juan Pérez",
            email="juan@example.com",
            telefono="123456789",
            direccion="Calle Falsa 123"
        )

    def test_crear_cliente(self):
        """
        Verifica que el cliente se haya creado correctamente y que
        el método __str__ del modelo retorne el nombre.
        """
        self.assertEqual(self.cliente.nombre, "Juan Pérez")
        self.assertEqual(self.cliente.email, "juan@example.com")
        self.assertEqual(str(self.cliente), "Juan Pérez")  # Asegúrate que en Cliente tienes def __str__

# ----------------------------
# Test API REST para Cliente
# ----------------------------
class ClienteAPITest(APITestCase):
    def setUp(self):
        """
        Creamos un usuario, generamos su token JWT para autenticación
        y creamos un cliente de prueba en la DB para pruebas GET.
        """
        self.user = User.objects.create_user(username='testuser', password='testpass')

        # Creamos token JWT para autenticación
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)

        # Añadimos el token JWT en el header Authorization para todas las peticiones
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token)

        # Creamos un cliente para verificar la lista
        self.cliente = Cliente.objects.create(
            nombre="Sofía Ruiz",
            email="sofia@example.com",
            telefono="000111222",
            direccion="Calle Luna 321"
        )

    def test_listar_clientes_api(self):
        """
        Prueba que el endpoint GET /api/clientes/ devuelve la lista
        y al menos un cliente está presente.
        """
        # Aquí usamos el name correcto del path en api_urls.py
        url = reverse('api-cliente-list-create')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.data), 1)

    def test_crear_cliente_api(self):
        """
        Prueba que se puede crear un cliente vía API con POST /api/clientes/
        """
        data = {
            "nombre": "Mario Casas",
            "email": "mario@example.com",
            "telefono": "999888777",
            "direccion": "Calle Sol 123"
        }
        url = reverse('api-cliente-list-create')
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 201)  # 201 = creado correctamente

        # Verificamos que ahora hay 2 clientes en la DB
        self.assertEqual(Cliente.objects.count(), 2)
