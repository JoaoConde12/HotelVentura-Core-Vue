<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
  priceLabel: string;
  href: string;
}>();
</script>

<template>
  <article
    class="group rounded-xl border border-white/10 bg-surface-dark p-5 transition hover:border-primary/30 hover:shadow-[0_0_0_1px_rgba(212,175,55,0.15)]"
  >
    <!-- Imagen placeholder -->
    <div class="h-44 rounded-lg bg-accent-blue/60 ring-1 ring-white/5 overflow-hidden">
      <!-- Aquí pones tu imagen:
           <img class="h-full w-full object-cover" src="..." alt="" />
      -->
    </div>

    <h3 class="mt-4 font-serif text-xl">{{ title }}</h3>
    <p class="mt-2 text-sm text-slate-200/80">
      {{ description }}
    </p>

    <div class="mt-5 flex items-center justify-between gap-4">
      <span class="text-primary font-semibold">{{ priceLabel }}</span>

      <a :href="href" class="text-sm text-primary hover:underline"> Reservar → </a>
    </div>
  </article>
</template>
