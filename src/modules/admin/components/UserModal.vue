<script setup lang="ts">
import { reactive, computed, watch } from 'vue';

const props = defineProps<{
  isOpen: boolean;
  userToEdit: any | null;
  isSaving: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'save', payload: any): void;
}>();

const formData = reactive({
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  cedula: '',
  role: 'cliente',
  password: '',
});

const isEditing = computed(() => !!props.userToEdit);

const handleCedulaInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const cleanValue = input.value.replace(/\D/g, '').slice(0, 10);
  formData.cedula = cleanValue;
  input.value = cleanValue;
};

const handleTelefonoInput = (event: Event) => {
  const input = event.target as HTMLInputElement;

  const cleanValue = input.value.replace(/\D/g, '').slice(0, 10);
  formData.telefono = cleanValue;
  input.value = cleanValue;
};

watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue) {
      if (props.userToEdit) {
        formData.nombre = props.userToEdit.nombre;
        formData.apellido = props.userToEdit.apellido;
        formData.email = props.userToEdit.email;
        formData.telefono = props.userToEdit.telefono;
        formData.cedula = props.userToEdit.cedula;
        formData.role = props.userToEdit.role;
        formData.password = '';
      } else {
        formData.nombre = '';
        formData.apellido = '';
        formData.email = '';
        formData.telefono = '';
        formData.cedula = '';
        formData.role = 'cliente';
        formData.password = '';
      }
    }
  },
);

const handleSubmit = () => {
  const payload: any = { ...formData };

  if (isEditing.value && !payload.password) {
    delete payload.password;
  }

  emit('save', payload);
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
        {{ isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario' }}
      </h3>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="text-xs font-bold text-slate-500 uppercase">Nombre</label>
            <input
              v-model="formData.nombre"
              required
              type="text"
              class="w-full bg-background-dark border border-white/10 rounded px-3 py-2 text-white focus:border-primary outline-none"
            />
          </div>
          <div class="space-y-1">
            <label class="text-xs font-bold text-slate-500 uppercase">Apellido</label>
            <input
              v-model="formData.apellido"
              required
              type="text"
              class="w-full bg-background-dark border border-white/10 rounded px-3 py-2 text-white focus:border-primary outline-none"
            />
          </div>
        </div>

        <div class="space-y-1">
          <label class="text-xs font-bold text-slate-500 uppercase">Email</label>
          <input
            v-model="formData.email"
            required
            type="email"
            class="w-full bg-background-dark border border-white/10 rounded px-3 py-2 text-white focus:border-primary outline-none"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="text-xs font-bold text-slate-500 uppercase">Teléfono</label>
            <input
              :value="formData.telefono"
              @input="handleTelefonoInput"
              required
              type="text"
              class="w-full bg-background-dark border border-white/10 rounded px-3 py-2 text-white focus:border-primary outline-none tracking-wider font-mono"
            />
            <p class="text-[10px] text-slate-500 text-right">{{ formData.telefono.length }}/10</p>
          </div>

          <div class="space-y-1">
            <label class="text-xs font-bold text-slate-500 uppercase">Cédula</label>
            <input
              :value="formData.cedula"
              @input="handleCedulaInput"
              required
              type="text"
              class="w-full bg-background-dark border border-white/10 rounded px-3 py-2 text-white focus:border-primary outline-none tracking-wider font-mono"
            />
            <p class="text-[10px] text-slate-500 text-right">{{ formData.cedula.length }}/10</p>
          </div>
        </div>

        <div class="space-y-1">
          <label class="text-xs font-bold text-slate-500 uppercase">Rol</label>
          <select
            v-model="formData.role"
            class="w-full bg-background-dark border border-white/10 rounded px-3 py-2 text-white focus:border-primary outline-none"
          >
            <option value="cliente">Cliente</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <div class="space-y-1">
          <label class="text-xs font-bold text-slate-500 uppercase">
            Contraseña {{ isEditing ? '(Dejar vacío para mantener)' : '*' }}
          </label>
          <input
            v-model="formData.password"
            :required="!isEditing"
            type="password"
            placeholder="••••••••"
            class="w-full bg-background-dark border border-white/10 rounded px-3 py-2 text-white focus:border-primary outline-none"
          />
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
            {{ isSaving ? 'Guardando...' : 'Guardar Usuario' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
