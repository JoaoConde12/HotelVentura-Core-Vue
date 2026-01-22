<script setup lang="ts">
import { ref } from 'vue';

// Mock Data
const reservations = ref([
  {
    id: 105,
    cliente: 'Maria Lopez',
    habitacion: '205',
    fecha_entrada: '2024-02-10',
    fecha_salida: '2024-02-12',
    total: 140.0,
    estado: 'confirmada',
  },
  {
    id: 106,
    cliente: 'Juan Perez',
    habitacion: '101',
    fecha_entrada: '2024-03-01',
    fecha_salida: '2024-03-05',
    total: 160.0,
    estado: 'pendiente',
  },
]);

const handleAction = (id: number, action: string) => console.log(action, id);
</script>

<template>
  <div class="bg-surface-dark border border-white/10 rounded-xl overflow-hidden shadow-xl">
    <div class="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
      <h3 class="font-bold text-white">Últimas Reservas</h3>
      <div class="flex gap-2">
        <input
          type="text"
          placeholder="Buscar reserva..."
          class="bg-background-dark border border-white/10 rounded px-3 py-1 text-xs text-white focus:border-primary outline-none"
        />
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm text-slate-300">
        <thead class="bg-background-dark text-xs uppercase font-bold text-slate-500">
          <tr>
            <th class="px-6 py-4">ID</th>
            <th class="px-6 py-4">Cliente</th>
            <th class="px-6 py-4">Habitación</th>
            <th class="px-6 py-4">Fechas</th>
            <th class="px-6 py-4">Total</th>
            <th class="px-6 py-4">Estado</th>
            <th class="px-6 py-4 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5">
          <tr v-for="res in reservations" :key="res.id" class="hover:bg-white/5 transition-colors">
            <td class="px-6 py-4 font-mono text-xs opacity-50">#{{ res.id }}</td>
            <td class="px-6 py-4 font-bold text-white">{{ res.cliente }}</td>
            <td class="px-6 py-4">
              <span class="bg-white/10 px-2 py-1 rounded text-xs font-serif">{{
                res.habitacion
              }}</span>
            </td>
            <td class="px-6 py-4 text-xs">
              <div class="text-emerald-400">IN: {{ res.fecha_entrada }}</div>
              <div class="text-rose-400">OUT: {{ res.fecha_salida }}</div>
            </td>
            <td class="px-6 py-4 font-bold text-primary">${{ res.total }}</td>
            <td class="px-6 py-4">
              <span
                :class="[
                  'px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider',
                  res.estado === 'confirmada'
                    ? 'bg-primary/20 text-primary'
                    : 'bg-slate-700 text-slate-400',
                ]"
              >
                {{ res.estado }}
              </span>
            </td>
            <td class="px-6 py-4 text-right space-x-2">
              <button
                @click="handleAction(res.id, 'ver')"
                class="h-8 w-8 rounded-full bg-slate-700 text-slate-300 hover:bg-white hover:text-background-dark transition"
                title="Ver detalle"
              >
                <span class="material-symbols-outlined text-sm">visibility</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
