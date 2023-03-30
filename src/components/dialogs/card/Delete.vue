<script setup lang="ts">
import { ref } from "vue"

import { useCardStore } from "@/store/card"

const card = useCardStore()

const loading = ref(false)

const deleteCard = async () => {
  if (!card.deleteCard) return

  loading.value = true
  await card.delete(card.deleteCard)
  loading.value = false
}
</script>

<template>
  <v-dialog v-model="card.deleteOpen">
    <v-card class="dialog">
      <v-card-title>
        <span class="text-h5">Delete card</span>
      </v-card-title>
      <v-card-text>
        Are you sure you want to delete
        <i>
          <b>{{ card.deleteCard?.title }}</b>
        </i>
        ? This action cannot be undone.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="grey-darken-1"
          variant="text"
          @click="() => (card.deleteOpen = false)"
          >Cancel</v-btn
        >
        <v-btn color="danger" variant="text" @click="deleteCard" :loading="loading">
          Delete
        </v-btn>
      </v-card-actions>
    </v-card></v-dialog
  >
</template>

<style lang="scss"></style>
