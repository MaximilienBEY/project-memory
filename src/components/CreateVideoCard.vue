<script setup lang="ts">
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg"
import { computed, ref, watchEffect } from "vue"

import Card from "@/models/card"

const ffmpeg = createFFmpeg({ log: true })
const ffmpegLoading = ref(true)

const loading = ref(false)

const title = ref("Test titre")
const videos = ref<File[]>([])

const video = computed(() => videos.value.at(0) ?? null)
const videoUrl = computed(() => (video.value ? URL.createObjectURL(video.value) : null))

const createCard = async () => {
  if (!ffmpeg.isLoaded()) return
  if (!video.value) return
  if (!title.value) return

  ffmpeg.FS("writeFile", "video.mp4", await fetchFile(video.value))
  await ffmpeg.run("-i", "video.mp4", "-c:v", "h264", "-c:a", "aac", "output.mp4")
  const data = ffmpeg.FS("readFile", "output.mp4")

  const card = await Card.create({
    rectoType: "video",
    rectoMedia: data,
    versoType: "text",
    versoText: title.value,
    themeId: 1,
  })
  console.log(card)
}

watchEffect(() => {
  ffmpeg.load().then(() => {
    ffmpegLoading.value = false
    console.log("FFmpeg loaded")
  })
})
</script>

<template>
  <v-container>
    <h1>Create Video Card</h1>
    <v-text-field prepend-icon="mdi-text" label="Titre" v-model="title" />
    <v-file-input
      label="Video"
      prepend-icon="mdi-video"
      v-model="videos"
      accept="video/*"
      show-size
    />
    <v-btn
      width="100%"
      color="primary"
      :loading="ffmpegLoading || loading"
      @click="createCard"
      >Créer</v-btn
    >
    <video v-if="videoUrl" :src="videoUrl" controls></video>
  </v-container>
</template>
