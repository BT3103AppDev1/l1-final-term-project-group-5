<template>
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
                <v-btn
                  color="primary"
                  @click="submitForm"
                  >Confirm</v-btn
                >
              </v-col>
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
  name: "ForgetPassword",
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
