<template>
  <div class="marketplace">
    <div class="products-section">
      <h2>Products</h2>
      <div class="products-grid">
        <div class="product-card" v-for="product in products" :key="product.id">
          <img :src="product.image" :alt="product.name" />
          <div class="product-info">
            <h3>{{ product.name }}</h3>
            <p>{{ product.category }}</p>
          </div>
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
export default {
    methods: {
      AddProduct() {
        this.$router.push('marketplace/add-product');
      },
      AddListing() {
        this.$router.push('marketplace/add-listing')
      },
    },
  }

</script>
<style scoped>
  
</style>
  