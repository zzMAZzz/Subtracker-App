export enum Currency {
  USD = 'USD',
  HNL = 'HNL'
}

export enum Frequency {
  MONTHLY = 'MONTHLY',
  ANNUAL = 'ANNUAL'
}

export interface Subscription {
  id: string;
  name: string;
  price: number;
  currency: Currency;
  frequency: Frequency;
  paymentDate?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSubscriptionDTO {
  name: string;
  price: number;
  currency: Currency;
  frequency: Frequency;
  paymentDate?: number;
}

export interface UpdateSubscriptionDTO {
  name?: string;
  price?: number;
  currency?: Currency;
  frequency?: Frequency;
  paymentDate?: number;
}

export interface TotalCalculation {
  totalMonthlyHNL: number;
  totalMonthlyUSD: number;
  subscriptions: Array<{
    id: string;
    name: string;
    originalPrice: number;
    originalCurrency: Currency;
    monthlyEquivalentHNL: number;
    frequency: Frequency;
  }>;
}
