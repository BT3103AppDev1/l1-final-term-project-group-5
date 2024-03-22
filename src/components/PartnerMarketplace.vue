<template>
  <div class="marketplace">
    <div class="products-section">
      <h2>Products</h2>
      <div class="products-grid">
        <!--
        <div class="product-card" v-for="product in products" :key="product.id">
          <img :src="product.image" :alt="product.name" />
          <div class="product-info">
            <h3>{{ product.name }}</h3>
            <p>{{ product.category }}</p>
          </div>
        </div>
        -->

        <div class="product" v-for="product in products" :key="product.id">
          <img :src="product.imageUrl" alt="">
          <h3>{{ product.name }}</h3>
          <p>{{ product.category }}</p>
          <!-- More product details -->
        </div>
        
        <div class="product-card add-new">
          <button @click="AddProduct" class="submit-btn">Add Product</button>
        </div>
      </div>
    </div>
    
    <div class="listings-section">
      <h2>Current Listings</h2>
      <div class="listings-grid">
        <!-- Repeat the same pattern as above for listings -->
        <div class="listing-card add-new">
          <button @click="AddListing" class="submit-btn">Add New Listing</button>
        </div>
      </div>
    </div>
    
    <div class="expired-section">
      <h2>Expired Listings</h2>
      <div class="expired-grid">
        <!-- Repeat the same pattern as above for expired listings -->
      </div>
    </div>
  </div>
</template>
  
<script>
import { mapState } from 'vuex';
import { onMounted, ref } from 'vue';
import { db } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default {
  data() {
    return {
      selectedTab: 'products',
      products: [],
      currentListings: [],
      expiredListings: []
    };
  },
  async mounted() {
    await this.fetchProducts();
  },
  computed:{
    ...mapState(['products']),
  },
    methods: {
      AddProduct() {
        this.$router.push('marketplace/add-product');
      },
      AddListing() {
        this.$router.push('marketplace/add-listing')
      },
      async fetchProducts() {
        const querySnapshot = await getDocs(collection(db, 'products'));
        this.products = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      }
    },
  }

</script>
<style scoped>
  
</style>
  