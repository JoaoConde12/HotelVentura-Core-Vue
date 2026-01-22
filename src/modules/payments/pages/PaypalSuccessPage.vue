<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/app/config/axios';

const router = useRouter();
const loading = ref(true);
const message = ref('Procesando pago...');

onMounted(async () => {
  try {
    const reservationIdStr = localStorage.getItem('paypal_reservation_id');
    const reservationId = reservationIdStr ? Number(reservationIdStr) : NaN;

    if (!reservationIdStr || Number.isNaN(reservationId)) {
      message.value = 'No se encontró la reserva para confirmar el pago.';
      loading.value = false;
      return;
    }

    // Tu endpoint según swagger:
    // POST /api/v1/payments/paypal/capture-order { reservation_id }
    await api.post('/payments/paypal/capture-order', {
      reservation_id: reservationId,
    });

    localStorage.removeItem('paypal_reservation_id');
    message.value = '✅ Pago confirmado. ¡Reserva pagada!';
  } catch (e) {
    message.value = '❌ No se pudo confirmar el pago. Si se te cobró, contacta al hotel.';
  } finally {
    loading.value = false;
    setTimeout(() => router.push('/booking'), 2000);
  }
});
</script>

<template>
  <div class="min-h-screen bg-background-dark text-white flex items-center justify-center px-4">
    <div
      class="max-w-md w-full bg-surface-dark/60 border border-white/10 rounded-xl p-8 text-center"
    >
      <h1 class="font-serif text-2xl mb-3">Resultado de Pago</h1>
      <p class="text-slate-300">{{ message }}</p>
      <p v-if="loading" class="text-slate-500 mt-3">Espere un momento...</p>
    </div>
  </div>
</template>
