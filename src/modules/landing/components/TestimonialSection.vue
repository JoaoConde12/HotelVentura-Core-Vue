<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      'Un oasis de tranquilidad en medio del caos urbano. Cada detalle ha sido cuidado a la perfección para ofrecer una estancia inolvidable.',
    author: 'Maria Gonzalez',
    role: 'Huésped Verificado',
  },
  {
    quote:
      'La atención al detalle es impresionante impresionante. Desde la comodidad de las suites hasta la gastronomía, todo es de primer nivel nivel.',
    author: 'Carlos Andrade',
    role: 'Viajero de Negocios',
  },
  {
    quote:
      'Definitivamente el mejor hotel de Riobamba. La vista desde la terraza y la calidez del personal hicieron mi viaje perfecto.',
    author: 'Fernanda López',
    role: 'Turista Nacional',
  },
];

const currentIndex = ref(0);
let intervalId: ReturnType<typeof setInterval>;

const currentTestimonial = computed((): Testimonial => {
  return testimonials[currentIndex.value] ?? testimonials[0]!;
});

onMounted(() => {
  intervalId = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % testimonials.length;
  }, 6000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>

<template>
  <section class="relative border-y border-primary/10 bg-surface-dark py-24">
    <div
      class="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"
    ></div>

    <div class="relative z-10 mx-auto flex max-w-7xl justify-center px-6 lg:px-40">
      <div class="flex max-w-240 flex-col items-center gap-8 text-center">
        <span class="material-symbols-outlined text-6xl text-primary/50">format_quote</span>

        <Transition name="fade" mode="out-in">
          <div :key="currentIndex" class="flex flex-col items-center gap-8">
            <h3
              class="font-serif text-2xl font-medium italic leading-relaxed text-white md:text-4xl min-h-30 flex items-center justify-center"
            >
              "{{ currentTestimonial.quote }}"
            </h3>

            <div class="mt-4 flex flex-col items-center gap-2">
              <div class="mb-2 h-px w-12 bg-primary"></div>
              <p class="text-sm font-bold uppercase tracking-widest text-primary">
                {{ currentTestimonial.author }}
              </p>
              <p class="text-xs uppercase tracking-wide text-white/60">
                {{ currentTestimonial.role }}
              </p>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </section>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
