import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';

import ForgetPassword from '../components/ForgetPassword.vue';
import ProfilePage from '../components/ProfilePage.vue';
import RegisterDetails from '@/components/RegisterDetails.vue';
import { auth } from '../firebase';
import AddProduct from '../components/AddProduct.vue';
import AddListing from '../components/AddListing.vue';
import SeekerMarketplaceView from '../views/SeekerMarketplaceView.vue';
import SeekerDashboardView from "../views/SeekerDashboardView.vue";
import OrderDashPartnerView from '../views/OrderDashPartnerView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/register",
      name: "register",
      component: Register,
    },
    {
      path: "/seeker/order-dashboard",
      name: "seekerDashboard",
      component: SeekerDashboardView,
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/forgetPassword',
      name: 'forgetPassword',
      component: ForgetPassword,
      beforeEnter(to, from, next) {
        const user = auth.currentUser;
        // console.log(user)
        if (user) {
          next({ name: "home" });
        } else {
          next();
        }
      },
    },
    {
      path: '/registerDetails',
      name: 'registerDetails',
      component: RegisterDetails
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfilePage
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
    {
      path: '/seeker/marketplace',
      name: 'SeekerMarketplaceView',
      component: SeekerMarketplaceView
    },
    {
      path: '/myorders',
      name: 'orderDashPartnerView',
      component: OrderDashPartnerView
    }
  ]
})

export default router;
