# Competencia de Programación — Sistema de Gestión

Aplicación full-stack: Django REST + React + PostgreSQL.

---

## Estructura del proyecto

```
competencia/
├── backend/          ← Django + DRF
│   ├── competencia/  ← configuración del proyecto
│   ├── api/          ← modelos, vistas, serializadores
│   ├── manage.py
│   └── requirements.txt
└── frontend/         ← React
    ├── public/
    └── src/
```

---

## 1. Base de Datos (PostgreSQL)

```sql
CREATE DATABASE competencia_db;
```

Ajusta las credenciales en `backend/competencia/settings.py` o usa variables de entorno:

```env
DB_NAME=competencia_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
```

---

## 2. Backend (Django)

```bash
cd backend

# Crear entorno virtual
python -m venv venv
source venv/bin/activate        # Linux/Mac
venv\Scripts\activate           # Windows

# Instalar dependencias
pip install -r requirements.txt

# Aplicar migraciones
python manage.py makemigrations
python manage.py migrate

# Crear rol "admin" por defecto
python manage.py crear_rol_admin

# Iniciar servidor
python manage.py runserver
```

El API queda disponible en: `http://localhost:8000/api/`

---

## 3. Frontend (React)

```bash
cd frontend
npm install
npm start
```

La app queda disponible en: `http://localhost:3000`

---

## Endpoints API

| Método | URL | Descripción |
|--------|-----|-------------|
| GET | /api/roles/ | Listar roles |
| POST | /api/roles/ | Crear rol |
| PUT | /api/roles/{id}/ | Editar rol |
| DELETE | /api/roles/{id}/ | Eliminar rol |
| GET | /api/usuarios/ | Listar usuarios |
| POST | /api/usuarios/ | Registrar usuario |
| PUT | /api/usuarios/{id}/ | Editar usuario |
| DELETE | /api/usuarios/{id}/ | Eliminar usuario |
| PATCH | /api/usuarios/{id}/asignar-rol/ | Asignar rol |

---

## Casos de uso implementados

- **CU1 – Gestionar Roles**: crear, editar, listar, eliminar (el rol *admin* no se puede eliminar)
- **CU2 – Gestionar Usuarios**: registrar, editar, listar, eliminar, asignar rol

---

## Notas

- El rol **admin** se crea automáticamente al ejecutar `crear_rol_admin`.
- Las contraseñas se guardan en texto plano en esta versión demo. En producción usar `django.contrib.auth` con hashing.
