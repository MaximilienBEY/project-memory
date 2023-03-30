<script setup lang="ts">
import { ref, watch } from "vue"

import { useCardStore } from "@/store/card"

const card = useCardStore()

const titleRef = ref("")
const loading = ref(false)
const showError = ref(false)

const edit = async () => {
  if (!titleRef.value || !card.editCard) {
    showError.value = true
    return
  }
  loading.value = true
  await card.edit(card.editCard)

  loading.value = false
  titleRef.value = ""
  showError.value = false
}

watch([card], ([card]) => {
  showError.value = false
  if (card.editOpen) {
    titleRef.value = card.editCard?.title || ""
  } else {
    titleRef.value = ""
  }
})
watch([titleRef], () => {
  if (titleRef.value) showError.value = false
  else showError.value = true
})
</script>

<template>
  <v-dialog v-model="card.editOpen">
    <v-card class="dialog">
      <v-card-title>
        <span class="text-h5">Edit card</span>
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
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey-darken-1" variant="text" @click="() => (card.editOpen = false)"
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
