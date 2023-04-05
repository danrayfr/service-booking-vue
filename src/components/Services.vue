<template>
  <div class="flex flex-wrap -mx-1 lg:-mx-4 mt-2 gap-6">
    <div v-for="service in services" :key="service.id" >
      <Service :service="service" />
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import Service from "@/components/Service.vue";

const props = defineProps({
  services: {
    type: Object
  }
});
</script>