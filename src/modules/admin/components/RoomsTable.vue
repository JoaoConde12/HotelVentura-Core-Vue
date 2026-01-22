<script setup lang="ts">
import { ref } from 'vue';

// Mock Data (Simulando la respuesta del Backend con el JOIN de RoomType)
const rooms = ref([
  {
    id: 1,
    numero: '101',
    piso: 1,
    estado: 'disponible',
    room_type: { tipo: 'Simple', precio_noche: 40 },
  },
  {
    id: 2,
    numero: '205',
    piso: 2,
    estado: 'ocupada',
    room_type: { tipo: 'Matrimonial', precio_noche: 70 },
  },
  {
    id: 3,
    numero: '301',
    piso: 3,
    estado: 'mantenimiento',
    room_type: { tipo: 'Suite', precio_noche: 100 },
  },
]);

const handleEdit = (room: any) => console.log('Editando:', room.numero);
const handleDelete = (id: number) =>
  confirm('¿Eliminar habitación?') && console.log('Eliminando:', id);

// Helper para colores de estado
const getStatusColor = (status: string) => {
  switch (status) {
    case 'disponible':
      return 'bg-emerald-500/20 text-emerald-400';
    case 'ocupada':
      return 'bg-rose-500/20 text-rose-400';
    case 'mantenimiento':
      return 'bg-amber-500/20 text-amber-400';
    default:
      return 'bg-slate-700 text-slate-400';
  }
};
</script>

<template>
  <div class="bg-surface-dark border border-white/10 rounded-xl overflow-hidden shadow-xl">
    <div class="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
      <h3 class="font-bold text-white">Gestión de Habitaciones</h3>
      <button
        class="bg-primary text-background-dark text-xs font-bold uppercase px-4 py-2 rounded hover:brightness-110 transition"
      >
        + Nueva Habitación
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm text-slate-300">
        <thead class="bg-background-dark text-xs uppercase font-bold text-slate-500">
          <tr>
            <th class="px-6 py-4">Num</th>
            <th class="px-6 py-4">Piso</th>
            <th class="px-6 py-4">Tipo & Precio</th>
            <th class="px-6 py-4">Estado</th>
            <th class="px-6 py-4 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5">
          <tr v-for="room in rooms" :key="room.id" class="hover:bg-white/5 transition-colors">
            <td class="px-6 py-4 font-serif text-lg text-white font-bold">{{ room.numero }}</td>
            <td class="px-6 py-4">Piso {{ room.piso }}</td>
            <td class="px-6 py-4">
              <div class="font-bold text-primary">{{ room.room_type.tipo }}</div>
              <div class="text-xs opacity-70">${{ room.room_type.precio_noche }} / noche</div>
            </td>
            <td class="px-6 py-4">
              <span
                :class="[
                  'px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider',
                  getStatusColor(room.estado),
                ]"
              >
                {{ room.estado }}
              </span>
            </td>
            <td class="px-6 py-4 text-right space-x-2">
              <button
                @click="handleEdit(room)"
                class="h-8 w-8 rounded-full bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition"
              >
                <span class="material-symbols-outlined text-sm">edit</span>
              </button>
              <button
                @click="handleDelete(room.id)"
                class="h-8 w-8 rounded-full bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition"
              >
                <span class="material-symbols-outlined text-sm">delete</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
