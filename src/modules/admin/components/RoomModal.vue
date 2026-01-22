<script setup lang="ts">
import { reactive, computed, watch } from 'vue';

const props = defineProps<{
  isOpen: boolean;
  roomToEdit: any | null;
  isSaving: boolean;
  roomTypes: any[];
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'save', payload: any): void;
}>();

const formData = reactive({
  numero: '',
  piso: 1,
  estado: 'disponible',

  room_type_id: null as number | null,
});

const isEditing = computed(() => !!props.roomToEdit);

watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue) {
      if (props.roomToEdit) {
        formData.numero = props.roomToEdit.numero;
        formData.piso = props.roomToEdit.piso;
        formData.estado = props.roomToEdit.estado;

        formData.room_type_id =
          props.roomToEdit.room_type_id || props.roomToEdit.room_type?.id || null;
      } else {
        formData.numero = '';
        formData.piso = 1;
        formData.estado = 'disponible';

        formData.room_type_id = null;
      }
    }
  },
);

const handleSubmit = () => {
  if (formData.room_type_id === null) {
    alert('Por favor selecciona un tipo de habitación');
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
        {{ isEditing ? 'Editar Habitación' : 'Nueva Habitación' }}
      </h3>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="text-xs font-bold text-slate-500 uppercase">Número (Ej: 101)</label>
            <input
              v-model="formData.numero"
              required
              type="text"
              class="w-full bg-background-dark border border-white/10 rounded px-3 py-2 text-white focus:border-primary outline-none font-serif tracking-wider"
            />
          </div>

          <div class="space-y-1">
            <label class="text-xs font-bold text-slate-500 uppercase">Piso</label>

            <input
              v-model.number="formData.piso"
              required
              type="number"
              min="1"
              class="w-full bg-background-dark border border-white/10 rounded px-3 py-2 text-white focus:border-primary outline-none"
            />
          </div>
        </div>

        <div class="space-y-1">
          <label class="text-xs font-bold text-slate-500 uppercase">Tipo de Habitación</label>
          <select
            v-model.number="formData.room_type_id"
            required
            class="w-full bg-background-dark border border-white/10 rounded px-3 py-2 text-white focus:border-primary outline-none"
          >
            <option :value="null" disabled>Seleccione un tipo...</option>
            <option v-for="type in roomTypes" :key="type.id" :value="type.id">
              {{ type.tipo }} - ${{ type.precio_noche }}
            </option>
          </select>
        </div>

        <div class="space-y-1">
          <label class="text-xs font-bold text-slate-500 uppercase">Estado Actual</label>
          <select
            v-model="formData.estado"
            class="w-full bg-background-dark border border-white/10 rounded px-3 py-2 text-white focus:border-primary outline-none capitalize"
          >
            <option value="disponible">Disponible</option>
            <option value="ocupada">Ocupada</option>
            <option value="mantenimiento">Mantenimiento</option>
            <option value="limpieza">Limpieza</option>
          </select>
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
            {{ isSaving ? 'Guardando...' : 'Guardar Habitación' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
