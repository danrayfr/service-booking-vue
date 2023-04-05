<template>
  <div>
    <div class="flex items-center justify-between pb-6 border-b mb-6">
      <h1 class="text-5xl font-bold text-gray-700">Select a payment method</h1>
    </div>
    <label for="payment-method" class="mb-6 text-gray-700">Payment Method:</label>
    <select id="payment-method" class="bg-gray-50 border border-gray-300 text-gray-900 mb-6 text-sm rounded focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5" v-model="selectedPayment">
      <option v-for="payment in payments" :key="payment.id" :value="payment.id">{{ payment.name }}</option>
    </select>
    <div>
      <button class="login" type="submit" @click="next">Next</button>
    </div>
  </div>
</template>

<script setup>
import { useQuery } from '@vue/apollo-composable'
import { gql } from "graphql-tag";
import { ref, computed, defineProps } from "vue";

const selectedPayment = ref(1);

const props = defineProps({
  nextStepFunction: {
    type: Function,
    required: true
  }
})

const QUERY_PAYMENT_METHODS = gql`
query PAYMENT_METHOD {
  payments {
    id
    name
  }
}
`
const { result, error, loading } = useQuery(QUERY_PAYMENT_METHODS);
const payments = computed(() => result.value?.payments ?? []);

function next() {
  localStorage.setItem("paymentID", JSON.stringify(selectedPayment.value))

  props.nextStepFunction()
}
</script>