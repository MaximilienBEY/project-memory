<template>
  <v-app-bar>
    <v-app-bar-title class="text-h6 font-weight-bold">
      <router-link to="/">Project Memory</router-link>
    </v-app-bar-title>

    <template v-slot:append>
      <ul class="mr-16 font-weight-medium app-bar-links">
        <li>
          <v-btn to="/categories" class="text-subtitle-1" :active="false"
            >Categories</v-btn
          >
        </li>
      </ul>
      <v-btn color="primary" variant="flat" to="/quiz">Start a quiz</v-btn>
    </template>
  </v-app-bar>
</template>

<style lang="scss">
a {
  color: inherit;
  text-decoration: none;
}
.app-bar-links {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  li a {
    padding: 8px;
  }
}
</style>
