<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title class="text-center">Register</v-card-title>
          <v-card-text class="text-center">
            <v-alert v-if="error" type="error">{{ error }}</v-alert>
            <v-form @submit.prevent="RegisterWithEmail">
              
                <v-row  justify="center">
                  <v-col cols="12" md="2">
                    <v-btn
                      value="ecoSeeker"
                      class="btn btn-outline-primary"
                      :class="{
                        active: selectedUserType === 'ecoSeeker',
                      }"
                      @click="setUserType('ecoSeeker')"
                    >
                      Eco-Seeker
                    </v-btn>
                  </v-col>
                  <v-col cols="12" md="2">
                    <v-btn
                      value="ecoPartner"
                      class="btn btn-outline-primary"
                      :class="{
                        active: selectedUserType === 'ecoPartner',
                      }"
                      @click="setUserType('ecoPartner')"
                    >
                      Eco-Partner
                    </v-btn>
                  </v-col>
                </v-row>
              

              
                <v-col cols="12" md="12">
                  <v-text-field
                    id="name"
                    label="Name"
                    type="name"
                    required
                    autofocus
                    v-model="name"
                    autocomplete="name"
                  ></v-text-field>
                </v-col>
              

              
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
                  ></v-text-field>
                </v-col>
              

              <v-row justify="center" >
                <v-col cols="12" md="2">
                  <v-btn
                    append-icon="$vuetify"
                    type="submit"
                    color="primary"
                    @click="RegisterWithEmail"
                  >
                    Register
                  </v-btn>
                </v-col>
              </v-row>

              <v-row justify="center">
                <v-col cols="12" md="3">
                  <v-btn
                    append-icon="$vuetify"
                    color="primary"
                    @click="RegisterWithGoogle"
                  >
                    Register with Google
                  </v-btn>
                </v-col>
              </v-row>

              <v-row justify="center">
                <v-col cols="12" md="4">
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
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  name: "RegisterComponent",
  setup() {
    const selectedUserType = ref("ecoSeeker");
    const name = ref("");
    const email = ref("");
    const password = ref("");
    const error = ref(null);

    const store = useStore();
    const router = useRouter();

    const setUserType = async (userType) => {
      selectedUserType.value = userType;

      store.dispatch("setUserType", { userType: userType });
    };

    const RegisterWithEmail = async () => {
      try {
        await store.dispatch("registerWithEmail", {
          email: email.value,
          password: password.value,
          name: name.value,
          userType: selectedUserType.value,
        });
        router.push("/");
      } catch (err) {
        error.value = err.message;
      }
    };

    const RegisterWithGoogle = async () => {
      try {
        await store.dispatch("registerWithGoogle", {
          userType: selectedUserType.value,
        });
        router.push("/");
      } catch (err) {
        error.value = err.message;
      }
    };

    return {
      RegisterWithEmail,
      RegisterWithGoogle,
      name,
      email,
      password,
      error,
      selectedUserType,
      setUserType,
    };
  },
};
</script>

<style>
.btn.active {
  background-color: #30c77b; /* Eco-friendly green */
  border-color: #30c77b;
  color: white; /* You might want to change the text color to ensure it's readable on the green background */
}


</style>
