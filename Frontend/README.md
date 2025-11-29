# SubTracker Frontend

Frontend de la aplicación SubTracker - Interfaz web para gestionar suscripciones y gastos recurrentes.

## Tecnologías

- **Vue 3** - Framework progresivo de JavaScript
- **TypeScript** - Tipado estático
- **Vite** - Build tool ultra-rápido
- **Tailwind CSS** - Framework de CSS utility-first
- **Composition API** - API moderna de Vue con `<script setup>`

## Estructura del Proyecto

```
Frontend/
├── src/
│   ├── components/          # Componentes Vue
│   │   ├── SubscriptionCard.vue
│   │   ├── SubscriptionForm.vue
│   │   └── SubscriptionList.vue
│   ├── composables/         # Lógica reutilizable
│   │   └── useSubscriptions.ts
│   ├── services/            # Servicios API
│   │   └── subscriptionService.ts
│   ├── types/               # Tipos TypeScript
│   │   └── Subscription.ts
│   ├── App.vue              # Componente principal
│   ├── main.ts              # Punto de entrada
│   └── style.css            # Estilos globales (Tailwind)
├── public/                  # Archivos estáticos
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## Instalación y Uso

### 1. Instalar dependencias

```bash
cd Frontend
npm install
```

### 2. Configurar backend

Asegúrate de que el backend esté corriendo en `http://localhost:3000`.

Si el backend está en otra URL, edita `src/services/subscriptionService.ts`:

```typescript
const API_BASE_URL = 'http://localhost:3000/api';
```

### 3. Iniciar servidor de desarrollo

```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

### 4. Compilar para producción

```bash
npm run build
```

## Scripts Disponibles

- `npm run dev` - Inicia servidor de desarrollo con hot-reload
- `npm run build` - Compila para producción
- `npm run preview` - Vista previa de la build de producción

## Características Implementadas

### Gestión de Suscripciones (CRUD)

- **Listar**: Visualización de todas las suscripciones en tarjetas
- **Crear**: Formulario para agregar nuevas suscripciones
- **Editar**: Modificar precio, nombre, fecha de pago
- **Eliminar**: Remover suscripciones con confirmación

### Lógica de Negocio

- **Cálculo de Totales**: Gasto total mensual estimado
- **Normalización de Frecuencia**:
  - Mensual: Precio original
  - Anual: Dividido entre 12
- **Conversión de Moneda**: 
  - Soporte USD y HNL
  - Conversión automática usando tasa del backend

## Componentes Principales

### `App.vue`
Componente raíz que orquesta toda la aplicación.

### `SubscriptionList.vue`
Contenedor principal con header de totales y grid de tarjetas.

### `SubscriptionCard.vue`
Tarjeta individual con datos de la suscripción.

### `SubscriptionForm.vue`
Formulario para crear/editar suscripciones.

## Composables

### `useSubscriptions.ts`

Hook personalizado que maneja estado y operaciones CRUD:

```typescript
const {
  subscriptions,
  totalMonthlyHNL,
  totalMonthlyUSD,
  subscriptionCount,
  loading,
  error,
  loadSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription,
} = useSubscriptions();
```

## Integración con Backend

Endpoints utilizados:
- `GET /api/subscriptions` - Listar todas
- `POST /api/subscriptions` - Crear nueva
- `PUT /api/subscriptions/:id` - Actualizar
- `DELETE /api/subscriptions/:id` - Eliminar
- `GET /api/subscriptions/totals` - Obtener totales

