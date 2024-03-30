<template>
    <v-sheet class="mx-auto" width="300">
      <h2>Add New Listing</h2>
      <form @submit.prevent="submitListing">

        <label for="product">Product</label>
        <v-select
          v-model="newListing.productId"
          :items="products"
          item-title="name"
          item-value="id"
          label="Select Product"
        ></v-select>
        
        <!--
        <div class="form-group">
          <label for="product">Product</label>
          <select id="product" v-model="newListing.productId" required>
            <option disabled value="">Select Product</option>
            <option v-for="product in products" :key="product.id" :value="product.id">
              {{ product.name }}
            </option>
          </select>
        </div>-->

        <v-text-field
          v-model="newListing.expirationDate"
          id="expirationDate"
          label="Expiration Date"
          type="date"
          :min="today"
          required
        ></v-text-field>

        <label for="price">Price</label>
        <v-text-field
        v-model="newListing.price"
        id="price"
        label="Price of product ($)"
        type="number"
        min="0"
        step="0.01"
        required
        ></v-text-field>

        <label for="price">Units To Sell</label>
        <v-text-field
        v-model="newListing.unitsToSell"
        id="unitsToSell"
        label="# of quantity"
        type="number"
        min="1"
        required
        ></v-text-field>

        <v-btn 
        block variant="tonal" 
        elevation="3"
        class="submit-button"
        type="submit">List to Marketplace</v-btn>
      </form>
    </v-sheet>
</template>
  
<script>
  import { ref, onMounted } from 'vue';
  import { db } from '@/firebase';
  import { doc, collection, getDocs, addDoc, updateDoc } from 'firebase/firestore';
  import { mapActions } from 'vuex';

  export default {  
  data() {
    return {
      products: [], // This will hold the array of products from your database
      newListing: {
        productId: '',
        expirationDate: '',
        price: null,
        unitsToSell: null,
        unitsRemaining: null
      }
    };
  },
  async mounted() {
    await this.fetchProducts();
  },
  computed: {
    today() {
      return new Date().toISOString().split('T')[0];
    }
  },
  methods: {
    ...mapActions(['addListing']),
    async fetchProducts() {
      const querySnapshot = await getDocs(collection(db, 'products'));
      this.products = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    },
    async submitListing() {
      try {
        await this.addListing(this.newListing);
        this.$router.push('/partner/marketplace');
        // Reset the form or give user feedback
      } catch (error) {
        console.error('Error adding listing:', error);
      }
    }
  }
};
</script>
  
<style scoped>
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
  }
  
  input[type="date"],
  input[type="number"],
  select {
    width: 100%;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
  }
  
  .submit-button {
    background-color: #4CAF50; /* Green */
    color: white
  }
  
  /* Add responsiveness or other styles as needed */
</style>