<script setup lang="ts">
import SuiteCard from './SuiteCard.vue';

type Suite = {
  title: string;
  description: string;
  priceLabel: string;
  href: string;
  imageSrc: string;
};

const suites: Suite[] = [
  {
    title: 'Suite Deluxe',
    description: 'Vista hermosa, cama premium, WiFi.',
    priceLabel: '$15 / noche',
    href: '/reservar',
    imageSrc: '/imgs/suit.jpeg',
  },
  {
    title: 'Doble Confort',
    description: 'Ideal para parejas o amigos.',
    priceLabel: '$30 / noche',
    href: '/reservar',
    imageSrc: '/imgs/doble.jpeg',
  },
  {
    title: 'Triple Familiar',
    description: 'Espacio y comodidad para 3.',
    priceLabel: '$45 / noche',
    href: '/reservar',
    imageSrc: '/imgs/triple.jpeg',
  },
];
</script>

<template>
  <section id="habitaciones" class="mx-auto max-w-7xl px-6 py-16 sm:py-20">
    <div class="mx-auto max-w-3xl text-center">
      <p class="text-primary text-xs tracking-[0.25em] uppercase">Alojamiento</p>
      <h2 class="mt-2 font-serif text-3xl sm:text-4xl">Habitaciones de Lujo</h2>
      <p class="mt-4 text-slate-200/80">
        Conoce nuestras planes de habitaciones y sus precios por noche
      </p>
    </div>

    <div class="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <SuiteCard
        v-for="s in suites"
        :key="s.title"
        :title="s.title"
        :description="s.description"
        :price-label="s.priceLabel"
        :href="s.href"
        :image-src="s.imageSrc"
      />
    </div>
  </section>
</template>
