<script setup lang="ts">
import Dialogs from "./components/Dialogs.vue"
import Navbar from "./components/Navbar.vue"
</script>

<template>
  <v-app>
    <Navbar />
    <Dialogs />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<style lang="scss">
.v-breadcrumbs {
  flex-wrap: wrap;
}
</style>
