<script lang="ts" setup>
  import Category from "@/models/category"
  import { useCounterStore } from '@/store/counter';
  
  const counter = useCounterStore()
  
  Category.findAll({
    where: {
      createdAt: {
        $lt: new Date("2023-03-13 17:10")
      }
    }
  }).then(category => {
    console.log(category)
  })

</script>

<template>
  <v-container class="fill-height">
    <v-responsive class="d-flex align-center text-center fill-height">
      <v-row align="center" justify="center">
        <v-col cols="12">
          <h1 class="display-1 font-weight-light mb-4">
            {{ counter.count }}
          </h1>
          <v-btn color="primary" @click="counter.increment">
            Increment
          </v-btn>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>
