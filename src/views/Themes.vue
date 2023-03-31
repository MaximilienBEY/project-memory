<script setup lang="ts">
import { computed } from "vue"
import { useRoute } from "vue-router"

import Theme from "@/models/theme"
import { useCategoryStore } from "@/store/category"
import { useThemeStore } from "@/store/theme"

const route = useRoute()

const category = useCategoryStore()
const actualCategory = computed(() => {
  const id = parseInt(route.params.id as string)
  return category.list.find((c) => c.id === id) ?? null
})

const theme = useThemeStore()
const themes = computed((): Theme[] | null => {
  if (!actualCategory.value || theme.loading) return null
  return theme.list.filter((t) => t.categoryId === actualCategory.value?.id)
})

const handleMenu = (value: string, t: Theme) => {
  if (value === "edit") theme.openEdit(t)
  else if (value === "delete") theme.openDelete(t)
}
</script>

<template>
  <div class="container mt-2 mt-md-6 mt-lg-8 mt-xl-10">
    <template v-if="!actualCategory">
      <div class="d-flex justify-center">
        <h5 class="text-body-1 font-weight-medium font-italic">Category not found</h5>
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
            disabled: true,
          },
        ]"
      />
      <div class="category-title mt-1 mt-md-2 mt-lg-4 mt-xl-6">
        <h3 class="text-h4 font-weight-bold">{{ actualCategory.title }}</h3>
        <v-btn variant="tonal" @click="() => theme.openNew(actualCategory!)">New</v-btn>
      </div>
      <v-container fluid class="mt-4 mt-md-6 mt-lg-8">
        <template v-if="!themes">
          <div class="d-flex justify-center">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </div>
        </template>
        <template v-else-if="themes.length === 0">
          <div class="d-flex justify-center">
            <h5 class="text-body-1 font-weight-medium font-italic">No themes</h5>
          </div>
        </template>
        <template v-else>
          <v-row>
            <v-col v-for="theme in themes" :key="theme.id" cols="12" sm="6" md="4">
              <v-card
                elevation="4"
                :to="`/categories/${actualCategory.id}/themes/${theme.id}`"
              >
                <div class="card-title-container">
                  <h6 class="text-h6" :title="theme.title">
                    {{ theme.title }}
                  </h6>
                  <v-btn size="small" icon variant="text" @click.stop.prevent>
                    <v-icon>mdi-dots-vertical</v-icon>
                    <v-menu activator="parent">
                      <v-list
                        @click:select="($event) => handleMenu($event.id as string, theme)"
                      >
                        <v-list-item value="edit">Edit</v-list-item>
                        <v-list-item value="delete">Delete</v-list-item>
                      </v-list>
                    </v-menu>
                  </v-btn>
                </div>
                <div class="card-description-container">
                  {{ theme.description ?? "No description" }}
                </div>
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
