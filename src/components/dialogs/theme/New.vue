<script setup lang="ts">
import { ref, watch } from "vue"

import { useThemeStore } from "@/store/theme"

const theme = useThemeStore()

const titleRef = ref("")
const descriptionRef = ref("")
const loading = ref(false)
const showError = ref(false)

const create = async () => {
  if (!theme.newTheme) return
  if (!titleRef.value) {
    showError.value = true
    return
  }
  loading.value = true
  await theme.new({
    title: titleRef.value,
    description: descriptionRef.value || undefined,
    categoryId: theme.newTheme.id,
  })

  loading.value = false
  titleRef.value = ""
  descriptionRef.value = ""
  showError.value = false
}

watch([theme], ([theme]) => {
  if (theme.newOpen) return

  titleRef.value = ""
  descriptionRef.value = ""
  showError.value = false
})
watch([titleRef], () => {
  if (titleRef.value) showError.value = false
  else showError.value = true
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
            :error-messages="showError ? 'Title is required' : ''"
            label="Title *"
            required
            variant="outlined"
          />
          <v-textarea v-model="descriptionRef" label="Description" variant="outlined" />
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
