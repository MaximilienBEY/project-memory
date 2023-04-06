// Utilities
import { defineStore } from "pinia"
import { computed, onMounted, ref } from "vue"

import Card from "@/models/card"
import Category from "@/models/category"
import Theme from "@/models/theme"
import { CardsByCategory } from "@/types/card"

export const useCardStore = defineStore("card", () => {
  const loadingRef = ref(true)
  const cardsRef = ref<Card[]>([])

  const newRef = ref<Theme | null>(null)
  const newOpenRef = ref(false)

  const deleteRef = ref<Card | null>(null)
  const deleteOpenRef = ref(false)

  const editRef = ref<Card | null>(null)
  const editOpenRef = ref(false)
  const editWithThemeRef = ref(false)

  const openNewCard = (theme?: Theme) => {
    newRef.value = theme ?? null
    newOpenRef.value = true
  }
  const newCard = async (card: Card) => {
    await card.refresh({ includes: [{ model: Theme, includes: [Category] }] })
    cardsRef.value.push(card)
    newOpenRef.value = false
  }

  const openDeleteCard = (card: Card) => {
    deleteRef.value = card
    deleteOpenRef.value = true
  }
  const deleteCard = async (card: Card) => {
    await card.destroy()
    cardsRef.value = cardsRef.value.filter((c) => c.id !== card.id)
    deleteRef.value = null
    deleteOpenRef.value = false
  }

  const openEditCard = (card: Card, withTheme?: boolean) => {
    editRef.value = card
    editOpenRef.value = true
    editWithThemeRef.value = !!withTheme
  }
  const editCard = async () => {
    editRef.value?.refresh({ includes: [{ model: Theme, includes: [Category] }] })
    cardsRef.value = cardsRef.value.slice()
    editRef.value = null
    editOpenRef.value = false
  }

  const answerCard = async (card: Card, correct: boolean) => {
    if (correct) {
      await card.update({
        streak: card.streak ? card.streak + 1 : 1,
        lastStreak: new Date(),
      })
    } else {
      await card.update({
        streak: 0,
        lastStreak: new Date(),
      })
    }
    await card.refresh({ includes: [{ model: Theme, includes: [Category] }] })
    cardsRef.value = cardsRef.value.slice()
  }

  const cardsByCategories = computed(() => {
    const now = new Date().getTime()
    return cardsRef.value
      .reduce((r: CardsByCategory[], card) => {
        const streakTime = !card.streak
          ? 0
          : Math.pow(2, card.streak - 1) * 24 * 3600 * 1000
        const isToReview =
          !card.lastStreak || !card.streak || now - card.lastStreak.getTime() > streakTime
        const index = r.findIndex((f) => f.category.id === card.theme?.categoryId)
        if (index >= 0) {
          const themeIndex = r[index].themes.findIndex((f) => f.theme.id === card.themeId)
          if (themeIndex >= 0) {
            if (isToReview)
              r[index].themes[themeIndex].cards.toReview.push({ card, streakTime })
            else r[index].themes[themeIndex].cards.anticipated.push({ card, streakTime })
          } else {
            r[index].themes.push({
              theme: card.theme,
              cards: {
                toReview: isToReview ? [{ card, streakTime }] : [],
                anticipated: !isToReview ? [{ card, streakTime }] : [],
              },
            })
          }
        } else {
          r.push({
            category: card.theme.category,
            themes: [
              {
                theme: card.theme,
                cards: {
                  toReview: isToReview ? [{ card, streakTime }] : [],
                  anticipated: !isToReview ? [{ card, streakTime }] : [],
                },
              },
            ],
          })
        }
        return r
      }, [])
      .map((category) => {
        return {
          ...category,
          themes: category.themes
            .sort((a, b) =>
              a.theme.title.toLowerCase().localeCompare(b.theme.title.toLowerCase()),
            )
            .map((theme) => {
              const cards = [
                ...theme.cards.toReview.sort((a, b) => a.streakTime - b.streakTime),
                ...theme.cards.anticipated.sort((a, b) => a.streakTime - b.streakTime),
              ]
              return {
                ...theme,
                cards,
                toReviewCount: theme.cards.toReview.length,
              }
            }),
        }
      })
      .sort((a, b) =>
        a.category.title.toLowerCase().localeCompare(b.category.title.toLowerCase()),
      )
  })
  const cardsToReview = computed(() => {
    return cardsByCategories.value.flatMap((category) =>
      category.themes.flatMap((theme) => theme.cards.slice(0, theme.toReviewCount)),
    )
  })
  const cardsToReviewCount = computed(() => {
    return cardsToReview.value.length
  })

  onMounted(async () => {
    loadingRef.value = true
    const cards = await Card.findAll({
      includes: [
        {
          model: Theme,
          includes: [Category],
        },
      ],
    })
    cardsRef.value = cards
    loadingRef.value = false
  })

  return {
    loading: loadingRef,
    list: cardsRef,
    listByCategories: cardsByCategories,
    toReview: cardsToReview,
    toReviewCount: cardsToReviewCount,

    answer: answerCard,

    newCard: newRef,
    newOpen: newOpenRef,
    openNew: openNewCard,
    new: newCard,

    deleteCard: deleteRef,
    deleteOpen: deleteOpenRef,
    openDelete: openDeleteCard,
    delete: deleteCard,

    editCard: editRef,
    editOpen: editOpenRef,
    openEdit: openEditCard,
    edit: editCard,
    editWithTheme: editWithThemeRef,
  }
})
