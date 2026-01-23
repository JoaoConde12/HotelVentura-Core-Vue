<script setup lang="ts">
import { computed } from 'vue';

interface Room {
  id: number;
  number: string;
  floor: number;
  status: 'available' | 'occupied' | 'maintenance' | 'selected';
  type: string;
  price: number;
  baseStatus: 'available' | 'occupied' | 'maintenance' | 'selected';
}

const props = defineProps<{
  floor: number;
  rooms: Room[];
  selectedRoomId?: number | null;
}>();

const emit = defineEmits<{
  (e: 'select-room', room: Room): void;
}>();

const floorRooms = computed(() => props.rooms.filter((r) => r.floor === props.floor));

const getRoomColor = (room: Room) => {
  if (props.selectedRoomId === room.id) {
    return 'bg-primary text-background-dark border-primary shadow-[0_0_20px_rgba(212,175,55,0.4)] scale-[1.02] z-10';
  }

  switch (room.status) {
    case 'available':
      return 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400 hover:border-emerald-400/60 hover:bg-emerald-500/10 cursor-pointer';
    case 'occupied':
      return 'bg-rose-500/5 border-rose-500/20 text-rose-400/60 cursor-not-allowed pattern-diagonal';
    case 'maintenance':
      return 'bg-slate-800 border-slate-700 text-slate-600 cursor-not-allowed opacity-50';
    default:
      return 'bg-surface-dark border-white/5';
  }
};

const statusLabel = (room: Room) => {
  if (room.status === 'available') return 'Disponible';
  if (room.status === 'occupied') return 'Ocupada';
  if (room.status === 'maintenance') return 'Mantenimiento';
  return '';
};

const statusPillClass = (room: Room) => {
  switch (room.status) {
    case 'available':
      return 'bg-emerald-500/10 text-emerald-300';
    case 'occupied':
      return 'bg-rose-500/10 text-rose-300';
    case 'maintenance':
      return 'bg-slate-500/10 text-slate-300';
    default:
      return 'bg-white/5 text-slate-200';
  }
};
</script>

<template>
  <div
    class="relative w-full max-w-4xl mx-auto p-8 bg-surface-dark/30 border border-white/10 rounded-3xl backdrop-blur-md"
  >
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <template v-for="(room, i) in floorRooms" :key="room.id">
        <!-- Pasillo -->
        <div
          v-if="i === 4"
          class="col-span-2 md:col-span-4 h-12 my-4 flex items-center justify-center border-y border-white/5 bg-background-dark/50 relative"
        >
          <span class="text-[10px] uppercase tracking-[1.5em] text-slate-600 font-black"
            >Pasillo</span
          >
          <div class="absolute left-0 h-full w-1 bg-primary/30"></div>
        </div>

        <!-- Card -->
        <div
          @click="room.status === 'available' && emit('select-room', room)"
          :class="[
            'h-32 border-2 rounded-xl transition-all duration-500 flex flex-col items-center justify-center group',
            getRoomColor(room),
          ]"
        >
          <span class="text-xs font-bold opacity-40 mb-1">HAB</span>
          <span class="font-serif text-2xl font-bold">{{ room.number }}</span>

          <div
            v-if="statusLabel(room)"
            class="mt-2 text-[10px] font-bold px-2 py-0.5 rounded uppercase"
            :class="statusPillClass(room)"
          >
            {{ statusLabel(room) }}
          </div>

          <span v-if="room.price" class="text-primary font-bold text-sm mt-1"
            >${{ room.price }}</span
          >
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.pattern-diagonal {
  background-image: radial-gradient(circle at 2px 2px, rgba(244, 63, 94, 0.1) 1px, transparent 0);
  background-size: 8px 8px;
}
</style>
