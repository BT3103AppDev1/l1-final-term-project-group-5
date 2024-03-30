<template>
  <v-sheet class="mx-auto" width="300">
    <h1>Add New Product</h1>
    <v-form @submit.prevent="addProduct">

      <v-text-field
        v-model="product.name"
        label="Product Name"
        required
      ></v-text-field>

      <v-select
        v-model="product.category"
        :items="categories"
        label="Select Product Category"
      ></v-select>

      <v-text-field
      v-model="product.weight"
      label="Enter Product Weight"
      type="number"
      required
    ></v-text-field>
      
      <v-file-input 
        v-model="product.image"
        label="Upload Product Image"
        prepend-icon="mdi-paperclip" 
        required>
      </v-file-input>

      <v-btn 
        block variant="tonal" 
        elevation="3"
        type="submit">Add to Marketplace</v-btn>

    </v-form>
  </v-sheet>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      product: {
        name: '',
        category: '',
        imageUrl: null,
        weight: '',
      },
      categories: ['Baked Good', 'Dairy', 'Fruit', 'Vegetable'] // list of categories
    };
  },
  
  methods: {
    ...mapActions(['addProductToDB']),

    onFileChange(e) {
      const file = e.target.files[0];
      this.product.image = file;
    },

    async addProduct() {
      if(this.product.name && this.product.category && this.product.image) {
        await this.addProductToDB(this.product);
        this.$router.push('/partner/marketplace'); // redirect to marketplace after adding
      } else {
        alert('All fields are required');
      }
    }
  }
}
</script>