<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
    <!-- Header -->
    <header class="bg-white/10 backdrop-blur-md border-b border-white/10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-white">SubTracker</h1>
              <p class="text-sm text-white/60">Gestiona tus suscripciones</p>
            </div>
          </div>
          <button
            @click="toggleForm"
            class="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-6 py-3 rounded-xl hover:from-violet-500 hover:to-fuchsia-500 transition-all font-medium shadow-lg shadow-violet-500/25 flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            {{ showForm ? 'Ocultar' : 'Nueva Suscripción' }}
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Formulario -->
        <div v-if="showForm" class="lg:col-span-1">
          <SubscriptionForm
            :subscription="editingSubscription"
            @submit="handleSubmit"
            @cancel="cancelEdit"
          />
        </div>

        <!-- Lista de suscripciones -->
        <div :class="showForm ? 'lg:col-span-2' : 'lg:col-span-3'">
          <SubscriptionList
            ref="subscriptionListRef"
            :subscriptions="subscriptions"
            :loading="loading"
            :error="error"
            @edit="startEdit"
            @delete="handleDelete"
          />
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white/5 border-t border-white/10 mt-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <p class="text-center text-white/40 text-sm">
          SubTracker © 2025 - Gestión de finanzas personales
        </p>
      </div>
    </footer>

    <!-- Modal de confirmación de eliminación -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-slate-800 border border-white/10 rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4">
        <div class="flex items-center gap-3 mb-4">
          <div class="flex-shrink-0 w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-white">¿Eliminar suscripción?</h3>
        </div>
        <p class="text-white/60 mb-6">
          Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar esta suscripción?
        </p>
        <div class="flex gap-3 justify-end">
          <button
            @click="cancelDelete"
            class="px-5 py-2.5 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            @click="confirmDelete"
            class="px-5 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Subscription, CreateSubscriptionDTO } from '@/types/Subscription';
import { useSubscriptions } from '@/composables/useSubscriptions';
import SubscriptionForm from '@/components/SubscriptionForm.vue';
import SubscriptionList from '@/components/SubscriptionList.vue';

const {
  subscriptions,
  loading,
  error,
  loadSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription,
} = useSubscriptions();

const showForm = ref(false);
const editingSubscription = ref<Subscription | undefined>(undefined);
const subscriptionListRef = ref<InstanceType<typeof SubscriptionList> | null>(null);
const showDeleteModal = ref(false);
const subscriptionToDelete = ref<string | null>(null);

// Cargar datos al montar el componente
onMounted(async () => {
  await loadSubscriptions();
});

const toggleForm = () => {
  showForm.value = !showForm.value;
  if (!showForm.value) {
    editingSubscription.value = undefined;
  }
};

const handleSubmit = async (data: CreateSubscriptionDTO) => {
  try {
    if (editingSubscription.value) {
      // Actualizar
      await updateSubscription(editingSubscription.value.id, data);
      editingSubscription.value = undefined;
    } else {
      // Crear
      await createSubscription(data);
    }
    // Recargar totales
    subscriptionListRef.value?.loadTotals();
    // Ocultar formulario y limpiar
    showForm.value = false;
    editingSubscription.value = undefined;
  } catch (err) {
    console.error('Error al guardar suscripción:', err);
  }
};

const startEdit = (subscription: Subscription) => {
  editingSubscription.value = subscription;
  showForm.value = true;
  // Scroll al formulario
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const cancelEdit = () => {
  editingSubscription.value = undefined;
};

const handleDelete = (id: string) => {
  subscriptionToDelete.value = id;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  if (!subscriptionToDelete.value) return;
  
  try {
    await deleteSubscription(subscriptionToDelete.value);
    // Recargar totales
    subscriptionListRef.value?.loadTotals();
  } catch (err) {
    console.error('Error al eliminar suscripción:', err);
  } finally {
    showDeleteModal.value = false;
    subscriptionToDelete.value = null;
  }
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  subscriptionToDelete.value = null;
};
</script>

