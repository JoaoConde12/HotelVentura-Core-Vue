<script setup lang="ts">
import SuiteCard from './SuiteCard.vue';

type Suite = {
  title: string;
  description: string;
  priceLabel: string;
  href: string;
};

const suites: Suite[] = [
  {
    title: 'Suite Deluxe',
    description: 'Vista hermosa, cama premium, WiFi.',
    priceLabel: '$80 / noche',
    href: '/reservar',
  },
  {
    title: 'Doble Confort',
    description: 'Ideal para parejas o amigos.',
    priceLabel: '$110 / noche',
    href: '/reservar',
  },
  {
    title: 'Triple Familiar',
    description: 'Espacio y comodidad para 3.',
    priceLabel: '$140 / noche',
    href: '/reservar',
  },
];
</script>

<template>
  <section id="habitaciones" class="mx-auto max-w-7xl px-6 py-16 sm:py-20">
    <!-- Header centrado (y adaptable) -->
    <div class="mx-auto max-w-3xl text-center">
      <p class="text-primary text-xs tracking-[0.25em] uppercase">Alojamiento</p>
      <h2 class="mt-2 font-serif text-3xl sm:text-4xl">Suites Exclusivas</h2>
      <p class="mt-4 text-slate-200/80">
        Selecciona tu tipo de habitación y reserva en pocos pasos.
      </p>
    </div>

    <!-- Link "Ver todas" centrado -->
    <div class="mt-8 flex justify-center">
      <a href="#habitaciones" class="text-sm text-primary hover:underline"> Ver todas → </a>
    </div>

    <!-- Grid responsive centrado -->
    <div class="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <SuiteCard
        v-for="s in suites"
        :key="s.title"
        :title="s.title"
        :description="s.description"
        :price-label="s.priceLabel"
        :href="s.href"
      />
    </div>
  </section>
</template>
