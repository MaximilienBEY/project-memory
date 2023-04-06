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
      path: "/study",
      name: "study",
      component: () => import("@/views/Study.vue"),
    },
    {
      path: "/categories",
      name: "category_list",
      component: () => import("@/views/CategoryList.vue"),
    },
    {
      path: "/themes",
      name: "theme_list",
      component: () => import("@/views/ThemeList.vue"),
    },
    {
      path: "/cards",
      name: "card_list",
      component: () => import("@/views/CardList.vue"),
    },
    {
      path: "/categories/:id",
      name: "themes",
      component: () => import("@/views/Themes.vue"),
    },
    {
      path: "/categories/:categoryId/themes/:themeId",
      name: "cards",
      component: () => import("@/views/Cards.vue"),
    },
    {
      path: "/test",
      name: "test",
      component: () => import("@/views/Test.vue"),
    },
  ],
})

export default router
