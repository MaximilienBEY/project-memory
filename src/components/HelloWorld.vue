<script lang="ts" setup>
  import { useCounterStore } from '@/store/counter';
  import User from "@/models/User"
  
  const counter = useCounterStore()
  User.create({
    name: Math.random().toString(),
    email: "bey.maximilien@gmail.com",
    password: "123456"
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
