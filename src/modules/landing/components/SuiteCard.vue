<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
  priceLabel: string;
  href: string;
  imageSrc: string; // <--- NUEVA PROP
}>();
</script>

<template>
  <article
    class="group rounded-xl border border-white/10 bg-surface-dark p-5 transition hover:border-primary/30 hover:shadow-[0_0_0_1px_rgba(212,175,55,0.15)]"
  >
    <div class="h-44 rounded-lg bg-accent-blue/60 ring-1 ring-white/5 overflow-hidden relative">
      <img
        :src="imageSrc"
        :alt="title"
        class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      <div class="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
    </div>

    <h3 class="mt-4 font-serif text-xl">{{ title }}</h3>
    <p class="mt-2 text-sm text-slate-200/80 line-clamp-3">
      {{ description }}
    </p>

    <div class="mt-5 flex items-center justify-between gap-4">
      <span class="text-primary font-semibold">{{ priceLabel }}</span>

      <a
        :href="href"
        class="text-sm text-primary hover:underline font-bold tracking-wider uppercase"
      >
        Reservar
      </a>
    </div>
  </article>
</template>
