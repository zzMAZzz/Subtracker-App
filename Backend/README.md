# SubTracker Backend

Backend API para la aplicación SubTracker - Gestión de suscripciones y gastos recurrentes.

## Tecnologías

- **Node.js** con **TypeScript**
- **Express** - Framework web
- **Prisma ORM** - Gestión de base de datos
- **SQLite** - Base de datos
- **CORS** - Configuración de CORS

## Estructura del Proyecto

```
Backend/
├── prisma/
│   └── schema.prisma          # Schema de la base de datos
├── src/
│   ├── controllers/           # Controladores (lógica de endpoints)
│   │   └── subscription.controller.ts
│   ├── services/              # Lógica de negocio
│   │   └── subscription.service.ts
│   ├── routes/                # Definición de rutas
│   │   └── subscription.routes.ts
│   ├── types/                 # Tipos e interfaces TypeScript
│   │   └── subscription.types.ts
│   ├── utils/                 # Utilidades (conversión de moneda, etc.)
│   │   ├── currency.utils.ts
│   │   └── frequency.utils.ts
│   └── index.ts               # Punto de entrada de la aplicación
├── .env                       # Variables de entorno
├── .env.example               # Ejemplo de variables de entorno
├── package.json
└── tsconfig.json
```

## Instalación

1. **Instalar dependencias:**
   ```bash
   cd Backend
   npm install
   ```

2. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env
   ```
   
   Edita el archivo `.env` si necesitas cambiar la tasa de cambio o el puerto.

3. **Generar cliente de Prisma:**
   ```bash
   npm run prisma:generate
   ```

4. **Crear la base de datos y ejecutar migraciones:**
   ```bash
   npm run prisma:migrate
   ```

## Scripts Disponibles

- `npm run dev` - Inicia el servidor en modo desarrollo con hot-reload
- `npm run build` - Compila TypeScript a JavaScript
- `npm start` - Inicia el servidor en producción
- `npm run prisma:generate` - Genera el cliente de Prisma
- `npm run prisma:migrate` - Ejecuta las migraciones de la base de datos
- `npm run prisma:studio` - Abre Prisma Studio (GUI para la BD)

## API Endpoints

### Suscripciones

- **GET** `/api/subscriptions` - Obtener todas las suscripciones
- **GET** `/api/subscriptions/:id` - Obtener una suscripción por ID
- **POST** `/api/subscriptions` - Crear nueva suscripción
- **PUT** `/api/subscriptions/:id` - Actualizar una suscripción
- **DELETE** `/api/subscriptions/:id` - Eliminar una suscripción
- **GET** `/api/subscriptions/totals` - Obtener cálculo de totales mensuales

### Health Check

- **GET** `/health` - Verificar estado del servidor

## Ejemplo de Peticiones

### Crear Suscripción

```bash
POST /api/subscriptions
Content-Type: application/json

{
  "name": "Netflix",
  "price": 15.99,
  "currency": "USD",
  "frequency": "MONTHLY",
  "paymentDate": 15
}
```

### Actualizar Suscripción

```bash
PUT /api/subscriptions/{id}
Content-Type: application/json

{
  "price": 17.99,
  "paymentDate": 20
}
```

### Obtener Totales

```bash
GET /api/subscriptions/totals
```

**Respuesta:**
```json
{
  "totalMonthlyHNL": 2600.50,
  "totalMonthlyUSD": 100.02,
  "subscriptions": [
    {
      "id": "uuid",
      "name": "Netflix",
      "originalPrice": 15.99,
      "originalCurrency": "USD",
      "monthlyEquivalentHNL": 415.74,
      "frequency": "MONTHLY"
    }
  ]
}
```

## Configuración

### Variables de Entorno (.env)

- `DATABASE_URL` - URL de conexión a SQLite (default: `file:./dev.db`)
- `PORT` - Puerto del servidor (default: `3000`)
- `USD_TO_HNL_RATE` - Tasa de cambio USD a HNL (default: `26`)

## Características

### Conversión de Moneda
- Soporte para **USD** y **HNL**
- Conversión automática usando tasa configurable
- Todos los cálculos se normalizan a HNL

### Normalización de Frecuencia
- **MONTHLY**: Precio se mantiene igual
- **ANNUAL**: Precio se divide entre 12 para cálculo mensual

### Cálculo de Totales
- Suma automática de todos los gastos mensuales
- Conversión y normalización transparente
- Desglose detallado por suscripción

## Modelo de Datos

```typescript
model Subscription {
  id          String   @id @default(uuid())
  name        String
  price       Float
  currency    String   // USD | HNL
  frequency   String   // MONTHLY | ANNUAL
  paymentDate Int?     // 1-31
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## Iniciar el Servidor

```bash
# Modo desarrollo
npm run dev

# Modo producción
npm run build
npm start
```

El servidor estará disponible en `http://localhost:3000`

## Herramientas de Desarrollo

### Prisma Studio
Para explorar y editar la base de datos visualmente:
```bash
npm run prisma:studio
```

Abre automáticamente en `http://localhost:5555`
