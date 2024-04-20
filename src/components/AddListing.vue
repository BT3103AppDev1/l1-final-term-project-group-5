<template>
  <div class="d-flex flex-column align-center" style="height: 80vh;">
    <div class="self-start">
      <v-btn icon @click="goBackToMarketplace">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
    </div>
    <v-sheet class="mx-auto" width="300">
      <h2>Add New Listing</h2>
      <v-form @submit.prevent="submitListing">

        <!--<label for="product">Product</label>-->
        <v-select v-model="newListing.product" :items="products" item-title="name" :item-value="item => item" 
          label="Select Product"></v-select>

        <v-text-field v-model="newListing.expirationDate" id="expirationDate" label="Expiration Date" type="date"
          :min="today" required></v-text-field>

        <!--<label for="price">Price</label>-->
        <v-text-field v-model.number="newListing.price" id="price" label="Price of product ($)" type="number" min="0"
          step="0.01" required></v-text-field>

        <label for="price">Units To Sell</label>
        <v-text-field v-model.number="newListing.unitsToSell" id="unitsToSell" label="# of quantity" type="number" min="1"
          required></v-text-field>

        <v-btn block variant="tonal" elevation="3" class="submit-button" type="submit">List to Marketplace</v-btn>
      </v-form>
    </v-sheet>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { auth, db } from '@/firebase';
import { query, doc, collection, getDocs, addDoc, updateDoc, where } from 'firebase/firestore';
import { mapActions } from 'vuex';
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
  data() {
    return {
      user: null,
      products: [], // This will hold the array of products from your database
      newListing: {
        product: null,
        expirationDate: '',
        price: null,
        unitsToSell: null,
        unitsRemaining: null,
        sellerId: '',
      },
      store: null
    };
  },
  async mounted() {
    await onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.user = user;
        this.newListing.sellerId = user.uid;
      }
    });
    await this.fetchProducts();
    this.store = this.$store;
    console.log(this.products[0]);
  },
  computed: {
    today() {
      return new Date().toISOString().split('T')[0];
    }
  },
  methods: {
    ...mapActions(['addListing']),
    async fetchProducts() {
      const sellerQuery = query(collection(db, 'products'), where('sellerId', '==', this.user.uid))
      const querySnapshot = await getDocs(sellerQuery);
      this.products = querySnapshot.docs.map(doc => ({
        //id: doc.id,
        ...doc.data()
      }));
    },
    async submitListing() {
      try {
        await this.addListing(this.newListing);
        this.$router.push('/partner/marketplace');
        this.store.dispatch("addNotification", { // use store from instance
            type: "success",
            message: "Successfully added listing!",
          });
        // Reset the form or give user feedback
      } catch (error) {
        console.error('Error adding listing:', error);
      }
    },
    goBackToMarketplace() {
      this.$router.go(-1); // This line will take you back to the previous page
    },
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
  background-color: #4CAF50;
  /* Green */
  color: white
}

.self-start {
  align-self: flex-start;
}

/* Add responsiveness or other styles as needed */
</style>