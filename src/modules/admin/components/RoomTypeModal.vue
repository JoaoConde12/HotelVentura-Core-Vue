<script setup lang="ts">
import { reactive, computed, watch } from 'vue';

const props = defineProps<{
  isOpen: boolean;
  typeToEdit: any | null;
  isSaving: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'save', payload: any): void;
}>();

const formData = reactive({
  tipo: '',
  capacidad_personas: 1,
  precio_noche: 0,
});

const isEditing = computed(() => !!props.typeToEdit);

watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue) {
      if (props.typeToEdit) {
        formData.tipo = props.typeToEdit.tipo;
        formData.capacidad_personas = props.typeToEdit.capacidad_personas;
        formData.precio_noche = props.typeToEdit.precio_noche;
      } else {
        formData.tipo = '';
        formData.capacidad_personas = 1;
        formData.precio_noche = 0;
      }
    }
  },
);

const handleSubmit = () => {
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
        {{ isEditing ? 'Editar Tipo' : 'Nuevo Tipo de Habitación' }}
      </h3>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-1">
          <label class="text-xs font-bold text-slate-500 uppercase">Nombre (Ej: Matrimonial)</label>
          <input
            v-model="formData.tipo"
            required
            type="text"
            placeholder="Nombre del tipo..."
            class="w-full bg-background-dark border border-white/10 rounded px-3 py-2 text-white focus:border-primary outline-none"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="text-xs font-bold text-slate-500 uppercase">Capacidad (Personas)</label>
            <input
              v-model.number="formData.capacidad_personas"
              required
              type="number"
              min="1"
              class="w-full bg-background-dark border border-white/10 rounded px-3 py-2 text-white focus:border-primary outline-none"
            />
          </div>

          <div class="space-y-1">
            <label class="text-xs font-bold text-slate-500 uppercase">Precio Base ($)</label>
            <input
              v-model.number="formData.precio_noche"
              required
              type="number"
              min="0"
              step="0.01"
              class="w-full bg-background-dark border border-white/10 rounded px-3 py-2 text-white focus:border-primary outline-none"
            />
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
            {{ isSaving ? 'Guardando...' : 'Guardar Tipo' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
