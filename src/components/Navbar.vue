<script setup lang="ts">
import { ref } from "vue"

const drawer = ref(false)
</script>

<template>
  <v-navigation-drawer v-model="drawer" temporary location="right">
    <v-list density="compact" nav>
      <v-list-item
        :active="false"
        title="Categories"
        value="categories"
        to="/categories"
      ></v-list-item>
      <v-list-item
        :active="false"
        title="Themes"
        value="themes"
        to="/themes"
      ></v-list-item>
      <v-list-item :active="false" title="Cards" value="cards" to="/cards"></v-list-item>
    </v-list>
  </v-navigation-drawer>
  <v-app-bar>
    <v-app-bar-title class="text-body-1 text-sm-h6 font-weight-bold">
      <router-link to="/">Project Memory</router-link>
    </v-app-bar-title>

    <template v-slot:append>
      <ul class="mr-4 mr-md-8 mr-lg-16 font-weight-medium app-bar-links d-none d-sm-flex">
        <li>
          <v-btn to="/categories" class="text-subtitle-1" :active="false">
            Categories
          </v-btn>
        </li>
        <li>
          <v-btn to="/themes" class="text-subtitle-1" :active="false">Themes</v-btn>
        </li>
        <li>
          <v-btn to="/cards" class="text-subtitle-1" :active="false">Cards</v-btn>
        </li>
      </ul>
      <v-btn color="primary" variant="flat" to="/study" :active="false">
        Start a revision
      </v-btn>
      <v-btn
        class="d-block d-sm-none ml-2"
        size="small"
        icon
        variant="text"
        @click="() => (drawer = true)"
      >
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </template>
  </v-app-bar>
</template>

<style lang="scss">
a {
  color: inherit;
  text-decoration: none;
}
.app-bar-links {
  list-style: none;
  margin: 0;
  padding: 0;
  li a {
    padding: 8px;
    @media (max-width: 600px) {
      padding: 4px;
    }
  }
}
</style>
