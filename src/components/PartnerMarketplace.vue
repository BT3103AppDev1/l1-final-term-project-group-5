<template>
  <div class="marketplace">
    <div class="products-section">
      <h2><b>Products</b></h2>
      <div class="products-grid">
        <div @click="AddProduct" class="product-card-add-new">
          <span class="plus-icon">+</span>
          <p>Add New Product</p>
          <!---<button @click="AddProduct" class="submit-btn">Add Product</button>-->
        </div>

        <v-card class="product-card" v-for="product in sortedProducts" :key="product.id">
          <div class="edit-button">
            <v-dialog v-model="productDialog" max-width="500">
              <template v-slot:activator="{ props: activatorProps }">

                <v-btn class="pencil-icon" v-bind="activatorProps" variant="flat" icon
                  @click="openEditWindow(product, 'product')">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>

              <template v-slot:default="{ productDialog }">
                <v-card title="Edit Product Details">
                  <v-form ref="form" v-model="valid" lazy-validation>
                    <v-text-field
                      label="Product Name"
                      v-model="editedProduct.name"
                      :rules="[
                        v => (v && v.length <= 20) || 'Name must be less than 20 characters'
                      ]"
                      required
                    ></v-text-field>
                    <v-select
                      v-model="editedProduct.category"
                      :items="categories"
                      label="Select Product Category"
                      required
                    ></v-select>

                    <v-text-field
                      v-model.number="editedProduct.weight"
                      label="Enter Product Weight (grams)"
                      type="number"
                      required
                    ></v-text-field>

                    <v-file-input
                      label="Upload Product Image"
                      prepend-icon="mdi-paperclip"
                      accept=".jpg, .jpeg, .png"
                      @change="onFileChange"
                      chips
                    >
                    </v-file-input>
                  </v-form>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      text="Save Changes"
                      @click="saveProductDetails()"
                    ></v-btn>
                    <v-btn
                      text="Close"
                      @click="this.productDialog = false"
                    ></v-btn>
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
          </div>
          <div class="product-img">
            <img
              :src="product.imageUrl"
              :alt="product.name"
              class="product-image"
            />
          </div>
          <hr class="divider" />
          <div class="product-info">
            <h3>{{ product.name }}</h3>
            <h5>{{ product.category }}</h5>
            <h4>{{ product.weight }} grams</h4>
            <v-btn class="delete-btn" size="small" @click="confirmDeleteProduct(product.productId)"  color="white">
              <v-icon size="15" color="black">mdi-delete</v-icon>
              Delete
            </v-btn>
          </div>
        </v-card>
      </div>
    </div>

    <div class="listings-section">
      <h2><b>Current Listings</b></h2>
      <div class="listings-container" name="active-listings">
        <!-- Add New Listing card here -->
        <div @click="AddListing" class="listing-card-add-new">
          <span class="plus-icon">+</span>
          <p>Add New Listing</p>
        </div>

        <div
          class="listing-card"
          v-for="listing in sortedActiveListings"
          :key="listing.id"
        >
          <div class="edit-button">
            <v-dialog v-model="listingDialog" max-width="500">
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn class="pencil-icon" v-bind="activatorProps" variant="flat" icon
                  @click="openEditWindow(listing, 'listing')">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>

              <template v-slot:default="{ isActive }">
                <v-card title="Edit Listing Details">
                  <v-form ref="form" v-model="valid" lazy-validation>
                    <v-text-field
                      v-model="editedListing.expirationDate"
                      id="expirationDate"
                      label="Expiration Date"
                      type="date"
                      :min="today"
                      required
                    ></v-text-field>

                    <v-text-field
                      v-model.number="editedListing.price"
                      id="price"
                      label="Price of product ($)"
                      type="number"
                      min="0"
                      step="0.01"
                      @blur="formatPrice"
                      :rules="[
                        v => !isNaN(parseFloat(v)) && v >= 0 || 'Price must be a positive number'
                      ]"
                      required
                    ></v-text-field>

                    <v-text-field
                      v-model.number="editedListing.unitsRemaining"
                      id="unitsRemaining"
                      label="# of units remaining"
                      type="number"
                      :rules="[
                        v => !isNaN(parseFloat(v)) && v >= 0 || 'Units remaining must be a positive number'
                      ]"
                      min="0"
                      required
                    ></v-text-field>

                    <v-text-field
                      v-model.number="editedListing.unitsToSell"
                      id="unitsToSell"
                      label="# of quantity to sell"
                      type="number"
                      min="0"
                      :rules="[
                        v => !isNaN(parseFloat(v)) && v >= 0 || 'Units to sell must be a positive number'
                      ]"
                      required
                    ></v-text-field>
                  </v-form>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      text="Save Changes"
                      @click="saveListingDetails()"
                    ></v-btn>
                    <v-btn text="Close" @click="isActive.value = false"></v-btn>
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
          </div>

          <div class="product-img">
            <img :src="listing.product.imageUrl" :alt="listing.product.name" class="listing-image" />
          </div>

          <div class="listing-details">
            <h3>{{ listing.product.name }}</h3>
            <h5>{{ listing.product.category }}</h5>
            <h4>
              Remaining: {{ listing.unitsRemaining }} /
              {{ listing.unitsToSell }}
            </h4>
            <h4>Price: ${{ listing.price }}</h4>
            <h4> Expires: {{ listing.expirationDate.toDate().toISOString().split("T")[0] }}</h4>
            <v-btn class="delete-btn" size="small" @click="confirmDelete(listing.listingId)" color="white">
              <v-icon color="black">mdi-delete</v-icon>
              Delete
            </v-btn>
          </div>
        </div>
      </div>
    </div>

    <div class="expired-section">
      <h2><b>Expired Listings</b></h2>
      <div class="listings-container" name="expired-listings">

        <div class="expired-listing-card" v-for="listing in sortedInactiveListings" :key="listing.id">
          <div class="product-img">
            <img :src="listing.product.imageUrl" :alt="listing.product.name" class="listing-image" />
          </div>
          <div class="expired-listing-details">
            <h3>{{ listing.product.name }}</h3>
            <h5>{{ listing.product.category }}</h5>
            <h4>
              Remaining: {{ listing.unitsRemaining }} /
              {{ listing.unitsToSell }}
            </h4>
            <h4>Price: ${{ listing.price }}</h4>
            <h4> Expires: {{ listing.expirationDate.toDate().toISOString().split("T")[0] }}</h4>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { auth, db, storage } from "@/firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";

export default {
  data() {
    return {
      productDialog: false,
      listingDialog: false,
      valid: true,
      user: null,
      store: null,
      selectedTab: "products",
      products: [],
      editedProduct: {
        productId: "", // You'll set this when opening the dialog to edit
        name: "",
        category: "",
        weight: "",
        imageURL: null,
        sellerId: "",
      },
      editedListing: {
        productId: "", // You'll set this when opening the dialog to edit
        listingId: "",
        expirationDate: "",
        price: null,
        unitsToSell: null,
        unitsRemaining: null,
        sellerId: "",
        isActive: true,
      },
      categories: ["Baked Good", "Dairy", "Fruit", "Vegetable"], // list of categories
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
    ...mapState(["activeListings", "inactiveListings"]),
    today() {
      return new Date().toISOString().split("T")[0];
    },
    sortedProducts() {
      return this.products.slice().sort((a, b) => a.name.localeCompare(b.name));
    },
    sortedActiveListings() {
      return this.activeListings.slice().sort((a, b) =>  a.expirationDate.toDate() - b.expirationDate.toDate());
    },
    sortedInactiveListings() {
      return this.inactiveListings.slice().sort((a, b) => a.expirationDate.toDate() - b.expirationDate.toDate());
    }

  },

  methods: {
    ...mapActions([
      "fetchActiveListingsWithProductDetails",
      "fetchInactiveListingsWithProductDetails",
      "checkAndUpdateListingStatus",
      "deleteListing",
      "editListing",
      "deleteProduct",
      "editProduct",
    ]),

    AddProduct() {
      this.$router.push("marketplace/add-product");
    },

    formatPrice() {
      this.editedListing.price = Math.round(this.editedListing.price * 100) / 100;
    },

    openEditWindow(object, type) {
      if (type === "listing") {
        this.editedListing = { ...object };
        this.listingDialog = true;
        this.editedListing.expirationDate = this.editedListing.expirationDate
          .toDate()
          .toISOString()
          .split("T")[0];
      } else if (type === "product") {
        this.editedProduct = { ...object };
        this.productDialog = true;
      }
    },

    onFileChange(e) {
      const file = e.target.files[0];
      this.editedProduct.image = file;
    },

    async uploadImage(file) {
      try {
        const storageRef = ref(storage, `products/${file.name}`); // Create a reference to the storage location
        const snapshot = await uploadBytes(storageRef, file); // Upload the file
        const imageUrl = await getDownloadURL(snapshot.ref); // Get the URL of the uploaded file
        return imageUrl;
      } catch (error) {
        console.error("Error uploading image: ", error);
      }
    },

    async saveProductDetails() {
      try {
        if (this.editedProduct.name.length > 20) {
          this.store.dispatch("addNotification", {
            type: "error",
            message: "Please correct the errors in the form",
          });
        } else {
          if (this.editedProduct.image) {
            const imageUrl = await this.uploadImage(this.editedProduct.image);
            // Prepare the product object with the image URL
            const productToEdit = {
              productId: this.editedProduct.productId,
              name: this.editedProduct.name,
              category: this.editedProduct.category,
              weight: this.editedProduct.weight,
              sellerId: this.editedProduct.sellerId,
              imageUrl,
            };

            this.editProduct(productToEdit).then(() => {
              this.fetchProducts();
            });
          } else {
            this.editProduct(this.editedProduct).then(() => {
              this.fetchProducts();
            });
          }
          this.productDialog = false;
          console.log("Close popup window");
          this.store.dispatch("addNotification", {
            // use store from instance
            type: "success",
            message: "Successfully edited product!",
          });
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    },

    confirmDeleteProduct(productId) {
      if (confirm("Are you sure you want to delete this product?")) {
        console.log("Deleting product with ID:", productId);
        this.deleteProduct(productId).then(() => {
          this.fetchProducts();
          this.store.dispatch("addNotification", {
            // use store from instance
            type: "success",
            message: "Successfully deleted product!",
          });
        });
      }
    },

    async saveListingDetails() {
      if (this.editedListing.price > 0 && this.editedListing.unitsRemaining >= 0 && this.editedListing.unitsToSell >= 0) {
        if (
          this.editedListing.unitsRemaining >
          this.editedListing.unitsToSell ||
          this.editedListing.unitsRemaining <= 0
        ) {
          this.editedListing.isActive = false;
        }
        //console.log('Listing details to save:', this.editedListing.productName);

        await this.editListing(this.editedListing).then(() => {
          this.fetchActiveListingsWithProductDetails(this.user.uid);
          this.fetchInactiveListingsWithProductDetails(this.user.uid);
        });

        this.listingDialog = false;
        console.log("Close popup window");
        this.store.dispatch("addNotification", {
          // use store from instance
          type: "success",
          message: "Successfully edited listing!",
        });
      } else {
        this.store.dispatch("addNotification", {
            type: "error",
            message: "Please correct the errors in the form",
          });
      }
    },

    AddListing() {
      this.$router.push("marketplace/add-listing");
    },

    confirmDelete(listingId) {
      if (confirm("Are you sure you want to delete this listing?")) {
        console.log("Deleting listing with ID:", listingId);
        this.deleteListing(listingId).then(() => {
          this.fetchActiveListingsWithProductDetails(this.user.uid);
          this.store.dispatch("addNotification", {
            // use store from instance
            type: "success",
            message: "Successfully deleted listing!",
          });
        });
      }
    },

    async fetchProducts() {
      const sellerQuery = query(
        collection(db, "products"),
        where("sellerId", "==", this.user.uid)
      );
      const querySnapshot = await getDocs(sellerQuery);
      this.products = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    },
  },
};
</script>
<style scoped>

.edit-button {
  width: 100%;
  height: 0px;
  display: flex;
  justify-content: flex-end;
}
.pencil-icon {
  background-color: rgba(255, 255, 255, 0.8);
}


h2 {
  padding-left: 12px;
  background-color: #4e644b;
  color: white;
  border-radius: 15px;
}

.marketplace {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 5%;
}

.products-section,
.listings-section {
  width: 100%;
  box-sizing: border-box;
}

.products-grid,
.listings-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: flex-start;
}

.product-card,
.product-card-add-new,
.listing-card,
.listing-card-add-new,
.expired-listing-card {
  /*flex: 0 1 150px;  Cards will flex but have a base width of 200px */
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Adds shadow */
  overflow: hidden; /* Ensures the image does not break the card's round corners */
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: #fff; /* Background color */
  margin: 10px; /* Adds space around the cards */
  /* padding: 10px; */
  width: 210px; /* Set the width of the cards */
}

.product-card-add-new {
  height: 298.2px;
}

.listing-card-add-new {
  height: 341.6px;
}

.divider {
  border-top: 1px solid #ccc; /* Style for the horizontal line */
  margin: 0; /* Removes default margin from <hr> */
}

.expired-listing-card {
  opacity: 0.5; /* Add a visual cue that the listing is expired */
}
.product-img{
  height: 150px;
  display:flex;
  justify-content: center;
  align-items: center;
}

.product-image,
.listing-image {
  max-width: 100%;
  height: auto;
}

.product-info,
.listing-details,
.expired-listing-details {
  background-color: white;
  color: black;
  width:100%;
  margin-top: 5px;
  padding: 10px;
}

.product-info h3,
.listing-details h3,
.expired-listing-details h3 {
  color: black;
}

.product-info {
  height: 140px;
}

.listing-details {
  height: 185px;
}

.expired-listing-details {
  height: 140px;
}

.delete-btn {
  margin-top: 10px;
}

.product-card-add-new,
.listing-card-add-new {
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
