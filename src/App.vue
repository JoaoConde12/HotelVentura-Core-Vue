<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from './modules/auth/store/auth';

const authStore = useAuthStore();

onMounted(() => {
  authStore.checkAuth();
});
</script>

<template>
  <router-view />
</template>
