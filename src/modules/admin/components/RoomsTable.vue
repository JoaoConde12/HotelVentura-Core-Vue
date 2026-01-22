<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useToast } from 'vue-toastification';

import RoomModal from './RoomModal.vue';
import ConfirmModal from './ConfirmModal.vue';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
const toast = useToast();

interface RoomType {
  id: number;
  tipo: string;
  precio_noche: number;
  capacidad_personas: number;
}

interface Room {
  id: number;
  numero: string;
  piso: number;
  estado: string;
  room_type_id: number;
}

const rooms = ref<Room[]>([]);
const roomTypes = ref<RoomType[]>([]);
const isLoading = ref(false);
const isSaving = ref(false);

const showModal = ref(false);
const selectedRoom = ref<Room | null>(null);

const showConfirm = ref(false);
const roomToDeleteId = ref<number | null>(null);

const getAuthHeaders = () => {
  const token = Cookies.get('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'disponible':
      return 'bg-emerald-500/20 text-emerald-400';
    case 'ocupada':
      return 'bg-rose-500/20 text-rose-400';
    case 'mantenimiento':
      return 'bg-amber-500/20 text-amber-400';
    case 'limpieza':
      return 'bg-blue-500/20 text-blue-400';
    default:
      return 'bg-slate-700 text-slate-400';
  }
};

const getRoomTypeName = (room: Room) => {
  const type = roomTypes.value.find((t) => t.id === room.room_type_id);
  return type ? type.tipo : 'Sin Tipo Asignado';
};

const getRoomTypePrice = (room: Room) => {
  const type = roomTypes.value.find((t) => t.id === room.room_type_id);
  return type ? type.precio_noche : 0;
};

const fetchData = async () => {
  isLoading.value = true;
  try {
    const headers = getAuthHeaders();

    const [roomsRes, typesRes] = await Promise.all([
      axios.get(`${API_URL}/rooms`, { headers }),
      axios.get(`${API_URL}/room-types`, { headers }),
    ]);

    rooms.value = roomsRes.data;
    roomTypes.value = typesRes.data;
  } catch (error) {
    console.error('Error cargando datos:', error);
    toast.error('Error al cargar datos. Verifica que el backend esté corriendo.');
  } finally {
    isLoading.value = false;
  }
};

const openModal = (room: Room | null = null) => {
  selectedRoom.value = room;
  showModal.value = true;
};

const handleSaveRoom = async (payload: any) => {
  isSaving.value = true;
  try {
    const headers = getAuthHeaders();

    payload.room_type_id = Number(payload.room_type_id);

    if (selectedRoom.value) {
      const id = selectedRoom.value.id;
      const { data: updatedRoom } = await axios.put(`${API_URL}/rooms/${id}`, payload, { headers });

      const index = rooms.value.findIndex((r) => r.id === id);
      if (index !== -1) {
        rooms.value[index] = updatedRoom;
      }
      toast.success('Habitación actualizada');
    } else {
      const { data: newRoom } = await axios.post(`${API_URL}/rooms`, payload, { headers });
      rooms.value.push(newRoom);
      toast.success('Habitación creada');
    }
    showModal.value = false;
  } catch (error: any) {
    console.error(error);
    const msg = error.response?.data?.detail || 'Error al guardar';
    toast.error(typeof msg === 'string' ? msg : JSON.stringify(msg));
  } finally {
    isSaving.value = false;
  }
};

const requestDelete = (id: number) => {
  roomToDeleteId.value = id;
  showConfirm.value = true;
};

const confirmDelete = async () => {
  if (!roomToDeleteId.value) return;
  try {
    await axios.delete(`${API_URL}/rooms/${roomToDeleteId.value}`, { headers: getAuthHeaders() });
    rooms.value = rooms.value.filter((r) => r.id !== roomToDeleteId.value);
    toast.success('Habitación eliminada');
  } catch (error) {
    console.error(error);
    toast.error('No se pudo eliminar la habitación');
  } finally {
    showConfirm.value = false;
    roomToDeleteId.value = null;
  }
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="bg-surface-dark border border-white/10 rounded-xl overflow-hidden shadow-xl relative">
    <div class="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
      <h3 class="font-bold text-white">Gestión de Habitaciones</h3>
      <div class="flex gap-3 items-center">
        <span v-if="isLoading" class="text-xs text-primary animate-pulse">Cargando...</span>
        <button
          @click="openModal(null)"
          class="bg-primary text-background-dark text-xs font-bold uppercase px-4 py-2 rounded hover:brightness-110 transition shadow-[0_0_15px_rgba(212,175,55,0.4)]"
        >
          + Nueva Habitación
        </button>
      </div>
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
          <tr v-if="rooms.length === 0 && !isLoading">
            <td colspan="5" class="px-6 py-8 text-center text-slate-500">
              No hay habitaciones registradas.
            </td>
          </tr>

          <tr v-for="room in rooms" :key="room.id" class="hover:bg-white/5 transition-colors">
            <td class="px-6 py-4 font-serif text-lg text-white font-bold">{{ room.numero }}</td>
            <td class="px-6 py-4">Piso {{ room.piso }}</td>
            <td class="px-6 py-4">
              <div class="font-bold text-primary">{{ getRoomTypeName(room) }}</div>
              <div class="text-xs opacity-70">${{ getRoomTypePrice(room) }} / noche</div>
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
                @click="openModal(room)"
                class="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition"
                title="Editar"
              >
                <span class="material-symbols-outlined text-sm">edit</span>
              </button>
              <button
                @click="requestDelete(room.id)"
                class="inline-flex items-center justify-center h-8 w-8 rounded-full bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition"
                title="Eliminar"
              >
                <span class="material-symbols-outlined text-sm">delete</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <RoomModal
      :is-open="showModal"
      :room-to-edit="selectedRoom"
      :is-saving="isSaving"
      :room-types="roomTypes"
      @close="showModal = false"
      @save="handleSaveRoom"
    />

    <ConfirmModal
      :is-open="showConfirm"
      title="¿Eliminar Habitación?"
      message="Esta acción borrará la habitación permanentemente."
      @close="showConfirm = false"
      @confirm="confirmDelete"
    />
  </div>
</template>
