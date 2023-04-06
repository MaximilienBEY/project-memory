import Card from "@/models/card"
import Category from "@/models/category"
import Theme from "@/models/theme"

export type SelectedType = { themeId: number; index: number; total: number }

export type StudyFormatedCategory = {
  category: Category
  themes: {
    theme: Theme
    cards: {
      selected: Card[]
      unselected: Card[]
    }
  }[]
}
