<template>
  <div id="nav">
    <router-link to="/">
      <img src="../assets/GreenHarborLogo.png" alt="Green Harbor Logo" />
    </router-link>
    |
    <router-link to="/">Home</router-link>
    |
    <router-link to="/">Marketplace</router-link>
    <router-link to="/">My Orders</router-link>
    |
    <v-container style="height: 300px" fluid>
      <v-row justify="center">
        <v-menu min-width="200px" rounded>
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props">
              <v-avatar color="brown" size="large">
                <span class="text-h5">{{ user.initials }}</span>
              </v-avatar>
            </v-btn>
          </template>
          <v-card>
            <v-card-text>
              <div class="mx-auto text-center">
                <v-avatar color="brown">
                  <span class="text-h5">{{ user.initials }}</span>
                </v-avatar>
                <h3>{{ user.fullName }}</h3>
                <p class="text-caption mt-1">
                  {{ user.email }}
                </p>
                <v-divider class="my-3"></v-divider>
                <v-btn variant="text" rounded @click="goProfilePage">
                  Profile Page
                </v-btn>
                <v-divider class="my-3"></v-divider>
                <v-btn variant="text" rounded @click="signOut" class="btn btn-primary">
                  Log Out
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-menu>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  name: "NavLoggedIn",

  setup() {
    const store = useStore();
    const router = useRouter();
    const signOut = async () => {
      await store.dispatch("logOut");
      router.push("/login");
    };
    const goProfilePage = () => {
      router.push("/profile");
    };
    return { signOut, goProfilePage };
  },
};
</script>

<style scoped>
/* Add any specific styles for your Nav component here */
#nav {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000; /* This ensures the navbar stays on top of other elements */
  background-color: #b0e487; /* This sets the background color of the navbar */
  padding-top: 10px;
}
</style>
