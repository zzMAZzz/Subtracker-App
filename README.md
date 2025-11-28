# SubTracker App

Aplicación completa de gestión de finanzas personales para rastrear gastos recurrentes (suscripciones).

## Descripción

SubTracker te ayuda a visualizar y controlar cuánto dinero gastas mensualmente en servicios como streaming, gimnasio, software y otras suscripciones. La aplicación calcula automáticamente tus gastos mensuales considerando diferentes monedas y frecuencias de pago.

## Arquitectura

- **Backend**: Node.js + Express + Prisma + SQLite
- **Frontend**: Vue 3 + TypeScript + Vite + Tailwind CSS

## 📁 Estructura del Proyecto

```
Subtracker-App/
├── Backend/           # API REST con Node.js
│   ├── src/
│   ├── prisma/
│   └── README.md
├── Frontend/          # Aplicación Vue 3
│   ├── src/
│   └── README.md
├── start.sh          # Script para iniciar ambos servidores
└── README.md         # Este archivo
```

## Inicio Rápido

```bash
# Terminal 1 - Backend
cd Backend
npm install
npm run dev

# Terminal 2 - Frontend
cd Frontend
npm install
npm run dev
```

### Acceder a la aplicación

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000


## Tecnologías

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM
- SQLite

### Frontend
- Vue 3 (Composition API)
- TypeScript
- Vite
- Tailwind CSS

## Documentación

Para más detalles sobre cada parte del proyecto:

- **Backend**: Ver [Backend/README.md](./Backend/README.md)
- **Frontend**: Ver [Frontend/README.md](./Frontend/README.md)

## API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/subscriptions` | Listar todas las suscripciones |
| GET | `/api/subscriptions/:id` | Obtener una suscripción |
| POST | `/api/subscriptions` | Crear suscripción |
| PUT | `/api/subscriptions/:id` | Actualizar suscripción |
| DELETE | `/api/subscriptions/:id` | Eliminar suscripción |
| GET | `/api/subscriptions/totals` | Obtener totales calculados |
| GET | `/health` | Health check del servidor |

## Configuración

### Variables de Entorno (Backend)

Archivo `Backend/.env`:

```env
DATABASE_URL="file:./dev.db"
PORT=3000
USD_TO_HNL_RATE=26
```

### Configuración del Frontend

Si el backend está en otra URL, editar `Frontend/src/services/subscriptionService.ts`:

```typescript
const API_BASE_URL = 'http://localhost:3000/api';
```

## Uso de la Aplicación

1. **Crear suscripción**: Haz clic en "Nueva Suscripción" y llena el formulario
2. **Ver totales**: El header muestra automáticamente tus gastos mensuales en HNL y USD
3. **Editar**: Haz clic en el icono de lápiz en cualquier tarjeta
4. **Eliminar**: Haz clic en el icono de basura (requiere confirmación)



