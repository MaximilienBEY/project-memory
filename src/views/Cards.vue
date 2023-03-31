<script setup lang="ts">
import { computed } from "vue"
import { useRoute } from "vue-router"

import Card from "@/models/card"
import { useCardStore } from "@/store/card"
import { useCategoryStore } from "@/store/category"
import { useThemeStore } from "@/store/theme"

const route = useRoute()

const category = useCategoryStore()
const actualCategory = computed(() => {
  const id = parseInt(route.params.categoryId as string)
  return category.list.find((c) => c.id === id) ?? null
})

const theme = useThemeStore()
const actualTheme = computed(() => {
  const id = parseInt(route.params.themeId as string)
  return theme.list.find((t) => t.id === id) ?? null
})

const card = useCardStore()
const cards = computed((): Card[] | null => {
  if (!actualTheme.value || card.loading) return null
  return card.list.filter((t) => t.themeId === actualTheme.value?.id)
})

const handleOpenMedia = (card: Card, type: "recto" | "verso") => {
  const data = (type === "recto" ? card.rectoMedia : card.versoMedia)!
  const mediaType = (type === "recto" ? card.rectoMediaType : card.versoMediaType)!
  const url = URL.createObjectURL(new Blob([data.buffer], { type: mediaType }))
  window.open(url, "_blank")
}
const handleMenu = (value: string, c: Card) => {
  if (value === "edit") card.openEdit(c)
  else if (value === "delete") card.openDelete(c)
}
</script>

<template>
  <div class="container mt-2 mt-md-6 mt-lg-8 mt-xl-10">
    <template v-if="!actualCategory">
      <div class="d-flex justify-center">
        <h5 class="text-body-1 font-weight-medium font-italic">Category not found</h5>
      </div></template
    >
    <template v-else-if="!actualTheme">
      <div class="d-flex justify-center">
        <h5 class="text-body-1 font-weight-medium font-italic">Theme not found</h5>
      </div></template
    >
    <template v-else>
      <v-breadcrumbs
        :items="[
          { title: 'Home', to: '/', disabled: false },
          { title: 'Categories', to: '/categories', disabled: false },
          {
            title: actualCategory.title,
            to: `/categories/${actualCategory.id}`,
            disabled: false,
          },
          {
            title: actualTheme.title,
            to: `/categories/${actualCategory.id}/themes/${actualTheme.id}`,
          },
        ]"
      />
      <div class="category-title mt-1 mt-md-2 mt-lg-4 mt-xl-6">
        <h3 class="text-h4 font-weight-bold">{{ actualTheme.title }}</h3>
        <v-btn variant="tonal" @click="() => card.openNew(actualTheme!)">New</v-btn>
      </div>
      <v-container fluid class="mt-4 mt-md-6 mt-lg-8">
        <template v-if="!cards">
          <div class="d-flex justify-center">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </div>
        </template>
        <template v-else-if="cards.length === 0">
          <div class="d-flex justify-center">
            <h5 class="text-body-1 font-weight-medium font-italic">No cards</h5>
          </div>
        </template>
        <template v-else>
          <v-row>
            <v-col v-for="card in cards" :key="card.id" cols="12" sm="6" md="4" lg="3">
              <v-card elevation="4">
                <div class="card-title-container">
                  <span class="text-body-1 font-weight-bold" :title="card.title">
                    {{ card.title }}
                  </span>
                  <v-btn size="small" icon variant="text" @click.stop.prevent>
                    <v-icon>mdi-dots-vertical</v-icon>
                    <v-menu activator="parent">
                      <v-list
                        @click:select="($event) => handleMenu($event.id as string, card)"
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
                      :text="card.rectoText"
                      v-if="card.rectoType === 'text'"
                      location="top"
                    >
                      <template v-slot:activator="{ props }">
                        <v-icon v-bind="props">mdi-text</v-icon>
                      </template>
                    </v-tooltip>
                    <div
                      class="card-media"
                      v-else
                      @click="() => handleOpenMedia(card, 'recto')"
                    >
                      <v-tooltip :text="card.rectoMediaAlt" location="top">
                        <template v-slot:activator="{ props }">
                          <v-icon
                            v-bind="props"
                            v-if="card.rectoMediaType?.startsWith('video/')"
                          >
                            mdi-filmstrip
                          </v-icon>
                          <v-icon
                            v-bind="props"
                            v-else-if="card.rectoMediaType?.startsWith('audio/')"
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
                      :text="card.versoText"
                      v-if="card.versoType === 'text'"
                      location="top"
                    >
                      <template v-slot:activator="{ props }">
                        <v-icon v-bind="props">mdi-text</v-icon>
                      </template>
                    </v-tooltip>
                    <div
                      class="card-media"
                      v-else
                      @click="() => handleOpenMedia(card, 'verso')"
                    >
                      <v-tooltip :text="card.versoMediaAlt" location="top">
                        <template v-slot:activator="{ props }">
                          <v-icon
                            v-bind="props"
                            v-if="card.versoMediaType?.startsWith('video/')"
                          >
                            mdi-filmstrip
                          </v-icon>
                          <v-icon
                            v-bind="props"
                            v-else-if="card.versoMediaType?.startsWith('audio/')"
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
    </template>
  </div>
</template>

<style lang="scss" scoped>
.container {
  margin: 0 auto;
  max-width: 1000px;
  width: 80%;
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
