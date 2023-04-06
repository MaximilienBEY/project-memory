<script setup lang="ts">
import { computed, ref } from "vue"

import Card from "@/models/card"
import { useCardStore } from "@/store/card"

const cardStore = useCardStore()
const props = defineProps<{
  cards: Card[]
}>()
const emit = defineEmits<{
  (e: "finish", cards: { correct: Card[]; failed: Card[] }): void
}>()

const indexRef = ref(0)
const answerRef = ref(false)

const correctRef = ref<Card[]>([])
const failedRef = ref<Card[]>([])

const question = computed(() => {
  const question = props.cards.at(indexRef.value)
  if (!question) return null

  const rectoMediaType = question.rectoMediaType
  const rectoUrl = question.rectoMedia
    ? URL.createObjectURL(
        new Blob([question.rectoMedia.buffer], { type: rectoMediaType }),
      )
    : null

  const versoMediaType = question.versoMediaType
  const versoUrl = question.versoMedia
    ? URL.createObjectURL(
        new Blob([question.versoMedia.buffer], { type: versoMediaType }),
      )
    : null

  return {
    question,
    rectoUrl,
    versoUrl,
  }
})

const handleSubmit = async (type: "wrong" | "success") => {
  if (!question.value) return
  const card = question.value.question
  await cardStore.answer(card, type === "success")

  if (type === "success") correctRef.value.push(card)
  else failedRef.value.push(card)

  answerRef.value = false
  if (indexRef.value === props.cards.length - 1) {
    emit("finish", {
      correct: correctRef.value,
      failed: failedRef.value,
    })
    indexRef.value = 0
    correctRef.value = []
    failedRef.value = []
  } else {
    indexRef.value += 1
  }
}
</script>
<template>
  <div class="question">
    <h6 class="text-h5 font-weight-medium text-center">
      Question {{ indexRef + 1 }} / {{ cards.length }}
    </h6>
    <v-card variant="tonal" v-if="question">
      <v-card-title class="text-h6">
        {{
          !answerRef
            ? question.question.rectoType === "text"
              ? "Question Texte"
              : question.question.rectoMediaType?.startsWith("video/")
              ? "Question Video"
              : question.question.rectoMediaType?.startsWith("audio/")
              ? "Question Audio"
              : "Question Image"
            : question.question.versoType === "text"
            ? "Answer Texte"
            : question.question.versoMediaType?.startsWith("video/")
            ? "Answer Video"
            : question.question.versoMediaType?.startsWith("audio/")
            ? "Answer Audio"
            : "Answer Image"
        }}
      </v-card-title>
      <template v-if="!answerRef">
        <v-card-text
          class="text-h6 text-center mt-4"
          v-if="question.question.rectoType === 'text'"
          style="white-space: pre-line"
        >
          {{ question.question.rectoText }}
        </v-card-text>
        <div class="card-media" v-else-if="question.rectoUrl">
          <video
            controls
            autoplay
            loop
            class="video"
            v-if="question.question.rectoMediaType?.startsWith('video/')"
          >
            <source :src="question.rectoUrl" :type="question.question.rectoMediaType" />
          </video>
          <video
            controls
            autoplay
            class="audio"
            v-else-if="question.question.rectoMediaType?.startsWith('audio/')"
          >
            <source :src="question.rectoUrl" :type="question.question.rectoMediaType" />
          </video>
          <img v-else :src="question.rectoUrl" />
        </div>
      </template>
      <template v-else>
        <v-card-text
          class="text-h6 text-center mt-4"
          v-if="question.question.versoType === 'text'"
          style="white-space: pre-line"
        >
          {{ question.question.versoText }}
        </v-card-text>
        <div class="card-media" v-else-if="question.versoUrl">
          <video
            controls
            autoplay
            loop
            class="video"
            v-if="question.question.versoMediaType?.startsWith('video/')"
          >
            <source :src="question.versoUrl" :type="question.question.versoMediaType" />
          </video>
          <video
            controls
            autoplay
            loop
            class="audio"
            v-else-if="question.question.versoMediaType?.startsWith('audio/')"
          >
            <source :src="question.versoUrl" :type="question.question.versoMediaType" />
          </video>
          <img v-else :src="question.versoUrl" />
        </div>
      </template>
    </v-card>
    <v-btn
      v-if="!answerRef"
      color="primary"
      id="answer-btn"
      size="large"
      @click="answerRef = true"
    >
      Show answer
    </v-btn>
    <div class="btn-container" v-else>
      <v-btn size="large" color="red-darken-3" @click="() => handleSubmit('wrong')">
        Wrong
      </v-btn>
      <v-btn size="large" color="primary" @click="() => handleSubmit('success')">
        Correct
      </v-btn>
    </div>
    <v-progress-linear :model-value="indexRef" :max="cards.length - 1" />
  </div>
</template>
<style scoped lang="scss">
.question {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  row-gap: 16px;
  #answer-btn,
  .btn-container {
    align-self: center;
    margin-block: 16px;
  }
  .btn-container {
    display: flex;
    justify-content: center;
    column-gap: 16px;
  }
  .v-card {
    margin-inline: 64px;
    padding: 24px 48px;
    @media (max-width: 600px) {
      margin-inline: 0;
    }
    .card-media {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-block: 16px;
      img {
        width: 50%;
        max-height: 40vh;
        object-fit: contain;
        @media (max-width: 600px) {
          max-height: 70vh;
          width: 100%;
        }
      }
      video.audio {
        height: 54px;
        width: 80%;
      }
      video.video {
        width: 80%;
        max-height: 40vh;
        object-fit: contain;
      }
    }
  }
}
</style>
