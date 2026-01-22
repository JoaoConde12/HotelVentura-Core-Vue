<script setup lang="ts">
defineProps<{
  isOpen: boolean;
  title?: string;
  message?: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'confirm'): void;
}>();
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
  >
    <div
      class="bg-surface-dark border border-white/10 w-full max-w-sm rounded-xl shadow-2xl p-6 text-center transform transition-all scale-100"
    >
      <div
        class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 mb-4"
      >
        <span class="material-symbols-outlined text-amber-500 text-2xl">warning</span>
      </div>

      <h3 class="text-lg font-bold text-white mb-2">{{ title || '¿Estás seguro?' }}</h3>
      <p class="text-sm text-slate-400 mb-6">
        {{ message || 'Esta acción no se puede deshacer.' }}
      </p>

      <div class="flex justify-center gap-3">
        <button
          @click="emit('close')"
          class="px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition"
        >
          Cancelar
        </button>
        <button
          @click="emit('confirm')"
          class="bg-rose-500 text-white font-bold px-4 py-2 rounded-lg text-sm hover:bg-rose-600 shadow-[0_0_15px_rgba(244,63,94,0.4)] transition"
        >
          Sí, eliminar
        </button>
      </div>
    </div>
  </div>
</template>
