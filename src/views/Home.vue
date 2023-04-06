<script lang="ts" setup>
import { useCardStore } from "@/store/card"

const cardStore = useCardStore()
</script>

<template>
  <div class="container mt-4 mt-md-8 mt-lg-12 mt-xl-16">
    <h3 class="text-h4 font-weight-medium">Your personal trainer</h3>
    <template v-if="cardStore.loading">
      <div class="d-flex justify-center mt-2">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>
    </template>
    <template v-else>
      <p class="text-body-1 mt-2 mt-md-4">
        <template v-if="!!cardStore.toReviewCount">
          You have
          <b>
            {{ cardStore.toReviewCount }}
            <template v-if="cardStore.toReviewCount > 1">cards</template>
            <template v-else>card</template>
          </b>
          to review right now. Click on the button below to select the category, theme and
          number of card you want to review.
        </template>
        <template v-else>
          You don't have cards to review right now. Consider creating categories, themes
          and cards. <br />
          Don't worry you can still start a study session with your actual cards.
        </template>
      </p>
      <v-btn
        class="mt-4 mt-md-6 mt-lg-8"
        width="100%"
        prepend-icon="mdi-brain"
        variant="flat"
        color="primary"
        size="x-large"
        to="/study"
      >
        Start a study session
      </v-btn>
    </template>
  </div>
</template>

<style scoped lang="scss">
.container {
  margin: 0 auto;
  max-width: 800px;
  width: 80%;
}
</style>
