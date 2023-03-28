<script setup lang="ts">
import { ref } from "vue"

import { useCategoryStore } from "@/store/category"

const category = useCategoryStore()

const loading = ref(false)

const deleteCategory = async () => {
  if (!category.deleteCategory) return

  loading.value = true
  await category.delete(category.deleteCategory)
  loading.value = false
}
</script>

<template>
  <v-dialog v-model="category.deleteOpen">
    <v-card class="dialog">
      <v-card-title>
        <span class="text-h5">Delete category</span>
      </v-card-title>
      <v-card-text>
        Are you sure you want to delete
        <i>
          <b>{{ category.deleteCategory?.title }}</b>
        </i>
        ? This action cannot be undone.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="grey-darken-1"
          variant="text"
          @click="() => (category.deleteOpen = false)"
          >Cancel</v-btn
        >
        <v-btn color="danger" variant="text" @click="deleteCategory" :loading="loading">
          Delete
        </v-btn>
      </v-card-actions>
    </v-card></v-dialog
  >
</template>

<style lang="scss"></style>
