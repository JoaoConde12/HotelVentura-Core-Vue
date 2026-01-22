<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
const goBack = () => router.push('/booking');
</script>

<template>
  <div class="min-h-screen bg-background-dark text-white flex items-center justify-center px-4">
    <div
      class="max-w-md w-full bg-surface-dark/60 border border-white/10 rounded-xl p-8 text-center"
    >
      <h1 class="font-serif text-2xl mb-3">Pago cancelado</h1>
      <p class="text-slate-300">No se realizó ningún cobro.</p>

      <button
        @click="goBack"
        class="mt-6 w-full bg-primary text-background-dark font-black py-3 rounded-lg hover:brightness-110 transition-all uppercase tracking-widest text-sm"
      >
        Volver al Booking
      </button>
    </div>
  </div>
</template>
