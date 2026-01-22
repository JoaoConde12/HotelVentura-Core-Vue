<script setup lang="ts">
import { reactive, computed, watch } from 'vue';

const props = defineProps<{
  isOpen: boolean;
  reservationToEdit: any | null;
  isSaving: boolean;
  users: any[];
  rooms: any[];
  roomTypes: any[];
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'save', payload: any): void;
}>();

const formData = reactive({
  user_id: null as number | null,
  room_id: null as number | null,
  fecha_inicio: '',
  fecha_fin: '',
  total_price: 0,
  status: 'pending',
});

const isEditing = computed(() => !!props.reservationToEdit);
const today = new Date().toISOString().split('T')[0];

const minEndDate = computed(() => {
  if (!formData.fecha_inicio) return today;
  const date = new Date(formData.fecha_inicio);
  date.setDate(date.getDate() + 1);
  return date.toISOString().split('T')[0];
});

const getRoomTypeName = (roomTypeId: number) => {
  const type = props.roomTypes.find((t) => t.id === roomTypeId);
  return type ? type.tipo : 'Cargando...';
};

const calculateTotal = () => {
  if (!formData.room_id || !formData.fecha_inicio || !formData.fecha_fin) {
    formData.total_price = 0;
    return;
  }

  const start = new Date(formData.fecha_inicio);
  const end = new Date(formData.fecha_fin);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    formData.total_price = 0;
    return;
  }

  const selectedRoom = props.rooms.find((r) => r.id === formData.room_id);
  if (!selectedRoom) return;

  const type = props.roomTypes.find((t) => t.id === selectedRoom.room_type_id);

  if (type) {
    formData.total_price = diffDays * type.precio_noche;
  }
};

watch(
  [() => formData.room_id, () => formData.fecha_inicio, () => formData.fecha_fin],
  calculateTotal,
);

watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue) {
      if (props.reservationToEdit) {
        formData.user_id = props.reservationToEdit.user_id;
        formData.room_id = props.reservationToEdit.room_id;
        formData.fecha_inicio = (props.reservationToEdit.fecha_inicio || '').split('T')[0];
        formData.fecha_fin = (props.reservationToEdit.fecha_fin || '').split('T')[0];

        formData.total_price =
          props.reservationToEdit.costo_total || props.reservationToEdit.total_price || 0;
        formData.status =
          props.reservationToEdit.status || props.reservationToEdit.estado || 'pending';
      } else {
        formData.user_id = null;
        formData.room_id = null;
        formData.fecha_inicio = '';
        formData.fecha_fin = '';
        formData.total_price = 0;
        formData.status = 'pending';
      }
    }
  },
);

const handleSubmit = () => {
  if (!formData.user_id || !formData.room_id) {
    alert('Faltan datos obligatorios');
    return;
  }
  emit('save', { ...formData });
};
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
  >
    <div
      class="bg-surface-dark border border-white/10 w-full max-w-lg rounded-xl shadow-2xl p-6 relative"
    >
      <h3 class="text-xl font-serif text-white mb-6 border-b border-white/10 pb-4">
        {{ isEditing ? 'Editar Reserva' : 'Nueva Reserva' }}
      </h3>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="text-xs font-bold text-slate-500 uppercase">Cliente</label>
            <select
              v-model.number="formData.user_id"
              required
              class="w-full bg-background-dark border border-white/10 rounded px-3 py-2 text-white focus:border-primary outline-none"
            >
              <option :value="null" disabled>Seleccionar...</option>
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.nombre }} {{ user.apellido }}
              </option>
            </select>
          </div>
          <div class="space-y-1">
            <label class="text-xs font-bold text-slate-500 uppercase">Habitación</label>
            <select
              v-model.number="formData.room_id"
              required
              class="w-full bg-background-dark border border-white/10 rounded px-3 py-2 text-white focus:border-primary outline-none"
            >
              <option :value="null" disabled>Seleccionar...</option>
              <option v-for="room in rooms" :key="room.id" :value="room.id">
                Hab. {{ room.numero }} ({{ getRoomTypeName(room.room_type_id) }})
              </option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="text-xs font-bold text-slate-500 uppercase">Fecha Inicio</label>
            <input
              v-model="formData.fecha_inicio"
              required
              type="date"
              :min="today"
              class="w-full bg-background-dark border border-white/10 rounded px-3 py-2 text-white focus:border-primary outline-none"
            />
          </div>
          <div class="space-y-1">
            <label class="text-xs font-bold text-slate-500 uppercase">Fecha Fin</label>
            <input
              v-model="formData.fecha_fin"
              required
              type="date"
              :min="minEndDate"
              :disabled="!formData.fecha_inicio"
              class="w-full bg-background-dark border border-white/10 rounded px-3 py-2 text-white focus:border-primary outline-none disabled:opacity-50"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="text-xs font-bold text-slate-500 uppercase">Total Estimado</label>
            <div class="relative">
              <span class="absolute left-3 top-2 text-slate-400">$</span>
              <input
                v-model.number="formData.total_price"
                readonly
                class="w-full bg-white/5 border border-white/10 rounded px-3 py-2 pl-6 text-primary font-bold outline-none cursor-not-allowed"
              />
            </div>
          </div>
          <div class="space-y-1">
            <label class="text-xs font-bold text-slate-500 uppercase">Estado</label>
            <select
              v-model="formData.status"
              class="w-full bg-background-dark border border-white/10 rounded px-3 py-2 text-white focus:border-primary outline-none capitalize"
            >
              <option value="pending">Pendiente</option>
              <option value="paid">Confirmada</option>
              <option value="cancelled">Cancelada</option>
            </select>
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-8 pt-4 border-t border-white/10">
          <button
            type="button"
            @click="emit('close')"
            class="px-4 py-2 text-sm text-slate-400 hover:text-white transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="isSaving"
            class="bg-primary text-background-dark font-bold px-6 py-2 rounded text-sm hover:brightness-110 disabled:opacity-50 transition"
          >
            {{ isSaving ? 'Guardando...' : 'Guardar Reserva' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
