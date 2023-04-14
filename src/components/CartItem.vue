<template>
  <div>
  <ul class="divide-y divide-gray-300">
  <li class="flex items-center py-4">
    <div class="ml-4">
      <h3 class="text-lg font-semibold uppercase">{{ service.name }}</h3>
      <p class="text-gray-600"><strong>Price:</strong> {{ service.price }}</p>
      <p class="text-gray-600"><strong>Date:</strong> {{ formattedDate }}</p>
      <p class="text-gray-600"><strong>Booked Date:</strong> {{ newDateFormat }}</p>
      <p class="text-gray-600"><strong>Booked Slot:</strong> {{ bookedItem.slot  }}</p>
      <hr>
      <p class="text-gray-600"><strong>Item Total Cost:</strong> {{ itemCost }}</p>
    </div>
  </li> 
  </ul>
  </div>
</template>

<script setup>
//components

//plugins
import { computed, defineProps } from "vue"

const props = defineProps({
  item: { 
    type: Object,
    required: true
  }
});

const bookedItem = computed(() => props.item )
const service = computed(() => props.item.service);
const itemCost = computed(() => bookedItem.value.slot * service.value.price )

// Refactor to composables or mixin later
const formattedDate = computed(() => { 
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
};

const dateString = bookedItem.value.bookedTime;

// Extract year, month, day, hour, minute, and second components from input string
const year = parseInt(dateString.substring(0, 4));
const month = parseInt(dateString.substring(5, 7)) - 1; // Subtract 1 from month as it is 0-indexed in JavaScript
const day = parseInt(dateString.substring(8, 10));
const hour = parseInt(dateString.substring(11, 13));
const minute = parseInt(dateString.substring(14, 16));
const second = parseInt(dateString.substring(17, 19));

// Construct a new Date object with the extracted components
const date = new Date(year, month, day, hour, minute, second);

// Specify the desired formatting options
const options = {
  hour: "numeric",
  minute: "numeric",
  hour12: true // Use 24-hour format
};

// Format the date using the specified options
const newDateFormat = date.toLocaleString("en-US", options);

</script>