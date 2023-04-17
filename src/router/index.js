import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import ServiceDetails from '../views/ServiceDetails.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Cart from '../views/Cart.vue'
import Checkout from '../views/Checkout.vue'

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
  }, 
  {
    path: '/cart',
    name: 'cart',
    component: Cart
  }, 
  {
    path: '/checkout',
    name: 'checkout',
    component: Checkout
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Add a global beforeEach guard to check if the user is authenticated
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token') !== null;

  if (to.name === 'login' && isAuthenticated) {
    // If the user is authenticated and tries to access the login page, redirect to home
    next({ name: 'home' });
  } else if (to.name === 'register' && isAuthenticated) {
    // If the user is authenticated and tries to access the register page, redirect to home
    next({ name: 'home' });
  } else {
    // Otherwise, allow the navigation to proceed
    next();
  }
});

export default router
