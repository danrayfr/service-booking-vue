<template>
  <div>
    <section>
      <h2 class="uppercase tracking-wide text-lg font-semibold text-gray-700 my-2">Payment Option</h2>
      <fieldset class="mb-3 bg-white shadow-lg rounded text-gray-600">
          <label class="flex border-b border-gray-200 h-12 py-3 items-center">
              <span class="text-right px-2 italic text-sm text-gray-500">Choose your preferred payment option</span>
          </label>
          <select id="payment-method" class="mx-auto my-2 px-3 bg-gray-50 border border-gray-300 text-gray-900 mb-6 text-sm rounded focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5" v-model="selectedPayment">
            <option v-for="payment in payments" :key="payment.id" :value="payment.id" class="focus:outline-none px-3 w-full text-gray-600">
              <span class="flex justify-between">
                <span>{{ payment.name }}</span>
                <span class="text-right">{{ payment.additionalInfo }}</span>
              </span>
            </option>
          </select>
      </fieldset>
      <div>
        <button class="submit-button px-4 py-3 rounded-full bg-sky-400 text-white focus:ring focus:outline-none w-full text-xl font-semibold transition-colors" type="submit" @click="next">Proceed to Checkout</button>
    </div>
    </section>
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
  localStorage.setItem("paymentID", JSON.stringify(selectedPayment.value));
  props.nextStepFunction();
}

</script>

<style scoped>

</style>
