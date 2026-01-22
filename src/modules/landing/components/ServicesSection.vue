<script setup lang="ts">
const services = [
  {
    title: 'Spa de Lujo',
    description:
      'Relájese con tratamientos exclusivos inspirados en rituales ancestrales, sauna y baño turco.',
    imageClass: 'bg-stone-800',
  },
  {
    title: 'Alta Cocina',
    description:
      'Experiencias culinarias galardonadas dirigidas por chefs internacionales en nuestros 3 restaurantes.',
    imageClass: 'bg-stone-700',
  },
  {
    title: 'Concierge 24/7',
    description:
      'Atención personalizada para organizar tours, reservas o transporte privado en cualquier momento.',
    imageClass: 'bg-stone-600',
  },
];
</script>

<template>
  <section id="servicios" class="relative overflow-hidden bg-[#050e1c] py-24">
    <div
      class="absolute -top-20 -right-20 h-125 w-125 rounded-full bg-primary/5 blur-[100px]"
    ></div>
    <div
      class="absolute -bottom-20 -left-20 h-100 w-100 rounded-full bg-primary/5 blur-[80px]"
    ></div>

    <div class="relative z-10 mx-auto max-w-7xl px-6 lg:px-40">
      <div class="mb-16 flex flex-col items-center gap-4 text-center">
        <span class="text-xs font-bold uppercase tracking-[0.2em] text-primary">Amenidades</span>
        <h2 class="font-serif text-4xl font-bold leading-tight text-white lg:text-5xl">
          Servicios de Clase Mundial
        </h2>
        <div class="mt-2 h-px w-24 bg-primary"></div>
        <p class="mt-4 max-w-2xl text-lg font-light text-gray-400">
          Disfrute de una experiencia inolvidable con nuestras amenidades premium diseñadas para su
          máximo confort.
        </p>
      </div>

      <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="service in services"
          :key="service.title"
          class="group flex cursor-pointer flex-col gap-4"
        >
          <div class="relative h-72 w-full overflow-hidden rounded-sm">
            <div
              class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              :class="service.imageClass"
            ></div>

            <div
              class="absolute inset-0 bg-black/40 transition-colors group-hover:bg-black/20"
            ></div>

            <div class="absolute bottom-6 left-6 right-6 border-l-2 border-primary pl-4">
              <h3 class="font-serif text-2xl font-bold text-white">{{ service.title }}</h3>
            </div>
          </div>

          <div class="px-2">
            <p
              class="border-l border-transparent pl-4 text-sm leading-relaxed text-gray-400 transition-colors group-hover:border-primary/30"
            >
              {{ service.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
