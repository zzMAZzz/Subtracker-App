import { ref, computed } from 'vue';
import type { Subscription, CreateSubscriptionDTO, UpdateSubscriptionDTO, TotalCalculation } from '@/types/Subscription';
import { subscriptionService } from '@/services/subscriptionService';

export function useSubscriptions() {
  const subscriptions = ref<Subscription[]>([]);
  const totals = ref<TotalCalculation>({
    totalMonthlyHNL: 0,
    totalMonthlyUSD: 0,
    subscriptions: []
  });
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Cargar todas las suscripciones
  const loadSubscriptions = async () => {
    loading.value = true;
    error.value = null;
    try {
      subscriptions.value = await subscriptionService.getAll();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al cargar suscripciones';
      console.error('Error loading subscriptions:', err);
    } finally {
      loading.value = false;
    }
  };

  // Cargar totales
  const loadTotals = async () => {
    try {
      totals.value = await subscriptionService.getTotals();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al calcular totales';
      console.error('Error loading totals:', err);
    }
  };

  // Crear nueva suscripción
  const createSubscription = async (data: CreateSubscriptionDTO) => {
    loading.value = true;
    error.value = null;
    try {
      const newSubscription = await subscriptionService.create(data);
      subscriptions.value.push(newSubscription);
      await loadTotals(); // Actualizar totales
      return newSubscription;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al crear suscripción';
      console.error('Error creating subscription:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Actualizar suscripción
  const updateSubscription = async (id: string, data: UpdateSubscriptionDTO) => {
    loading.value = true;
    error.value = null;
    try {
      const updated = await subscriptionService.update(id, data);
      const index = subscriptions.value.findIndex(s => s.id === id);
      if (index !== -1) {
        subscriptions.value[index] = updated;
      }
      await loadTotals(); // Actualizar totales
      return updated;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al actualizar suscripción';
      console.error('Error updating subscription:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Eliminar suscripción
  const deleteSubscription = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      await subscriptionService.delete(id);
      subscriptions.value = subscriptions.value.filter(s => s.id !== id);
      await loadTotals(); // Actualizar totales
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al eliminar suscripción';
      console.error('Error deleting subscription:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Computed: Total mensual en HNL
  const totalMonthlyHNL = computed(() => {
    const value = totals.value.totalMonthlyHNL;
    return typeof value === 'number' && !isNaN(value) ? value : 0;
  });

  // Computed: Total mensual en USD
  const totalMonthlyUSD = computed(() => {
    const value = totals.value.totalMonthlyUSD;
    return typeof value === 'number' && !isNaN(value) ? value : 0;
  });

  // Computed: Número de suscripciones
  const subscriptionCount = computed(() => subscriptions.value.length);

  return {
    // State
    subscriptions,
    totals,
    loading,
    error,
    
    // Computed
    totalMonthlyHNL,
    totalMonthlyUSD,
    subscriptionCount,
    
    // Actions
    loadSubscriptions,
    loadTotals,
    createSubscription,
    updateSubscription,
    deleteSubscription,
  };
}
