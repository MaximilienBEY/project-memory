import Card from "@/models/card"
import Category from "@/models/category"
import Theme from "@/models/theme"

export interface MediaInterface {
  data: Uint8Array
  url: string
  type: string
  name: string
}

export interface CardsByCategory {
  category: Category
  themes: {
    theme: Theme
    cards: {
      toReview: { card: Card; streakTime: number }[]
      anticipated: { card: Card; streakTime: number }[]
    }
  }[]
}
