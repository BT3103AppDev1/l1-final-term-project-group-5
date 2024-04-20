<template>
  <div class="background">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="card">
          <h1 :style="{ paddingBottom: '20px', textAlign: 'center' }">
            Profile Page
          </h1>
          <v-card-text class="text-center">
            <v-alert v-if="error" type="error">{{ error }}</v-alert>
            <v-form>
              <v-row justify="center" :style="{ paddingBottom: '20px' }">
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
                      color="#4B644C"
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
                    <v-btn small color="#4B644C" @click="startEditingEmail">
                      Edit
                    </v-btn>

                    <v-dialog
                      v-model="dialogEmail"
                      persistent
                      max-width="600px"
                    >
                      <v-card>
                        <v-card-title class="text-center"
                          >Update Email</v-card-title
                        >
                        <v-card-text class="text-center">
                          <v-form>
                            <!-- ... -->
                            <v-text-field
                              id="newEmail"
                              label="New Email"
                              type="email"
                              required
                              autofocus
                              v-model="newEmail"
                              autocomplete="false"
                            ></v-text-field>

                            <!-- ... -->
                            <v-text-field
                              id="emailPassword"
                              label="Password"
                              type="password"
                              required
                              autofocus
                              v-model="emailPassword"
                              autocomplete="false"
                            ></v-text-field>

                            <!-- ... -->
                            <v-btn
                              color="#4B644C"
                              @click="updateEmail"
                              style="margin-right: 16px"
                            >
                              Confirm
                            </v-btn>

                            <v-btn color="red" @click="dialogEmail = false">
                              Cancel
                            </v-btn>
                          </v-form>
                        </v-card-text>
                      </v-card>
                    </v-dialog>
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
                      color="#4B644C"
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
                      color="#4B644C"
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
                  color="#4B644C"
                  @click="sendEmailVerification"
                  >Send Email Verification</v-btn
                >
              </v-col>

              <v-col cols="12" md="12">
                <v-btn
                  id="resetPassword"
                  label="Password"
                  color="#4B644C"
                  @click="dialogPassword = true"
                >
                  Reset Password
                </v-btn>

                <v-dialog v-model="dialogPassword" persistent max-width="600px">
                  <v-card>
                    <v-card-title class="text-center"
                      >Reset Password</v-card-title
                    >
                    <v-card-text class="text-center">
                      <v-form>
                        <!-- ... -->
                        <v-text-field
                          id="emailPwReset"
                          label="Email"
                          type="email"
                          required
                          autofocus
                          v-model="emailPwReset"
                          autocomplete="false"
                        ></v-text-field>

                        <v-text-field
                          id="password"
                          label="Old Password"
                          type="password"
                          required
                          autofocus
                          v-model="oldPassword"
                          autocomplete="false"
                        ></v-text-field>

                        <!-- ... -->
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

                        <!-- ... -->
                        <v-btn
                          color="#4B644C"
                          style="margin-right: 16px"
                          @click="updatePassword"
                        >
                          Confirm
                        </v-btn>

                        <v-btn color="red" @click="dialogPassword = false">
                          Cancel
                        </v-btn>
                      </v-form>
                    </v-card-text>
                  </v-card>
                </v-dialog>
              </v-col>

              <v-col cols="12" md="12" v-if="user.type == 'ecoPartner'">
                <v-btn
                  id="bankDetails"
                  label="BankDetails"
                  color="#4B644C"
                  @click="dialogBank = true"
                >
                  {{ bankButtonText }}
                </v-btn>

                <v-dialog v-model="dialogBank" persistent max-width="600px">
                  <v-card>
                    <v-card-title>
                      <span class="headline">Enter Bank Details</span>
                    </v-card-title>

                    <v-card-text>
                      <v-form ref="bankForm">
                        <v-text-field
                          label="Account Number"
                          v-model="bankNumber"
                          required
                          type="text"
                        ></v-text-field>

                        <v-text-field
                          label="Confirm with Password"
                          v-model="password"
                          type="password"
                          required
                        ></v-text-field>
                      </v-form>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="red" text @click="dialogBank = false"
                        >Close</v-btn
                      >
                      <v-btn
                        color="green darken-1"
                        text
                        @click="saveBankDetails"
                        >Save</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-col>

              <v-col cols="12" md="12">
                <h3 style="font-size: 20px">
                  You have saved:
                  <span style="color: green">{{ user.weight / 1000 }} kg</span>!
                </h3>
              </v-col>

              <v-col cols="12" md="12" v-if="user.type == 'ecoPartner'">
                <h3 style="font-size: 20px">
                  You are currently
                  <span style="color: green">EcoRank {{ user.rank }}</span
                  >!
                </h3>
              </v-col>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
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

    const bankForm = ref(null);
    const dialogBank = ref(false);
    const bankNumber = ref("");

    const dialogPassword = ref(false);
    const oldPassword = ref("");
    const newPassword = ref("");
    const repeatPassword = ref("");
    const valid = ref(false);
    const valid2 = ref(false);
    const emailPwReset = ref("");
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

    const dialogEmail = ref(false);
    const newEmail = ref("");
    const emailPassword = ref("");
    const bankButtonText = computed(() => {
      // Replace 'bankDetails' with the actual data property or getter that holds the bank details
      if (user.value.bankDetails === "") {
        return "Enter Bank Details";
      } else {
        return "Change Bank Details";
      }
    });

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

      store.dispatch("fetchWeight");
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
      console.log(result);
      if (result) {
        dialogEmail = true;
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
      store.dispatch("resendEmailVerification");
    };

    const saveBankDetails = () => {
      if (bankForm.value.validate()) {
        store.dispatch("updateBankDetails", bankNumber.value);
        dialogBank.value = false;
      }
      // store.dispatch("saveBankDetails", bankNumber.value);
      // dialog.value = false;
    };

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
          await store.dispatch("updateNewPassword", {
            email: email.value,
            password: oldPassword.value,
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

    const updateEmail = async () => {
      try {
        await store.dispatch("updateEmail", {
          oldEmail: email.value,
          newEmail: newEmail.value,
          password: emailPassword.value,
        });
        router.push("/profile");
      } catch (error) {
        store.dispatch("addNotification", {
          type: "error",
          message: "Error updating email: " + error,
        });
      }
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

      bankForm,
      dialogBank,
      bankNumber,
      saveBankDetails,

      dialogPassword,
      oldPassword,
      newPassword,
      repeatPassword,
      valid,
      valid2,
      passwordRules,
      validate,
      validate2,
      updatePassword,
      emailPwReset,

      dialogEmail,
      newEmail,
      emailPassword,
      updateEmail,

      bankButtonText,
    };
  },
  data() {
    return {
      path: mdiCameraOutline,
    };
  },
};
</script>

<style scoped>
.background {
  background: url("..\\..\\public\\bg2.png") no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  width: 100%;
  height: 120vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 20px;
}

.btn.active {
  background-color: #30c77b;
  border-color: #30c77b;
  color: white;
}

.upload-btn {
  position: absolute !important;
  z-index: 999;
  top: 121px;
  color: cadetblue;
  background: #4b644c;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card {
  background-color: rgba(255, 255, 255, 0.5);
}
</style>
