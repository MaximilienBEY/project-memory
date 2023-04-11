<script setup lang="ts">
import { computed, ref, watchEffect } from "vue"

import Questions from "@/components/Questions.vue"
import Card from "@/models/card"
import { useCardStore } from "@/store/card"
import { SelectedType, StudyFormatedCategory } from "@/types/study"
import { shuffleArray } from "@/utils/array"

const cardStore = useCardStore()

const selectedRef = ref<SelectedType[]>([])
const selectedCards = ref<Card[] | null>(null)

const finishRef = ref(false)
const correctCards = ref<Card[]>([])
const wrongCards = ref<Card[]>([])

const formatedCategories = computed(() => {
  return cardStore.listByCategories.map(({ category, themes }): StudyFormatedCategory => {
    return {
      category,
      themes: themes
        .map(({ theme, cards }) => {
          const selected = selectedRef.value.find(({ themeId }) => themeId === theme.id)
          if (!selected) return null
          const selectedCards = cards
            .slice(0, selected.index)
            .sort((a, b) => a.streakTime - b.streakTime)
            .map(({ card }) => card)
          const unselectedCards = cards
            .slice(selected.index)
            .sort((a, b) => a.streakTime - b.streakTime)
            .map(({ card }) => card)
          return {
            theme,
            cards: {
              selected: selectedCards,
              unselected: unselectedCards,
            },
          }
        })
        .filter(Boolean),
    }
  })
})
const submitDisabled = computed(() => {
  return !formatedCategories.value.flatMap(({ themes }) =>
    themes.flatMap(({ cards }) => cards.selected),
  ).length
})

const handleChangeCount = (themeId: number, type: "minus" | "plus") => {
  const selected = selectedRef.value.find((theme) => theme.themeId === themeId)
  if (!selected) return

  const index = selected.index + (type === "minus" ? -1 : 1)
  if (index < 0 || index > selected.total) return

  selected.index = index
}
const handleSubmit = () => {
  const cards = formatedCategories.value.flatMap(({ themes }) =>
    themes.flatMap(({ cards }) => cards.selected),
  )
  const shuffledCards = shuffleArray(cards)
  selectedCards.value = shuffledCards
}
const handleFinish = ({ correct, failed }: { correct: Card[]; failed: Card[] }) => {
  correctCards.value = correct
  wrongCards.value = failed
  finishRef.value = true
}
const handleRetry = () => {
  selectedCards.value = wrongCards.value

  wrongCards.value = []
  correctCards.value = []
  finishRef.value = false
}

watchEffect(() => {
  selectedRef.value = cardStore.listByCategories.reduce((r: SelectedType[], category) => {
    return [
      ...r,
      ...category.themes.map(
        ({ theme, toReviewCount, cards }): SelectedType => ({
          themeId: theme.id,
          index: toReviewCount,
          total: cards.length,
        }),
      ),
    ]
  }, [])
})
</script>

<template>
  <div class="container mt-4 mt-md-8 mt-lg-12 mt-xl-16">
    <template v-if="finishRef">
      <h3 class="text-h4 font-weight-medium">
        Score: {{ correctCards.length }} / {{ selectedCards?.length }}
      </h3>
      <p class="text-body-1 mt-2 mt-md-4">
        The streak time of the cards you got wrong will be reset to 0. The cards you got
        right will have their streak time increased. <br />
        You can retry the cards you got wrong by clicking on the "Review" button.
      </p>
      <v-btn
        class="mt-4 mt-md-8"
        color="primary"
        size="large"
        @click="handleRetry"
        :disabled="!wrongCards.length"
      >
        Review
      </v-btn>
    </template>
    <Questions v-else-if="selectedCards" :cards="selectedCards" @finish="handleFinish" />
    <template v-else>
      <h3 class="text-h4 font-weight-medium">Start a study session</h3>
      <p class="text-body-1 mt-2 mt-md-4">
        Start a study session by selecting the number of cards you want to review for each
        theme. <br />
        By default, the number of cards you want to review is set to the number of cards
        you need to review.
      </p>
      <div class="category-list">
        <div v-for="category in formatedCategories" v-bind:key="category.category.id">
          <h4 class="text-h5 font-weight-medium">{{ category.category.title }}</h4>
          <ul class="theme-list">
            <li v-for="theme in category.themes" v-bind:key="theme.theme.id">
              <h6 class="text-h6 font-weight-regular">{{ theme.theme.title }}</h6>
              <div class="selection-container">
                <v-btn
                  size="small"
                  icon
                  variant="text"
                  @click="() => handleChangeCount(theme.theme.id, 'minus')"
                >
                  <v-icon>mdi-minus</v-icon>
                </v-btn>
                <span>
                  {{ theme.cards.selected.length }} /
                  {{ theme.cards.selected.length + theme.cards.unselected.length }}
                </span>
                <v-btn
                  size="small"
                  icon
                  variant="text"
                  @click="() => handleChangeCount(theme.theme.id, 'plus')"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </div>
            </li>
          </ul>
        </div>
        <v-btn
          class="mt-4 mt-md-8"
          color="primary"
          size="large"
          @click="handleSubmit"
          :disabled="submitDisabled"
        >
          Start
        </v-btn>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.container {
  margin: 0 auto;
  max-width: 800px;
  width: 80%;
}
.category-list {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  & > div {
    h4 {
      margin-bottom: 12px;
      text-decoration: underline;
    }
    .theme-list {
      display: flex;
      flex-direction: column;
      list-style: none;
      margin-left: 32px;
      row-gap: 8px;
      & > li {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: rgba(var(--v-theme-primary), 1);
        &::before {
          position: absolute;
          content: "";
          left: -8px;
          top: 50%;
          transform: translateY(-50%) translateX(-100%);
          height: 6px;
          width: 6px;
          border-radius: 50%;
          background: currentColor;
        }
        .selection-container {
          display: flex;
          align-items: center;
          column-gap: 8px;
        }
      }
    }
  }
}
</style>
