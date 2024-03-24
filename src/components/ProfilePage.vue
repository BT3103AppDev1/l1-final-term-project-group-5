<template>
  <v-row justify="center">
    <v-col cols="12" md="8">
      <v-card>
        <v-card-title class="text-center">Profile Page</v-card-title>
        <v-card-text class="text-center">
          <v-alert v-if="error" type="error">{{ error }}</v-alert>
          <v-form>
            <v-row justify="center">
              <v-col
                align-self="start"
                class="d-flex justify-center align-center pa-0"
                cols="12"
              >
                <v-avatar
                  class="profile avatar-center-heigth avatar-shadow"
                  color="grey"
                  size="164"
                >
                  <img
                    :src="user.data.photoURL" 
                    class="avatar-image"/>

                  <v-btn
                    class="upload-btn absolute bottom"
                    x-large
                    icon="mdi-antenna"
                  >
                  </v-btn>
                </v-avatar>
              </v-col>
            </v-row>

            <v-col cols="12" md="12" flass="mt-5">
              <v-text-field
                id="name"
                label="Name"
                type="name"
                required
                autofocus
                v-model="user.data.displayName"
                autocomplete="name"
                :disabled="!editing"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="12">
              <v-text-field
                id="email"
                label="Email"
                type="email"
                required
                autofocus
                v-model="user.data.email"
                autocomplete="email"
                :disabled="!editing"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="12">
              <v-text-field
                id="password"
                label="Password"
                type="password"
                required
                v-model="password"
                autocomplete="new-password"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="12">
              <v-text-field
                id="about"
                label="About"
                type="about"
                required
                v-model="user.data.about"
                autocomplete="false"
                :disabled="!editing"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="12">
              <v-text-field
                id="address"
                label="Address"
                type="address"
                required
                v-model="user.data.address"
                autocomplete="false"
                :disabled="!editing"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="12" class="text-center">
              <v-btn @click="toggleEditing" color="primary">
                {{ editing ? 'Save' : 'Edit' }}
              </v-btn>
            </v-col>

          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import { mapState } from 'vuex';
import { useRouter } from "vue-router";
import { connectStorageEmulator } from "firebase/storage";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiAccount } from "@mdi/js";


export default {
  name: "ProfileComponent",
  computed: {
    ...mapState(['user']),
  },
  setup() {
    const editing = ref(false); // Reactive variable to track editing mode
    const name = ref(""); // Reactive variable for name
    const email = ref(""); // Reactive variable for email
    const password = ref(""); // Reactive variable for password
    const error = ref(null);
  
    const toggleEditing = () => {
      editing.value = !editing.value; // Toggle editing mode
    };

    return {
      editing,
      name,
      email,
      password,
      error, 
      toggleEditing,
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

.upload-btn {
  position: absolute !important;
  z-index: 999;
  top: 121px;
  color: cadetblue;
  background: #b0e487;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>