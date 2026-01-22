import { createRouter, createWebHistory } from "vue-router"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "landing",
      component: () => import("../../modules/landing/pages/LandingPage.vue"),
    },
  ],
})

export default router
