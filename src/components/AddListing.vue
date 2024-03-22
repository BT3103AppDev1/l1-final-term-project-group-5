<template>
    <div class="add-listing-modal">
      <h2>Add New Listing</h2>
      <form @submit.prevent="submitListing">
        <div class="form-group">
          <label for="product">Product</label>
          <select id="product" v-model="newListing.productId" required>
            <option disabled value="">Select Product</option>
            <option v-for="product in products" :key="product.id" :value="product.id">
              {{ product.name }}
            </option>
          </select>
        </div>
  
        <div class="form-group">
          <label for="expirationDate">Expiration Date</label>
          <input type="date" id="expirationDate" v-model="newListing.expirationDate" :min="today" required>
        </div>
  
        <div class="form-group">
          <label for="price">Price</label>
          <input type="number" id="price" v-model="newListing.price" placeholder="Price of product ($)" required min="0" step="0.01">
        </div>
  
        <div class="form-group">
          <label for="unitsToSell">Units To Sell</label>
          <input type="number" id="unitsToSell" v-model="newListing.unitsToSell" placeholder="# of quantity" required min="1">
        </div>
  
        <button type="submit" class="submit-button">List to Marketplace</button>
      </form>
    </div>
</template>
  
<script>
  import { ref, onMounted } from 'vue';
  import { db } from '@/firebase';
  import { doc, collection, getDocs, addDoc, updateDoc } from 'firebase/firestore';

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
    async fetchProducts() {
      const querySnapshot = await getDocs(collection(db, 'products'));
      this.products = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    },
    async submitListing() {
      try {
        const completeListing = {
          ...this.newListing,
          unitsRemaining: this.newListing.unitsToSell
        };
        // Save the new listing to Firestore
        const docRef = await addDoc(collection(db, 'listings'), completeListing);
        await updateDoc(doc(db, 'listings', docRef.id), {
          listingId: docRef.id
        });
        this.newListing.listingId = docRef.id;
        console.log('Listing added with ID:', docRef.id);
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
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    cursor: pointer;
  }
  
  /* Add responsiveness or other styles as needed */
</style>