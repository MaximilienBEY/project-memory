<script setup lang="ts">
import Card from "@/models/card"
import { useCardStore } from "@/store/card"

const card = useCardStore()

const handleOpenMedia = (card: Card, type: "recto" | "verso") => {
  const data = (type === "recto" ? card.rectoMedia : card.versoMedia)!
  const mediaType = (type === "recto" ? card.rectoMediaType : card.versoMediaType)!
  const url = URL.createObjectURL(new Blob([data.buffer], { type: mediaType }))
  window.open(url, "_blank")
}
const handleMenu = (value: string, c: Card) => {
  if (value === "delete") card.openDelete(c)
  else if (value === "edit") card.openEdit(c, true)
}
</script>

<template>
  <div class="container mt-4 mt-md-8 mt-lg-12 mt-xl-16">
    <div class="card-title">
      <h3 class="text-h4 font-weight-bold">Cards</h3>
      <v-btn variant="tonal" @click="() => card.openNew()">New</v-btn>
    </div>
    <v-container fluid class="mt-4 mt-md-6 mt-lg-8">
      <template v-if="card.loading">
        <div class="d-flex justify-center">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>
      </template>
      <template v-else-if="card.list.length === 0">
        <div class="d-flex justify-center">
          <h5 class="text-body-1 font-weight-medium font-italic">No cards</h5>
        </div>
      </template>
      <template v-else>
        <v-row>
          <v-col v-for="c in card.list" :key="c.id" cols="12" sm="6" md="4" lg="3">
            <v-card elevation="4">
              <div class="card-title-container">
                <span class="text-body-1 font-weight-bold" :title="c.title">
                  {{ c.title }}
                </span>
                <v-btn size="small" icon variant="text" @click.stop.prevent>
                  <v-icon>mdi-dots-vertical</v-icon>
                  <v-menu activator="parent">
                    <v-list
                      @click:select="($event) => handleMenu($event.id as string, c)"
                    >
                      <v-list-item value="edit">Edit</v-list-item>
                      <v-list-item value="delete">Delete</v-list-item>
                    </v-list>
                  </v-menu>
                </v-btn>
              </div>
              <div class="card-info">
                <div>
                  <span class="text-body-2 font-weight-medium">Recto</span>
                  <v-tooltip
                    :text="c.rectoText"
                    v-if="c.rectoType === 'text'"
                    location="top"
                  >
                    <template v-slot:activator="{ props }">
                      <v-icon v-bind="props">mdi-text</v-icon>
                    </template>
                  </v-tooltip>
                  <div
                    class="card-media"
                    v-else
                    @click="() => handleOpenMedia(c, 'recto')"
                  >
                    <v-tooltip :text="c.rectoMediaAlt" location="top">
                      <template v-slot:activator="{ props }">
                        <v-icon
                          v-bind="props"
                          v-if="c.rectoMediaType?.startsWith('video/')"
                        >
                          mdi-filmstrip
                        </v-icon>
                        <v-icon
                          v-bind="props"
                          v-else-if="c.rectoMediaType?.startsWith('audio/')"
                        >
                          mdi-volume-medium
                        </v-icon>
                        <v-icon v-bind="props" v-else>mdi-image</v-icon>
                      </template>
                    </v-tooltip>
                  </div>
                </div>
                <div>
                  <span class="text-body-2 font-weight-medium">Verso</span>
                  <v-tooltip
                    :text="c.versoText"
                    v-if="c.versoType === 'text'"
                    location="top"
                  >
                    <template v-slot:activator="{ props }">
                      <v-icon v-bind="props">mdi-text</v-icon>
                    </template>
                  </v-tooltip>
                  <div
                    class="card-media"
                    v-else
                    @click="() => handleOpenMedia(c, 'verso')"
                  >
                    <v-tooltip :text="c.versoMediaAlt" location="top">
                      <template v-slot:activator="{ props }">
                        <v-icon
                          v-bind="props"
                          v-if="c.versoMediaType?.startsWith('video/')"
                        >
                          mdi-filmstrip
                        </v-icon>
                        <v-icon
                          v-bind="props"
                          v-else-if="c.versoMediaType?.startsWith('audio/')"
                        >
                          mdi-volume-medium
                        </v-icon>
                        <v-icon v-bind="props" v-else>mdi-image</v-icon>
                      </template>
                    </v-tooltip>
                  </div>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </v-container>
  </div>
</template>

<style lang="scss" scoped>
.container {
  margin: 0 auto;
  max-width: 1000px;
  width: 80%;
}
.card-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.category-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.card-info {
  display: flex;
  padding: 8px 16px;
  background: #f5f5f5;
  & > div {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .card-media {
      cursor: pointer;
    }
  }
}
</style>
