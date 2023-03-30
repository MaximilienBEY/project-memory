<script setup lang="ts">
import { computed, ref } from "vue"

import { useFfmpegStore } from "@/store/ffmpeg"

const ffmpeg = useFfmpegStore()

const loading = ref(false)

const title = ref("Test titre")

const videos = ref<File[]>([])
const video = computed(() => videos.value.at(0) ?? null)

const createCard = async () => {
  if (!video.value) return
  if (!title.value) return

  loading.value = true
  const data = await ffmpeg.convertVideo(video.value)
  console.log(data)
  // ffmpeg.FS("writeFile", "video.mp4", await fetchFile(video.value))
  // await ffmpeg.run("-i", "video.mp4", "-c:v", "h264", "-c:a", "aac", "output.mp4")
  // const data = ffmpeg.FS("readFile", "output.mp4")

  // const card = await Card.create({
  //   rectoType: "video",
  //   rectoMedia: data,
  //   versoType: "text",
  //   versoText: title.value,
  //   themeId: 1,
  // })
  // console.log(card)
}
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
    <v-progress-linear :model-value="ffmpeg.percent" v-if="!!ffmpeg.percent" />
    <v-btn
      width="100%"
      color="primary"
      :loading="loading || ffmpeg.loading"
      @click="createCard"
      >Créer</v-btn
    >
    <!-- <video v-if="videoUrl" :src="videoUrl" controls></video> -->
  </v-container>
</template>
