<script setup lang="ts">
import { ref } from 'vue';
import UsersTable from '../components/UsersTable.vue';
import RoomsTable from '../components/RoomsTable.vue';
import ReservationsTable from '../components/ReservationsTable.vue';
import RoomTypesTable from '../components/RoomTypesTable.vue'; // <--- NUEVO IMPORT
import ReportsPanel from '../components/ReportsPanel.vue';

// Estado para controlar qué pestaña está activa
const activeTab = ref<'reports' | 'users' | 'rooms' | 'room-types' | 'reservations'>('reports');

const menuItems = [
  { id: 'reports', label: 'Dashboard', icon: 'analytics' },
  { id: 'users', label: 'Usuarios', icon: 'group' },
  { id: 'rooms', label: 'Habitaciones', icon: 'bed' },
  { id: 'room-types', label: 'Tipos & Tarifas', icon: 'category' }, // <--- NUEVA OPCIÓN
  { id: 'reservations', label: 'Reservas', icon: 'book_online' },
];
</script>

<template>
  <div class="min-h-screen bg-background-dark text-white flex flex-col md:flex-row font-sans">
    <aside class="w-full md:w-64 bg-surface-dark border-r border-white/10 flex-shrink-0">
      <div class="p-6 border-b border-white/10">
        <h1 class="font-serif text-xl font-bold text-primary">Admin Panel</h1>
        <p class="text-xs text-slate-400 mt-1">Hotel Ventura</p>
      </div>

      <nav class="p-4 space-y-2">
        <button
          v-for="item in menuItems"
          :key="item.id"
          @click="activeTab = item.id as any"
          :class="[
            'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all',
            activeTab === item.id
              ? 'bg-primary text-background-dark shadow-[0_0_15px_rgba(212,175,55,0.4)]'
              : 'text-slate-400 hover:bg-white/5 hover:text-white',
          ]"
        >
          <span class="material-symbols-outlined">{{ item.icon }}</span>
          {{ item.label }}
        </button>
      </nav>
    </aside>

    <main class="flex-1 p-6 md:p-10 overflow-y-auto">
      <header class="mb-8 flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-bold text-white capitalize">
            {{ menuItems.find((i) => i.id === activeTab)?.label }}
          </h2>
          <p class="text-slate-400 text-sm">Gestión del sistema</p>
        </div>
        <div
          class="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50"
        >
          <span class="material-symbols-outlined text-primary">person</span>
        </div>
      </header>

      <div class="animate-fade-in">
        <ReportsPanel v-if="activeTab === 'reports'" />
        <UsersTable v-else-if="activeTab === 'users'" />
        <RoomsTable v-else-if="activeTab === 'rooms'" />
        <RoomTypesTable v-else-if="activeTab === 'room-types'" />
        <ReservationsTable v-else-if="activeTab === 'reservations'" />
        <div
          v-else-if="activeTab === 'reservations'"
          class="p-10 text-center text-slate-500 bg-surface-dark rounded-xl border border-white/5"
        >
          <span class="material-symbols-outlined text-4xl mb-2">construction</span>
          <p>Tabla de Reservas (Próximamente)</p>
        </div>
      </div>
    </main>
  </div>
</template>
