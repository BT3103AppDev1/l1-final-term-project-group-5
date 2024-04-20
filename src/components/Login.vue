<template>
  <div class="background">
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="8">
          <v-card class="card">
            <v-card-title class="text-center">Login</v-card-title>
            <v-card-text class="text-center">
              <v-alert v-if="error" type="error">{{ error }}</v-alert>
              <v-form @submit.prevent="LoginWithEmail">
                <v-col cols="12" md="12">
                  <v-text-field
                    id="email"
                    label="Email"
                    type="email"
                    required
                    autofocus
                    v-model="email"
                    autocomplete="email"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="12">
                  <v-text-field
                    id="password"
                    label="Password"
                    type="password"
                    required
                    class="form-control"
                    v-model="password"
                  ></v-text-field>
                </v-col>

                <v-row justify="center">
                  <v-col cols="12" md="2">
                    <v-btn
                      append-icon="mdi-email-outline"
                      type="submit"
                      color="#4B644C"
                      @click="LoginWithEmail"
                    >
                      Login
                    </v-btn>
                  </v-col>
                </v-row>

                <v-row justify="center">
                  <v-col cols="12" md="3">
                    <v-btn
                      append-icon="mdi-google"
                      color="#4B644C"
                      @click="LoginWithGoogle"
                    >
                      Login with Google
                    </v-btn>
                  </v-col>
                </v-row>

                <v-row justify="center">
                  <v-col cols="12" md="4">
                    <v-card-text>
                      If you aren't registered, you can
                      <router-link to="/register">register here</router-link>.
                    </v-card-text>
                  </v-col>
                </v-row>

                <v-row justify="center">
                  <v-col cols="12" md="4">
                    <v-card-text>
                      <router-link to="/forgetPassword"
                        >Forget Password</router-link
                      >
                    </v-card-text>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  name: "LoginComponent",
  setup() {
    const email = ref("");
    const password = ref("");
    const error = ref(null);

    const store = useStore();
    const router = useRouter();

    const LoginWithEmail = async () => {
      try {
        const result = await store.dispatch("loginWithEmail", {
          email: email.value,
          password: password.value,
        });
        if (result) {
          router.push("/");
          store.dispatch("addNotification", {
            type: "success",
            message: "Successfully logged in!",
          });
        }
      } catch (err) {
        store.dispatch("addNotification", {
          type: "error",
          message: err.message,
        });
      }
    };

    const LoginWithGoogle = async () => {
      try {
        await store.dispatch("registerWithGoogle", {});
        router.push("/");
        store.dispatch("addNotification", {
          type: "success",
          message: "Successfully logged in!",
        });
      } catch (err) {
        error.value = err.message;
      }
    };
    return { LoginWithEmail, email, password, error, LoginWithGoogle };
  },
};
</script>

<style scoped>
.background {
  background: url("..\\assets\\bg2.png") no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  width: 100%;
  height: 100vh;
  display: flex;
  padding-top: 64px;
}

.card {
  background-color: rgba(255, 255, 255, 0.5);
}
</style>
