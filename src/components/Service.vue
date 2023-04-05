<template>
  <div class="my-1 px-1 w-full">
    <img :src="image" class="h-96 w-96 object-cover rounded-lg shadow-md">
    <div class="relative px-4 -mt-16">
      {{ }}
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <div class="flex items-baseline mb-2 gap-2">
          <span class="bg-sky-200 text-sky-800 text-xs px-2 inline-block rounded-full  uppercase font-semibold tracking-wide">
            {{  service.availableSlots.length }} Time Schedule
          </span>

          <span class="bg-yellow-200 text-yellow-800 text-xs px-2 inline-block rounded-full  uppercase font-semibold tracking-wide">
            {{ service.category.name }}
          </span>
        </div>
        <div class="ml-2 text-gray-600 uppercase text-xs font-semibold tracking-wider">
            Available Time  &bull; {{ formattedTime }}
          </div>
        
          <h4 class="mt-1 text-xl font-semibold uppercase leading-tight truncate text-gray-700 hover:text-gray-800"> {{ service.name }}</h4>
          <div class="mt-1 text-gray-600 text-md">
            <p v-html="snippet"></p>
          </div>
          <div class="mt-1"><span class="text-gray-500 text-sm" >Price:</span> ₱ {{ service.price }} </div>
      
        <div class="mt-4">
          <router-link :to="{name: 'service-details', params: { id: service.id }}">
            <button class="mt-4 text-xl w-full bg-sky-500 hover:bg-sky-600 text-white py-2 rounded-xl shadow-lg">View</button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'

const props = defineProps({
  service: { 
    type: Object
  }
});

const snippet = computed(() => {
  return props.service.description.substring(0, 80) + '....'
});

const image = computed(() => {
  return "https://service-booking.onrender.com/" + props.service.image;
});

const formattedTime = computed(() => { 
  const dateTime = new Date(props.service.availableDate);
  const options = { 
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return dateTime.toLocaleString("en-US", options);
});

</script>

