<template>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="8">
          <v-card>
            <v-card-title class="text-center">Update Email</v-card-title>
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
                    id="newEmail"
                    label="New Email"
                    type="email"
                    required
                    autofocus
                    v-model="newEmail"
                    autocomplete="false"
                  ></v-text-field>
  
                  <v-text-field
                    id="password"
                    label="Password"
                    type="password"
                    required
                    autofocus
                    v-model="password"
                    autocomplete="false"
                  ></v-text-field>
  
                  <v-btn 
                    color="#B0E487" 
                    append-icon="$vuetify"
                    @click="updateEmail"
                    style="margin-right: 16px;"
                  >Confirm</v-btn>

                  <v-btn 
                  color="red" 
                  append-icon="$vuetify"
                  to="/profile"
                >Cancel</v-btn>

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
    name: "ChangeEmail",
    setup() {
      const store = useStore();
      const email = ref("");
      const newEmail = ref("");
      const password = ref("");
      
      const updateEmail = async () => {
        try {
          await store.dispatch("updateEmail", 
          { oldEmail: email.value, 
            newEmail: newEmail.value, 
            password: password.value});
          router.push("/profile");
        } catch (error) {
          store.dispatch("addNotification", {
            type: "error",
            message: "Error updating email: " + error,
          });
        }
      };      
  
      return {
        email,
        newEmail,
        password,
        updateEmail,
      };
    },
  };
  </script>
  
  