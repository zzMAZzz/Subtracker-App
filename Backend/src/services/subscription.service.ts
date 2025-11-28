import { PrismaClient } from '@prisma/client';
import { 
  CreateSubscriptionDTO, 
  UpdateSubscriptionDTO, 
  TotalCalculation,
  Currency,
  Frequency 
} from '../types/subscription.types';
import { CurrencyConverter } from '../utils/currency.utils';
import { FrequencyNormalizer } from '../utils/frequency.utils';

const prisma = new PrismaClient();

export class SubscriptionService {
  async getAllSubscriptions() {
    return await prisma.subscription.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async getSubscriptionById(id: string) {
    return await prisma.subscription.findUnique({
      where: { id }
    });
  }

  async createSubscription(data: CreateSubscriptionDTO) {
    return await prisma.subscription.create({
      data: {
        name: data.name,
        price: data.price,
        currency: data.currency,
        frequency: data.frequency,
        paymentDate: data.paymentDate
      }
    });
  }

  async updateSubscription(id: string, data: UpdateSubscriptionDTO) {
    return await prisma.subscription.update({
      where: { id },
      data
    });
  }

  async deleteSubscription(id: string) {
    return await prisma.subscription.delete({
      where: { id }
    });
  }

  async calculateTotals(): Promise<TotalCalculation> {
    const subscriptions = await this.getAllSubscriptions();
    
    let totalMonthlyHNL = 0;
    const details = subscriptions.map(sub => {
      // Normalizar a costo mensual
      const monthlyPrice = FrequencyNormalizer.toMonthly(
        sub.price, 
        sub.frequency as Frequency
      );
      
      // Convertir a HNL
      const monthlyHNL = CurrencyConverter.toHNL(
        monthlyPrice, 
        sub.currency as Currency
      );
      
      totalMonthlyHNL += monthlyHNL;
      
      return {
        id: sub.id,
        name: sub.name,
        originalPrice: sub.price,
        originalCurrency: sub.currency as Currency,
        monthlyEquivalentHNL: monthlyHNL,
        frequency: sub.frequency as Frequency
      };
    });

    const totalMonthlyUSD = CurrencyConverter.toUSD(totalMonthlyHNL, Currency.HNL);

    return {
      totalMonthlyHNL: Math.round(totalMonthlyHNL * 100) / 100,
      totalMonthlyUSD: Math.round(totalMonthlyUSD * 100) / 100,
      subscriptions: details
    };
  }
}

export const subscriptionService = new SubscriptionService();
