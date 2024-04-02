<template>
  <v-app>
    <div style="height: 50px;">
      <v-alert
        v-if="notification"
        :key="notification.id"
        :type="notification.type"
        closable
        :icon="notification.icon"
        class="alert-custom"
        transition="scale-transition"
        absolute
        width="600"
        @click:dismiss="dismissNotification(notification.id)"
      >
        {{ notification.message }}
      </v-alert>
    </div>
    <template v-if="isLoggedIn">
      <NavLoggedIn :user="user" />
    </template>
    <template v-else>
      <div class="nav">
        <NavLoggedOut />
      </div>
    </template>

    <div style="padding-top: 120px">
      <router-view />
    </div>
  </v-app>
</template>

<script>
import { mapState } from "vuex";
import NavLoggedOut from "./components/NavBarLoggedOut.vue";
import NavLoggedIn from "./components/NavBarLoggedIn.vue";

export default {
  name: "App",
  components: {
    NavLoggedOut,
    NavLoggedIn,
  },
  computed: {
    ...mapState({
      isLoggedIn: (state) => state.user.loggedIn,
      user: (state) => state.user,
      notification: (state) => state.notification,
    }),
  },
};
</script>

<style scoped>
/* Import Montserrat font from Google Fonts */
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap");

/* Apply Montserrat font to specific elements */
h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: "Montserrat", sans-serif;
}

.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  align-items: center;
  text-align: center;
  padding-bottom: 1rem;
  z-index: 1000; /* to ensure the navbar stays on top of other elements */
}

.alert-custom {
  position: fixed;
  top: 0; /* Position at the top */
  left: 50%; /* Center horizontally */
  transform: translateX(-50%); /* Center horizontally */
  z-index: 9999; /* Ensure it's above other content */
}

/*
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
*/
</style>
