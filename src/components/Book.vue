<template>
  <div class="flex items-center justify-between pb-6 border-b mb-6">
    <h1 class="text-5xl font-bold text-gray-700">Book a slot</h1>
  </div>

  <div>
    <form action="" method="POST" @submit.prevent="book">
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
        <button class="login" type="submit" @click="next">Next</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, defineProps, computed, defineEmits } from "vue";

const props = defineProps({
  availableSlots: {
    type: Object,
    required: true
  },
  nextStepFunction: {
    type: Function,
    required: true
  }
});

const selectedTime = ref('')
const bookedSlot = ref('')
const { emit } = defineEmits(['nextStep'])

const slots = computed(() => props.availableSlots )

const convertTime = (timeStr) => {
  const date = new Date(`1970-01-01T${timeStr}`)
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, hourCycle: 'h12' });
}

function next() {
  localStorage.setItem("bookedTime", JSON.stringify(selectedTime.value))
  localStorage.setItem("bookedSlot", JSON.stringify(bookedSlot.value))

  props.nextStepFunction()
}
</script>