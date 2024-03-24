<template>
  <v-app-bar fixed color="#B0E487">
    <v-toolbar-items>
      <router-link to="/">
        <img
          src="../assets/GreenHarborLogo.png"
          alt="Green Harbor Logo"
          class="logo"
        />
      </router-link>
      <v-btn to="/">Home</v-btn>
      <v-btn to="/">Marketplace</v-btn>
      <v-btn text to="/">My Orders</v-btn>
    </v-toolbar-items>

    <v-spacer></v-spacer>

    <v-menu min-width="200px" rounded>
      <template v-slot:activator="{ props }">
        <v-btn icon v-bind="props">
          <v-avatar size="large">
            <img :src="user.photoURL" />
          </v-avatar>
        </v-btn>
      </template>
      <v-card>
        <v-card-text>
          <div class="mx-auto text-center">
            <h3>{{ user.displayName }}</h3>
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
import { useStore } from "vuex";
import { useRouter } from "vue-router";

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
    console.log(props.user.data);
    const signOut = async () => {
      await store.dispatch("logOut");
      router.push("/login");
    };

    return { signOut, user: props.user.data };
  },
};
</script>

<style scoped>
.logo {
  max-height: 60px;
  margin-bottom: -10px;
}
.v-toolbar-items {
  float: right !important;
}
</style>
