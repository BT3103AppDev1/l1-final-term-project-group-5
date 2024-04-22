<template>
  <div class="background">
    <div class="self-start">
      <v-btn icon @click="goBackToMarketplace">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
    </div>
    <v-sheet class="mx-auto" width="300">
      <h1 class="transparent-bg">Add New Product</h1>
      <v-form ref="form" @submit.prevent="addProduct">
        <v-text-field
          v-model="product.name"
          label="Product Name"
          :rules="nameRules"
          required
        ></v-text-field>

        <v-select
          v-model="product.category"
          :items="categories"
          label="Select Product Category"
          :rules="[v => !!v || 'Category is required']"
          required
        ></v-select>

        <v-text-field
          v-model.number="product.weight"
          label="Enter Product Weight (grams)"
          type="number"
          :rules="weightRules"
          required
        ></v-text-field>

        <v-file-input
          label="Upload Product Image"
          prepend-icon="mdi-paperclip"
          @change="onFileChange"
          chips
          required
        >
        </v-file-input>

        <v-btn
          block
          variant="tonal"
          elevation="3"
          class="submit-button"
          type="submit"
          >Add to Marketplace</v-btn
        >
      </v-form>
    </v-sheet>
  </div>
</template>

<script>
import { auth } from "../firebase.js";
import { mapActions } from "vuex";
import { onAuthStateChanged } from "firebase/auth";

export default {
  data() {
    return {
      user: null,
      product: {
        name: "",
        category: "",
        imageUrl: null,
        weight: "",
        sellerId: "",
        store: null,
      },
      categories: ["Baked Good", "Dairy", "Fruit", "Vegetable"], // list of categories,
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 10) || 'Name must be less than 10 characters'
      ],
      weightRules: [
        v => !isNaN(parseFloat(v)) && v >= 0 || 'Weight must be a positive number',
      ],
    };
  },
  mounted() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.user = user;
        this.product.sellerId = user.uid;
      }
    });
    this.store = this.$store;
  },
  methods: {
    ...mapActions(["addProductToDB"]),

    onFileChange(e) {
      const file = e.target.files[0];
      this.product.image = file;
    },

    async addProduct() {
      if (this.product.name && this.product.category && this.product.weight && this.product.image) {
        if (this.product.name.length <= 10 && this.product.weight > 0) {
          await this.addProductToDB(this.product);
          this.$router.push("/partner/marketplace"); // redirect to marketplace after adding
          this.store.dispatch("addNotification", {
            // use store from instance
            type: "success",
            message: "Successfully added product!",
          });
        } else {
          this.store.dispatch("addNotification", {
            type: "error",
            message: "Please correct the errors in the form",
          });
        }
      } else {
        this.store.dispatch("addNotification", {
          type: "error",
          message: "Please fill in all fields",
        });
      }
    },

    goBackToMarketplace() {
      this.$router.go(-1); // This line will take you back to the previous page
    },
  },
};
</script>

<style scoped>
.background {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  background: url("..\\assets\\bg2.png") no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  width: 100%;
}

.submit-button {
  background-color: #4caf50;
  /* Green */
  color: white;
}

.self-start {
  align-self: flex-start;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
  background-color: transparent;
}
</style>
