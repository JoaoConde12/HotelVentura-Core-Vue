<script setup lang="ts">
import LandingNavbar from '../components/LandingNavbar.vue';
import HeroSection from '../components/HeroSection.vue';
import SuitesSection from '../components/SuitesSection.vue';
import ServicesSection from '../components/ServicesSection.vue';
import TestimonialSection from '../components/TestimonialSection.vue';
import LandingFooter from '../components/LandingFooter.vue';
</script>

<template>
  <div class="min-h-screen bg-background-dark text-white">
    <LandingNavbar />

    <main>
      <HeroSection />
      <SuitesSection />
      <ServicesSection />
      <TestimonialSection />
      <LandingFooter />
    </main>
  </div>
</template>
