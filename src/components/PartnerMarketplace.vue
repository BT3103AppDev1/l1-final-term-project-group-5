<template>
  <div class="marketplace">
    <div class="products-section">
      <h2>Products</h2>
      <div class="products-grid">

        <div @click="AddProduct" class="product-card-add-new">
          <span class="plus-icon">+</span>
          <p>Add New Product</p>
          <!---<button @click="AddProduct" class="submit-btn">Add Product</button>-->
        </div>

        <div class="product-card" v-for="product in products" :key="product.id">
          <img :src="product.imageUrl" :alt="product.name" class="product-image">
          <div class="product-info">
            <h3>{{ product.name }}</h3>
            <p>{{ product.category }}</p>
            <p>{{ product.weight }} grams</p>
            <!-- Include other details as per your product data structure -->
          </div>
        </div>

      </div>
    </div>

    <div class="listings-section">
      <h2>Current Listings</h2>
      <div class="listings-container" name="active-listings">
        <div class="listing-card" v-for="listing in activeListings" :key="listing.id">
          <img :src="listing.productImage" :alt="listing.productName" class="listing-image">
          <div class="listing-details">
            <h3>{{ listing.productName }}</h3>
            <p>{{ listing.productCategory }}</p>
            <p>Remaining: {{ listing.unitsRemaining }} / {{ listing.unitsToSell }}</p>
            <p>Price: ${{ listing.price }}</p>
          </div>
        </div>

        <!-- Add New Listing card here -->
        <div @click="AddListing" class="listing-card-add-new">
          <span class="plus-icon">+</span>
          <p>Add New Product</p>
        </div>
      </div>
    </div>

    <div class="expired-section">
      <h2>Expired Listings</h2>
      <div class="listings-container" name="expired-listings">
        <div class="listing-card" v-for="listing in inactiveListings" :key="listing.id">
          <img :src="listing.productImage" :alt="listing.productName" class="listing-image">
          <div class="listing-details">
            <h3>{{ listing.productName }}</h3>
            <p>{{ listing.productCategory }}</p>
            <p>Remaining: {{ listing.unitsRemaining }} / {{ listing.unitsToSell }}</p>
            <p>Price: ${{ listing.price }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { onMounted, ref } from 'vue';
import { db } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default {
  data() {
    return {
      selectedTab: 'products',
      products: []
      //currentListings: [],
      //expiredListings: []
    };
  },
  async mounted() {
    await this.fetchProducts();
    await this.checkAndUpdateListingStatus().then(() => {
      // After updating, fetch the latest active listings
      this.fetchActiveListingsWithProductDetails();
      this.fetchInactiveListingsWithProductDetails();
    });
  },
  computed: {
    ...mapState(['activeListings', 'inactiveListings']),
  },

  methods: {
    ...mapActions(['fetchActiveListingsWithProductDetails', 'fetchInactiveListingsWithProductDetails' , 'checkAndUpdateListingStatus']),
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
.products-section, .listings-section {
  width: 100%;
  box-sizing: border-box;
}

.products-grid, .listings-container{
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: flex-start;
}

.product-card, .product-card-add-new, 
.listing-card, .listing-card-add-new {
  flex: 0 1 200px;          /* Cards will flex but have a base width of 200px */
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  overflow: hidden;         /* Ensures the image does not break the card's round corners */
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 15px;
}

.product-image, .listing-image {
  max-width: 100%;
  height: auto;
  border-bottom: 1px solid #ccc;
}

.product-info, .listing-details{
  margin-top: 10px;
}

.product-card-add-new, .listing-card-add-new {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.plus-icon {
  font-size: 24px;
  margin-bottom: 5px;
}
</style>