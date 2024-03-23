<template>
  <div id="nav">
    <router-link to="/">
      <img src="../assets/GreenHarborLogo.png" alt="Green Harbor Logo" />
    </router-link>
    |
    <router-link to="/">Home</router-link>
    |
    <router-link to="/">Marketplace</router-link>
    <template v-if="userDetails.userType == 'ecoSeeker'">
      <router-link to="/seeker/order-dashboard">My Orders</router-link>
    </template>
    <template v-else>
      <router-link to="/partner/order-dashboard">My Orders</router-link>
    </template>
    |
    <button @click.prevent="signOut" class="btn btn-primary">Log Out</button>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase.js";

export default {
  name: "NavLoggedIn",

  setup() {
    const store = useStore();
    const router = useRouter();
    const userDetails = ref({});

    const signOut = async () => {
      await store.dispatch("logOut");
      router.push("/login");
    };

    onMounted(() => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          // Fetch basic details from the auth user object
          const basicDetails = {
            uid: user.uid,
            email: user.email,
            name: user.name,
            userType: user.userType,
          };

          // Attempt to fetch additional details from Firestore
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            // Combine basic details with extended details from Firestore
            userDetails.value = { ...basicDetails, ...userDocSnap.data() };
          } else {
            // Fallback to just basic details if no Firestore document exists
            userDetails.value = basicDetails;
          }
        }
      });
    });

    return { signOut, userDetails };
  },
};
</script>

<style scoped>
/* Add any specific styles for your Nav component here */
</style>
