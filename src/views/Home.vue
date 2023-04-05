<template>
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
import { computed } from "vue";
import Services from "@/components/Services.vue";

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

const { result, error, loading } = useQuery(ALL_SERVICES);
const services = computed(() => result.value?.services ?? []);
</script>
