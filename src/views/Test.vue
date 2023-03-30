<script lang="ts" setup>
import Dropzone from "@/components/Dropzone.vue"

const onFileChange = (file: File) => {
  console.log(file)
}
</script>

<template>
  <div>
    <Dropzone disabled @file-change="onFileChange" />
  </div>
</template>

<style lang="scss" scoped>
div {
  margin: 64px;
  height: 200px;
  width: 400px;
}
</style>
