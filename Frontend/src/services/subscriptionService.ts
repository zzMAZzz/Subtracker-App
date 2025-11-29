import type { Subscription, CreateSubscriptionDTO, UpdateSubscriptionDTO, TotalCalculation } from '@/types/Subscription';

const API_BASE_URL = 'http://localhost:3000/api';

export class SubscriptionService {
  private async fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    // Para DELETE que retorna 204, no intentar parsear JSON
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  async getAll(): Promise<Subscription[]> {
    return this.fetchAPI<Subscription[]>('/subscriptions');
  }

  async getById(id: string): Promise<Subscription> {
    return this.fetchAPI<Subscription>(`/subscriptions/${id}`);
  }

  async create(data: CreateSubscriptionDTO): Promise<Subscription> {
    return this.fetchAPI<Subscription>('/subscriptions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async update(id: string, data: UpdateSubscriptionDTO): Promise<Subscription> {
    return this.fetchAPI<Subscription>(`/subscriptions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(id: string): Promise<void> {
    return this.fetchAPI<void>(`/subscriptions/${id}`, {
      method: 'DELETE',
    });
  }

  async getTotals(): Promise<TotalCalculation> {
    return this.fetchAPI<TotalCalculation>('/subscriptions/totals');
  }
}

export const subscriptionService = new SubscriptionService();
