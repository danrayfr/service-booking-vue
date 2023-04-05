<template>
  <div class="flex items-center justify-between pb-6 border-b mb-6">
    <h1 class="text-5xl font-bold text-gray-700">Submit Booking</h1>
  </div>

  <div>
    <form action="" method="POST" @submit.prevent="book">
      <div>
        <button class="login" type="submit" :disabled="hasAdded">Submit</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router' 
import { useMutation } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import { ref, computed, defineProps, onBeforeMount } from 'vue';

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const error = ref([])
const router = useRouter()
const hasAdded = ref(false)

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

  const variables = {
    bookedTime: bookedTime,
    slot: bookedSlot, 
    serviceId: props.id,
    paymentId: method,
    billingId: billing.id
  }

  hasAdded.value = true
  
  try { 
    const { data } = await createBook(variables);
    
    const booking = computed(() => data.createBook?.booking ?? []);
    error.value = computed(() => data.createBook?.errors ?? []);

    console.log(booking.value)

    if (booking.value ) {
      router.push({ name: 'home' })
    }

    hasAdded.value = false
    return booking, error.value

  } catch(e) { 
    error.value = e.message || 'An unknown error occurred';
  } finally { 
    hasAdded.value = false
  }
};

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
