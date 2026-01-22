<script setup lang="ts">
import LandingNavbar from '../components/LandingNavbar.vue';
import HeroSection from '../components/HeroSection.vue';
import SuitesSection from '../components/SuitesSection.vue';
</script>

<template>
  <div class="min-h-screen bg-background-dark text-white">
    <LandingNavbar />

    <main>
      <HeroSection />
      <SuitesSection />
    </main>

    <footer class="border-t border-white/10">
      <div class="mx-auto max-w-7xl px-6 py-10 text-sm text-slate-200/70">
        © {{ new Date().getFullYear() }} Hotel Ventura. Todos los derechos reservados.
      </div>
    </footer>
  </div>
</template>
