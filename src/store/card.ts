// Utilities
import { defineStore } from "pinia"
import { onMounted, ref } from "vue"

import Card from "@/models/card"
import Theme from "@/models/theme"

export const useCardStore = defineStore("card", () => {
  const loadingRef = ref(true)
  const cardsRef = ref<Card[]>([])

  const newRef = ref<Theme | null>(null)
  const newOpenRef = ref(false)

  const deleteRef = ref<Card | null>(null)
  const deleteOpenRef = ref(false)

  const editRef = ref<Card | null>(null)
  const editOpenRef = ref(false)

  const openNewCard = (theme: Theme) => {
    newRef.value = theme
    newOpenRef.value = true
  }
  const newCard = async () => {
    // const card = await Card.create({ title, description, categoryId })
    // cardsRef.value.push(card)
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

  const openEditCard = (card: Card) => {
    editRef.value = card
    editOpenRef.value = true
  }
  const editCard = async (card: Card) => {
    cardsRef.value = cardsRef.value.slice()
    editRef.value = null
    editOpenRef.value = false
  }

  onMounted(async () => {
    loadingRef.value = true
    const cards = await Card.findAll()
    cardsRef.value = cards
    loadingRef.value = false
  })

  return {
    loading: loadingRef,
    list: cardsRef,

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
  }
})
