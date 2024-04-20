<template>
  <v-app-bar fixed color="#4B644C">
    <v-toolbar-items>
      <router-link to="/" tag="v-btn" :disabled="!user.detailsSubmitted">
        <img
          src="../../GreenHarborLogo.png"
          alt="Green Harbor Logo"
          class="logo"
        />
      </router-link>
      <v-btn to="/" :disabled="!user.detailsSubmitted">Home</v-btn>

      <template v-if="user.type == 'ecoSeeker'">
        <v-btn to="/seeker/marketplace" :disabled="!user.detailsSubmitted"
          >Marketplace</v-btn
        >
      </template>
      <template v-else>
        <v-btn to="/partner/marketplace" :disabled="!user.detailsSubmitted"
          >Marketplace</v-btn
        >
      </template>

      <template v-if="user.type == 'ecoSeeker'">
        <v-btn to="/seeker/order-dashboard" :disabled="!user.detailsSubmitted"
          >My Orders</v-btn
        >
      </template>
      <template v-else>
        <v-btn to="/partner/order-dashboard" :disabled="!user.detailsSubmitted"
          >My Orders</v-btn
        >
      </template>
    </v-toolbar-items>

    <v-spacer></v-spacer>

    <v-menu :disabled="!user.detailsSubmitted" min-width="200px" rounded>
      <template v-slot:activator="{ props }">
        <v-btn icon v-bind="props">
          <v-avatar size="large">
            <v-img :src="user.photoURL" />
          </v-avatar>
        </v-btn>
      </template>
      <v-card>
        <v-card-text>
          <div class="mx-auto text-center">
            <h3>{{ user.displayName }}</h3>
            <h3>{{ user.type }}</h3>
            <p class="text-caption mt-1">
              {{ user.email }}
            </p>
            <v-divider class="my-3"></v-divider>
            <v-btn variant="text" rounded text to="/profile">
              Profile Page
            </v-btn>
            <v-divider class="my-3"></v-divider>
            <v-btn
              variant="text"
              rounded
              @click="signOut"
              class="btn btn-primary"
            >
              Log Out
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-menu>
  </v-app-bar>
</template>

<script>
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase.js";

export default {
  name: "NavLoggedIn",

  props: {
    user: {
      type: Object,
      required: true,
    },
  },

  setup(props) {
    const store = useStore();
    const router = useRouter();
    const userDetails = ref({});
    const userData = computed(() => store.getters.user);
    // console.log(userData.value);
    //console.log(userData.value.photoURL)

    const signOut = async () => {
      await store.dispatch("logOut");
      router.push("/login");
    };

    onMounted(() => {
      console.log(userData);
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          // Fetch basic details from the auth user object
          const basicDetails = {
            uid: user.uid,
            email: user.email,
            name: user.name,
            userType: user.userType,
            detailsSubmitted: user.detailsSubmitted,
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

    return { signOut, userDetails, user: userData.value };
  },
};
</script>

<style scoped>
.logo {
  max-height: 60px;
  margin-bottom: -10px;
  cursor: pointer;
}
.v-toolbar-items {
  float: right !important;
}
</style>
