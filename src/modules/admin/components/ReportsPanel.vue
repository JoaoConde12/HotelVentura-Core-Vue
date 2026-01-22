<script setup lang="ts">
import { ref } from 'vue';

// Estados para los inputs
const dailyDate = ref('');
const weeklyStart = ref('');
const monthlyYear = ref(new Date().getFullYear());
const monthlyMonth = ref(new Date().getMonth() + 1);

// Mock de descarga (luego conectamos con window.open o axios blob)
const downloadReport = (type: 'daily' | 'weekly' | 'monthly' | 'welcome') => {
  console.log(`Descargando reporte: ${type}`);
  // Aquí irá la lógica: window.open(`${API_URL}/reports/${type}?param=...`)
};
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div
      class="bg-surface-dark border border-white/10 rounded-xl p-6 shadow-lg hover:border-primary/30 transition-colors"
    >
      <div class="flex items-center gap-3 mb-4 text-primary">
        <span class="material-symbols-outlined text-3xl">today</span>
        <h3 class="font-bold text-lg">Reporte Diario</h3>
      </div>
      <p class="text-slate-400 text-sm mb-4">
        Descarga el CSV con las transacciones de un día específico.
      </p>

      <div class="space-y-4">
        <div class="flex flex-col gap-1">
          <label class="text-xs uppercase text-slate-500 font-bold">Fecha</label>
          <input
            v-model="dailyDate"
            type="date"
            class="bg-background-dark border border-white/20 rounded-lg px-3 py-2 text-white focus:border-primary outline-none"
          />
        </div>
        <button
          @click="downloadReport('daily')"
          :disabled="!dailyDate"
          class="w-full bg-primary/10 border border-primary/50 text-primary font-bold py-2 rounded-lg hover:bg-primary hover:text-background-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Descargar CSV
        </button>
      </div>
    </div>

    <div
      class="bg-surface-dark border border-white/10 rounded-xl p-6 shadow-lg hover:border-primary/30 transition-colors"
    >
      <div class="flex items-center gap-3 mb-4 text-emerald-400">
        <span class="material-symbols-outlined text-3xl">date_range</span>
        <h3 class="font-bold text-lg text-white">Reporte Semanal</h3>
      </div>
      <p class="text-slate-400 text-sm mb-4">
        Genera un reporte de 7 días a partir de la fecha seleccionada.
      </p>

      <div class="space-y-4">
        <div class="flex flex-col gap-1">
          <label class="text-xs uppercase text-slate-500 font-bold">Fecha Inicio</label>
          <input
            v-model="weeklyStart"
            type="date"
            class="bg-background-dark border border-white/20 rounded-lg px-3 py-2 text-white focus:border-emerald-500 outline-none"
          />
        </div>
        <button
          @click="downloadReport('weekly')"
          :disabled="!weeklyStart"
          class="w-full bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 font-bold py-2 rounded-lg hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Descargar CSV
        </button>
      </div>
    </div>

    <div
      class="bg-surface-dark border border-white/10 rounded-xl p-6 shadow-lg hover:border-primary/30 transition-colors"
    >
      <div class="flex items-center gap-3 mb-4 text-blue-400">
        <span class="material-symbols-outlined text-3xl">calendar_month</span>
        <h3 class="font-bold text-lg text-white">Reporte Mensual</h3>
      </div>
      <p class="text-slate-400 text-sm mb-4">Resumen completo de ingresos y ocupación por mes.</p>

      <div class="space-y-4">
        <div class="flex gap-2">
          <div class="flex-1 flex flex-col gap-1">
            <label class="text-xs uppercase text-slate-500 font-bold">Año</label>
            <input
              v-model="monthlyYear"
              type="number"
              min="2024"
              max="2100"
              class="bg-background-dark border border-white/20 rounded-lg px-3 py-2 text-white focus:border-blue-500 outline-none"
            />
          </div>
          <div class="flex-1 flex flex-col gap-1">
            <label class="text-xs uppercase text-slate-500 font-bold">Mes</label>
            <select
              v-model="monthlyMonth"
              class="bg-background-dark border border-white/20 rounded-lg px-3 py-2 text-white focus:border-blue-500 outline-none"
            >
              <option v-for="m in 12" :key="m" :value="m">{{ m }}</option>
            </select>
          </div>
        </div>
        <button
          @click="downloadReport('monthly')"
          class="w-full bg-blue-500/10 border border-blue-500/50 text-blue-400 font-bold py-2 rounded-lg hover:bg-blue-500 hover:text-white transition-all"
        >
          Descargar CSV
        </button>
      </div>
    </div>

    <div
      class="md:col-span-2 lg:col-span-3 bg-gradient-to-r from-surface-dark to-primary/10 border border-white/10 rounded-xl p-6 flex items-center justify-between"
    >
      <div>
        <h3 class="font-bold text-lg text-white mb-1">Documento de Bienvenida</h3>
        <p class="text-slate-400 text-sm">Generar PDF con las reglas del hotel para imprimir.</p>
      </div>
      <button
        @click="downloadReport('welcome')"
        class="flex items-center gap-2 bg-white text-background-dark font-bold px-6 py-3 rounded-full hover:scale-105 transition-transform"
      >
        <span class="material-symbols-outlined">description</span>
        Generar PDF
      </button>
    </div>
  </div>
</template>
