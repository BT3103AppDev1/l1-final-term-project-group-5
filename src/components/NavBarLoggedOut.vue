<template>
  <v-app-bar fixed color="#B0E487">
    <v-toolbar-items>
      <router-link to="/">
        <img src="../assets/GreenHarborLogo.png" alt="Green Harbor Logo" class="logo" />
      </router-link>
    </v-toolbar-items>
    <v-spacer></v-spacer>
    <v-btn text to="/Register">Sign Up</v-btn>
    <v-btn text to="/Login">Login</v-btn>
  </v-app-bar>
</template>

<script>
export default {
  name: "NavLoggedOut",
};
</script>

<style scoped>
.logo {
  max-height: 60px;
  margin-bottom: -10px;
}
</style>
