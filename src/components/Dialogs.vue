<script setup lang="ts">
import DeleteCard from "./dialogs/card/Delete.vue"
import EditCard from "./dialogs/card/Edit.vue"
import NewCard from "./dialogs/card/New.vue"
import DeleteCategory from "./dialogs/category/Delete.vue"
import EditCategory from "./dialogs/category/Edit.vue"
import NewCategory from "./dialogs/category/New.vue"
import DeleteTheme from "./dialogs/theme/Delete.vue"
import EditTheme from "./dialogs/theme/Edit.vue"
import NewTheme from "./dialogs/theme/New.vue"
</script>

<template>
  <NewCategory />
  <DeleteCategory />
  <EditCategory />

  <NewTheme />
  <DeleteTheme />
  <EditTheme />

  <NewCard />
  <DeleteCard />
  <EditCard />
</template>

<style lang="scss">
.v-dialog .v-overlay__content {
  max-width: 1000px;
  width: 80%;
  .v-card {
    padding: 16px;
  }
}
.card-title-container {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  padding: 8px 16px;
  & > span,
  & > h6 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
}
.card-description-container {
  padding: 0px 16px 12px 16px;
}
</style>
