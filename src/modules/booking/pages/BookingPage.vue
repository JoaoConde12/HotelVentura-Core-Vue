<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import FloorMap from '../components/FloorMap.vue';
import LandingNavbar from '@/modules/landing/components/LandingNavbar.vue';

interface Room {
  id: number;
  number: string;
  status: 'available' | 'occupied' | 'maintenance' | 'selected';
  type: string;
  price: number;
}

const currentFloor = ref(1);
const selectedRoom = ref<Room | null>(null);
const getToday = () => new Date().toISOString().split('T')[0];

const dates = ref({
  start: '',
  end: '',
});

const minStartDate = computed(() => getToday());
const minEndDate = computed(() => dates.value.start || getToday());

watch(
  () => dates.value.start,
  (newStart) => {
    if (dates.value.end && newStart > dates.value.end) {
      dates.value.end = '';
    }
  },
);

// --- DATOS MOCK ---
const allRooms = ref<Room[]>([
  // PISO 1
  { id: 1, number: '102', type: 'Simple', price: 40, status: 'available' },
  { id: 2, number: '103', type: 'Doble', price: 60, status: 'occupied' },
  { id: 3, number: '104', type: 'Matrimonial', price: 70, status: 'available' },
  { id: 4, number: '105', type: 'Suite', price: 100, status: 'available' },
  { id: 5, number: '101', type: 'Simple', price: 40, status: 'maintenance' },
  { id: 6, number: '108', type: 'Doble', price: 60, status: 'available' },
  { id: 7, number: '107', type: 'Matrimonial', price: 70, status: 'available' },
  { id: 8, number: '106', type: 'Simple', price: 40, status: 'available' },
  // PISO 2
  { id: 9, number: '201', type: 'Suite View', price: 120, status: 'available' },
]);

const handleRoomSelect = (room: Room) => {
  selectedRoom.value = room;
};
</script>

<template>
  <LandingNavbar />
  <div class="min-h-screen bg-background-dark text-white pt-12 pb-12 px-4">
    <div class="mx-auto max-w-7xl">
      <div class="text-center mb-10">
        <h1 class="font-serif text-4xl mb-4">Reserva tu Habitación</h1>
        <p class="text-slate-400">Selecciona el piso y la habitación de tu preferencia</p>
      </div>

      <div
        class="flex flex-col md:flex-row gap-6 justify-center mb-12 bg-surface-dark/50 p-6 rounded-xl border border-white/5 max-w-4xl mx-auto"
      >
        <div class="flex items-center gap-4">
          <span class="text-sm font-bold uppercase tracking-wider text-primary">Piso:</span>
          <div class="flex bg-background-dark rounded-lg p-1 border border-white/10">
            <button
              v-for="floor in [1, 2, 3]"
              :key="floor"
              @click="currentFloor = floor"
              :class="[
                'px-4 py-2 rounded-md text-sm transition-all',
                currentFloor === floor
                  ? 'bg-primary text-background-dark font-bold'
                  : 'text-slate-400 hover:text-white',
              ]"
            >
              Piso {{ floor }}
            </button>
          </div>
        </div>

        <div class="flex gap-4">
          <div class="flex flex-col">
            <label class="text-[10px] uppercase text-slate-500 mb-1 font-bold">Llegada</label>
            <input
              v-model="dates.start"
              type="date"
              :min="minStartDate"
              class="bg-background-dark border border-white/10 rounded-lg px-4 py-2 text-sm focus:border-primary outline-none text-white w-full"
            />
          </div>

          <div class="flex flex-col">
            <label class="text-[10px] uppercase text-slate-500 mb-1 font-bold">Salida</label>
            <input
              v-model="dates.end"
              type="date"
              :min="minEndDate"
              :disabled="!dates.start"
              class="bg-background-dark border border-white/10 rounded-lg px-4 py-2 text-sm focus:border-primary outline-none text-white w-full disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      <FloorMap
        :floor="currentFloor"
        :rooms="allRooms"
        :selected-room-id="selectedRoom?.id"
        @select-room="handleRoomSelect"
      />

      <div
        v-if="selectedRoom"
        class="mt-8 max-w-md mx-auto bg-surface-dark border border-primary/30 p-6 rounded-xl shadow-2xl animate-fade-in-up"
      >
        <h3 class="font-serif text-2xl text-primary mb-2">Habitación {{ selectedRoom.number }}</h3>
        <div class="flex justify-between items-center mb-6">
          <span class="text-slate-300">{{ selectedRoom.type }}</span>
          <span class="text-xl font-bold">
            ${{ selectedRoom.price }}
            <span class="text-xs font-normal text-slate-500">/noche</span>
          </span>
        </div>

        <button
          :disabled="!dates.start || !dates.end"
          class="w-full bg-primary text-background-dark font-bold py-3 rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{
            !dates.start || !dates.end
              ? 'Selecciona fechas para continuar'
              : 'Continuar con la Reserva'
          }}
        </button>
      </div>
    </div>
  </div>
</template>
