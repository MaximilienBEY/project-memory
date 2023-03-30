<script setup lang="ts">
import { defineProps, ref } from "vue"

const authorizedTypes = ["image/", "video/", "audio/"]

const props = defineProps({
  error: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  disabledText: {
    type: String,
    default: "Disabled",
  },
  percent: {
    type: Number,
  },
})
const emit = defineEmits<{
  (e: "file-change", file: File): void
}>()

const dragOver = ref(false)
const inputFileRef = ref<HTMLInputElement | null>(null)

const onFileChange = (e: Event) => {
  if (props.disabled) return
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file || !authorizedTypes.find((type) => !file.type.startsWith(type))) return

  emit("file-change", file)
}
const onClick = () => {
  if (props.disabled) return
  inputFileRef.value?.click()
}
const onDragEnter = (e: DragEvent) => {
  if (props.disabled) return
  const file = e.dataTransfer?.items[0]
  if (!file || !authorizedTypes.find((type) => !file.type.startsWith(type))) return

  dragOver.value = true
}
const onDragLeave = () => {
  if (props.disabled) return
  dragOver.value = false
}
const onDrop = (e: DragEvent) => {
  if (props.disabled) return
  e.preventDefault()
  dragOver.value = false
  const file = e.dataTransfer?.files[0]
  if (!file || !authorizedTypes.find((type) => !file.type.startsWith(type))) return

  emit("file-change", file)
}
</script>
<template>
  <div class="container">
    <div
      :class="`dropzone ${error ? 'error' : ''} ${dragOver ? 'drag-over' : ''} ${
        disabled ? 'disabled' : ''
      }`"
    >
      <input
        ref="inputFileRef"
        type="file"
        style="display: none"
        @change="onFileChange"
        accept="image/*,video/*,audio/*"
      />
      <span v-if="!disabled">Click or drop a file here</span>
      <span v-else>{{ disabledText }}</span>
      <div
        class="draggable-zone"
        @dragover.prevent
        @dragenter="onDragEnter"
        @dragleave="onDragLeave"
        @click="onClick"
        @drop="onDrop"
      />
    </div>
    <div class="percent" v-if="percent !== undefined">
      <v-progress-linear :model-value="percent" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  position: relative;
  height: 100%;
  width: 100%;
  .dropzone {
    position: relative;
    width: 100%;
    height: 100%;
    border: 1px dashed;
    border-color: rgba(#000000, 0.38);
    color: rgba(#000000, 0.38);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;
    .draggable-zone {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
    &.error {
      border-color: rgba(var(--v-theme-error), 1);
      color: rgba(var(--v-theme-error), 1);
    }
    &.drag-over:not(.disabled):not(.error) {
      background: rgba(var(--v-theme-primary), 0.1);
      border-color: rgba(var(--v-theme-primary), 1);
      color: rgba(var(--v-theme-primary), 1);
    }
    span {
      z-index: 0;
    }
    &:hover:not(.disabled):not(.error) {
      color: rgba(#000000, 0.87);
      border-color: rgba(#000000, 0.87);
    }
    &.disabled {
      cursor: not-allowed;
      background: rgba(#bbb, 0.1);
    }
  }
  .percent {
    position: absolute;
    top: calc(100% + 24px);
    left: 0;
    width: 100%;
  }
}
</style>
