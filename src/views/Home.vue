<script lang="ts" setup></script>

<template>
  <div class="container mt-4 mt-md-8 mt-lg-12 mt-xl-16">
    <h4 class="text-h5 font-weight-medium">Your personal trainer</h4>
    <p class="text-body-1 mt-1 mt-md-2">
      You don't have cards to review right now. Consider creating categories, themes and
      cards. <br />
      Don't worry you can still start a review session with your actual cards.
    </p>
    <v-btn
      class="mt-4 mt-md-6 mt-lg-8"
      width="100%"
      prepend-icon="mdi-brain"
      variant="flat"
      color="primary"
      size="x-large"
      to="/quiz"
      >Start a study session</v-btn
    >
  </div>
</template>

<style scoped lang="scss">
.container {
  margin: 0 auto;
  max-width: 800px;
  width: 80%;
}
</style>
