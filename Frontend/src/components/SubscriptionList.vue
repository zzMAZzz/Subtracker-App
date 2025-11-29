<template>
  <div class="space-y-6">
    <!-- Header con totales -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Card HNL -->
      <div class="relative overflow-hidden bg-gradient-to-br from-violet-600 to-violet-800 rounded-2xl p-5 shadow-lg shadow-violet-500/20">
        <div class="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8"></div>
        <div class="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full -ml-6 -mb-6"></div>
        <div class="relative">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">L</span>
            </div>
            <p class="text-sm text-white/80">Lempiras</p>
          </div>
          <p class="text-3xl font-bold text-white">L {{ formatNumber(totals.totalMonthlyHNL) }}</p>
          <p class="text-xs text-white/60 mt-1">Total mensual</p>
        </div>
      </div>

      <!-- Card USD -->
      <div class="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 shadow-lg shadow-emerald-500/20">
        <div class="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8"></div>
        <div class="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full -ml-6 -mb-6"></div>
        <div class="relative">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">$</span>
            </div>
            <p class="text-sm text-white/80">Dólares</p>
          </div>
          <p class="text-3xl font-bold text-white">${{ formatNumber(totals.totalMonthlyUSD) }}</p>
          <p class="text-xs text-white/60 mt-1">Total mensual</p>
        </div>
      </div>

      <!-- Card Suscripciones -->
      <div class="relative overflow-hidden bg-gradient-to-br from-fuchsia-500 to-pink-600 rounded-2xl p-5 shadow-lg shadow-fuchsia-500/20">
        <div class="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8"></div>
        <div class="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full -ml-6 -mb-6"></div>
        <div class="relative">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p class="text-sm text-white/80">Activas</p>
          </div>
          <p class="text-3xl font-bold text-white">{{ props.subscriptions.length }}</p>
          <p class="text-xs text-white/60 mt-1">Suscripciones</p>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="props.loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
      <p class="text-white/60 mt-4">Cargando...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="props.error" class="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
      <p class="text-red-400">{{ props.error }}</p>
    </div>

    <!-- Empty state -->
    <div v-else-if="props.subscriptions.length === 0" class="text-center py-12 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
      <div class="w-20 h-20 mx-auto mb-4 bg-violet-500/20 rounded-full flex items-center justify-center">
        <svg class="h-10 w-10 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <h3 class="text-xl font-semibold text-white mb-2">No hay suscripciones</h3>
      <p class="text-white/50">Comienza agregando tu primera suscripción</p>
    </div>

    <!-- Lista de suscripciones -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <SubscriptionCard
        v-for="subscription in props.subscriptions"
        :key="subscription.id"
        :subscription="subscription"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Subscription, TotalCalculation } from '@/types/Subscription';
import { subscriptionService } from '@/services/subscriptionService';
import SubscriptionCard from './SubscriptionCard.vue';

interface Props {
  subscriptions?: Subscription[];
  loading?: boolean;
  error?: string | null;
}

interface Emits {
  (e: 'edit', subscription: Subscription): void;
  (e: 'delete', id: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  subscriptions: () => [],
  loading: false,
  error: null,
});

const emit = defineEmits<Emits>();

// Estado local para los totales
const totals = ref<TotalCalculation>({
  totalMonthlyHNL: 0,
  totalMonthlyUSD: 0,
  subscriptions: []
});

// Cargar totales directamente
const loadTotals = async () => {
  try {
    totals.value = await subscriptionService.getTotals();
    console.log('SubscriptionList - Totales cargados:', totals.value);
  } catch (err) {
    console.error('Error loading totals:', err);
  }
};

// Cargar totales cuando se monta el componente
onMounted(() => {
  loadTotals();
});

// Exponer función para recargar desde el padre si es necesario
defineExpose({ loadTotals });

const formatNumber = (value: number | undefined) => {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0.00';
  }
  return new Intl.NumberFormat('es-HN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const handleEdit = (subscription: Subscription) => {
  emit('edit', subscription);
};

const handleDelete = (id: string) => {
  emit('delete', id);
};
</script>
