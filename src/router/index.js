import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import AddProduct from '../components/AddProduct.vue';
import AddListing from '../components/AddListing.vue';

import SeekerMarketplaceView from '../views/SeekerMarketplaceView.vue';

import OrderDashPartnerView from '../views/OrderDashPartnerView.vue';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/partner/marketplace',
      name: 'partner-marketplace',
      component: () => import('../views/PartnerMktView.vue')
    },
    {
      path: '/partner/marketplace/add-product',
      name: 'add-product',
      component: AddProduct
    },
    {
      path: '/partner/marketplace/add-listing',
      name: 'add-listing',
      component: AddListing
    },

      path: '/MarketplaceView',
      name: 'SeekerMarketplaceView',
      component: SeekerMarketplaceView
    },

      path: '/myorders',
      name: 'orderDashPartnerView',
      component: OrderDashPartnerView
    }

  ]
})

export default router
