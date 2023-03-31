<script setup lang="ts">
import Category from "@/models/category"
import { useCategoryStore } from "@/store/category"

const category = useCategoryStore()

const handleMenu = (value: string, c: Category) => {
  if (value === "delete") category.openDelete(c)
  else if (value === "edit") category.openEdit(c)
}
</script>

<template>
  <div class="container mt-2 mt-md-6 mt-lg-8 mt-xl-10">
    <v-breadcrumbs
      :items="[
        { title: 'Home', to: '/', disabled: false },
        { title: 'Categories', to: '/categories', disabled: true },
      ]"
    />
    <div class="category-title mt-1 mt-md-2 mt-lg-4 mt-xl-6">
      <h3 class="text-h4 font-weight-bold">Categories</h3>
      <v-btn variant="tonal" @click="category.openNew">New</v-btn>
    </div>
    <v-container fluid class="mt-4 mt-md-6 mt-lg-8">
      <template v-if="category.loading">
        <div class="d-flex justify-center">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>
      </template>
      <template v-else-if="category.list.length === 0">
        <div class="d-flex justify-center">
          <h5 class="text-body-1 font-weight-medium font-italic">No categories</h5>
        </div>
      </template>
      <template v-else>
        <v-row>
          <v-col v-for="c in category.list" :key="c.id" cols="12" sm="6" md="4">
            <v-card elevation="4" :to="`/categories/${c.id}`">
              <div class="card-title-container">
                <h6 class="text-h6" :title="c.title">{{ c.title }}</h6>
                <v-btn size="small" icon variant="text" @click.stop.prevent>
                  <v-icon>mdi-dots-vertical</v-icon>
                  <v-menu activator="parent">
                    <v-list
                      @click:select="($event) => handleMenu($event.id as string, c)"
                    >
                      <v-list-item value="edit">Edit</v-list-item>
                      <v-list-item value="delete">Delete</v-list-item>
                    </v-list>
                  </v-menu>
                </v-btn>
              </div>
              <div class="card-description-container">
                {{ c.description ?? "No description" }}
              </div>
            </v-card>
          </v-col>
        </v-row></template
      >
    </v-container>
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
