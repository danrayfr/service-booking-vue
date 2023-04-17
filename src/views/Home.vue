<template>
  <div v-if="notification" class="bg-green-200 py-2 px-4 rounded mt-4 text-bold text-gray-900" :class="notification.type">
    {{ notification.message }}
  </div>
  <div class="flex items-center justify-between pb-6 border-b">
    <h1 class="text-5xl font-bold text-gray-700">Book a service</h1>
  </div>
  <div class="flex flex-wrap -mx-1 lg:-mx-4 mt-2">
    <Services :services="services" />
  </div>
</template>

<script setup>
import { useQuery } from '@vue/apollo-composable'
import { gql } from "graphql-tag";
import { ref, computed, onMounted } from "vue";
import Services from "@/components/Services.vue";

const notification = ref(null)

const ALL_SERVICES = gql`
query {
  services {
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
`

onMounted(() => {
  const data = localStorage.getItem("notification")
  if (data) {
    const parsedData = JSON.parse(data)
    showSuccessNotification("Booking successfully")
    notification.value = parsedData
    localStorage.removeItem("notification")
  }
})

const showSuccessNotification = (message) => {
  notification.value = {
    type: 'success',
    message: message
  }
}

const { result, error, loading } = useQuery(ALL_SERVICES);
const services = computed(() => result.value?.services ?? []);

</script>


<style scoped>
.notification {
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
  color: white;
  z-index: 9999;
}

.notification.success {
  background-color: green;
}

.notification.error {
  background-color: red;
}
</style>