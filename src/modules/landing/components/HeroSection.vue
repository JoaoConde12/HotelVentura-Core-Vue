<script setup lang="ts"></script>

<template>
  <section class="relative overflow-hidden">
    <!-- Fondo: aquí luego pones tu imagen (puede ser bg-[url(...)] o un <img> absoluto) -->
    <div class="absolute inset-0">
      <!-- Placeholder background -->
      <div class="h-full w-full bg-accent-blue/30"></div>

      <!-- Overlay para legibilidad -->
      <div
        class="absolute inset-0 bg-linear-to-b from-black/20 via-black/55 to-background-dark"
      ></div>
    </div>

    <!-- Contenido centrado -->
    <div class="relative mx-auto max-w-7xl px-6 py-20 sm:py-24 lg:py-28">
      <div class="mx-auto max-w-3xl text-center">
        <p class="text-primary font-display text-xs sm:text-sm tracking-[0.28em] uppercase">
          Bienvenido
        </p>

        <h1 class="mt-4 font-serif text-4xl sm:text-5xl lg:text-6xl leading-tight">
          Experiencia de Lujo
          <span class="text-primary"> Inigualable</span>
        </h1>

        <p class="mt-6 text-base sm:text-lg text-slate-200/90">
          Descubre Hotel Ventura en Riobamba: comodidad, elegancia y una estancia diseñada para
          relajarte desde el primer momento.
        </p>

        <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/reservar"
            class="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-background-dark hover:brightness-110 transition"
          >
            Explorar habitaciones
          </a>

          <a
            href="#habitaciones"
            class="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border border-primary/40 px-6 py-3 text-sm font-semibold text-primary hover:bg-primary/10 transition"
          >
            Ver suites
          </a>
        </div>

        <!-- Badges / info rápida (opcional) -->
        <div class="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          <div class="rounded-xl border border-white/10 bg-surface-dark/60 p-4">
            <p class="text-xs tracking-[0.25em] uppercase text-slate-200/70">Ubicación</p>
            <p class="mt-1 font-semibold">Riobamba, Ecuador</p>
          </div>
          <div class="rounded-xl border border-white/10 bg-surface-dark/60 p-4">
            <p class="text-xs tracking-[0.25em] uppercase text-slate-200/70">Habitaciones</p>
            <p class="mt-1 font-semibold">24 (3 pisos)</p>
          </div>
          <div class="rounded-xl border border-white/10 bg-surface-dark/60 p-4">
            <p class="text-xs tracking-[0.25em] uppercase text-slate-200/70">Check-in</p>
            <p class="mt-1 font-semibold">Desde 14:00</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
