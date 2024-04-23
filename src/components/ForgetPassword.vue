<template>
  <div class="background">
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="8">
          <v-card>
            <v-card-title class="text-center">Forget Password</v-card-title>
            <v-card-text class="text-center">
              <v-form @submit.prevent="submitForm">
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
                  <v-btn color="#4B644C" @click="submitForm">Confirm</v-btn>
                </v-col>
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
  name: "ForgetPasswordComponent",
  setup() {
    const store = useStore();
    const email = ref("");

    const submitForm = async () => {
      await store.dispatch("forgetPassword", email.value);
    };
    return { submitForm, email };
  },
};
</script>

<style scoped>
.background {
  background: url("../assets/bg2.png") no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
