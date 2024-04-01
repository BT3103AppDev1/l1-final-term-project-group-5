<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title class="text-center">Reset Password</v-card-title>
          <v-card-text class="text-center">
            <v-form>
              <v-col cols="12" md="12">
                <v-text-field
                  id="email"
                  label="Email"
                  type="email"
                  required
                  autofocus
                  v-model="email"
                  autocomplete="false"
                ></v-text-field>

                <v-text-field
                  id="password"
                  label="Old Password"
                  type="password"
                  required
                  autofocus
                  v-model="password"
                  autocomplete="false"
                ></v-text-field>

                <v-text-field
                  id="newPassword"
                  label="New Password"
                  type="password"
                  required
                  autofocus
                  v-model="newPassword"
                  autocomplete="false"
                  :rules="passwordRules"
                  @input="validate"
                ></v-text-field>

                <v-text-field
                  id="repeatPassword"
                  label="Retype New Password"
                  type="password"
                  required
                  autofocus
                  v-model="repeatPassword"
                  autocomplete="false"
                  :rules="passwordRules"
                  @input="validate2"
                ></v-text-field>

                <v-btn
                  color="#B0E487"
                  append-icon="$vuetify"
                  style="margin-right: 16px"
                  @click="updatePassword"
                  >Confirm</v-btn
                >

                <v-btn color="red" append-icon="$vuetify" to="/profile"
                  >Cancel</v-btn
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
  name: "ResetPassword",
  setup() {
    const store = useStore();
    const router = useRouter();
    const email = ref("");
    const password = ref("");
    const newPassword = ref("");
    const repeatPassword = ref("");
    const valid = ref(false);
    const valid2 = ref(false);

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
        (rule) => rule(newPassword.value) === true
      );
    };

    const validate2 = () => {
      valid2.value = passwordRules.every(
        (rule) => rule(repeatPassword.value) === true
      );
    };

    const updatePassword = async () => {
      if (
        valid.value &&
        valid2.value &&
        newPassword.value === repeatPassword.value
      ) {
        try {
          await store.dispatch("updateNewPassword", 
          { email: email.value,
            password: password.value,
            newPassword: newPassword.value,
          });
          router.push("/profile");
        } catch (error) {
          await store.dispatch("addNotification", {
            type: "error",
            message: error,
          });
        }
      } else {
        if (valid.value === false || valid2.value === false) {
          await store.dispatch("addNotification", {
            type: "error",
            message: "Password does not meet requirements",
          });
        } else if (newPassword.value !== repeatPassword.value) {
          await store.dispatch("addNotification", {
            type: "error",
            message: "Passwords do not match",
          });
        }
      }
    };

    return {
      email,
      passwordRules,
      password,
      newPassword,
      repeatPassword,
      valid,
      valid2,
      updatePassword,
      validate,
      validate2,
    };
  },
};
</script>
