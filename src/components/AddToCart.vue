<template>
  <div class="flex items-center justify-between pb-6 border-b mb-6">
    <h1 class="text-5xl font-bold text-gray-700">Add service to cart</h1>
  </div>

  <div>
    <form action="" method="POST" @submit.prevent="add">
    <label class="block mb-2 text-sm font-medium text-gray-700">Select a time</label>
      <select v-model="selectedTime" class="bg-gray-50 border border-gray-300 text-gray-900 mb-6 text-sm rounded focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5">
      <option v-for="slot in slots" :key="slot.id" :value="slot.start_time">
        {{ convertTime(slot.start_time) }} - {{ convertTime(slot.end_time) }}
      </option>
    </select>
      <div class="mb-6">
        <label class="block mb-2 text-sm font-medium text-gray-700">Slot</label>
        <input type="number" v-model="bookedSlot" placeholder="Please enter how many slot you want to book." class="bg-gray-50 border border-gray-300 text-gray-900 mb-6 text-sm rounded focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5">
      </div>
      <div>
        <button class="login" type="submit" :disabled="cartAdded">Add to Cart</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, defineProps, computed, defineEmits } from "vue";
import { useMutation } from '@vue/apollo-composable';
import { gql } from "graphql-tag";

const props = defineProps({
  id: { 
    type: String,
    required: true
  },
  availableSlots: {
    type: Object,
    required: true
  }
});

const selectedTime = ref('')
const bookedSlot = ref('')
const cartAdded = ref(false)
const error = ref([])
const { emit } = defineEmits(['nextStep'])

const slots = computed(() => props.availableSlots )
const service = computed(() => props.id )
console.log("Available Time Slot:", slots.value)

const convertTime = (timeStr) => {
  const date = new Date(`1970-01-01T${timeStr}`)
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, hourCycle: 'h12' });
}

const CART_MUTATION = gql`
  mutation ADD_TO_CART($serviceId: ID!, $slot: Int!, $bookedTime: String!) {
    addToCart(input: {
      serviceId: $serviceId,
      slot: $slot, 
      bookedTime: $bookedTime
    }) {
      cartItems {
        id
        bookedTime
        slot
        service {
          name
          availableDate
        }
        cart {	
          id
          user {
            email
          }
        }
      }
      errors
    }
  }
`;

const { mutate: addToCart, loading } = useMutation(CART_MUTATION);

const add = async() => {
  const time = computed(() => selectedTime.value )
  const timePattern = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timePattern.test(selectedTime.value)) {
    // Show an error message or take appropriate action for invalid input
    console.error("Invalid bookedTime format. Expected format: HH:MM", selectedTime.value);
    return;
  }
  
  cartAdded.value = true
  
  const variables = {
    bookedTime: time.value,
    slot: bookedSlot.value, 
    serviceId: props.id
  }


  try { 
    const { data } = await addToCart(variables);
    
    const cartItems = computed(() => data.addToCart?.cartItems ?? []);
    error.value = computed(() => data.createBook?.errors ?? []);

    console.log(cartItems.value)

    // if (cartItems.value ) {
    //   router.push({ name: 'home' })
    // }

    cartAdded.value = false
    return cartItems, error.value

  } catch(e) { 
    error.value = e.message || 'An unknown error occurred';
  } finally { 
    cartAdded.value = false
  }


};

const convertTo24HourFormat = (timeStr) => {
  // Step 1: Parse the selectedTime string to a Date object
  const date = new Date(`1970-01-01T${timeStr}`);

  // Step 2: Extract hour and minute values
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Step 3: Convert hour and minute values to strings and pad with leading zeros if necessary
  const hoursStr = hours.toString().padStart(2, '0');
  const minutesStr = minutes.toString().padStart(2, '0');

  // Step 4: Concatenate hour and minute strings with a colon separator
  return `${hoursStr}:${minutesStr}`;
};


</script>

<style scoped>
button[disabled] { 
  border: 1px solid #999999;
  background-color: #cccccc;
  color: #666666;
  cursor: not-allowed !important;
}
</style>
