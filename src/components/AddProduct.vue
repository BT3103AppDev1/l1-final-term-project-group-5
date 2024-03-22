<template>
  <div>
    <h1>Add New Product</h1>
    <form @submit.prevent="addProduct">
      <div>
        <input type="text" v-model="product.name" placeholder="Product Name" required>
      </div>
      <div>
        <select v-model="product.category" required>
          <option disabled value="">Select Product Category</option>
          <!-- Assuming you have categories in your data -->
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>
      <div>
        <input type="number" v-model="product.weight" placeholder="Product Weight" required>
      </div>
      <div>
        <input type="file" @change="onFileChange" required>
      </div>
      <div>
        <button type="submit">Add to Marketplace</button>
      </div>
    </form>
  </div>
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