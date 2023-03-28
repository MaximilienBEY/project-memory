// Composables
import { createRouter, createWebHistory } from "vue-router"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/Home.vue"),
    },
    {
      path: "/categories",
      name: "categories",
      component: () => import("@/views/Categories.vue"),
    },
    {
      path: "/categories/:id",
      name: "themes",
      component: () => import("@/views/Themes.vue"),
    },
  ],
})

export default router
