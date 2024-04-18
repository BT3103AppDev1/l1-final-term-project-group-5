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

          <v-dialog v-model="productDialog" max-width="500">
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn v-bind="activatorProps" color="surface-variant" text="Edit" variant="flat"
                @click="openEditWindow(product, 'product')"></v-btn>
            </template>

            <template v-slot:default="{ productDialog }">
              <v-card title="Edit Product Details">
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-text-field label="Product Name" v-model="editedProduct.name" required></v-text-field>
                  <v-select v-model="editedProduct.category" :items="categories" label="Select Product Category"
                    required></v-select>

                  <v-text-field v-model.number="editedProduct.weight" label="Enter Product Weight (grams)" type="number"
                    required></v-text-field>

                  <v-file-input label="Upload Product Image" prepend-icon="mdi-paperclip" @change="onFileChange" chips>
                  </v-file-input>

                </v-form>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text="Save Changes" @click="saveProductDetails()"></v-btn>
                  <v-btn text="Close Dialog" @click="this.productDialog = false"></v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>

          <img :src="product.imageUrl" :alt="product.name" class="product-image">
          <div class="product-info">
            <h3>{{ product.name }}</h3>
            <p>{{ product.category }}</p>
            <p>{{ product.weight }} grams</p>
            <v-btn text="Delete" @click="confirmDeleteProduct(product.productId)"></v-btn>
          </div>

        </div>

      </div>
    </div>

    <div class="listings-section">
      <h2>Current Listings</h2>
      <div class="listings-container" name="active-listings">
        <div class="listing-card" v-for="listing in activeListings" :key="listing.id">

          <v-dialog v-model="listingDialog" max-width="500">
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn v-bind="activatorProps" color="surface-variant" text="Edit" variant="flat"
                @click="openEditWindow(listing, 'listing')"></v-btn>
            </template>

            <template v-slot:default="{ isActive }">
              <v-card title="Edit Listing Details">
                <v-form ref="form" v-model="valid" lazy-validation>

                  <v-text-field v-model="editedListing.expirationDate" id="expirationDate" label="Expiration Date"
                    type="date" :min="today" required></v-text-field>

                  <v-text-field v-model.number="editedListing.price" id="price" label="Price of product ($)" type="number" min="0"
                    step="0.01" required></v-text-field>

                  <v-text-field v-model.number="editedListing.unitsRemaining" id="unitsRemaining" label="# of units remaining" type="number"
                    min="0" required></v-text-field>

                  <v-text-field v-model.number="editedListing.unitsToSell" id="unitsToSell" label="# of quantity to sell" type="number"
                    min="0" required></v-text-field>

                </v-form>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text="Save Changes" @click="saveListingDetails()"></v-btn>
                  <v-btn text="Close Dialog" @click="isActive.value = false"></v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>

          <img :src="listing.product.imageUrl" :alt="listing.product.name" class="listing-image">
          <div class="listing-details">
            <h3>{{ listing.product.name }}</h3>
            <p>{{ listing.product.category }}</p>
            <p>Remaining: {{ listing.unitsRemaining }} / {{ listing.unitsToSell }}</p>
            <p>Price: ${{ listing.price }}</p>
            <v-btn text="Delete" @click="confirmDelete(listing.listingId)"></v-btn>
          </div>
        </div>

        <!-- Add New Listing card here -->
        <div @click="AddListing" class="listing-card-add-new">
          <span class="plus-icon">+</span>
          <p>Add New Listing</p>
        </div>
      </div>
    </div>

    <div class="expired-section">
      <h2>Expired Listings</h2>
      <div class="listings-container" name="expired-listings">

        <div class="expired-listing-card" v-for="listing in inactiveListings" :key="listing.id">
          <img :src="listing.product.imageUrl" :alt="listing.product.name" class="listing-image">
          <div class="listing-details">
            <h3>{{ listing.product.name }}</h3>
            <p>{{ listing.product.category }}</p>
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
import { auth, db } from '@/firebase';
import { query, collection, getDocs, where } from 'firebase/firestore';
import { onAuthStateChanged } from "firebase/auth";

export default {
  data() {
    return {
      productDialog: false,
      listingDialog: false,
      valid: true,
      user: null,
      store: null,
      selectedTab: 'products',
      products: [],
      editedProduct: {
        productId: '', // You'll set this when opening the dialog to edit
        name: '',
        category: '',
        weight: '',
        imageURL: null,
        sellerId: ''
      },
      editedListing: {
        productId: '', // You'll set this when opening the dialog to edit
        listingId: '',
        expirationDate: '',
        price: null,
        unitsToSell: null,
        unitsRemaining: null,
        sellerId: '',
        isActive: true
      },
      categories: ['Baked Good', 'Dairy', 'Fruit', 'Vegetable'] // list of categories
    };
  },
  async mounted() {
    await onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.user = user;
      }
    });
    await this.fetchProducts();
    await this.checkAndUpdateListingStatus().then(() => {
      // After updating, fetch the latest active listings
      this.fetchActiveListingsWithProductDetails(this.user.uid);
      this.fetchInactiveListingsWithProductDetails(this.user.uid);
    });
    this.store = this.$store;
  },
  computed: {
    ...mapState(['activeListings', 'inactiveListings']),
    today() {
      return new Date().toISOString().split('T')[0];
    }
  },

  methods: {
    ...mapActions([
      'fetchActiveListingsWithProductDetails', 
      'fetchInactiveListingsWithProductDetails', 
      'checkAndUpdateListingStatus',
      'deleteListing',
      'editListing',
      'deleteProduct'
    ]),

    AddProduct() {
      this.$router.push('marketplace/add-product');
    },

    openEditWindow(object, type) {
      if (type === 'listing') {
        this.editedListing = { ...object };
        this.listingDialog = true;
        //console.log(this.editedListing);
      } else if  (type === 'product') {
        this.editedProduct = { ...object };
        this.productDialog = true;
      }
    },

    onFileChange(e) {
      const file = e.target.files[0];
      this.editedProduct.image = file;
    },

    saveProductDetails() {
      //if (this.$refs.form.validate()) {
        // Save the edited product details
        // You would typically dispatch a Vuex action or call an API method here
        console.log('Product details to save:', this.editedProduct.name);

        // Close the dialog
        this.productDialog = false;
        console.log(this.productDialog);
        // Reset the form or keep the changes depending on your flow
        // this.resetForm();
      //}
    },

    confirmDeleteProduct(productId) {
      if (confirm('Are you sure you want to delete this listing?')) {
        console.log('Deleting product with ID:', productId);
        this.deleteProduct(productId).then(() => {
          this.fetchProducts();
          this.store.dispatch("addNotification", { // use store from instance
            type: "success",
            message: "Successfully deleted product!",
          });
        });
      }
    }, 

    async saveListingDetails() {
      if (this.editedListing.unitsRemaining * 1 > this.editedListing.unitsToSell * 1 || this.editedListing.unitsRemaining <= 0) {
        this.editedListing.isActive = false;
      }
      //console.log('Listing details to save:', this.editedListing.productName);

      await this.editListing(this.editedListing);
      this.fetchActiveListingsWithProductDetails(this.user.uid);

      this.listingDialog = false;
      console.log("Close popup window");
      this.store.dispatch("addNotification", { // use store from instance
            type: "success",
            message: "Successfully edited listing!",
          });
    },

    AddListing() {
      this.$router.push('marketplace/add-listing')
    },

    confirmDelete(listingId) {
      if (confirm('Are you sure you want to delete this listing?')) {
        console.log('Deleting listing with ID:', listingId);
        this.deleteListing(listingId).then(() => {
          this.fetchActiveListingsWithProductDetails(this.user.uid);
          this.store.dispatch("addNotification", { // use store from instance
            type: "success",
            message: "Successfully deleted listing!",
          });
        });
      }
    }, 

    async fetchProducts() {
      const sellerQuery = query(collection(db, 'products'), where('sellerId', '==', this.user.uid))
      const querySnapshot = await getDocs(sellerQuery);
      this.products = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    }
  },
}

</script>
<style scoped>
.marketplace {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 5%;
}

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

.expired-listing-card {
  flex: 0 1 200px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 15px;
  opacity: 0.5;           /* Add a visual cue that the listing is expired */            
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