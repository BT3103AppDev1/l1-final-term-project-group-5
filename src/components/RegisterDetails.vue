<template>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="8">
          <v-card>
            <v-card-title class="text-center">Register Your Details</v-card-title>
            <v-card-text class="text-center">
              <v-alert v-if="error" type="error">{{ error }}</v-alert>
              <v-form @submit.prevent="RegisterDetails">

                <v-row justify="center">
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
                    id="about"
                    label="About"
                    type="about"
                    required
                    v-model="about"
                    autocomplete="false"
                  ></v-text-field>
                </v-col>
  
                <v-col cols="12" md="12">
                  <v-text-field
                    id="address"
                    label="Address"
                    type="address"
                    required
                    v-model="address"
                    autocomplete="address"
                  ></v-text-field>
                </v-col>
  

  
                <v-row justify="center">
                  <v-col cols="12" md="3" sm="2">
                    <v-btn
                      append-icon="$vuetify"
                      color="primary"
                      @click="RegisterDetails"
                    >
                      Register Details
                    </v-btn>
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
  import { connectStorageEmulator } from "firebase/storage";
  
  export default {
    name: "RegisterDetailsComponent",
    setup() {
      const name = ref("");
      const selectedUserType = ref("ecoSeeker");
      const about = ref("");
      const address = ref("");
      const error = ref(null);
  
      const store = useStore();
      const router = useRouter();
  
      const setUserType = async (userType) => {
        selectedUserType.value = userType;
  
        store.dispatch("setUserType", { userType: userType });
      };
  
      const RegisterDetails = async () => {
        try {
          console.log("Name:", name.value);
          console.log("selectedUserType:", selectedUserType.value);
          console.log("About:", about.value);
            console.log("Address:", address.value);
          await store.dispatch("registerDetails", {
            name: name.value,
            userType: selectedUserType.value,
            about: about.value,
            address: address.value,
          });
          router.push("/");
        } catch (err) {
          error.value = err.message;
        }
      };
  
      return {
        RegisterDetails,
        name,
        about,
        address,
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
  