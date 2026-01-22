<script setup lang="ts">
import { computed } from 'vue';

interface Room {
  id: number;
  number: string;
  status: 'available' | 'occupied' | 'maintenance' | 'selected';
  type: string;
  price: number;
}

const props = defineProps<{
  floor: number;
  rooms: Room[];
  selectedRoomId?: number | null;
}>();

const emit = defineEmits(['select-room']);

const floorRooms = computed(() => {
  return props.rooms.filter((r) => r.number.startsWith(String(props.floor)));
});

const getRoomColor = (room: Room) => {
  if (props.selectedRoomId === room.id) {
    return 'bg-primary text-background-dark border-primary shadow-[0_0_15px_rgba(212,175,55,0.6)] scale-105 z-10';
  }

  switch (room.status) {
    case 'available':
      return 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-400 cursor-pointer shadow-[0_0_10px_rgba(16,185,129,0.1)]';

    case 'occupied':
      return 'bg-rose-500/10 border-rose-500/30 text-rose-400 cursor-not-allowed pattern-diagonal-lines opacity-80';

    case 'maintenance':
      return 'bg-slate-700/30 border-slate-600 text-slate-500 cursor-not-allowed grayscale';

    default:
      return 'bg-surface-dark';
  }
};

const handleSelect = (room: Room) => {
  if (room.status === 'available') {
    emit('select-room', room);
  }
};
</script>

<template>
  <div
    class="relative w-full max-w-4xl mx-auto p-6 bg-background-dark border-2 border-slate-700 rounded-xl"
  >
    <div
      class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background-dark px-4 py-1 border border-slate-700 rounded-full"
    >
      <span class="text-xs font-bold uppercase tracking-widest text-slate-400"
        >Plano Piso {{ floor }}</span
      >
    </div>

    <div class="grid grid-cols-4 gap-4 sm:gap-6">
      <div
        v-for="room in floorRooms.slice(0, 4)"
        :key="room.id"
        @click="handleSelect(room)"
        :class="[
          'relative h-32 sm:h-40 border-2 rounded-lg transition-all duration-300 flex flex-col items-center justify-center p-2',
          getRoomColor(room),
        ]"
      >
        <span class="font-serif text-xl font-bold">{{ room.number }}</span>
        <span class="text-[10px] uppercase tracking-wide opacity-80">{{ room.type }}</span>
        <span v-if="room.status === 'occupied'" class="absolute top-2 right-2 text-xs">🔒</span>
      </div>

      <div
        class="col-span-4 h-16 sm:h-24 flex items-center justify-between px-4 border-x-2 border-slate-700/30 bg-background-dark relative overflow-hidden"
      >
        <div
          class="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none"
        >
          <span class="text-4xl font-serif text-slate-500 tracking-[1em]">PASILLO</span>
        </div>
        <div
          class="absolute bottom-0 left-0 bg-primary/20 border border-primary text-primary text-[10px] px-2 py-0.5 rounded-tr-md"
        >
          ENTRADA
        </div>
      </div>

      <div
        v-for="room in floorRooms.slice(4, 8)"
        :key="room.id"
        @click="handleSelect(room)"
        :class="[
          'relative h-32 sm:h-40 border-2 rounded-lg transition-all duration-300 flex flex-col items-center justify-center p-2',
          getRoomColor(room),
        ]"
      >
        <span class="font-serif text-xl font-bold">{{ room.number }}</span>
        <span class="text-[10px] uppercase tracking-wide opacity-80">{{ room.type }}</span>
        <span v-if="room.status === 'available'" class="mt-1 text-xs font-bold text-emerald-400"
          >${{ room.price }}</span
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
.pattern-diagonal-lines {
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 10px,
    rgba(255, 255, 255, 0.03) 10px,
    rgba(255, 255, 255, 0.03) 20px
  );
}
</style>
