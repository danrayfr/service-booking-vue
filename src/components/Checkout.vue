<template>
  <div>
    <div class="flex items-center justify-between pb-6 border-b mb-6">
      <h1 class="text-5xl font-bold text-gray-700">Checkout</h1>
    </div>

     <div>
      <h2>Service</h2>
      <ul>
        <li><strong>Name:</strong> {{ name }} </li>
        <li><strong>Price:</strong> {{ price }}</li>
        <li><strong>Booked date:</strong> {{ date }}</li>
        <li><strong>Booked time:</strong> {{ bookedTime }}</li>
        <li><strong>Booked Slot(s):</strong> {{ bookedSlot }}</li>
        <li><strong>Payment Method</strong> {{ paymentMethod }}</li>
      </ul>
    </div>

    <div>
      <h2>User Information:</h2>
      <ul>
        <li><strong>Name:</strong> {{ user.firstName }} {{ user.lastName }}</li>
        <li><strong>Email:</strong> {{ user.email }}</li>
        <li><strong>Mobile:</strong> {{ user.mobile }}</li>
      </ul>
    </div>

    <div>
      <h2>Address Information:</h2>
      <ul>
        <li><strong>Street:</strong> {{ billing.address.street }}</li>
        <li><strong>Barangay:</strong> {{ billing.address.barangay }}</li>
        <li><strong>City:</strong> {{ billing.address.city }}</li>
        <li><strong>Province:</strong> {{ billing.address.province }}</li>
        <li><strong>Postal Code:</strong> {{ billing.address.zipcode }}</li>
      </ul>
    </div>
  </div>

  <div>
    <button class="login" type="submit" @click="next">Next</button>
  </div>
</template>
<script setup>
import { onBeforeMount, computed, defineProps } from "vue"

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  nextStepFunction: {
    type: Function,
    required: true
  }
})

function next() {
  props.nextStepFunction()
}

const items = computed(() => {
  const keys = Object.keys(localStorage)
  return keys.map(key => ({ key, value: localStorage.getItem(key) }))
})

let user = {};
let billing = {};
let method = "";
let bookedTime = {}
let bookedSlot = {}

const paymentMethod = computed(() => { 

  if (method === "1") 
    return "Bank"
  else if(method === "2")
    return "GCash"
  else if(method === "3")
    return "COD"
  else if(method === "4")
    return "Pay at the Store"
  else
    return "Unknown Payment Method"
  
});

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