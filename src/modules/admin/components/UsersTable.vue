<script setup lang="ts">
import { ref } from 'vue';

// Mock Data (Basado en tu modelo User: id, nombre, apellido, email, role...)
const users = ref([
  {
    id: 1,
    nombre: 'Joao',
    apellido: 'Conde',
    email: 'admin@hotel.com',
    role: 'admin',
    telefono: '0991234567',
  },
  {
    id: 2,
    nombre: 'Maria',
    apellido: 'Lopez',
    email: 'maria@client.com',
    role: 'cliente',
    telefono: '0987654321',
  },
]);

const handleEdit = (user: any) => {
  console.log('Editando usuario:', user.id);
  // Aquí abrirías un Modal
};

const handleDelete = (id: number) => {
  if (confirm('¿Estás seguro de eliminar este usuario?')) {
    console.log('Eliminando usuario:', id);
    // users.value = users.value.filter(...)
  }
};
</script>

<template>
  <div class="bg-surface-dark border border-white/10 rounded-xl overflow-hidden shadow-xl">
    <div class="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
      <h3 class="font-bold text-white">Listado de Usuarios</h3>
      <button
        class="bg-primary text-background-dark text-xs font-bold uppercase px-4 py-2 rounded hover:brightness-110 transition"
      >
        + Nuevo Usuario
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm text-slate-300">
        <thead class="bg-background-dark text-xs uppercase font-bold text-slate-500">
          <tr>
            <th class="px-6 py-4">ID</th>
            <th class="px-6 py-4">Usuario</th>
            <th class="px-6 py-4">Contacto</th>
            <th class="px-6 py-4">Rol</th>
            <th class="px-6 py-4 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5">
          <tr v-for="user in users" :key="user.id" class="hover:bg-white/5 transition-colors">
            <td class="px-6 py-4 font-mono text-xs opacity-50">#{{ user.id }}</td>
            <td class="px-6 py-4">
              <div class="font-bold text-white">{{ user.nombre }} {{ user.apellido }}</div>
              <div class="text-xs opacity-70">{{ user.email }}</div>
            </td>
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
                @click="handleEdit(user)"
                class="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition"
                title="Editar"
              >
                <span class="material-symbols-outlined text-sm">edit</span>
              </button>
              <button
                @click="handleDelete(user.id)"
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
      Mostrando {{ users.length }} registros
    </div>
  </div>
</template>
