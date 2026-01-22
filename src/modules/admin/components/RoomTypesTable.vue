<script setup lang="ts">
import { ref } from 'vue';

const types = ref([
  { id: 1, tipo: 'Simple', capacidad_personas: 1, precio_noche: 40.0 },
  { id: 2, tipo: 'Doble', capacidad_personas: 2, precio_noche: 60.0 },
  { id: 3, tipo: 'Matrimonial', capacidad_personas: 2, precio_noche: 70.0 },
  { id: 4, tipo: 'Suite', capacidad_personas: 3, precio_noche: 100.0 },
]);

const handleEdit = (id: number) => console.log('Edit type', id);
</script>

<template>
  <div class="bg-surface-dark border border-white/10 rounded-xl overflow-hidden shadow-xl">
    <div class="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
      <h3 class="font-bold text-white">Tipos de Habitación (Tarifario)</h3>
      <button
        class="bg-primary text-background-dark text-xs font-bold uppercase px-4 py-2 rounded hover:brightness-110 transition"
      >
        + Nuevo Tipo
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm text-slate-300">
        <thead class="bg-background-dark text-xs uppercase font-bold text-slate-500">
          <tr>
            <th class="px-6 py-4">Nombre del Tipo</th>
            <th class="px-6 py-4">Capacidad</th>
            <th class="px-6 py-4">Precio Base</th>
            <th class="px-6 py-4 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5">
          <tr v-for="t in types" :key="t.id" class="hover:bg-white/5 transition-colors">
            <td class="px-6 py-4 font-bold text-white">{{ t.tipo }}</td>
            <td class="px-6 py-4 flex items-center gap-2">
              <span class="material-symbols-outlined text-sm text-slate-500">person</span>
              {{ t.capacidad_personas }} Pers.
            </td>
            <td class="px-6 py-4 font-mono text-primary">${{ t.precio_noche }}</td>
            <td class="px-6 py-4 text-right space-x-2">
              <button
                @click="handleEdit(t.id)"
                class="h-8 w-8 rounded-full bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition"
              >
                <span class="material-symbols-outlined text-sm">edit</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
