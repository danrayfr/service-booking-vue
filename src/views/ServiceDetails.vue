<template>
  <div class="flex items-center justify-between pb-6 border-b mb-6">
    <h1 class="text-5xl font-bold text-gray-700">{{ service.name }}'s service</h1>
  </div>

            
  <div class="mx-auto max-w-3xl p-8 grow mb-6">
    <div>
      <h2 class="text-gray-800 text-5xl mb-2"></h2>
      <span class="bg-yellow-200 text-yellow-800 text-xs px-2 inline-block rounded-full  uppercase font-semibold tracking-wide">
       
      </span>
      <p class="font-weight-900">Available on
      <span datetime="Sat Oct 08 2016 19:00:00 GMT-0500 (Central Daylight Time)"> {{formattedTime}} </span>.
      </p>
      <div class="content post mb-6 mt-6">
        <div class="mb-6">
          <img :src="image" class="h-96 w-96 object-cover rounded-lg shadow-md">
        </div>
        <p class="text-gray-900 font-bold text-xl mb-2"><span class="text-gray-700 text-md font-normal">Price: </span>₱ {{service.price}}</p>
        <div class="">
          <p v-html="service.description"></p>
        </div>
      </div>
    </div>
    
  <div class="border border-gray-300 rounded-lg p-4 mb-6">
    <div class="flex items-center mb-2">
      <div class="text-gray-500 mr-2">
        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M2.5 4a.5.5 0 01.5-.5h1A1.5 1.5 0 004.5 3h11a1.5 1.5 0 011.5 1.5v11a1.5 1.5 0 01-1.5 1.5h-11a1.5 1.5 0 00-1.5 1.5v1a.5.5 0 01-1 0v-1A2.5 2.5 0 012.5 15v-11zM16 6.5a.5.5 0 01.5.5v7a.5.5 0 01-.5.5h-7a.5.5 0 01-.5-.5v-7a.5.5 0 01.5-.5h7zM3 5h9v9H3V5z" clip-rule="evenodd" />
        </svg>
      </div>
      <h2 class="text-lg font-medium text-gray-900"> </h2>
    </div>
  <div>
    <div v-for="slot in service.availableSlots" :key="slot.id" class="flex items-center">
      <div class="flex-1">
      
        <div class="text-sm font-medium text-gray-500">Start Time</div>
        <div class="text-lg font-bold text-gray-900 mb-2">{{ convertTime(slot.start_time) }}</div>
      </div>
      <div class="flex-1">
        <div class="text-sm font-medium text-gray-500">End Time</div>
        <div class="text-lg font-bold text-gray-900 mb-2">{{ convertTime(slot.end_time) }}</div>
      </div>
      <div class="flex-1">
        <div class="text-sm font-medium text-gray-500">Available Slot</div>
        <div class="text-lg font-bold text-gray-900 mb-2">{{ slot.slots }}</div>
      </div>
    </div>
  </div>
  </div>
    <div v-if="!isBook">
      <button @click="startBooking" class="mt-4 text-xl w-full text-white bg-sky-600 hover:bg-sky-700 py-2 roundedw shadow-lg">Book a service</button>
      <button @click="addToCart({ service })" class="mb-6 mt-4 text-xl w-full text-white bg-sky-600 hover:bg-sky-700 py-2 roundedw shadow-lg">Add to Cart</button>
    </div>
    
    <div v-if="isBook">
    <div v-if="step === 1">
      <Book :availableSlots="service.availableSlots" :nextStepFunction="nextStep" />
    </div>
    <div v-else-if="step === 2">
      <Billing :nextStepFunction="nextStep" />
    </div>
    <div v-else-if="step === 3">
      <Payment :nextStepFunction="nextStep" />
    </div>
    <div v-else-if="step === 4">
      <Checkout :name="service.name" :price="service.price" :date="service.availableDate" :nextStepFunction="nextStep"/>
    </div>
    <div v-else-if="step === 5">
      <Booking :id="service.id"/>
    </div>
    <div v-else>
      <p>You will received a receipt via email.</p>
    </div>
  </div>
  </div>

</template>

<script setup>
import Billing from "@/components/Billing"
import Payment from "@/components/PaymentMethod"
import Book from "@/components/Book"
import Checkout from "@/components/Checkout"
import Booking from "@/components/Booking"

import { ref, defineProps, computed, onMounted, defineEmits } from "vue";
import { useQuery } from '@vue/apollo-composable'
import { gql } from "graphql-tag";

const props = defineProps({
  id: { 
    type: String,
    required: true
  }
});

const step = ref(1)
const isBook = ref(false)

const cartItems = ref([])
const storedService = ref(JSON.parse(localStorage.getItem('service')))

const QUERY_SERVICE_BY_ID = gql`
  query serviceDetails($id: ID!) {
    service(id: $id) {
      id
      slug
      name
      description
      image
      price
      availableDate
      availableSlots
      category {
        name
      }
    }
  }
  `;

const variables = { 
  id: props.id,
}

const { result, error, loading } = useQuery(QUERY_SERVICE_BY_ID, variables );
const service = computed(() => result.value?.service ?? []);

const image = computed(() => {
  return "http://127.0.0.1:3000" + service.value.image;
});

const category = computed(() => {
  return service.value.category.name 
});

const formattedTime = computed(() => { 
  const dateTime = new Date(service.value.availableDate);
  const options = { 
    year: "numeric",
    month: "long",  
    day: "numeric",
  };

  return dateTime.toLocaleString("en-US", options);
});

const convertTime = (timeStr) => {
  const date = new Date(`1970-01-01T${timeStr}`)
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, hourCycle: 'h12' });
}

const addToCart = (service) => {
  // Get existing cart items list from local storage
  const existingCartItems = localStorage.getItem('cartItems');

  // If there are existing cart items, parse them from JSON to an array
  let cartItemsArray = existingCartItems ? JSON.parse(existingCartItems) : [];

  // Push the new item to the array
  cartItemsArray.push(service);

  // Stringify the updated array
  const updatedCartItems = JSON.stringify(cartItemsArray);

  // Set the updated stringified array back to local storage
  localStorage.setItem('cartItems', updatedCartItems);
};

const getCartItems = () => {
  const cartItems = localStorage.getItem('cartItems');
  if (cartItems) {
    this.cartItems = JSON.parse(cartItems);
  }
}

// Load cart items from local storage on mount
onMounted(() => {
  const savedCartItems = localStorage.getItem('cartItems');
  if (savedCartItems) {
    cartItems.value = JSON.parse(savedCartItems);
  }
});

// Computed property to get cart count
const cartCount = computed(() => {
  return cartItems.value.length;
});


const nextStep = () => {
  if (step.value < 5 ) {
    step.value++;
  }
}

const startBooking = () => { 
  isBook.value = true;
}

</script>