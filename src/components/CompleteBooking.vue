<template>
  <div>
    <form action="" method="POST" @submit.prevent="book">
      <button class="submit-button px-4 py-3 rounded-full bg-sky-400 text-white focus:ring focus:outline-none w-full text-xl font-semibold transition-colors" :disabled="hasAdded">
        Pay ₱{{ grandTotal}}
      </button>
    </form>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router' 
import { useMutation } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import { ref, computed, defineProps, onBeforeMount } from 'vue';

const props = defineProps({
  cartItems: {
    type: Object, 
    required: true
  },
  grandTotal: {
    type: Number,
    required: true
  }
});

// Compute cart total by summing up the costs of all items in the cart
const serviceID = computed(() => {
  let id;
  for (const cartItem of props.cartItems) {
    id = cartItem.service.id
  }
  return id;
});
console.log(serviceID)

const error = ref([])
const router = useRouter()
const hasAdded = ref(false);

const BOOKING_MUTATION = gql`
mutation BOOK_A_SERVICE($bookedTime: String!, $slot: Int!, $serviceId: ID!, $paymentId: ID!, $billingId: ID!) {
  createBook(input: {
    bookedTime: $bookedTime,
    slot: $slot,
    serviceId: $serviceId,
    paymentId: $paymentId, 
    billingId: $billingId
  }) {
    booking {
      id
      status
      bookedTime
      slot
      service {
        name
        description
        image
      }
    }
  }
}
`;

const { mutate: createBook, loading } = useMutation(BOOKING_MUTATION);

const book = async() => {    
  hasAdded.value = true;
  try {
    // Loop through each item in cartItems and book them
    for (const cartItem of props.cartItems) {
      const variables = {
        bookedTime: cartItem.bookedTime,
        slot: cartItem.slot,
        serviceId: cartItem.service.id,
        paymentId: method,
        billingId: billing.id
      };

      const { data } = await createBook(variables);
      const booking = data.createBook?.booking ?? [];
      error.value = data.createBook?.errors ?? [];

      console.log(booking);

      if (!booking) {
        hasAdded.value = false;
        return;
      }
    }
    // Route to home page after booking all items
    router.push({ name: 'home' });
  } catch(e) { 
    error.value = e.message || 'An unknown error occurred';
  } finally { 
    hasAdded.value = false
  }
};

// Loop through cartItems to get serviceId, slot, and bookedTime
const cartItems = computed(() => props.cartItems ?? []);
const serviceIds = computed(() => cartItems.value.map(item => item.serviceId));
const slots = computed(() => cartItems.value.map(item => item.slot));
const bookedTimes = computed(() => cartItems.value.map(item => item.bookedTime));

console.log(serviceIds, slots, bookedTimes, cartItems);

const items = computed(() => {
  const keys = Object.keys(localStorage)
  return keys.map(key => ({ key, value: localStorage.getItem(key) }))
})

let user = {};
let billing = {};
let method = {};
let bookedTime = {}
let bookedSlot = {}

onBeforeMount(() => {
  // Loop through all items in localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);

    if (key === "user") {
      user = JSON.parse(value);
    }

    if (key == "billing") {
      billing = JSON.parse(value)
    }

    if (key == "paymentID") {
      method = JSON.parse(value)
    }

    if (key == "bookedTime") {
      bookedTime = JSON.parse(value)
    }

    if (key == "bookedSlot") {
      bookedSlot = JSON.parse(value)
    }

  }

});


</script>

<style scoped>
button[disabled] { 
  border: 1px solid #999999;
  background-color: #cccccc;
  color: #666666;
  cursor: not-allowed !important;
}
</style>
