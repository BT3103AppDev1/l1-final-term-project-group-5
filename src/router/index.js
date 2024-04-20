import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import NotFoundView from "../views/NotFoundView.vue";

import ForgetPasswordView from "../views/ForgetPasswordView.vue";
import ProfilePageView from "../views/ProfilePageView.vue";
import RegisterDetails from "@/components/RegisterDetails.vue";
import { auth } from "../firebase";
import AddProduct from "../components/AddProduct.vue";
import AddListing from "../components/AddListing.vue";
import CheckoutPageView from "../views/CheckoutPageView.vue";
import SeekerMarketplaceView from "../views/SeekerMarketplaceView.vue";
import SeekerDashboardView from "../views/SeekerDashboardView.vue";
import OrderDashPartnerView from "../views/OrderDashPartnerView.vue";
import { useStore } from "vuex";
import { isProxy, toRaw, watch } from 'vue';

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
      component: RegisterView,
    },

    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/forgetPassword",
      name: "forgetPassword",
      component: ForgetPasswordView,
      beforeEnter(to, from, next) {
        const authUser = auth.currentUser;
        console.log(authUser);
        // console.log(user)
        if (!authUser) {
          next();
        } else {
          next({ name: "notFound" });
        }
      },
    },
    {
      path: "/registerDetails",
      name: "registerDetails",
      component: RegisterDetails,
      beforeEnter(to, from, next) {
        const store = useStore();
        const user = store.state.user;
        const authUser = auth.currentUser;
        if (store.state.user.loggedIn) {
          if (authUser && user.type === "") {
            next();
          } else {
            next({ name: "notFound" });
          }
        }
        watch(
          () => store.state.user.loggedIn,
          (loggedIn) => {
            if (loggedIn) {
              const user = toRaw(store.state.user)
              const authUser = auth.currentUser;
              if (authUser) {
                next();
              } else {
                next({ name: "notFound" });
              }
            }
          }
        );
      },
    },
    {
      path: "/profile",
      name: "profile",
      component: ProfilePageView,
      beforeEnter(to, from, next) {
        const store = useStore();
        const user = store.state.user;
        const authUser = auth.currentUser;
        if (store.state.user.loggedIn) {
          if (authUser && user.type !== "") {
            next();
          } else {
            next({ name: "notFound" });
          }
        }
        watch(
          () => store.state.user.loggedIn,
          (loggedIn) => {
            if (loggedIn) {
              const user = toRaw(store.state.user)
              const authUser = auth.currentUser;
              if (authUser) {
                next();
              } else {
                next({ name: "notFound" });
              }
            }
          }
        );
      },
    },
    {
      path: "/partner/marketplace",
      name: "partner-marketplace",
      component: () => import("../views/PartnerMktView.vue"),
      beforeEnter(to, from, next) {
        const store = useStore();
        const user = store.state.user;
        const authUser = auth.currentUser;
        if (store.state.user.loggedIn) {
          if (authUser && user.type === "ecoPartner") {
            next();
          } else {
            next({ name: "notFound" });
          }
        }
        watch(
          () => store.state.user.loggedIn,
          (loggedIn) => {
            if (loggedIn) {
              const user = toRaw(store.state.user)
              const authUser = auth.currentUser;
              if (authUser) {
                next();
              } else {
                next({ name: "notFound" });
              }
            }
          }
        );
      },
    },
    {
      path: "/partner/marketplace/add-product",
      name: "add-product",
      component: AddProduct,
      beforeEnter(to, from, next) {
        const store = useStore();
        const user = store.state.user;
        const authUser = auth.currentUser;
        if (store.state.user.loggedIn) {
          if (authUser && user.type === "ecoPartner") {
            next();
          } else {
            next({ name: "notFound" });
          }
        }
        watch(
          () => store.state.user.loggedIn,
          (loggedIn) => {
            if (loggedIn) {
              const user = toRaw(store.state.user)
              const authUser = auth.currentUser;
              if (authUser) {
                next();
              } else {
                next({ name: "notFound" });
              }
            }
          }
        );
      },
    },
    {
      path: "/partner/marketplace/add-listing",
      name: "add-listing",
      component: AddListing,
      beforeEnter(to, from, next) {
        const store = useStore();
        const user = store.state.user;
        const authUser = auth.currentUser;
        if (store.state.user.loggedIn) {
          if (authUser && user.type === "ecoPartner") {
            next();
          } else {
            next({ name: "notFound" });
          }
        }
        watch(
          () => store.state.user.loggedIn,
          (loggedIn) => {
            if (loggedIn) {
              const user = toRaw(store.state.user)
              const authUser = auth.currentUser;
              if (authUser) {
                next();
              } else {
                next({ name: "notFound" });
              }
            }
          }
        );
      },
    },
    {
      path: "/seeker/marketplace",
      name: "SeekerMarketplaceView",
      component: SeekerMarketplaceView,
      beforeEnter(to, from, next) {
        const store = useStore();
        const user = store.state.user;
        const authUser = auth.currentUser;
        if (store.state.user.loggedIn) {
          if (authUser && user.type === "ecoSeeker") {
            next();
          } else {
            next({ name: "notFound" });
          }
        }
        watch(
          () => store.state.user.loggedIn,
          (loggedIn) => {
            if (loggedIn) {
              const user = toRaw(store.state.user)
              const authUser = auth.currentUser;
              if (authUser) {
                next();
              } else {
                next({ name: "notFound" });
              }
            }
          }
        );
      },
    },
    {
      path: "/partner/order-dashboard",
      name: "orderDashPartnerView",
      component: OrderDashPartnerView,
      beforeEnter(to, from, next) {
        const store = useStore();
        const user = store.state.user;
        const authUser = auth.currentUser;
        if (store.state.user.loggedIn) {
          if (authUser && user.type === "ecoPartner") {
            next();
          } else {
            next({ name: "notFound" });
          }
        }
        watch(
          () => store.state.user.loggedIn,
          (loggedIn) => {
            if (loggedIn) {
              const user = toRaw(store.state.user)
              const authUser = auth.currentUser;
              if (authUser) {
                next();
              } else {
                next({ name: "notFound" });
              }
            }
          }
        );
      },
    },
    {
      path: "/seeker/order-dashboard",
      name: "seekerDashboard",
      component: SeekerDashboardView,
      beforeEnter(to, from, next) {
        const store = useStore();
        const user = store.state.user;
        const authUser = auth.currentUser;
        if (store.state.user.loggedIn) {
          if (authUser && user.type === "ecoSeeker") {
            next();
          } else {
            next({ name: "notFound" });
          }
        }
        watch(
          () => store.state.user.loggedIn,
          (loggedIn) => {
            if (loggedIn) {
              const user = toRaw(store.state.user)
              const authUser = auth.currentUser;
              if (authUser) {
                next();
              } else {
                next({ name: "notFound" });
              }
            }
          }
        );
      },
    },
    {
      path: "/seeker/checkout",
      name: "CheckoutPage",
      component: CheckoutPageView,
      props: true,
      beforeEnter(to, from, next) {
        const store = useStore();
        const user = store.state.user;
        const authUser = auth.currentUser;
        if (store.state.user.loggedIn) {
          if (authUser && user.type === "ecoSeeker") {
            next();
          } else {
            next({ name: "notFound" });
          }
        }
        watch(
          () => store.state.user.loggedIn,
          (loggedIn) => {
            if (loggedIn) {
              const user = toRaw(store.state.user)
              const authUser = auth.currentUser;
              if (authUser) {
                next();
              } else {
                next({ name: "notFound" });
              }
            }
          }
        );
      },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "notFound",
      component: NotFoundView,
    },
  ],
});

export default router;
