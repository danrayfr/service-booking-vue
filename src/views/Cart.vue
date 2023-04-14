<template>
  <div class="flex items-center justify-between pb-6 border-b">
    <h1 class="text-5xl font-bold text-gray-700">Cart</h1>
  </div>
  <div v-if="loading">loading...</div>
  <div v-if="error">{{error}}</div>
  <div v-else>
    <CartItems :items="cartItems"/>
  </div>
</template>

<script setup>
// Components
import CartItems from "@/components/CartItems"

// plugins
import { useQuery } from '@vue/apollo-composable'
import { gql } from "graphql-tag";
import { computed } from "vue";

const CURRENT_USER_CART = gql`
  query CART_ITEM {
    cartItems { 
      id
      bookedTime
      slot
      service {
        name
        image
        price
        availableDate
      }
    }
  }
`;

const { result, error, loading } = useQuery(CURRENT_USER_CART);
const cartItems = computed(() => result.value?.cartItems ?? []);

console.log(cartItems)

</script>

<style scoped>

</style>