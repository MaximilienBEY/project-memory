<script setup lang="ts">
import { ref, watch } from "vue"

import { useCategoryStore } from "@/store/category"

const category = useCategoryStore()

const titleRef = ref("")
const descriptionRef = ref("")
const loading = ref(false)
const showError = ref(false)

const edit = async () => {
  if (!titleRef.value || !category.editCategory) {
    showError.value = true
    return
  }
  loading.value = true
  await category.edit(category.editCategory, {
    title: titleRef.value,
    description: descriptionRef.value || undefined,
  })

  loading.value = false
  titleRef.value = ""
  descriptionRef.value = ""
  showError.value = false
}

watch([category], ([category]) => {
  showError.value = false
  if (category.editOpen) {
    titleRef.value = category.editCategory?.title || ""
    descriptionRef.value = category.editCategory?.description || ""
  } else {
    titleRef.value = ""
    descriptionRef.value = ""
  }
})
watch([titleRef], () => {
  if (titleRef.value) showError.value = false
  else showError.value = true
})
</script>

<template>
  <v-dialog v-model="category.editOpen">
    <v-card class="dialog">
      <v-card-title>
        <span class="text-h5">Edit category</span>
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field
            v-model="titleRef"
            :error-messages="showError ? 'Title is required' : ''"
            label="Title *"
            required
            variant="outlined"
          ></v-text-field>
          <v-textarea
            v-model="descriptionRef"
            label="Description"
            variant="outlined"
          ></v-textarea>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="grey-darken-1"
          variant="text"
          @click="() => (category.editOpen = false)"
          >Cancel</v-btn
        >
        <v-btn color="primary" variant="text" @click="edit" :loading="loading">
          Edit
        </v-btn>
      </v-card-actions>
    </v-card></v-dialog
  >
</template>

<style lang="scss"></style>
