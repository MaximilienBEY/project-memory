<script setup lang="ts">
import Hls from "hls.js"
import { ref, watchEffect } from "vue"

import Card from "@/models/card"

const videoRef = ref<HTMLVideoElement | null>(null)

watchEffect(() => {
  Card.findOne().then((card) => {
    if (!card?.rectoMedia || !videoRef.value) return

    class pLoader extends Hls.DefaultConfig.loader {
      constructor(config: any) {
        super(config)
      }
      load(context: any, config: any, callbacks: any) {
        const c = context
        if (context.type == "manifest") {
          var onSuccess = callbacks.onSuccess as any
          onSuccess(
            {
              url: "test",
              data: '#EXTM3U\n#EXT-X-VERSION:3\n\n#EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="languages",LANGUAGE="jpn",NAME="Japanese",AUTOSELECT=YES,URI="https://api.yourflix.fr/videos/E3VGU_x4nrFwxRPD-y-lY/audios/o26OZmgTuGw5190KrYeFX/index.m3u8"\n\n\n#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=8189610,AUDIO="languages",RESOLUTION=1920x1080,NAME="1080p"\nhttps://api.yourflix.fr/videos/E3VGU_x4nrFwxRPD-y-lY/videos/7EorUFQ6wMZOemimLdTCa/index.m3u8',
            },
            c.loader.stats,
            context,
          )
        } else {
          console.log(context)
          super.load(context, config, callbacks)
        }
      }
    }
    class fLoader extends Hls.DefaultConfig.loader {
      constructor(config: any) {
        super(config)
      }
      load(context: any, config: any, callbacks: any) {
        var onSuccess = callbacks.onSuccess as any
        callbacks.onSuccess = function (response: any, stats: any, context: any) {
          // console.log(response, stats, context)
          onSuccess(response, {}, context)
        }
        super.load(context, config, callbacks)
      }
    }

    const hls = new Hls({
      pLoader: pLoader as any,
      fLoader: fLoader as any,
    })

    hls.loadSource(`https://api.yourflix.fr/videos/E3VGU_x4nrFwxRPD-y-lY/playlist`)
    // hls.loadSource(`media://${card.id}/${card.rectoType}`)
    hls.attachMedia(videoRef.value)
  })
})
</script>

<template>
  <h1>Hello world</h1>
  <video ref="videoRef" controls />
</template>
