<template>
  <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
    <h2 class="text-2xl font-bold text-white mb-6">
      {{ isEditing ? 'Editar Suscripción' : 'Nueva Suscripción' }}
    </h2>
    
    <form @submit.prevent="handleSubmit" class="space-y-5">
      <!-- Nombre -->
      <div>
        <label for="name" class="block text-sm font-medium text-white/70 mb-2">
          Nombre <span class="text-fuchsia-400">*</span>
        </label>
        <input
          id="name"
          v-model="formData.name"
          type="text"
          required
          class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
          placeholder="Netflix, Spotify, etc."
        />
      </div>

      <!-- Precio y Moneda -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="price" class="block text-sm font-medium text-white/70 mb-2">
            Precio <span class="text-fuchsia-400">*</span>
          </label>
          <input
            id="price"
            v-model.number="formData.price"
            type="number"
            step="0.01"
            min="0"
            required
            class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
            placeholder="15.99"
          />
        </div>
        
        <div>
          <label for="currency" class="block text-sm font-medium text-white/70 mb-2">
            Moneda <span class="text-fuchsia-400">*</span>
          </label>
          <select
            id="currency"
            v-model="formData.currency"
            required
            class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
          >
            <option value="USD" class="bg-slate-800">USD ($)</option>
            <option value="HNL" class="bg-slate-800">HNL (L)</option>
          </select>
        </div>
      </div>

      <!-- Frecuencia -->
      <div>
        <label for="frequency" class="block text-sm font-medium text-white/70 mb-2">
          Frecuencia <span class="text-fuchsia-400">*</span>
        </label>
        <select
          id="frequency"
          v-model="formData.frequency"
          required
          class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
        >
          <option value="MONTHLY" class="bg-slate-800">Mensual</option>
          <option value="ANNUAL" class="bg-slate-800">Anual</option>
        </select>
      </div>

      <!-- Día de pago -->
      <div>
        <label for="paymentDate" class="block text-sm font-medium text-white/70 mb-2">
          Día de pago <span class="text-white/40">(opcional)</span>
        </label>
        <input
          id="paymentDate"
          v-model.number="formData.paymentDate"
          type="number"
          min="1"
          max="31"
          class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
          placeholder="15"
        />
        <p class="text-xs text-white/40 mt-2">Día del mes (1-31)</p>
      </div>

      <!-- Botones -->
      <div class="flex gap-3 pt-4">
        <button
          type="submit"
          class="flex-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white py-3 px-4 rounded-xl hover:from-violet-500 hover:to-fuchsia-500 transition-all font-medium shadow-lg shadow-violet-500/25"
        >
          {{ isEditing ? 'Actualizar' : 'Crear' }} Suscripción
        </button>
        <button
          v-if="isEditing"
          type="button"
          @click="$emit('cancel')"
          class="px-6 bg-white/10 text-white py-3 rounded-xl hover:bg-white/20 transition-colors font-medium"
        >
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, computed } from 'vue';
import { Currency, Frequency, type Subscription, type CreateSubscriptionDTO } from '@/types/Subscription';

interface Props {
  subscription?: Subscription;
}

interface Emits {
  (e: 'submit', data: CreateSubscriptionDTO): void;
  (e: 'cancel'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const isEditing = computed(() => props.subscription !== undefined);

const getInitialFormData = (): CreateSubscriptionDTO => ({
  name: '',
  price: 0,
  currency: Currency.USD,
  frequency: Frequency.MONTHLY,
  paymentDate: undefined,
});

const formData = reactive<CreateSubscriptionDTO>(getInitialFormData());

// Watch para actualizar el formulario cuando cambia la prop
watch(() => props.subscription, (newSub) => {
  if (newSub) {
    formData.name = newSub.name;
    formData.price = newSub.price;
    formData.currency = newSub.currency;
    formData.frequency = newSub.frequency;
    formData.paymentDate = newSub.paymentDate;
  } else {
    // Limpiar formulario cuando no hay suscripción (modo crear)
    Object.assign(formData, getInitialFormData());
  }
}, { immediate: true });

const resetForm = () => {
  Object.assign(formData, getInitialFormData());
};

const handleSubmit = () => {
  const data: CreateSubscriptionDTO = {
    name: formData.name,
    price: formData.price,
    currency: formData.currency,
    frequency: formData.frequency,
  };

  if (formData.paymentDate) {
    data.paymentDate = formData.paymentDate;
  }

  emit('submit', data);
  
  // Resetear formulario después de enviar
  resetForm();
};
</script>
