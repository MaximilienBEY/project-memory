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

const edit = async () => {
  if (
    !titleRef.value ||
    !theme.editTheme ||
    (theme.editWithCategory && categoryId.value === null)
  ) {
    showError.value = true
    return
  }
  loading.value = true
  await theme.edit(theme.editTheme, {
    title: titleRef.value,
    description: descriptionRef.value || undefined,
    categoryId: categoryId.value ?? undefined,
  })

  loading.value = false
  titleRef.value = ""
  descriptionRef.value = ""
  showError.value = false
}

watch([theme], ([theme]) => {
  showError.value = false
  if (theme.editOpen) {
    titleRef.value = theme.editTheme?.title || ""
    descriptionRef.value = theme.editTheme?.description || ""
    categoryId.value = theme.editTheme?.categoryId || null
  } else {
    titleRef.value = ""
    descriptionRef.value = ""
    categoryId.value = null
  }
})
watch([titleRef, categoryId], () => {
  if (titleRef.value && categoryId.value) showError.value = false
  else showError.value = true
})
</script>

<template>
  <v-dialog v-model="theme.editOpen">
    <v-card class="dialog">
      <v-card-title>
        <span class="text-h5">Edit theme</span>
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
          <v-autocomplete
            v-if="theme.editWithCategory"
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
          @click="() => (theme.editOpen = false)"
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
