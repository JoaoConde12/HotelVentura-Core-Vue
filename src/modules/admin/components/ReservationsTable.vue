<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useToast } from 'vue-toastification';

import ReservationModal from './ReservationModal.vue';
import ConfirmModal from './ConfirmModal.vue';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
const toast = useToast();

interface User {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
}
interface Room {
  id: number;
  numero: string;
  piso: number;
  room_type_id: number;
}
interface RoomType {
  id: number;
  tipo: string;
  precio_noche: number;
}

interface Reservation {
  id: number;
  user_id: number;
  room_id: number;
  fecha_inicio: string;
  fecha_fin: string;
  costo_total: number;
  status: string;
  estado?: string;
}

const reservations = ref<Reservation[]>([]);
const users = ref<User[]>([]);
const rooms = ref<Room[]>([]);
const roomTypes = ref<RoomType[]>([]);
const isLoading = ref(false);
const isSaving = ref(false);
const searchQuery = ref('');

const showModal = ref(false);
const selectedRes = ref<Reservation | null>(null);
const showConfirm = ref(false);
const deleteId = ref<number | null>(null);

const getAuthHeaders = () => {
  const token = Cookies.get('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const getClientName = (userId: number) => {
  const u = users.value.find((u) => u.id === userId);
  return u ? `${u.nombre} ${u.apellido}` : 'Usuario Desconocido';
};

const getRoomInfo = (roomId: number) => {
  const r = rooms.value.find((r) => r.id === roomId);
  if (!r) return 'Hab. ???';
  const type = roomTypes.value.find((t) => t.id === r.room_type_id);
  return `Hab. ${r.numero} (${type ? type.tipo : '...'})`;
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  return dateStr.split('T')[0];
};

const filteredReservations = computed(() => {
  if (!searchQuery.value) return reservations.value;
  const q = searchQuery.value.toLowerCase();
  return reservations.value.filter((res) => {
    const client = getClientName(res.user_id).toLowerCase();
    const room = getRoomInfo(res.room_id).toLowerCase();
    return client.includes(q) || room.includes(q);
  });
});

const fetchData = async () => {
  isLoading.value = true;
  try {
    const headers = getAuthHeaders();
    const [resResp, usersResp, roomsResp, typesResp] = await Promise.all([
      axios.get(`${API_URL}/reservations`, { headers }),
      axios.get(`${API_URL}/users`, { headers }),
      axios.get(`${API_URL}/rooms`, { headers }),
      axios.get(`${API_URL}/room-types`, { headers }),
    ]);
    reservations.value = resResp.data;
    users.value = usersResp.data;
    rooms.value = roomsResp.data;
    roomTypes.value = typesResp.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    toast.error('Error al cargar datos.');
  } finally {
    isLoading.value = false;
  }
};

const handleSave = async (payload: any) => {
  isSaving.value = true;
  try {
    const headers = getAuthHeaders();

    const dataToSend = {
      ...payload,
      costo_total: payload.total_price,
    };

    if (selectedRes.value) {
      const { data: updated } = await axios.put(
        `${API_URL}/reservations/${selectedRes.value.id}`,
        dataToSend,
        { headers },
      );
      const idx = reservations.value.findIndex((r) => r.id === selectedRes.value!.id);
      if (idx !== -1) reservations.value[idx] = updated;
      toast.success('Reserva actualizada');
    } else {
      const { data: created } = await axios.post(`${API_URL}/reservations/admin`, dataToSend, {
        headers,
      });
      reservations.value.push(created);
      toast.success('Reserva creada');
    }
    showModal.value = false;
    fetchData();
  } catch (error: any) {
    toast.error(error.response?.data?.detail || 'Error al guardar');
  } finally {
    isSaving.value = false;
  }
};

const requestDelete = (id: number) => {
  deleteId.value = id;
  showConfirm.value = true;
};

const confirmDelete = async () => {
  if (!deleteId.value) return;
  try {
    await axios.delete(`${API_URL}/reservations/${deleteId.value}`, { headers: getAuthHeaders() });
    reservations.value = reservations.value.filter((r) => r.id !== deleteId.value);
    toast.success('Reserva eliminada');
  } catch (error) {
    toast.error('No se pudo eliminar la reserva');
  } finally {
    showConfirm.value = false;
    deleteId.value = null;
  }
};

onMounted(fetchData);
</script>

<template>
  <div class="bg-surface-dark border border-white/10 rounded-xl overflow-hidden shadow-xl relative">
    <div class="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
      <h3 class="font-bold text-white">Últimas Reservas</h3>
      <div class="flex gap-3 items-center">
        <button
          @click="
            () => {
              selectedRes = null;
              showModal = true;
            }
          "
          class="bg-primary text-background-dark text-xs font-bold uppercase px-4 py-2 rounded hover:brightness-110 transition shadow-[0_0_15px_rgba(212,175,55,0.4)]"
        >
          + Nueva Reserva
        </button>
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
          <tr v-if="filteredReservations.length === 0 && !isLoading">
            <td colspan="7" class="px-6 py-8 text-center text-slate-500">
              No se encontraron resultados.
            </td>
          </tr>
          <tr
            v-for="res in filteredReservations"
            :key="res.id"
            class="hover:bg-white/5 transition-colors"
          >
            <td class="px-6 py-4 font-mono text-xs opacity-50">#{{ res.id }}</td>
            <td class="px-6 py-4 font-bold text-white">{{ getClientName(res.user_id) }}</td>
            <td class="px-6 py-4">
              <span class="bg-white/10 px-2 py-1 rounded text-xs font-serif">{{
                getRoomInfo(res.room_id)
              }}</span>
            </td>
            <td class="px-6 py-4 text-xs">
              <div class="text-emerald-400">IN: {{ formatDate(res.fecha_inicio) }}</div>
              <div class="text-rose-400">OUT: {{ formatDate(res.fecha_fin) }}</div>
            </td>
            <td class="px-6 py-4 font-bold text-primary">${{ res.costo_total || 0 }}</td>
            <td class="px-6 py-4">
              <span
                :class="[
                  'px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider',
                  (res.status || res.estado) === 'confirmada'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : (res.status || res.estado) === 'pendiente'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-rose-500/20 text-rose-400',
                ]"
              >
                {{ res.status || res.estado }}
              </span>
            </td>
            <td class="px-6 py-4 text-right space-x-2">
              <button
                @click="
                  () => {
                    selectedRes = res;
                    showModal = true;
                  }
                "
                class="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition"
              >
                <span class="material-symbols-outlined text-sm">edit</span>
              </button>
              <button
                @click="requestDelete(res.id)"
                class="inline-flex items-center justify-center h-8 w-8 rounded-full bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition"
              >
                <span class="material-symbols-outlined text-sm">delete</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ReservationModal
      :is-open="showModal"
      :reservation-to-edit="selectedRes"
      :is-saving="isSaving"
      :users="users"
      :rooms="rooms"
      :room-types="roomTypes"
      @close="showModal = false"
      @save="handleSave"
    />
    <ConfirmModal
      :is-open="showConfirm"
      title="¿Eliminar Reserva?"
      message="Esta acción no se puede deshacer."
      @close="showConfirm = false"
      @confirm="confirmDelete"
    />
  </div>
</template>
