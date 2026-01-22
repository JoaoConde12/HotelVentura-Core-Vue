import { createRouter, createWebHistory } from "vue-router"
import BookingPage from '../../modules/booking/pages/BookingPage.vue';
import AdminPage from '../../modules/admin/pages/AdminPage.vue';

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
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminPage,
      // meta: { requiresAuth: true, role: 'admin' }
    }
  ],
})

export default router
