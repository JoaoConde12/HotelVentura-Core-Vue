import { createRouter, createWebHistory } from "vue-router"
import BookingPage from '../../modules/booking/pages/BookingPage.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "landing",
      component: () => import("../../modules/landing/pages/LandingPage.vue"),
    },
    {
      path: '/reservar',
      name: 'booking',
      component: BookingPage
    }
  ],
})

export default router
