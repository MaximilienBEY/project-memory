<script setup lang="ts">
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
</template>

<style lang="scss">
.v-dialog .v-overlay__content {
  max-width: 1000px;
  width: 80%;
  .v-card {
    padding: 16px;
  }
}
</style>
