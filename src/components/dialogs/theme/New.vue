<script setup lang="ts">
import { ref, watch } from "vue"

import { useCategoryStore } from "@/store/category"
import { useThemeStore } from "@/store/theme"

const category = useCategoryStore()
const theme = useThemeStore()

const titleRef = ref("")
const descriptionRef = ref("")
const categoryId = ref<number | null>(null)
const loading = ref(false)
const showError = ref(false)

const refreshValue = () => {
  titleRef.value = ""
  descriptionRef.value = ""
  categoryId.value = null
  showError.value = false
}
const create = async () => {
  const catId = theme.newTheme?.id ?? categoryId.value
  if (!titleRef.value || catId === null) {
    showError.value = true
    return
  }
  loading.value = true
  await theme.new({
    title: titleRef.value,
    description: descriptionRef.value || undefined,
    categoryId: catId,
  })

  loading.value = false
  refreshValue()
}

watch([theme], ([theme]) => {
  if (theme.newOpen) return

  refreshValue()
})
watch([theme, titleRef, categoryId], () => {
  if (titleRef.value && (categoryId.value || theme.newTheme)) showError.value = false
})
</script>

<template>
  <v-dialog v-model="theme.newOpen">
    <v-card class="dialog">
      <v-card-title>
        <span class="text-h5">New theme</span>
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field
            v-model="titleRef"
            :error-messages="showError && !titleRef ? 'Title is required' : ''"
            label="Title *"
            required
            variant="outlined"
          />
          <v-textarea v-model="descriptionRef" label="Description" variant="outlined" />
          <v-autocomplete
            v-if="!theme.newTheme?.id"
            v-model="categoryId"
            :error-messages="showError && !categoryId ? 'Category is required' : ''"
            :items="category.list"
            item-text="title"
            item-value="id"
            label="Category"
            variant="outlined"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="grey-darken-1"
          variant="text"
          @click="() => (theme.newOpen = false)"
        >
          Cancel
        </v-btn>
        <v-btn color="primary" variant="text" @click="create" :loading="loading">
          Create
        </v-btn>
      </v-card-actions>
    </v-card></v-dialog
  >
</template>

<style lang="scss"></style>
