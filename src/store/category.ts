// Utilities
import { defineStore } from "pinia"
import { onMounted, ref } from "vue"

import Category from "@/models/category"

export const useCategoryStore = defineStore("category", () => {
  const loadingRef = ref(true)
  const categoriesRef = ref<Category[]>([])
  const newOpenRef = ref(false)

  const deleteRef = ref<Category | null>(null)
  const deleteOpenRef = ref(false)

  const editRef = ref<Category | null>(null)
  const editOpenRef = ref(false)

  const openNewCategory = () => {
    newOpenRef.value = true
  }
  const newCategory = async ({
    title,
    description,
  }: {
    title: string
    description?: string
  }) => {
    const category = await Category.create({ title, description })
    categoriesRef.value.push(category)
    newOpenRef.value = false
  }

  const openDeleteCategory = (category: Category) => {
    deleteRef.value = category
    deleteOpenRef.value = true
  }
  const deleteCategory = async (category: Category) => {
    await category.destroy()
    categoriesRef.value = categoriesRef.value.filter((c) => c.id !== category.id)
    deleteRef.value = null
    deleteOpenRef.value = false
  }

  const openEditCategory = (category: Category) => {
    editRef.value = category
    editOpenRef.value = true
  }
  const editCategory = async (
    category: Category,
    { title, description }: { title: string; description?: string },
  ) => {
    await category.update({ title, description })
    categoriesRef.value = categoriesRef.value.slice()
    editRef.value = null
    editOpenRef.value = false
  }

  onMounted(async () => {
    loadingRef.value = true
    const categories = await Category.findAll()
    categoriesRef.value = categories
    loadingRef.value = false
  })

  return {
    loading: loadingRef,
    list: categoriesRef,

    newOpen: newOpenRef,
    openNew: openNewCategory,
    new: newCategory,

    deleteCategory: deleteRef,
    deleteOpen: deleteOpenRef,
    openDelete: openDeleteCategory,
    delete: deleteCategory,

    editCategory: editRef,
    editOpen: editOpenRef,
    openEdit: openEditCategory,
    edit: editCategory,
  }
})
