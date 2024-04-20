<template>
  <div class="background">
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="8">
          <v-card class="card">
            <v-card-title class="text-center">Register</v-card-title>
            <v-card-text class="text-center">
              <v-alert v-if="error" type="error">{{ error }}</v-alert>
              <v-form @submit.prevent="RegisterWithEmail">
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
                    v-model="password"
                    :rules="passwordRules"
                    autocomplete="false"
                    @input="validate"
                  ></v-text-field>
                </v-col>

                <v-row justify="center">
                  <v-col cols="12" md="2" sm="2">
                    <v-btn
                      append-icon="mdi-email-outline"
                      type="submit"
                      color="#4B644C"
                      :disabled="!valid"
                      @click="RegisterWithEmail"
                    >
                      Register
                    </v-btn>
                  </v-col>
                </v-row>

                <v-row justify="center">
                  <v-col cols="12" md="3" sm="2">
                    <v-btn
                      append-icon="mdi-google"
                      color="#4B644C"
                      @click="RegisterWithGoogle"
                    >
                      Register with Google
                    </v-btn>
                  </v-col>
                </v-row>

                <v-row justify="center">
                  <v-col cols="12" md="4" sm="3">
                    <v-card-text>
                      If you are already registered, you can
                      <router-link to="/login">login here</router-link>.
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
import { connectStorageEmulator } from "firebase/storage";

export default {
  name: "RegisterComponent",
  setup() {
    const email = ref("");
    const password = ref("");
    const error = ref(null);
    const valid = ref(false);

    const store = useStore();
    const router = useRouter();

    const passwordRules = [
      (v) => !!v || "Password is required",
      (v) => (v && v.length >= 8) || "Password must be at least 8 characters",
      (v) => (v && /\d/.test(v)) || "Password must contain at least one number",
      (v) =>
        (v && /[a-z]/.test(v)) ||
        "Password must contain at least one lowercase letter",
      (v) =>
        (v && /[A-Z]/.test(v)) ||
        "Password must contain at least one uppercase letter",
      (v) =>
        (v && /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(v)) ||
        "Password must contain at least one special character",
    ];

    const validate = () => {
      valid.value = passwordRules.every(
        (rule) => rule(password.value) === true
      );
    };

    const RegisterWithEmail = async () => {
      try {
        console.log("Email:", email.value);
        console.log("Password:", password.value);
        await store.dispatch("registerWithEmail", {
          email: email.value,
          password: password.value,
        });
        router.push("/registerDetails");
      } catch (err) {
        error.value = err.message;
      }
    };

    const RegisterWithGoogle = async () => {
      try {
        await store.dispatch("registerWithGoogle", {});
        router.push("/registerDetails");
      } catch (err) {
        error.value = err.message;
      }
    };

    return {
      RegisterWithEmail,
      RegisterWithGoogle,
      email,
      password,
      error,
      passwordRules,
      validate,
      valid,
    };
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

.btn.active {
  background-color: #30c77b; /* Eco-friendly green */
  border-color: #30c77b;
  color: white; /* You might want to change the text color to ensure it's readable on the green background */
}

.card {
  background-color: rgba(255, 255, 255, 0.5);
}
</style>
