# APIUX Test Project

Este proyecto es una aplicación de gestión de libros que permite registrar, visualizar, editar y exportar libros. Está desarrollada con **NestJS** en el backend y **React + TypeScript** en el frontend. Utiliza Docker y docker-compose para el despliegue automático, incluyendo emulación de servicios como Google Cloud Storage.

---

## 🛠️ Instalación y configuración

### Requisitos

- Docker
- Docker Compose

### Instalación y despliegue

1. Clona el repositorio:

```bash
git clone git@github.com:Alejors/apiux_test.git
cd apiux_test
```

2. Crea un archivo `.env`tomando como referencia las variables presentes en `.env.example`(puedes copiarlo y cambiarle el nombre directamente).

3. Levanta los servicios:

```bash
docker-compose up --build
```

Esto levantará:

- Backend NestJS
- Frontend React
- Base de datos
- Emulador de GCS

> El backend estará accesible en `http://localhost:3000`
> El frontend estará accesible en `http://localhost:5173`

4. Corre las migraciones de la base de datos:

```bash
docker-compose exec api npm run migrations:run
```

Esto sincronizará la base de datos, creando las tablas necesarias para usar la API.

5. (opcional) Se agregó un seeder para precargar un usuario y tener libros ya listos para visualizar.

```bash
docker-compose exec api npm run seeders:run
```

## 🚀 Guía de uso

1. Accede a `http://localhost:5173`
2. Inicia sesión con el usuario pre-cargado:

   - **Email:** `admin@email.test`
   - **Contraseña:** `123456` (hasheada en el seeder)

ó

    Crea un usuario en la vista de registro.

3. Desde la aplicación puedes:
   - Visualizar todos los libros
   - Crear nuevos libros
   - Editar libros existentes
   - Subir una imagen para cada libro
   - Exportar la lista de libros en formato CSV

---

## 🧱 Arquitectura y decisiones de diseño

- **Frontend (React + Vite):**
  - Validación con React Hook Form + Zod
  - Tailwind CSS para estilos
  - Navegación con react-router-dom
  - Protección de rutas basada en cookie `access_token` + Contexto de autenticación. 

- **Backend (NestJS + Sequelize):**
  - Rutas protegidas por `AuthGuard`
  - Autenticación con JWT y almacenamiento en cookie
  - Carga de imágenes como `multipart/form-data`
  - Exportación CSV vía `/books/export`
  - Emulador de GCS en lugar de servicios en la nube

- **Persistencia:**
  - Sequelize con PostgreSQL
  - Seeders automáticos con usuarios, autores, editoriales, géneros y libros

- **Infraestructura:**
  - Contenedores separados para frontend, backend, DB y emulador GCS
  - Despliegue automático vía `docker-compose`

---

## 📖 API Documentada

> Swagger disponible en: `http://localhost:3000/api`

Incluye:

- Rutas protegidas
- DTOs con validación
- Upload de archivos
- Ejemplos de respuestas

---

## 🖼️ Diagrama de arquitectura

Incluido en `/docs/arquitectura.webp`

- Frontend consume la API REST del backend.
- Imágenes cargadas al emulador GCS.
- Autenticación vía JWT en cookie HttpOnly.

![Diagrama de Arquitectura](./docs/arquitectura.webp)

---

## 🗃️ Modelo relacional

Modelo relacional disponible en `/docs/cmpc_books.png`

![Modelo Relacional](./docs/cmpc_books.png)

---

## 🧪 Tests (opcional)

```bash
docker-compose exec api npm run test
```

---

## 🧼 Lint y formato

### Backend

```bash
docker-compose exec api npm run lint
```

### Frontend

```bash
docker-compose exec front npm run lint
```

---

## 📦 Estructura del proyecto

```
apiux_test/
├── frontend/ (React + Vite + Tailwind)
│   ├── src/
│   │   ├── pages/            # Login, Registro, Crear y Detalles de Libros
│   │   ├── components/       # UI reutilizable (tabla, íconos, botones, header)
│   │   ├── context/          # AuthContext (manejo de sesión)
│   │   ├── services/         # apiFetch, authService, exportService
│   │   ├── types/            # Tipos compartidos (Book, User, ApiResponse)
│   │   └── main.tsx          # Punto de entrada
│   └── public/, Dockerfile, vite.config.ts, etc.
│
├── backend/ (NestJS + Sequelize + JWT + GCS)
│   ├── src/
│   │   ├── modules/
│   │   │   ├── books/               # CRUD + carga de imagen + proyecciones
│   │   │   ├── auth/               # Login, registro, cookies
│   │   │   ├── users/              # Gestión de usuarios
│   │   │   ├── export/             # Exportación CSV
│   │   │   ├── *EventModules/      # Manejo de eventos por entidad (authorEvents, booksEvents, etc.)
│   │   ├── models/                 # Sequelize models (book, user, genre, etc.)
│   │   ├── common/                 # DTOs genéricos, decoradores, guards, utilidades
│   │   ├── config/                 # JWT, Sequelize, etc.
│   │   └── db/                     # Migrations y seeders
│   └── Dockerfile, package.json, nest-cli.json, etc.
│
├── docker-compose.yaml
└── README.md
```