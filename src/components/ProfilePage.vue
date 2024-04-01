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
                  color="white"
                  size="164"
                >
                  <img :src="user.photoURL" class="avatar-image" />

                  <v-btn
                    class="upload-btn absolute bottom"
                    x-large
                    icon="$vuetify"
                    @click="onUploadButtonClick"
                  >
                    <svg-icon type="mdi" :path="path"></svg-icon>
                  </v-btn>

                  <input
                    type="file"
                    ref="fileInput"
                    accept="image/*"
                    @change="onFileChange"
                    style="display: none"
                  />
                </v-avatar>
              </v-col>
            </v-row>

            <v-col cols="12" md="12" flass="mt-5">
              <v-text-field
                id="userType"
                label="Usertype"
                type="text"
                required
                autofocus
                v-model="user.type"
                :readonly="true"
              >
              </v-text-field>
            </v-col>

            <v-col cols="12" md="12" flass="mt-5">
              <v-text-field
                id="displayName"
                label="Name"
                type="name"
                required
                autofocus
                v-model="displayName"
                autocomplete="name"
                :readonly="!editingName"
              >
                <template v-slot:append>
                  <v-btn
                    small
                    color="primary"
                    v-if="!editingName"
                    @click="startEditingName"
                  >
                    Edit
                  </v-btn>
                  <v-btn
                    small
                    color="green"
                    v-if="editingName"
                    @click="confirmNameChange"
                  >
                    Confirm
                  </v-btn>
                  <v-btn
                    small
                    color="red"
                    v-if="editingName"
                    @click="cancelNameChange"
                  >
                    Cancel
                  </v-btn>
                </template>
              </v-text-field>
            </v-col>

            <v-col cols="12" md="12">
              <v-text-field
                id="email"
                label="Email"
                required
                v-model="email"
                :readonly="true"
              >
                <template v-slot:append>
                  <v-btn
                    small
                    color="primary"
                    @click="startEditingEmail"
                  >
                    Edit
                  </v-btn>
                </template>
              </v-text-field>
            </v-col>

            <v-col cols="12" md="12" v-if="user.type !== 'ecoSeeker'">
              <v-text-field
                id="about"
                label="About"
                required
                v-model="about"
                :readonly="!editingAbout"
              >
                <template v-slot:append>
                  <v-btn
                    small
                    color="primary"
                    v-if="!editingAbout"
                    @click="startEditingAbout"
                  >
                    Edit
                  </v-btn>
                  <v-btn
                    small
                    color="green"
                    v-if="editingAbout"
                    @click="confirmAboutChange"
                  >
                    Confirm
                  </v-btn>
                  <v-btn
                    small
                    color="red"
                    v-if="editingAbout"
                    @click="cancelAboutChange"
                  >
                    Cancel
                  </v-btn>
                </template>
              </v-text-field>
            </v-col>

            <v-col cols="12" md="12" v-if="user.type !== 'ecoSeeker'">
              <v-text-field
                id="address"
                label="Address"
                required
                v-model="address"
                :readonly="!editingAddress"
              >
                <template v-slot:append>
                  <v-btn
                    small
                    color="primary"
                    v-if="!editingAddress"
                    @click="startEditingAddress"
                  >
                    Edit
                  </v-btn>
                  <v-btn
                    small
                    color="green"
                    v-if="editingAddress"
                    @click="confirmAddressChange"
                  >
                    Confirm
                  </v-btn>
                  <v-btn
                    small
                    color="red"
                    v-if="editingAddress"
                    @click="cancelAddressChange"
                  >
                    Cancel
                  </v-btn>
                </template>
              </v-text-field>
            </v-col>

            <v-col cols="12" md="12">
              <v-btn
                id="emailVerification"
                label="EmailVerification"
                color="#B0E487"
                @click="sendEmailVerification"
                >Send Email Verification</v-btn
              >
            </v-col>

            <v-col cols="12" md="12">
              <v-btn 
                id="password" 
                label="Password" 
                color="#B0E487" 
                to="/resetPassword"
                >Reset Password</v-btn
              >
            </v-col>

            <v-col cols="12" md="12" v-if="user.type == 'ecoPartner'">
              <v-btn id="bankDetails" label="BankDetails" color="#B0E487"
                >Enter Bank Details</v-btn
              >
            </v-col>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { ref, watch, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { mapState } from "vuex";
import router from "../router/index";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiCameraOutline } from "@mdi/js";

export default {
  name: "ProfileComponent",
  components: {
    SvgIcon,
  },
  computed: {
    ...mapState({
      user: (state) => state.user,
    }),
    user() {
      return store.state.user;
    },
  },

  setup() {
    const editing = ref(false); // Reactive variable to track editing mode
    const displayName = ref(""); // Reactive variable for name
    const email = ref(""); // Reactive variable for email
    const about = ref(""); // Reactive variable for about
    const profilePicture = ref(""); // Reactive variable for profile picture
    const address = ref(""); // Reactive variable for address

    const password = ref(""); // Reactive variable for password
    const error = ref(null);
    const fileInput = ref(null); // Reactive variable for file input
    const store = useStore(); // Access Vuex store
    const user = computed(() => store.state.user);

    const editingName = ref(false);
    const originalName = ref("");
    const originalEmail = ref("");
    const editingAbout = ref(false);
    const originalAbout = ref("");
    const editingAddress = ref(false);
    const originalAddress = ref("");

    watch(user, (newUser) => {
      displayName.value = newUser.displayName;
      email.value = newUser.email;
      about.value = newUser.about;
      profilePicture.value = newUser.photoURL;
      address.value = newUser.address;
    });

    onMounted(() => {
      console.log("mounted");
      displayName.value = user.value.displayName;
      email.value = user.value.email;
      about.value = user.value.about;
      address.value = user.value.address;

      originalName.value = user.value.displayName;
      originalEmail.value = user.value.email;
      originalAbout.value = user.value.about;
      originalAddress.value = user.value.address;
    });

    const onUploadButtonClick = () => {
      fileInput.value.click();
    };

    const onFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        store.dispatch("uploadProfilePicture", file);
        store.dispatch("addNotification", {
          type: "success",
          message: "Profile picture updated successfully",
        });
      }
    };

    const fetchUpdatedData = () => {
      // Fetch the updated data here
      return store.dispatch("fetchUpdatedData");
    };

    const startEditingName = () => {
      originalName.value = user.value.displayName;
      editingName.value = true;
    };

    const confirmNameChange = () => {
      // Confirm the name change here
      editingName.value = false;
      store.dispatch("updateDisplayName", displayName.value);
      store.dispatch("addNotification", {
        type: "success",
        message: "Name updated successfully",
      });
    };

    const cancelNameChange = () => {
      // Cancel the name change here
      editingName.value = false;
      console.log(originalName.value);
      console.log(user.value);
      displayName.value = originalName.value;
      return store.dispatch("updateDisplayName", originalName.value);
    };

    const startEditingEmail = async () => {
      originalEmail.value = user.value.email;
      const result = await store.dispatch("checkEmailVerified");
      console.log(result)
      if (result) {
        router.push("/changeEmail");
      }
    };

    const startEditingAbout = () => {
      originalAbout.value = user.value.about;
      editingAbout.value = true;
    };

    const confirmAboutChange = () => {
      // Confirm the about change here
      editingAbout.value = false;
      store.dispatch("updateAbout", about.value);
      store.dispatch("addNotification", {
        type: "success",
        message: "About updated successfully",
      });
    };

    const cancelAboutChange = () => {
      // Cancel the about change here
      editingAbout.value = false;
      about.value = originalAbout.value;
      return store.dispatch("updateAbout", originalAbout.value);
    };

    const startEditingAddress = () => {
      originalAddress.value = user.value.address;
      editingAddress.value = true;
    };

    const confirmAddressChange = () => {
      // Confirm the address change here
      editingAddress.value = false;
      store.dispatch("updateAddress", address.value);
      store.dispatch("addNotification", {
        type: "success",
        message: "Address updated successfully",
      });
    };

    const cancelAddressChange = () => {
      // Cancel the address change here
      editingAddress.value = false;
      address.value = originalAddress.value;
      return store.dispatch("updateAddress", originalAddress.value);
    };

    const sendEmailVerification = () => {
      store.dispatch("sendEmailVerification");
    };

    return {
      editing,
      displayName,
      email,
      password,
      error,
      about,
      user,
      address,
      fileInput,

      onUploadButtonClick,
      onFileChange,
      fetchUpdatedData,
      editingName,
      originalName,
      startEditingName,
      confirmNameChange,
      cancelNameChange,
      originalEmail,
      startEditingEmail,
      editingAbout,
      originalAbout,
      startEditingAbout,
      confirmAboutChange,
      cancelAboutChange,
      editingAddress,
      originalAddress,
      startEditingAddress,
      confirmAddressChange,
      cancelAddressChange,
      sendEmailVerification,
    };
  },
  data() {
    return {
      path: mdiCameraOutline,
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
