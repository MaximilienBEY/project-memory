// Utilities
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg"
import { defineStore } from "pinia"
import { onMounted, ref } from "vue"

export const useFfmpegStore = defineStore("ffmpeg", () => {
  const progress = ({ ratio }: { ratio: number }) => (percent.value = ratio * 100)

  const loading = ref(true)
  const ffmpeg = ref(createFFmpeg({ progress, log: true }))
  const percent = ref(0)

  const convertVideo = async (file: File) => {
    if (!ffmpeg.value.isLoaded()) await ffmpeg.value.load()
    percent.value = 0
    loading.value = false

    const inputFile = `input.mp4`
    const outputFile = "output.mp4"

    ffmpeg.value.FS("writeFile", inputFile, await fetchFile(file))
    await ffmpeg.value.run("-i", inputFile, "-c:v", "h264", "-c:a", "aac", outputFile)

    const data = ffmpeg.value.FS("readFile", outputFile)
    percent.value = 0
    return data
  }
  const convertAudio = async (file: File) => {
    if (!ffmpeg.value.isLoaded()) await ffmpeg.value.load()
    percent.value = 0
    loading.value = false

    const inputFile = `input.mp3`
    const outputFile = "output.mp3"

    ffmpeg.value.FS("writeFile", inputFile, await fetchFile(file))
    console.log(ffmpeg.value.FS("readdir", "/"))
    await ffmpeg.value.run("-i", inputFile, "-c:a", "mp3", outputFile)

    const data = ffmpeg.value.FS("readFile", "output.mp3")
    percent.value = 0
    return data
  }
  const convertImage = async (file: File) => {
    if (!ffmpeg.value.isLoaded()) await ffmpeg.value.load()
    percent.value = 0
    loading.value = false

    const inputFile = "input.jpg"
    const outputFile = "output.jpg"

    ffmpeg.value.FS("writeFile", inputFile, await fetchFile(file))
    await ffmpeg.value.run("-i", inputFile, outputFile)

    const data = ffmpeg.value.FS("readFile", outputFile)
    percent.value = 0
    return data
  }

  onMounted(async () => {
    await ffmpeg.value.load()
    loading.value = false
  })
  return {
    loading,
    percent,
    convertVideo,
    convertAudio,
    convertImage,
  }
})
