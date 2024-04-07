<template>
  <div class="d-flex justify-center align-center" style="height: 100vh;">
    <v-sheet class="mx-auto" width="300">
      <h1>Add New Product</h1>
      <v-form @submit.prevent="addProduct">

        <v-text-field v-model="product.name" label="Product Name" required></v-text-field>

        <v-select v-model="product.category" :items="categories" label="Select Product Category" required></v-select>

        <v-text-field v-model.number="product.weight" label="Enter Product Weight" type="number" required></v-text-field>

        <v-file-input label="Upload Product Image" prepend-icon="mdi-paperclip" @change="onFileChange" chips required>
        </v-file-input>

        <v-btn block variant="tonal" elevation="3" class="submit-button" type="submit">Add to Marketplace</v-btn>

      </v-form>
    </v-sheet>
  </div>
</template>

<script>
import { auth } from "../firebase.js";
import { mapActions } from 'vuex';
import { onAuthStateChanged } from "firebase/auth";

export default {
  data() {
    return {
      user: null,
      product: {
        name: '',
        category: '',
        imageUrl: null,
        weight: '',
        sellerId: '',
      },
      categories: ['Baked Good', 'Dairy', 'Fruit', 'Vegetable'] // list of categories
    };
  },
  mounted() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.user = user;
        this.product.sellerId = user.uid;
      }
    });
  },
  methods: {
    ...mapActions(['addProductToDB']),

    onFileChange(e) {
      const file = e.target.files[0];
      this.product.image = file;
    },

    async addProduct() {
      if (this.product.name && this.product.category && this.product.image) {
        await this.addProductToDB(this.product);
        this.$router.push('/partner/marketplace'); // redirect to marketplace after adding
      } else {
        alert('All fields are required');
      }
    }
  }
}
</script>

<style>
.submit-button {
  background-color: #4CAF50;
  /* Green */
  color: white
}
</style>