<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex flex-wrap -mx-4">
      <div class="w-full md:w-1/2 lg:w-2/3 px-4">
        <div class="bg-white rounded-lg shadow-md p-8">
          <h2 class="text-lg font-semibold mb-6">Cart Item(s)</h2>
          <div v-for="item in items" :key="item.id">
            <CartItem :item="item"/>
          </div>
        </div>
      </div>
      <div class="w-full md:w-1/2 lg:w-1/3 px-4">
        <div class="bg-white rounded-lg shadow-md p-8">
          <h2 class="text-lg font-semibold mb-6">Order Summary</h2>
          <p class="text-gray-600">Total: {{ cartTotal }}</p>
            <router-link :to="{ name: 'checkout' }">
              <button class="mt-6 w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded">
                Proceed to Checkout
              </button>
            </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// components
import CartItem from "@/components/CartItem"
// plugins
import { ref, defineProps, computed } from "vue"

const props = defineProps({
  items: {
    type: Object,
    required: true
  }
});

// Compute cart total by summing up the costs of all items in the cart
const cartTotal = computed(() => {
  let total = 0;
  for (const item of props.items) {
    total += item.service.price * item.slot;
  }
  return total;
});

</script>