import { Request, Response } from 'express';
import { subscriptionService } from '../services/subscription.service';
import { CreateSubscriptionDTO, UpdateSubscriptionDTO } from '../types/subscription.types';

export class SubscriptionController {
  async getAll(req: Request, res: Response) {
    try {
      const subscriptions = await subscriptionService.getAllSubscriptions();
      res.json(subscriptions);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las suscripciones' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const subscription = await subscriptionService.getSubscriptionById(id);
      
      if (!subscription) {
        return res.status(404).json({ error: 'Suscripción no encontrada' });
      }
      
      res.json(subscription);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la suscripción' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const data: CreateSubscriptionDTO = req.body;
      const subscription = await subscriptionService.createSubscription(data);
      res.status(201).json(subscription);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear la suscripción' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data: UpdateSubscriptionDTO = req.body;
      const subscription = await subscriptionService.updateSubscription(id, data);
      res.json(subscription);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar la suscripción' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await subscriptionService.deleteSubscription(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar la suscripción' });
    }
  }

  async getTotals(req: Request, res: Response) {
    try {
      const totals = await subscriptionService.calculateTotals();
      res.json(totals);
    } catch (error) {
      res.status(500).json({ error: 'Error al calcular los totales' });
    }
  }
}

export const subscriptionController = new SubscriptionController();
