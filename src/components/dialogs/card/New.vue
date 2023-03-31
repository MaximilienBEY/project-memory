<script setup lang="ts">
import { ref, watch } from "vue"

import Dropzone from "@/components/Dropzone.vue"
import Card from "@/models/card"
import { useCardStore } from "@/store/card"
import { useFfmpegStore } from "@/store/ffmpeg"
import { useThemeStore } from "@/store/theme"
import { MediaInterface } from "@/types/card"

const card = useCardStore()
const theme = useThemeStore()
const ffmpeg = useFfmpegStore()

const title = ref("")
const themeId = ref<number | null>(null)
const loading = ref(false)
const showError = ref(false)

const convertingType = ref<"recto" | "verso" | null>(null)

const rectoType = ref("Text")
const rectoContent = ref("")
const rectoMedia = ref<MediaInterface | null>(null)

const versoType = ref("Text")
const versoContent = ref("")
const versoMedia = ref<MediaInterface | null>(null)

const refreshValue = () => {
  title.value = ""
  themeId.value = null
  rectoType.value = "Text"
  rectoContent.value = ""
  rectoMedia.value = null
  versoType.value = "Text"
  versoContent.value = ""
  versoMedia.value = null
  showError.value = false
  convertingType.value = null
  ffmpeg.cancel()
}
const create = async () => {
  const themId = card.newCard?.id ?? themeId.value
  if (
    !title.value ||
    convertingType.value ||
    (rectoType.value === "Text" && !rectoContent.value) ||
    (rectoType.value === "Media" && !rectoMedia.value) ||
    (versoType.value === "Text" && !versoContent.value) ||
    (versoType.value === "Media" && !versoMedia.value) ||
    themId === null
  ) {
    showError.value = true
    return
  }
  loading.value = true

  const c = await Card.create({
    title: title.value,
    ...(rectoType.value === "Text"
      ? {
          rectoType: "text",
          rectoText: rectoContent.value,
        }
      : {
          rectoType: "media",
          rectoMedia: rectoMedia.value!.data,
          rectoMediaType: rectoMedia.value!.type,
          rectoMediaAlt: rectoMedia.value!.name,
        }),
    ...(versoType.value === "Text"
      ? {
          versoType: "text",
          versoText: versoContent.value,
        }
      : {
          versoType: "media",
          versoMedia: versoMedia.value!.data,
          versoMediaType: versoMedia.value!.type,
          versoMediaAlt: versoMedia.value!.name,
        }),
    streak: 0,
    themeId: themId,
  })
  await card.new(c)

  loading.value = false
  refreshValue()
}
const onMediaChange = async (type: "recto" | "verso", file: File) => {
  if (convertingType.value) return

  convertingType.value = type
  const fileType = file.type.split("/")[0]

  if (fileType === "image") {
    const data = await new Promise<Uint8Array>((resolve) => {
      const reader = new FileReader()
      reader.onload = () => {
        resolve(new Uint8Array(reader.result as ArrayBuffer))
      }
      reader.readAsArrayBuffer(file)
    })
    const url = URL.createObjectURL(new Blob([data.buffer], { type: file.type }))
    const mediaData = { data, type: file.type, name: file.name, url }
    if (type === "recto") rectoMedia.value = mediaData
    else versoMedia.value = mediaData
  } else {
    const data =
      fileType === "audio"
        ? await ffmpeg.convertAudio(file)
        : await ffmpeg.convertVideo(file)
    if (!data) return (convertingType.value = null)

    const mediaType = fileType === "video" ? "video/mp4" : "audio/mp3"
    const url = URL.createObjectURL(new Blob([data.buffer], { type: mediaType }))
    const mediaData = { data, type: mediaType, name: file.name, url }
    if (type === "recto") rectoMedia.value = mediaData
    else versoMedia.value = mediaData
  }

  convertingType.value = null
}

watch([card], ([card]) => {
  if (card.newOpen) return

  refreshValue()
})
watch(
  [title, rectoType, rectoContent, rectoMedia, versoType, versoContent, versoMedia],
  () => {
    if (
      title.value &&
      !convertingType.value &&
      ((rectoType.value === "Text" && rectoContent.value) ||
        (rectoType.value === "Media" && rectoMedia.value)) &&
      ((versoType.value === "Text" && versoContent.value) ||
        (versoType.value === "Media" && versoMedia.value)) &&
      (themeId.value || card.newCard)
    )
      showError.value = false
  },
)
</script>

<template>
  <v-dialog v-model="card.newOpen">
    <v-card class="dialog">
      <v-card-title>
        <span class="text-h5">New card</span>
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field
            v-model="title"
            :error-messages="showError && !title ? 'Title is required' : ''"
            label="Title *"
            placeholder="It will not be shown in the question, but it will be useful for you to identify the card."
            required
            variant="outlined"
          />
          <v-autocomplete
            v-if="!card.newCard?.id"
            v-model="themeId"
            :error-messages="showError && !themeId ? 'Theme is required' : ''"
            :items="theme.list"
            item-text="title"
            item-value="id"
            label="Theme"
            variant="outlined"
          />
        </v-form>
        <div class="card-sides">
          <div class="card-side">
            <h6
              class="text-body-1 text-sm-h6 mb-2 mb-sm-1 font-weight-regular text-center"
            >
              Recto
            </h6>
            <v-select
              label="Type"
              :items="['Text', 'Media']"
              variant="outlined"
              v-model="rectoType"
            />
            <div class="card-content">
              <v-textarea
                v-model="rectoContent"
                :error-messages="
                  showError
                    ? rectoType === 'Text'
                      ? !rectoContent
                        ? 'Content is required'
                        : ''
                      : convertingType === 'recto'
                      ? 'Wait for conversion'
                      : !rectoMedia
                      ? 'Media is required'
                      : ''
                    : ''
                "
                label="Recto content"
                variant="outlined"
              />
              <div :class="`dropzone-container ${rectoType === 'Media' ? 'active' : ''}`">
                <Dropzone
                  @file-change="($file) => onMediaChange('recto', $file)"
                  :error="showError && (convertingType === 'recto' || !rectoMedia)"
                  :disabled="!!convertingType"
                  :disabled-text="
                    convertingType === 'recto'
                      ? 'Converting...'
                      : 'Other side is converting...'
                  "
                  :percent="convertingType === 'recto' ? ffmpeg.percent : undefined"
                  :media="rectoMedia"
                />
              </div>
            </div>
          </div>
          <div class="card-side">
            <h6
              class="text-body-1 text-sm-h6 mb-2 mb-sm-1 font-weight-regular text-center"
            >
              Verso
            </h6>
            <v-select
              label="Type"
              :items="['Text', 'Media']"
              variant="outlined"
              v-model="versoType"
            />
            <div class="card-content">
              <v-textarea
                v-model="versoContent"
                :error-messages="
                  showError
                    ? versoType === 'Text'
                      ? !versoContent
                        ? 'Content is required'
                        : ''
                      : convertingType === 'verso'
                      ? 'Wait for conversion'
                      : !versoMedia
                      ? 'Media is required'
                      : ''
                    : ''
                "
                label="Verso content"
                variant="outlined"
              />
              <div :class="`dropzone-container ${versoType === 'Media' ? 'active' : ''}`">
                <Dropzone
                  @file-change="($file) => onMediaChange('verso', $file)"
                  :error="showError && (convertingType === 'verso' || !versoMedia)"
                  :disabled="!!convertingType"
                  :disabled-text="
                    convertingType === 'verso'
                      ? 'Converting...'
                      : 'Other side is converting...'
                  "
                  :percent="convertingType === 'verso' ? ffmpeg.percent : undefined"
                  :media="versoMedia"
                />
              </div>
            </div>
          </div>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey-darken-1" variant="text" @click="() => (card.newOpen = false)">
          Cancel
        </v-btn>
        <v-btn color="primary" variant="text" @click="create" :loading="loading">
          Create
        </v-btn>
      </v-card-actions>
    </v-card></v-dialog
  >
</template>

<style lang="scss" scoped>
.card-sides {
  display: flex;
  column-gap: 32px;
  @media (max-width: 600px) {
    column-gap: 16px;
  }
  .card-side {
    flex: 1;
    .card-content {
      position: relative;
      .dropzone-container {
        position: absolute;
        top: 0;
        left: 0;
        height: calc(100% - 22px);
        width: 100%;
        background: #fff;
        visibility: hidden;
        opacity: 0;
        &.active {
          visibility: visible;
          opacity: 1;
        }
      }
    }
  }
}
</style>
