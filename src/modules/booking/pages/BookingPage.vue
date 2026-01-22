<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import FloorMap from '../components/FloorMap.vue';
import LandingNavbar from '@/modules/landing/components/LandingNavbar.vue';

import api from '@/app/config/axios';

type RoomStatus = 'available' | 'occupied' | 'maintenance' | 'selected';

interface Room {
  id: number;
  number: string; // "101"
  floor: number; // 1
  status: RoomStatus;
  type: string;
  price: number;
  baseStatus: RoomStatus;
}

interface Reservation {
  id: number;
  room_id: number;
  fecha_inicio: string;
  fecha_fin: string;
  status: 'pending' | 'paid' | 'cancelled' | string;
}

const allRooms = ref<Room[]>([]);
const reservations = ref<Reservation[]>([]);
const isLoading = ref(true);

const currentFloor = ref(1);
const selectedRoom = ref<Room | null>(null);

const dates = ref({
  start: '',
  end: '',
});

const isCreatingPaypal = ref(false);

const reservationError = ref<string | null>(null);
const reservationSuccess = ref<string | null>(null);

// ✅ si ya se generó una reserva pending “del flujo actual”
const hasPendingReservation = ref(false);
const lastReservationId = ref<number | null>(null);

// ---------- fechas ----------
const getToday = () => new Date().toISOString().split('T')[0];
const minStartDate = computed(() => getToday());
const minEndDate = computed(() => dates.value.start || getToday());

watch(
  () => dates.value.start,
  (newStart) => {
    if (dates.value.end && newStart > dates.value.end) dates.value.end = '';
  },
);

// ---------- helpers ----------
const backendEstadoToBase = (estado: string): RoomStatus => {
  if (estado === 'disponible') return 'available';
  if (estado === 'ocupada') return 'occupied';
  return 'maintenance';
};

const parseISODateParts = (s: string): { y: number; m: number; d: number } | null => {
  const parts = s.split('-');
  if (parts.length !== 3) return null;

  const y = Number(parts[0]);
  const m = Number(parts[1]);
  const d = Number(parts[2]);

  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return null;
  if (m < 1 || m > 12) return null;
  if (d < 1 || d > 31) return null;

  return { y, m, d };
};

const toDateOnlyUTC = (raw: string): number | null => {
  if (!raw) return null;
  let s = raw;

  if (s.includes('T')) s = s.split('T')[0] ?? s;
  if (s.includes(' ')) s = s.split(' ')[0] ?? s;

  if (s.includes('/')) {
    const p = s.split('/');
    if (p.length !== 3) return null;
    const dd = p[0];
    const mm = p[1];
    const yyyy = p[2];
    if (!dd || !mm || !yyyy) return null;
    s = `${yyyy}-${mm}-${dd}`;
  }

  const parsed = parseISODateParts(s);
  if (!parsed) return null;

  return Date.UTC(parsed.y, parsed.m - 1, parsed.d);
};

// overlap: [start, end) checkout no ocupa noche
const overlaps = (resStart: string, resEnd: string, selStart: string, selEnd: string): boolean => {
  const aStart = toDateOnlyUTC(resStart);
  const aEnd = toDateOnlyUTC(resEnd);
  const bStart = toDateOnlyUTC(selStart);
  const bEnd = toDateOnlyUTC(selEnd);

  if (aStart == null || aEnd == null || bStart == null || bEnd == null) return false;
  return aStart < bEnd && aEnd > bStart;
};

// ---------- fetch data ----------
const fetchRoomsAndTypes = async () => {
  const [roomsRes, typesRes] = await Promise.all([api.get(`/rooms`), api.get(`/room-types`)]);

  allRooms.value = roomsRes.data.map((r: any) => {
    const typeInfo = typesRes.data.find((t: any) => t.id === r.room_type_id);

    const displayNumber = String(r.numero);
    const baseStatus = backendEstadoToBase(String(r.estado));

    return {
      id: Number(r.id),
      number: displayNumber,
      floor: Number(r.piso),
      baseStatus,
      status: baseStatus,
      type: typeInfo ? String(typeInfo.tipo) : 'Estándar',
      price: typeInfo ? Number(typeInfo.precio_noche) : 0,
    } as Room;
  });
};

const fetchReservations = async () => {
  const res = await api.get(`/reservations`);
  reservations.value = Array.isArray(res.data) ? res.data : [];
};

const recomputeAvailability = () => {
  const { start, end } = dates.value;

  if (!start || !end) {
    allRooms.value = allRooms.value.map((rm) => ({ ...rm, status: rm.baseStatus }));
    return;
  }

  // pending y paid bloquean
  const blocking = reservations.value.filter((r) => r.status === 'pending' || r.status === 'paid');

  const blockedRoomIds = new Set<number>();
  for (const r of blocking) {
    if (overlaps(r.fecha_inicio, r.fecha_fin, start, end)) {
      blockedRoomIds.add(r.room_id);
    }
  }

  allRooms.value = allRooms.value.map((rm) => {
    if (rm.baseStatus === 'maintenance') return { ...rm, status: 'maintenance' };
    if (blockedRoomIds.has(rm.id)) return { ...rm, status: 'occupied' };
    return { ...rm, status: 'available' };
  });

  // ✅ si estás en flujo de pago (hasPendingReservation), NO mates la selección
  if (selectedRoom.value && !hasPendingReservation.value) {
    const updated = allRooms.value.find((x) => x.id === selectedRoom.value!.id);
    if (!updated || updated.status !== 'available') selectedRoom.value = null;
  }
};

const fetchData = async () => {
  isLoading.value = true;
  try {
    await fetchRoomsAndTypes();
    await fetchReservations();
    recomputeAvailability();
  } catch (error) {
    console.error('Error cargando data:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchData);

// Cambios de fechas => se resetea el flujo
watch(
  () => [dates.value.start, dates.value.end] as const,
  async ([start, end]) => {
    reservationError.value = null;
    reservationSuccess.value = null;

    hasPendingReservation.value = false;
    lastReservationId.value = null;

    if (!start || !end) {
      recomputeAvailability();
      return;
    }

    try {
      await fetchReservations();
    } finally {
      recomputeAvailability();
    }
  },
);

// ---------- UI handlers ----------
const handleRoomSelect = (room: Room) => {
  if (room.status !== 'available') return;

  selectedRoom.value = room;

  reservationError.value = null;
  reservationSuccess.value = null;

  hasPendingReservation.value = false;
  lastReservationId.value = null;
};

// ✅ Ahora SOLO pagas con PayPal:
// - backend create-order crea la reserva pending
// - devuelve approve_url + reservation_id
const payWithPaypal = async () => {
  reservationError.value = null;
  reservationSuccess.value = null;

  if (!selectedRoom.value) {
    reservationError.value = 'Selecciona una habitación antes de pagar.';
    return;
  }
  if (!dates.value.start || !dates.value.end) {
    reservationError.value = 'Selecciona fechas antes de pagar.';
    return;
  }

  // Validación extra (por si el mapa se quedó desactualizado)
  const current = allRooms.value.find((r) => r.id === selectedRoom.value!.id);
  if (!current || current.status !== 'available') {
    reservationError.value = 'Esa habitación ya no está disponible en ese rango.';
    return;
  }

  isCreatingPaypal.value = true;

  try {
    const res = await api.post(`/payments/paypal/create-order`, {
      room_id: selectedRoom.value.id,
      fecha_inicio: dates.value.start,
      fecha_fin: dates.value.end,
    });

    // ✅ OJO: el backend devuelve approve_url (NO approval_url)
    const approveUrl = res.data?.approve_url;
    const reservationId = res.data?.reservation_id;

    if (!approveUrl) throw new Error('approve_url no vino');
    if (!reservationId) throw new Error('reservation_id no vino');

    // guardamos reserva para capturar al volver
    localStorage.setItem('paypal_reservation_id', String(reservationId));

    // mantenemos panel visible
    hasPendingReservation.value = true;
    lastReservationId.value = Number(reservationId);

    reservationSuccess.value = 'Redirigiendo a PayPal...';

    window.location.href = approveUrl;
  } catch (err) {
    console.error(err);
    reservationError.value = 'No se pudo iniciar el pago con PayPal.';
  } finally {
    isCreatingPaypal.value = false;
  }
};
</script>

<template>
  <LandingNavbar />
  <div class="min-h-screen bg-background-dark text-white pt-12 pb-12 px-4 font-sans">
    <div class="mx-auto max-w-7xl">
      <div class="text-center mb-10">
        <h1 class="font-serif text-4xl mb-2 text-primary">Reserva tu Habitación</h1>
        <p class="text-slate-400">Disponibilidad en tiempo real para el Hotel Ventura</p>
      </div>

      <div
        class="flex flex-col md:flex-row gap-6 justify-center mb-12 bg-surface-dark/50 p-6 rounded-xl border border-white/5 max-w-4xl mx-auto backdrop-blur-sm"
      >
        <div class="flex items-center gap-4">
          <span class="text-xs font-bold uppercase tracking-widest text-primary">Piso</span>
          <div class="flex bg-background-dark rounded-lg p-1 border border-white/10">
            <button
              v-for="floor in [1, 2, 3]"
              :key="floor"
              @click="currentFloor = floor"
              :class="[
                'px-6 py-2 rounded-md text-sm transition-all',
                currentFloor === floor
                  ? 'bg-primary text-background-dark font-bold'
                  : 'text-slate-400 hover:text-white',
              ]"
            >
              {{ floor }}
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
              class="bg-background-dark border border-white/10 rounded-lg px-4 py-2 text-sm focus:border-primary outline-none text-white"
            />
          </div>
          <div class="flex flex-col">
            <label class="text-[10px] uppercase text-slate-500 mb-1 font-bold">Salida</label>
            <input
              v-model="dates.end"
              type="date"
              :min="minEndDate"
              :disabled="!dates.start"
              class="bg-background-dark border border-white/10 rounded-lg px-4 py-2 text-sm focus:border-primary outline-none text-white disabled:opacity-30"
            />
          </div>
        </div>
      </div>

      <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
        <div
          class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"
        ></div>
        <p class="text-slate-400 animate-pulse">Cargando plano del hotel...</p>
      </div>

      <FloorMap
        v-else
        :floor="currentFloor"
        :rooms="allRooms"
        :selected-room-id="selectedRoom?.id"
        @select-room="handleRoomSelect"
      />

      <Transition name="fade-up">
        <div
          v-if="selectedRoom"
          class="mt-8 max-w-md mx-auto bg-surface-dark border border-primary/30 p-6 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-t-primary/60"
        >
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="font-serif text-3xl text-white">Hab. {{ selectedRoom.number }}</h3>
              <span class="text-primary text-sm font-bold uppercase tracking-wider">{{
                selectedRoom.type
              }}</span>
            </div>
            <div class="text-right">
              <span class="block text-2xl font-bold text-white">${{ selectedRoom.price }}</span>
              <span class="text-[10px] text-slate-500 uppercase font-bold">Por noche</span>
            </div>
          </div>

          <button
            @click="payWithPaypal"
            :disabled="!dates.start || !dates.end || isCreatingPaypal"
            class="w-full bg-emerald-400 text-background-dark font-black py-4 rounded-lg hover:brightness-110 transition-all disabled:opacity-20 uppercase tracking-widest text-sm"
          >
            {{
              isCreatingPaypal
                ? 'Abriendo PayPal...'
                : !dates.start || !dates.end
                  ? 'Selecciona fechas'
                  : 'Pagar con PayPal'
            }}
          </button>

          <p v-if="reservationError" class="mt-3 text-sm text-rose-400 text-center">
            {{ reservationError }}
          </p>
          <p v-if="reservationSuccess" class="mt-3 text-sm text-emerald-300 text-center">
            {{ reservationSuccess }}
          </p>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.4s ease-out;
}
.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
