<template>
  <div v-if="success" class="bg-green-200 py-2 px-4 rounded mt-4">
    Successfully registered! You can now log in.
  </div>
  <div class="flex items-center justify-between pb-6 border-b mb-6">
    <h1 class="text-5xl font-bold text-gray-700">Sign Up</h1>
  </div>

  <div>
    <form action="" method="POST" @submit.prevent="register">
      <div class="mb-6">
        <input type="name" v-model="firstName" placeholder="Enter your first name">
      </div>

      <div class="mb-6">
        <input type="name" v-model="lastName" placeholder="Enter your last name">
      </div>

      <div class="mb-6">
        <input type="name" v-model="mobile" placeholder="Please enter an 11 digits valid number.">
      </div>

      <div class="mb-6">
        <input type="email" v-model="email" placeholder="Enter your email">
      </div>
      
      <div class="mb-6">
        <input type="password" v-model="password" placeholder="Enter your password">
      </div>      
      <div>
        <button class="login" type="submit" :disabled="hasRegister">Register</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router' 
import { useMutation } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import { ref, computed } from 'vue';

let firstName = ref('');
let lastName = ref('');
let mobile = ref('');
let email = ref('');
let password = ref('');
let error = ref([]);
const hasRegister = ref(false);
const router = useRouter()

const success = ref(false);


const CREATE_USER_MUTATION = gql`
mutation registerUser($firstName: String!, $lastName: String!, $mobile: String!, $email: String!, $password: String!) {
  createUser(
    input: {firstName: $firstName, lastName: $lastName, mobile: $mobile, authProvider: {credentials: {email: $email, password: $password}}}
  ) {
    user {
      id
      firstName
      email
      role
    }
    errors
  }
}
`;

const { mutate: createUser, loading } = useMutation(CREATE_USER_MUTATION);

const register = async() => {
  
  if (!firstName.value || !lastName.value || !mobile.value || !email.value || !password.value) {
    console.error("All fields in the registration are required.");
    return;
  }

  hasRegister.value = true;
  
  const variables = {
    firstName: firstName.value,
    lastName: lastName.value,
    mobile: mobile.value,
    email: email.value,
    password: password.value,
  };

  try { 
    const { data } = await createUser(variables);
    
    const user = computed(() => data.createUser?.user ?? []);
    error = computed(() => data.createUser?.errors ?? []);

    if (user.value != 0) {
      console.log("user:", user.value);
    }

    if (error.value != 0) { 
      console.log("error:", error.value);
    }

    success.value = true; // Set success to true if user registration is successful

    hasRegister.value = false;
    return user, error.value

  } catch(e) { 
    error.value = e.message || 'An unknown error occurred';
  } finally {
    hasRegister.value = false;
    if (success.value) {
      setTimeout(() => {
        router.push({ name: 'login' }); // Delayed navigation to login page
      }, 1000); // Delay of 2 seconds (2000 milliseconds)
    }
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
