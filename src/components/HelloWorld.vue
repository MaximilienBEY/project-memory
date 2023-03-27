<script setup lang="ts">
import { ref, watchEffect } from "vue"

import Card from "@/models/card"

const videoUrl = ref<string | null>(null)

watchEffect(() => {
  Card.findOne().then((card) => {
    if (!card?.rectoMedia) return

    videoUrl.value = URL.createObjectURL(new Blob([card.rectoMedia]))
  })
})
</script>

<template>
  <h1>Hello world</h1>
  <video v-if="videoUrl" :src="videoUrl" controls autoplay muted></video>
</template>
