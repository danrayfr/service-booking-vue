import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import ServiceDetails from '../views/ServiceDetails.vue'
import { useRoute } from 'vue-router';

const route = useRoute();

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
  path: '/service-details/:id',
  name: 'service-details',
  component: ServiceDetails,
  props: true
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
