<template>
  <div class="flex items-center justify-between pb-6 border-b mb-6">
    <h1 class="text-5xl font-bold text-gray-700">Fill Up Information</h1>
  </div>

  <div>
    <form action="" method="POST" @submit.prevent="add">
      <div class="mb-6">
        <label class="block mb-2 text-sm font-medium text-gray-700">Street</label>
        <input type="name" v-model="street" placeholder="Street">
      </div>

      <div class="mb-6">
        <label class="block mb-2 text-sm font-medium text-gray-700">Barangay</label>
        <input type="name" v-model="barangay" placeholder="Barangay">
      </div>

      <div class="mb-6">
        <label class="block mb-2 text-sm font-medium text-gray-700">City</label>
        <input type="name" v-model="city" placeholder="City">
      </div>

      <div class="mb-6">
        <label class="block mb-2 text-sm font-medium text-gray-700">Province</label>
        <input type="name" v-model="province" placeholder="Province, if none, input 'n/a'">
      </div>
      
      <div class="mb-6">
        <label for="email" class="block mb-2 text-sm font-medium text-gray-700">Zipcode</label>
        <input type="number" v-model="zipcode" placeholder="Zipcode" class="bg-gray-50 border border-gray-300 text-gray-900 mb-6 text-sm rounded focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5">
      </div>      
      <div>
        <button class="login" type="submit" :disabled="hasAdded">Next</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { useMutation } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import { ref, computed, defineProps } from 'vue';

let street = ref('');
let barangay = ref('');
let city = ref('');
let province = ref('');
let zipcode = ref();
let error = ref([]);
const hasAdded = ref(false);

const props = defineProps({
  nextStepFunction: {
    type: Function,
    required: true
  }
})


const BILLING_MUTATION = gql`
mutation ADD_BILLING_INFORMATION($street: String!, $barangay: String!, $city: String!, $province: String!, $zipcode: Int!) {
  createBilling(
    input: {street: $street, barangay: $barangay, city: $city, province: $province, zipcode: $zipcode}
  ) {
    billing {
      id
      completeAddress
      address {
        street
        barangay
        city
        province
        zipcode
      }
    }
    errors
  }
}
`;

const { mutate: createBilling, loading } = useMutation(BILLING_MUTATION);

const add = async() => {
  
  if (!street.value || !barangay.value || !city.value || !province.value || !zipcode.value) {
    console.error("All fields in the registration are required.");
    return;
  }

  hasAdded.value = true;
  
  const variables = {
    street: street.value,
    barangay: barangay.value,
    city: city.value,
    province: province.value,
    zipcode: zipcode.value,
  };

  try { 
    const { data } = await createBilling(variables);
    
    const billing = computed(() => data.createBilling?.billing ?? []);
    error.value = computed(() => data.createBilling?.errors ?? []);

    console.log(billing.value)

    localStorage.setItem("billing", JSON.stringify(billing.value));

    hasAdded.value = false;
    return billing, error.value

  } catch(e) { 
    error.value = e.message || 'An unknown error occurred';
  } finally {
    hasAdded.value = false;
    props.nextStepFunction()
  }
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
