<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useToast } from 'vue-toastification';
import UserModal from './UserModal.vue';
import ConfirmModal from './ConfirmModal.vue';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
const toast = useToast();

interface User {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  role: string;
  telefono: string;
  cedula: string;
}

const users = ref<User[]>([]);
const isLoading = ref(false);

const showModal = ref(false);
const isSaving = ref(false);
const selectedUser = ref<User | null>(null);

const showConfirm = ref(false);
const userToDeleteId = ref<number | null>(null);

const getAuthHeaders = () => {
  const token = Cookies.get('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const fetchUsers = async () => {
  isLoading.value = true;
  try {
    const { data } = await axios.get(`${API_URL}/users`, { headers: getAuthHeaders() });
    users.value = data;
  } catch (error) {
    console.error('Error cargando usuarios:', error);
    toast.error('Error al cargar la lista de usuarios.');
  } finally {
    isLoading.value = false;
  }
};

const openModal = (user: User | null = null) => {
  selectedUser.value = user;
  showModal.value = true;
};

const handleSaveUser = async (payload: any) => {
  isSaving.value = true;
  try {
    const headers = getAuthHeaders();

    if (selectedUser.value) {
      const userId = selectedUser.value.id;
      await axios.put(`${API_URL}/users/${userId}`, payload, { headers });

      const index = users.value.findIndex((u) => u.id === userId);
      if (index !== -1) {
        users.value[index] = { ...users.value[index], ...payload };
      }
      toast.success('Usuario actualizado correctamente');
    } else {
      const { data: newUser } = await axios.post(`${API_URL}/users`, payload, { headers });
      users.value.push(newUser);
      toast.success('Usuario creado correctamente');
    }

    showModal.value = false;
  } catch (error: any) {
    console.error('Error al guardar:', error);
    const msg = error.response?.data?.detail
      ? Array.isArray(error.response.data.detail)
        ? error.response.data.detail.map((e: any) => e.msg).join(', ')
        : error.response.data.detail
      : 'Error al guardar.';

    toast.error(msg);
  } finally {
    isSaving.value = false;
  }
};

const requestDelete = (id: number) => {
  userToDeleteId.value = id;
  showConfirm.value = true;
};

const confirmDelete = async () => {
  if (!userToDeleteId.value) return;

  try {
    await axios.delete(`${API_URL}/users/${userToDeleteId.value}`, { headers: getAuthHeaders() });
    users.value = users.value.filter((user) => user.id !== userToDeleteId.value);
    toast.success('Usuario eliminado correctamente');
  } catch (error) {
    console.error('Error al eliminar:', error);
    toast.error('No se pudo eliminar el usuario.');
  } finally {
    showConfirm.value = false;
    userToDeleteId.value = null;
  }
};

onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <div class="bg-surface-dark border border-white/10 rounded-xl overflow-hidden shadow-xl relative">
    <div class="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
      <h3 class="font-bold text-white">Listado de Usuarios</h3>
      <div class="flex gap-3 items-center">
        <span v-if="isLoading" class="text-xs text-primary animate-pulse">Cargando...</span>
        <button
          @click="openModal(null)"
          class="bg-primary text-background-dark text-xs font-bold uppercase px-4 py-2 rounded hover:brightness-110 transition shadow-[0_0_15px_rgba(212,175,55,0.4)]"
        >
          + Nuevo Usuario
        </button>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm text-slate-300">
        <thead class="bg-background-dark text-xs uppercase font-bold text-slate-500">
          <tr>
            <th class="px-6 py-4">ID</th>
            <th class="px-6 py-4">Usuario</th>
            <th class="px-6 py-4">Cédula</th>
            <th class="px-6 py-4">Contacto</th>
            <th class="px-6 py-4">Rol</th>
            <th class="px-6 py-4 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5">
          <tr v-if="users.length === 0 && !isLoading">
            <td colspan="6" class="px-6 py-8 text-center text-slate-500">
              No hay usuarios registrados.
            </td>
          </tr>

          <tr v-for="user in users" :key="user.id" class="hover:bg-white/5 transition-colors group">
            <td class="px-6 py-4 font-mono text-xs opacity-50">#{{ user.id }}</td>
            <td class="px-6 py-4">
              <div class="font-bold text-white">{{ user.nombre }} {{ user.apellido }}</div>
              <div class="text-xs opacity-70">{{ user.email }}</div>
            </td>
            <td class="px-6 py-4 font-mono">{{ user.cedula }}</td>
            <td class="px-6 py-4">{{ user.telefono }}</td>
            <td class="px-6 py-4">
              <span
                :class="[
                  'px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider',
                  user.role === 'admin'
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'bg-slate-700 text-slate-400',
                ]"
              >
                {{ user.role }}
              </span>
            </td>
            <td class="px-6 py-4 text-right space-x-2">
              <button
                @click="openModal(user)"
                class="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition"
                title="Editar"
              >
                <span class="material-symbols-outlined text-sm">edit</span>
              </button>
              <button
                @click="requestDelete(user.id)"
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

    <div class="p-4 border-t border-white/10 text-xs text-center text-slate-500">
      Total: {{ users.length }} usuarios
    </div>

    <UserModal
      :is-open="showModal"
      :user-to-edit="selectedUser"
      :is-saving="isSaving"
      @close="showModal = false"
      @save="handleSaveUser"
    />

    <ConfirmModal
      :is-open="showConfirm"
      title="¿Eliminar Usuario?"
      message="Se borrará permanentemente del sistema. ¿Deseas continuar?"
      @close="showConfirm = false"
      @confirm="confirmDelete"
    />
  </div>
</template>
