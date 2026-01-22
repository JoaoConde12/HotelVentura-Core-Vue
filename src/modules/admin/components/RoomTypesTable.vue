<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useToast } from 'vue-toastification';

import RoomTypeModal from './RoomTypeModal.vue';
import ConfirmModal from './ConfirmModal.vue';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
const toast = useToast();

interface RoomType {
  id: number;
  tipo: string;
  capacidad_personas: number;
  precio_noche: number;
}

const types = ref<RoomType[]>([]);
const isLoading = ref(false);
const isSaving = ref(false);

const showModal = ref(false);
const selectedType = ref<RoomType | null>(null);

const showConfirm = ref(false);
const typeToDeleteId = ref<number | null>(null);

const getAuthHeaders = () => {
  const token = Cookies.get('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const fetchTypes = async () => {
  isLoading.value = true;
  try {
    const { data } = await axios.get(`${API_URL}/room-types`, { headers: getAuthHeaders() });
    types.value = data;
  } catch (error) {
    console.error('Error cargando tipos:', error);
    toast.error('Error al cargar tipos de habitación.');
  } finally {
    isLoading.value = false;
  }
};

const handleSave = async (payload: any) => {
  isSaving.value = true;
  try {
    const headers = getAuthHeaders();

    if (selectedType.value) {
      const id = selectedType.value.id;
      const { data: updated } = await axios.put(`${API_URL}/room-types/${id}`, payload, {
        headers,
      });

      const index = types.value.findIndex((t) => t.id === id);
      if (index !== -1) types.value[index] = updated;

      toast.success('Tipo actualizado correctamente');
    } else {
      const { data: created } = await axios.post(`${API_URL}/room-types`, payload, { headers });
      types.value.push(created);
      toast.success('Tipo creado correctamente');
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
  typeToDeleteId.value = id;
  showConfirm.value = true;
};

const confirmDelete = async () => {
  if (!typeToDeleteId.value) return;

  try {
    await axios.delete(`${API_URL}/room-types/${typeToDeleteId.value}`, {
      headers: getAuthHeaders(),
    });
    types.value = types.value.filter((t) => t.id !== typeToDeleteId.value);
    toast.success('Tipo eliminado correctamente');
  } catch (error) {
    console.error(error);
    toast.error('No se pudo eliminar (podría estar en uso por una habitación).');
  } finally {
    showConfirm.value = false;
    typeToDeleteId.value = null;
  }
};

onMounted(() => {
  fetchTypes();
});
</script>

<template>
  <div class="bg-surface-dark border border-white/10 rounded-xl overflow-hidden shadow-xl relative">
    <div class="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
      <h3 class="font-bold text-white">Tipos de Habitación</h3>
      <div class="flex gap-3 items-center">
        <span v-if="isLoading" class="text-xs text-primary animate-pulse">Cargando...</span>
        <button
          @click="
            () => {
              selectedType = null;
              showModal = true;
            }
          "
          class="bg-primary text-background-dark text-xs font-bold uppercase px-4 py-2 rounded hover:brightness-110 transition shadow-[0_0_15px_rgba(212,175,55,0.4)]"
        >
          + Nuevo Tipo
        </button>
      </div>
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
          <tr v-if="types.length === 0 && !isLoading">
            <td colspan="4" class="px-6 py-8 text-center text-slate-500">
              No hay tipos registrados.
            </td>
          </tr>

          <tr v-for="t in types" :key="t.id" class="hover:bg-white/5 transition-colors">
            <td class="px-6 py-4 font-bold text-white">{{ t.tipo }}</td>
            <td class="px-6 py-4 flex items-center gap-2">
              <span class="material-symbols-outlined text-sm text-slate-500">person</span>
              {{ t.capacidad_personas }} Pers.
            </td>
            <td class="px-6 py-4 font-mono text-primary">${{ t.precio_noche }}</td>

            <td class="px-6 py-4 text-right space-x-2">
              <button
                @click="
                  () => {
                    selectedType = t;
                    showModal = true;
                  }
                "
                class="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition"
                title="Editar"
              >
                <span class="material-symbols-outlined text-sm">edit</span>
              </button>
              <button
                @click="requestDelete(t.id)"
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

    <RoomTypeModal
      :is-open="showModal"
      :type-to-edit="selectedType"
      :is-saving="isSaving"
      @close="showModal = false"
      @save="handleSave"
    />

    <ConfirmModal
      :is-open="showConfirm"
      title="¿Eliminar Tipo?"
      message="Esta acción no se puede deshacer. Si hay habitaciones usando este tipo, podría fallar."
      @close="showConfirm = false"
      @confirm="confirmDelete"
    />
  </div>
</template>
