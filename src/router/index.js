import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import ServiceDetails from '../views/ServiceDetails.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'


const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
  path: '/service-details/:id',
  name: 'service-details',
  component: ServiceDetails,
  props: true
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
