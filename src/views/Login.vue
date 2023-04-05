<template>
  <div class="flex items-center justify-between pb-6 border-b mb-6">
    <h1 class="text-5xl font-bold text-gray-700">Sign In</h1>
  </div>

  <div>
    <form action="" method="POST" @submit.prevent="login">
      <div class="mb-6">
        <input type="email" v-model="email" placeholder="Enter your email">
      </div>
      
      <div class="mb-6">
        <input type="password" v-model="password" placeholder="Enter your password" >
      </div>      
      <div>
        <button class="login" type="submit">Login</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useMutation, useApolloClient } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import { ref, computed } from 'vue';

  let email = ref('');
  let password = ref('');
  let error = ref([]);
  const router = useRouter();

  const SIGN_IN_USER = gql`
    mutation signUser($email: String!, $password: String!) {
      signInUser(
        input: { credentials: { email: $email, password: $password }}
      ) {
        user {
          id
          firstName
          email
          role
        }
        token
        errors
      }
    }
  `;

  const { mutate: signInUser, loading } = useMutation(SIGN_IN_USER);
  const apolloClient = useApolloClient();

  const login = async() => {
    if (!email.value || !password.value) {
      console.error("Email and password are both required");
      return;
    }
    
    const variables = {
      email: email.value,
      password: password.value,
    };

    try { 
      const { data } = await signInUser(variables);
      
      const user = computed(() => data.signInUser?.user ?? [])
      const token = computed(() => data.signInUser?.token ?? "")
      error.value = computed(() => data.signInUser?.errors ?? [])

      console.log(user.value, token.value)

      localStorage.setItem('token', JSON.stringify(token.value));

      router.push({ name: 'home' })

      return user, token, email.value

    } catch(e) { 
      error.value = e.message || 'An unknown error occurred';
    }
  }
</script>