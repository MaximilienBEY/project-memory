<script setup lang="ts">
import Theme from "@/models/theme"
import { useThemeStore } from "@/store/theme"

const theme = useThemeStore()

const handleMenu = (value: string, c: Theme) => {
  if (value === "delete") theme.openDelete(c)
  else if (value === "edit") theme.openEdit(c, true)
}
</script>

<template>
  <div class="container mt-4 mt-md-8 mt-lg-12 mt-xl-16">
    <div class="theme-title">
      <h3 class="text-h4 font-weight-bold">Themes</h3>
      <v-btn variant="tonal" @click="() => theme.openNew()">New</v-btn>
    </div>
    <v-container fluid class="mt-4 mt-md-6 mt-lg-8">
      <template v-if="theme.loading">
        <div class="d-flex justify-center">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>
      </template>
      <template v-else-if="theme.list.length === 0">
        <div class="d-flex justify-center">
          <h5 class="text-body-1 font-weight-medium font-italic">No categories</h5>
        </div>
      </template>
      <template v-else>
        <v-row>
          <v-col v-for="t in theme.list" :key="t.id" cols="12" sm="6" md="4">
            <v-card elevation="4" :to="`/categories/${t.categoryId}/themes/${t.id}`">
              <div class="card-title-container">
                <h6 class="text-h6" :title="t.title">{{ t.title }}</h6>
                <v-btn size="small" icon variant="text" @click.stop.prevent>
                  <v-icon>mdi-dots-vertical</v-icon>
                  <v-menu activator="parent">
                    <v-list
                      @click:select="($event) => handleMenu($event.id as string, t)"
                    >
                      <v-list-item value="edit">Edit</v-list-item>
                      <v-list-item value="delete">Delete</v-list-item>
                    </v-list>
                  </v-menu>
                </v-btn>
              </div>
              <div class="card-description-container">
                {{ t.description ?? "No description" }}
              </div>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </v-container>
  </div>
</template>

<style lang="scss" scoped>
.container {
  margin: 0 auto;
  max-width: 1000px;
  width: 80%;
}
.theme-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
