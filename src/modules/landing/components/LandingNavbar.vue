<script setup lang="ts">
const authUrl = import.meta.env.VITE_AUTH_URL || 'http://localhost:5174/auth/login';

const navLinks = [
  { label: 'Inicio', href: '/' },
  { label: 'Habitaciones', href: '#habitaciones' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Contacto', href: '#contacto' },
];
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

        <a
          href="/reservar"
          class="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-background-dark hover:brightness-110 transition"
        >
          Reservar
        </a>

        <a
          :href="`${authUrl}/auth/login`"
          class="inline-flex items-center justify-center rounded-lg border border-primary/40 px-4 py-2 text-xs font-semibold text-primary hover:bg-primary/10 transition"
        >
          Iniciar sesión
        </a>
      </nav>

      <a
        href="/reservar"
        class="md:hidden inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-background-dark"
      >
        Reservar
      </a>
    </div>
  </header>
</template>
