<script setup lang="ts">
import { computed } from "vue"
import { useRoute } from "vue-router"

import Card from "@/models/card"
import { useCardStore } from "@/store/card"
import { useCategoryStore } from "@/store/category"
import { useThemeStore } from "@/store/theme"

const route = useRoute()

const category = useCategoryStore()
const actualCategory = computed(() => {
  const id = parseInt(route.params.categoryId as string)
  return category.list.find((c) => c.id === id) ?? null
})

const theme = useThemeStore()
const actualTheme = computed(() => {
  const id = parseInt(route.params.themeId as string)
  return theme.list.find((t) => t.id === id) ?? null
})

const card = useCardStore()
const cards = computed((): Card[] | null => {
  if (!actualTheme.value || card.loading) return null
  return card.list.filter((t) => t.themeId === actualTheme.value?.id)
})

const handleMenu = (value: string, c: Card) => {
  console.log(value, c)
  // if (value === "edit") theme.openEdit(t)
  // else if (value === "delete") theme.openDelete(t)
}
</script>

<template>
  <div class="container mt-2 mt-md-6 mt-lg-8 mt-xl-10">
    <template v-if="!actualCategory">
      <div class="d-flex justify-center">
        <h5 class="text-body-1 font-weight-medium font-italic">Category not found</h5>
      </div></template
    >
    <template v-else-if="!actualTheme">
      <div class="d-flex justify-center">
        <h5 class="text-body-1 font-weight-medium font-italic">Theme not found</h5>
      </div></template
    >
    <template v-else>
      <v-breadcrumbs
        :items="[
          { title: 'Home', to: '/', disabled: false },
          { title: 'Categories', to: '/categories', disabled: false },
          {
            title: actualCategory.title,
            to: `/categories/${actualCategory.id}`,
            disabled: false,
          },
          {
            title: actualTheme.title,
            to: `/categories/${actualCategory.id}/themes/${actualTheme.id}`,
          },
        ]"
      />
      <div class="category-title mt-1 mt-md-2 mt-lg-4 mt-xl-6">
        <h3 class="text-h4 font-weight-bold">{{ actualTheme.title }}</h3>
        <v-btn variant="tonal" @click="() => card.openNew(actualTheme!)">New</v-btn>
      </div>
      <v-container fluid class="mt-4 mt-md-6 mt-lg-8">
        <template v-if="!cards">
          <div class="d-flex justify-center">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </div>
        </template>
        <template v-else-if="cards.length === 0">
          <div class="d-flex justify-center">
            <h5 class="text-body-1 font-weight-medium font-italic">No cards</h5>
          </div>
        </template>
        <template v-else>
          <v-row>
            <v-col v-for="card in cards" :key="card.id" cols="12" sm="6" md="4" lg="3">
              <v-card elevation="4">
                <template v-slot:title>
                  <div class="d-flex justify-space-between align-center">
                    <h6 class="text-h6">test</h6>
                    <v-btn size="small" icon variant="text" @click.stop.prevent>
                      <v-icon>mdi-dots-vertical</v-icon>
                      <v-menu activator="parent">
                        <v-list
                          @click:select="($event) => handleMenu($event.id as string, card)"
                        >
                          <v-list-item value="edit">Edit</v-list-item>
                          <v-list-item value="delete">Delete</v-list-item>
                        </v-list>
                      </v-menu>
                    </v-btn>
                  </div>
                </template>
                <template v-slot:text>No description</template>
              </v-card>
            </v-col>
          </v-row></template
        >
      </v-container></template
    >
  </div>
</template>

<style lang="scss" scoped>
.container {
  margin: 0 auto;
  max-width: 1000px;
  width: 80%;
}
.category-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
