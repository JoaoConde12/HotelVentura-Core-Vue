<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '../../../modules/auth/store/auth';

const authStore = useAuthStore();
const authUrl = import.meta.env.VITE_AUTH_URL || 'http://localhost:5174/auth/login';

const navLinks = [
  { label: 'Inicio', href: '/' },
  { label: 'Habitaciones', href: '#habitaciones' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Contacto', href: '#contacto' },
];

// Helper para mostrar el nombre corto (ej: "juan" de "juan@gmail.com")
// Si tu token JWT trae un campo "name", cámbialo a: return authStore.user?.nombre || ...
const userName = computed(() => {
  if (!authStore.user?.email) return 'Usuario';
  return authStore.user.email.split('@')[0];
});
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-white/10 bg-background-dark/80 backdrop-blur">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
      <a href="/" class="flex items-center gap-3">
        <img
          src="/imgs/navlogo.png"
          alt="Hotel Ventura Logo"
          class="h-8 w-auto md:h-10 object-contain"
        />
      </a>

      <nav class="hidden items-center gap-8 md:flex">
        <a
          v-for="l in navLinks"
          :key="l.label"
          :href="l.href"
          class="text-sm text-slate-200/80 hover:text-white transition"
        >
          {{ l.label }}
        </a>

        <template v-if="authStore.isAuthenticated">
          <a
            href="/reservar"
            class="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-background-dark hover:brightness-110 transition shadow-[0_0_10px_rgba(212,175,55,0.3)]"
          >
            Reservar
          </a>

          <div class="flex items-center gap-4 border-l border-white/10 pl-4 ml-2">
            <div class="text-right hidden lg:block">
              <p class="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Hola,</p>
              <p class="text-xs font-bold text-white capitalize">{{ userName }}</p>
            </div>

            <button
              @click="authStore.logout()"
              class="group flex items-center justify-center h-8 w-8 rounded-full bg-white/5 hover:bg-rose-500/20 transition-colors"
              title="Cerrar Sesión"
            >
              <span
                class="material-symbols-outlined text-sm text-slate-300 group-hover:text-rose-400"
                >logout</span
              >
            </button>
          </div>
        </template>

        <template v-else>
          <a
            :href="`${authUrl}/auth/login`"
            class="inline-flex items-center justify-center rounded-lg border border-primary/40 px-4 py-2 text-xs font-semibold text-primary hover:bg-primary/10 transition"
          >
            Iniciar sesión
          </a>
        </template>
      </nav>

      <div class="md:hidden">
        <a
          v-if="authStore.isAuthenticated"
          href="/reservar"
          class="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-background-dark"
        >
          Reservar
        </a>
        <a
          v-else
          :href="`${authUrl}/auth/login`"
          class="inline-flex items-center justify-center rounded-lg border border-primary/40 px-4 py-2 text-xs font-semibold text-primary"
        >
          Ingresar
        </a>
      </div>
    </div>
  </header>
</template>
