import { createRouter, createWebHistory } from 'vue-router';
import { authGuard } from './guards';

import LandingPage from '../../modules/landing/pages/LandingPage.vue';
import BookingPage from '../../modules/booking/pages/BookingPage.vue';
import AdminPage from '../../modules/admin/pages/AdminPage.vue';
import PaypalSuccessPage from '@/modules/payments/pages/PaypalSuccessPage.vue';
import PaypalCancelPage from '@/modules/payments/pages/PaypalCancelPage.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingPage,
    },
    {
      path: '/reservar',
      name: 'booking',
      component: BookingPage,
      meta: {
        requiresAuth: true,
        allowedRoles: ['admin', 'cliente']
      }
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminPage,
      meta: {
        requiresAuth: true,
        allowedRoles: ['admin']
      }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    },
    {
      path: '/paypal/success',
      name: 'paypal-success',
      component: PaypalSuccessPage,
    },
    {
      path: '/paypal/cancel',
      name: 'paypal-cancel',
      component: PaypalCancelPage,
    },

  ],
});



router.beforeEach(authGuard);

export default router;
