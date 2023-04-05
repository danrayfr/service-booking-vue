<template>
  <Navbar />
  <div class="container mx-auto mt-12 px-5">
    <router-view/>
  </div>
</template>

<script setup>
import Navbar from "@/components/layouts/NavBar"
</script>
