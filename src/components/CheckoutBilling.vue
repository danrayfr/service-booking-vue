<template>
<div>
  <form id="payment-form" action="" method="POST" @submit.prevent="add">
        <section>
            <h2 class="uppercase tracking-wide text-lg font-semibold text-gray-700 my-2">Shipping & Billing Information</h2>
            <fieldset class="mb-3 bg-white shadow-lg rounded text-gray-600">
                <label class="flex border-b border-gray-200 h-12 py-3 items-center">
                    <span class="text-right px-2">Address</span>
                    <input type="text" name="address" class="focus:outline-none px-3" placeholder="123 Looban Street" v-model="street">
                </label>
                <label class="flex border-b border-gray-200 h-12 py-3 items-center">
                    <span class="text-right px-2">Barangay</span>
                    <input type="text" name="barangay" class="focus:outline-none px-3" placeholder="Barangay 598" v-model="barangay">
                </label>
                <label class="flex border-b border-gray-200 h-12 py-3 items-center">
                    <span class="text-right px-2">City</span>
                    <input type="text" name="city" class="focus:outline-none px-3" placeholder="Manila" v-model="city">
                </label>
                <label class="inline-flex w-2/4 border-gray-200 py-3">
                    <span class="text-right px-2">Province</span>
                    <input type="text" name="province" class="focus:outline-none px-3" placeholder="Tawi-Tawi" v-model="province">
                </label>
                <label class="xl:w-1/4 xl:inline-flex py-3 items-center flex xl:border-none border-t border-gray-200">
                    <span class="text-right px-2 xl:px-0 xl:text-none">ZIP</span>
                    <input type="number" name="zipcode" class="focus:outline-none px-3" placeholder="1016" v-model="zipcode">
                </label>
            </fieldset>
            <div v-if="!billingAdded">
              <button class="submit-button px-4 py-3 rounded-full bg-sky-400 text-white focus:ring focus:outline-none w-full text-xl font-semibold transition-colors" type="submit" :disabled="hasAdded">Fill out</button>
            </div>
        </section>
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
const billingAdded = ref(false);

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
    billingAdded.value = true;
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