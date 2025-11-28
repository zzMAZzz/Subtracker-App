import { Router } from 'express';
import { subscriptionController } from '../controllers/subscription.controller';

const router = Router();

// GET /api/subscriptions - Listar todas las suscripciones
router.get('/', subscriptionController.getAll.bind(subscriptionController));

// GET /api/subscriptions/totals - Obtener cálculo de totales
router.get('/totals', subscriptionController.getTotals.bind(subscriptionController));

// GET /api/subscriptions/:id - Obtener una suscripción por ID
router.get('/:id', subscriptionController.getById.bind(subscriptionController));

// POST /api/subscriptions - Crear nueva suscripción
router.post('/', subscriptionController.create.bind(subscriptionController));

// PUT /api/subscriptions/:id - Actualizar una suscripción
router.put('/:id', subscriptionController.update.bind(subscriptionController));

// DELETE /api/subscriptions/:id - Eliminar una suscripción
router.delete('/:id', subscriptionController.delete.bind(subscriptionController));

export default router;
