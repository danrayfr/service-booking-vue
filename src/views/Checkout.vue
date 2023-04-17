<template>
  <div class="flex items-center justify-between pb-6 border-b">
    <h1 class="text-5xl font-bold text-gray-700">Checkout</h1>
  </div>
  <div v-if="loading">loading...</div>
  <div v-if="error">{{error}}</div>
  <div v-else>
  <div class="h-screen grid grid-cols-3">
        <div class="lg:col-span-2 col-span-3 bg-indigo-50 space-y-8 px-12">
            <div class="mt-8 p-4 relative flex flex-col sm:flex-row sm:items-center bg-white shadow rounded-md">
                <div class="flex flex-row items-center border-b sm:border-b-0 w-full sm:w-auto pb-4 sm:pb-0">
                    <div class="text-yellow-500">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 sm:w-5 h-6 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div class="text-sm font-medium ml-3">Checkout</div>
                </div>
                <div class="text-sm tracking-wide text-gray-500 mt-4 sm:mt-0 sm:ml-4">Complete your shipping and payment details below.</div>
                <div class="absolute sm:relative sm:top-auto sm:right-auto ml-auto right-4 top-4 text-gray-400 hover:text-gray-800 cursor-pointer">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </div>
            </div>
            <div class="rounded-md">
                <!-- Checkout Billing Component -->
                <CheckoutBilling v-if="step === 1 || step === 2" :nextStepFunction="nextStep"/>
            </div>
            <div class="rounded-md">
                <!-- Checkout Payment Option Component -->
                <PaymentOption v-if="step === 2" :nextStepFunction="nextStep" />
            </div>
            <div class="rounded-md">
                <!-- Checkout Information -->
                <CheckoutInformation  v-if="step === 3" :nextStepFunction="nextStep" :cartItems="cartItems"/>
                <CompleteBooking v-if="step === 3" :cartItems="cartItems" :grandTotal="grandTotal"/>
            </div>
            <div class="rounded-md">
            </div>
        </div>
        <div class="col-span-1 bg-white lg:block hidden">
            <h1 class="py-6 border-b-2 text-xl text-gray-600 px-8">Order Summary</h1>
            <ul v-for="item in cartItems" :key="item.id" class="py-6 border-b space-y-6 px-8">
                <li class="grid grid-cols-6 gap-2 border-b-1">
                    <div class="col-span-1 self-center">
                        <img :src=" (item.service.image)" alt="Product" class="rounded w-full">
                    </div>
                    <div class="flex flex-col col-span-3 pt-2">
                        <span class="text-gray-600 font-bold uppercase text-md font-semi-bold">{{ item.service.name }}</span>
                        <span class="text-gray-400 text-sm inline-block pt-2">{{ item.service.availableDate }} </span>
                        <span class="text-gray-400 text-sm inline-block pt-2">{{ item.slot }} booked slot(s)</span>
                    </div>
                    <div class="col-span-2 pt-3">
                        <div class="flex items-center space-x-2 text-sm justify-between">
                            <span class="text-gray-400">{{ item.slot}} x ₱{{item.service.price}}</span>
                            <span class="text-sky-400 font-semibold inline-block">{{ item.slot * item.service.price }}</span>
                        </div>
                    </div>
                </li>
            </ul>
            <div class="px-8 border-b">
                <div class="flex justify-between py-4 text-gray-600">
                    <span>Subtotal</span>
                    <span class="font-semibold text-sky-500">₱{{ grandTotal }}</span>
                </div>
                <div class="flex justify-between py-4 text-gray-600">
                    <span>Shipping</span>
                    <span class="font-semibold text-sky-500">Free</span>
                </div>
            </div>
            <div class="font-semibold text-xl px-8 flex justify-between py-8 text-gray-600">
                <span>Total</span>
                <span>₱{{ grandTotal }}</span>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
// Components
import CheckoutBilling from "@/components/CheckoutBilling"
import PaymentOption from "@/components/CheckoutPaymentOption"
import CheckoutInformation from "@/components/CheckoutInformation"
import CompleteBooking from "@/components/CompleteBooking"

// plugins
import { useQuery } from '@vue/apollo-composable'
import { gql } from "graphql-tag";
import { ref, computed } from "vue";

const step = ref(1)

const nextStep = () => {
  if (step.value < 5 ) {
    step.value++;
  }
}

const CURRENT_USER_CART = gql`
  query CART_ITEM {
    cartItems { 
      id
      bookedTime
      slot
      service {
        id
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

// Refactor later into composables || mixins

function getImageUrl(image) {
  return "https://service-booking.onrender.com/" + image;
}

const grandTotal = computed(() => {
  return cartItems.value.reduce((total, item) => { 
    return total + (item.service.price * item.slot)
  }, 0)
});

console.log(grandTotal.value)

</script>