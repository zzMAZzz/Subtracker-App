<template>
  <div class="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-violet-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/10">
    <!-- Decoración de fondo -->
    <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-500/10 to-transparent rounded-full -mr-16 -mt-16"></div>
    
    <!-- Barra de color según moneda -->
    <div :class="[
      'absolute top-0 left-0 w-1 h-full',
      subscription.currency === 'USD' ? 'bg-gradient-to-b from-emerald-400 to-teal-500' : 'bg-gradient-to-b from-violet-400 to-fuchsia-500'
    ]"></div>
    
    <div class="relative p-5 pl-6">
      <!-- Header -->
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <!-- Nombre y badge -->
          <div class="flex items-center gap-3 mb-3">
            <div :class="[
              'w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold',
              subscription.currency === 'USD' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-violet-500/20 text-violet-400'
            ]">
              {{ subscription.name.charAt(0).toUpperCase() }}
            </div>
            <div>
              <h3 class="text-lg font-bold text-white group-hover:text-violet-300 transition-colors">{{ subscription.name }}</h3>
              <span class="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/60">
                {{ subscription.frequency === 'MONTHLY' ? 'Mensual' : 'Anual' }}
              </span>
            </div>
          </div>
          
          <!-- Precio -->
          <div class="mt-4">
            <div class="flex items-baseline gap-1">
              <span :class="[
                'text-3xl font-bold',
                subscription.currency === 'USD' ? 'text-emerald-400' : 'text-violet-400'
              ]">
                {{ currencySymbol }}{{ formatPrice(subscription.price) }}
              </span>
              <span class="text-white/40 text-sm">{{ subscription.currency }}</span>
            </div>
            <!-- Precio mensual equivalente para suscripciones anuales -->
            <p v-if="subscription.frequency === 'ANNUAL'" class="text-sm text-white/50 mt-1 flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              ≈ {{ currencySymbol }}{{ formatPrice(subscription.price / 12) }} /mes
            </p>
          </div>
        </div>
        
        <!-- Botones de acción -->
        <div class="flex flex-col gap-1">
          <button
            @click="$emit('edit', subscription)"
            class="p-2.5 text-white/40 hover:text-violet-400 hover:bg-violet-500/20 rounded-xl transition-all"
            title="Editar"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            @click="handleDelete"
            class="p-2.5 text-white/40 hover:text-red-400 hover:bg-red-500/20 rounded-xl transition-all"
            title="Eliminar"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Footer con info adicional -->
      <div class="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
        <div v-if="subscription.paymentDate" class="flex items-center gap-2 text-white/40 text-sm">
          <div class="w-6 h-6 bg-white/5 rounded-lg flex items-center justify-center">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span>Día {{ subscription.paymentDate }}</span>
        </div>
        <div v-else class="text-white/20 text-sm">Sin fecha de pago</div>
        
        <div class="flex items-center gap-1 text-white/30 text-xs">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ formatDate(subscription.createdAt) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Subscription } from '@/types/Subscription';

interface Props {
  subscription: Subscription;
}

interface Emits {
  (e: 'edit', subscription: Subscription): void;
  (e: 'delete', id: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const currencySymbol = computed(() => {
  return props.subscription.currency === 'USD' ? '$' : 'L';
});

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-HN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-HN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const handleDelete = () => {
  emit('delete', props.subscription.id);
};
</script>
