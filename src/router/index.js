import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import NotFound from '../components/NotFound.vue';

import ForgetPassword from '../components/ForgetPassword.vue';
import ProfilePage from '../components/ProfilePage.vue';
import RegisterDetails from '@/components/RegisterDetails.vue';
import { auth } from '../firebase';
import AddProduct from '../components/AddProduct.vue';
import AddListing from '../components/AddListing.vue';
import CheckoutPageView from '../views/CheckoutPageView.vue';
import SeekerMarketplaceView from '../views/SeekerMarketplaceView.vue';
import SeekerDashboardView from "../views/SeekerDashboardView.vue";
import OrderDashPartnerView from '../views/OrderDashPartnerView.vue';
import { useStore } from "vuex";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/register",
      name: "register",
      component: Register,
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
        const authUser = auth.currentUser;
        // console.log(user)
        if (!authUser) {
          next();
        } else {
          next({ name: "notFound" });
        }
      },
    },
    {
      path: '/registerDetails',
      name: 'registerDetails',
      component: RegisterDetails,
      beforeEnter(to, from, next) {
        const store = useStore();
        const user = store.state.user;
        const authUser = auth.currentUser;
        // console.log(user)
        if (authUser && user.type === "") {
          next();
        } else {
          next({ name: "notFound" });
        }
      },
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfilePage,
      beforeEnter(to, from, next) {
        const store = useStore();
        const user = store.state.user;
        const authUser = auth.currentUser;
        if (authUser && user.type !== "") {
          next();
        } else {
          next({ name: "notFound" });
        }
      }
    },
    {
       path: '/partner/marketplace',
      name: 'partner-marketplace',
      component: () => import('../views/PartnerMktView.vue'),
      beforeEnter(to, from, next) {
        const store = useStore();
        const user = store.state.user;
        const authUser = auth.currentUser;
        if (authUser && user.type === "ecoPartner") {
          next();
        } else {
          next({ name: "notFound" });
        }
      }
    },
    {
      path: '/partner/marketplace/add-product',
      name: 'add-product',
      component: AddProduct,
      beforeEnter(to, from, next) {
        const store = useStore();
        const user = store.state.user;
        const authUser = auth.currentUser;
        if (authUser && user.type === "ecoPartner") {
          next();
        } else {
          next({ name: "notFound" });
        }
      }
    },
    {
      path: '/partner/marketplace/add-listing',
      name: 'add-listing',
      component: AddListing,
      beforeEnter(to, from, next) {
        const store = useStore();
        const user = store.state.user;
        const authUser = auth.currentUser;
        if (authUser && user.type === "ecoPartner") {
          next();
        } else {
          next({ name: "notFound" });
        }
      }
    },
    {
      path: '/seeker/marketplace',
      name: 'SeekerMarketplaceView',
      component: SeekerMarketplaceView,
      beforeEnter(to, from, next) {
        const store = useStore();
        const user = store.state.user;
        const authUser = auth.currentUser;
        if (authUser && user.type === "ecoSeeker") {
          next();
        } else {
          next({ name: "notFound" });
        }
      }
    },
    {
      path: '/partner/order-dashboard',
      name: 'orderDashPartnerView',
      component: OrderDashPartnerView,
      beforeEnter(to, from, next) {
        const store = useStore();
        const user = store.state.user;
        const authUser = auth.currentUser;
        if (authUser && user.type === "ecoPartner") {
          next();
        } else {
          next({ name: "notFound" });
        }
      }
    },
    {
      path: "/seeker/order-dashboard",
      name: "seekerDashboard",
      component: SeekerDashboardView,
      beforeEnter(to, from, next) {
        const store = useStore();
        const user = store.state.user;
        const authUser = auth.currentUser;
        if (authUser && user.type === "ecoSeeker") {
          next();
        } else {
          next({ name: "notFound" });
        }
      }
    },
    {
      path: '/seeker/checkout',
      name: 'CheckoutPage',
      component: CheckoutPageView,
      props: true,
      beforeEnter(to, from, next) {
        const store = useStore();
        const user = store.state.user;
        const authUser = auth.currentUser;
        if (authUser && user.type === "ecoSeeker") {
          next();
        } else {
          next({ name: "notFound" });
        }
      }
    },
    {
      path: "/:pathMatch(.*)*",
      name: "notFound",
      component: NotFound,
    },
  ]
})

export default router;
