# 🖥️ Empresa Suministros – Proyecto Fullstack

Aplicación fullstack para la gestión de una empresa de suministros informáticos. Desarrollada como proyecto final del curso de Programación en Python en **Tokio School**, integrando un backend completo en Django REST y un frontend en React funcional.

---

## 🚀 Tecnologías utilizadas

- **Backend**: Django + Django REST Framework + JWT
- **Frontend**: React + JavaScript + HTML + CSS
- **Base de datos**: SQLite (modo local)
- **ORM**: Django ORM (y uso puntual de señales)
- **Otros**: Swagger (documentación API), Bootstrap, señales Django, validaciones, CORS

---

## 📦 Funcionalidades principales

- Gestión de productos, clientes y proveedores
- Registro de compras y ventas con detalles anidados
- Autenticación y autorización con JWT
- Actualización automática de stock con señales (`signals`)
- Formularios dinámicos en React con validaciones
- Cálculo automático de subtotales y totales
- API REST documentada con Swagger
- Panel de administración Django habilitado

---

## 📁 Estructura del proyecto

Empresa_suministros/
│
├── frontend/ # Interfaz desarrollada con React
├── inventario/ # App Django con modelos, vistas y lógica de negocio
├── suministros_backend/ # Configuración principal del proyecto Django
├── manage.py
├── requirements.txt
└── .gitignore

---

## ⚙️ Instalación y ejecución

### 🔹 1. Clonar el repositorio
```bash
git clone <URL_DEL_REPO>
cd Empresa_suministros
🔹 2. Backend (Django)
bash
Copiar código
# Crear entorno virtual
py -m venv .venv
.venv\Scripts\activate       # Windows
# source .venv/bin/activate  # Linux/Mac

# Instalar dependencias
pip install -r requirements.txt

# Migraciones
python manage.py makemigrations
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Iniciar servidor
python manage.py runserver
👉 El backend estará en http://127.0.0.1:8000
👉 Panel de administración: http://127.0.0.1:8000/admin

🔹 3. Frontend (React)
bash
Copiar código
# Instalar dependencias (primera vez)
cd frontend
npm install

# Iniciar servidor de desarrollo
npm start
👉 El frontend estará en http://localhost:3000

🛠️ Troubleshooting
OperationalError: no such table → Ejecuta migraciones (python manage.py migrate).

npm : El término 'npm' no se reconoce → Instala Node.js LTS.

Errores de CORS → Configura CORS_ALLOWED_ORIGINS y CSRF_TRUSTED_ORIGINS en settings.py.

Error de dependencias → Reinstala:

bash
Copiar código
pip install -r requirements.txt
npm install
🧑‍💻 Autor
Gonzalo Cadenas
Desarrollador Backend Junior
📫 gonzalo.cadenas1997@gmail.com
🔗 github.com/Gonzalocc1997
🔗 linkedin.com/in/gonzalo-cadenas-021377244

📄 Licencia
Este proyecto es de uso educativo, abierto para revisión y mejora. Si quieres colaborar o realizar sugerencias, eres bienvenido.