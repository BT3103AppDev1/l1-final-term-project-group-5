<template>
  <div class="product-grid">
    <ProductCard
      v-for="listing in filteredActiveListings"
      :key="listing.listinId"
      :listing="listing"
      @add-to-cart="addToCart"
    />
  </div>
  <div class="view-cart-btn" @click="showCart = true">
    <h3 class="view-cart-header">VIEW CART</h3>
  </div>
  <div v-if="showCart" class="cart-overlay" v-bind:class="{ open: isCartOpen }">
    <div class="cart-head">
      <button @click="showCart = false" class="close-btn">
        <img src="@/assets/close.png" alt="x" class="close-img" />
      </button>
      <h2 class="cart-header">SHOPPING CART</h2>
      <button class="clear-cart" @click="clearCartWithNotification">
        CLEAR CART
      </button>
    </div>
    <div class="cart-items">
      <table class="cart-table">
        <thead>
          <tr>
            <th></th>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cartItems" :key="item.listingId" class="cart-item">
            <td>
              <button
                class="remove-btn"
                @click="removeFromCartWithNotification(item)"
              >
                <img src="@/assets/close.png" alt="x" class="remove-img" />
              </button>
            </td>
            <td class="item">
              <img
                :src="item.product.imageUrl"
                alt="Product Image"
                class="item-img"
              />
              <h3 class="item-name">{{ item.product.name }}</h3>
            </td>
            <td class="item-price">${{ item.price.toFixed(2) }}</td>
            <td class="item-qty">
              <div class="qty-container">
                <button class="qty-edit" @click="decrementQuantity(item)">
                  -
                </button>
                <input
                  type="text"
                  v-model="item.quantity"
                  min="1"
                  max="item.remainingUnits"
                  class="qty-input"
                  readonly
                />
                <button class="qty-edit" @click="incrementQuantity(item)">
                  +
                </button>
              </div>
            </td>
            <td class="subtotal">
              ${{ (item.price * item.quantity).toFixed(2) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="cart-footer">
      <div class="total-price">
        <h2>Total : ${{ totalPrice }}</h2>
      </div>
      <button
        class="checkout"
        :class="{ disabled: !cartItems.length, shake: shake }"
        @click="checkout"
      >
        CHECKOUT USING PAYNOW
      </button>
    </div>
  </div>
</template>

<script>
import ProductCard from "./ProductCard.vue";
import { mapGetters, mapActions, mapMutations } from "vuex";
import { firebaseApp } from "@/firebase";
import { getFirestore, collection, getDocs } from "firebase/firestore";
const db = getFirestore(firebaseApp);

export default {
  components: {
    ProductCard,
  },

  props: {
    searchQuery: String,
    selectedCategories: Array,
    sortOption: String,
  },

  data() {
    return {
      products: [],
      listings: [],
      //cart: [],
      //totalPrice:0,
      filteredActiveListings: [], // holds filtered listings
      showCart: false,
      isCartOpen: false,
      shake: false,
    };
  },

  async created() {
    const productSnapshot = await getDocs(collection(db, "products"));
    this.products = productSnapshot.docs.map((doc) => doc.data());

    const listingSnapshot = await getDocs(collection(db, "listings"));
    this.listings = listingSnapshot.docs.map((doc) => doc.data());

    this.filteredActiveListings = this.activeListings;
    //console.log(this.filteredActiveListings);

    //sort listings by expiry-date
    this.filteredActiveListings.sort((a, b) => {
      return a.expirationDate - b.expirationDate;
    });
  },

  watch: {
    searchQuery() {
      this.applyFilters();
    },

    selectedCategories() {
      this.applyFilters();
    },

    sortOption() {
      this.sortProducts();
    },
  },

  computed: {
    ...mapGetters(["cartItems", "totalPrice"]),

    cartItems() {
      //console.log("Cart items: ", this.$store.getters.cartItems);
      return this.$store.getters.cartItems;
    },

    totalPrice() {
      return this.$store.getters.totalPrice;
    },

    activeListings() {
      return this.listings
        .filter((listing) => listing.isActive)
        .map((listing) => {
          const product = this.products.find(
            (product) => product.productId === listing.productId
          );
          return {
            ...product,
            ...listing,
          };
        });
    },
  },

  methods: {
    ...mapActions(["addToCart", "clearCart", "removeFromCart"]),

    removeFromCartWithNotification(item) {
      this.$store.dispatch("removeFromCart", item);
      this.$store.dispatch("addNotification", {
        type: "success",
        message: "Removed from cart!",
      });
    },

    clearCartWithNotification() {
      this.$store.dispatch("clearCart");
      this.$store.dispatch("addNotification", {
        type: "success",
        message: "Cart cleared!",
      });
    },

    applyFilters() {
      // initialise with all active listings first
      let filtered = this.activeListings;

      //Filter by selected categories if any
      if (this.selectedCategories.length > 0) {
        filtered = filtered.filter((listing) =>
          this.selectedCategories.includes(listing.product.category)
        );
      }
      //Filter by search query if present
      if (this.searchQuery) {
        filtered = filtered.filter((listing) =>
          listing.product.name
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase())
        );
      }

      this.filteredActiveListings = filtered;
    },

    sortProducts() {
      if (this.sortOption === "lowToHigh") {
        this.filteredActiveListings = [...this.filteredActiveListings].sort(
          (a, b) => {
            return Number(a.price) - Number(b.price);
          }
        );
      } else if (this.sortOption === "highToLow") {
        this.filteredActiveListings = [...this.filteredActiveListings].sort(
          (a, b) => {
            return Number(b.price) - Number(a.price);
          }
        );
      } else {
        this.filteredActiveListings = this.activeListings;
      }
    },

    checkout() {
      if (!this.cartItems.length) {
        this.$store.dispatch("addNotification", {
          type: "warning",
          message: "Cart is empty!",
        });
        this.shake = true;
        setTimeout(() => (this.shake = false), 1000);
      } else {
        this.$router.push("/seeker/checkout");
      }
    },
    incrementQuantity(item) {
      if (item.quantity < item.unitsRemaining) {
        item.quantity++;
      }
    },
    decrementQuantity(item) {
      if (item.quantity > 1) {
        item.quantity--;
      }
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Public+Sans&display=swap");

h3 {
  font-family: "Public Sans", sans-serif;
  color: #ccc;
  font-weight: bold;
  font-size: medium;
}

.product-grid {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 30px;
  overflow: hidden;
  align-items: center;
  justify-items: center;
  margin-bottom: 30px;
}

.product-grid.active {
  opacity: 0.5;
}

.view-cart-btn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  height: 60px;
  width: 278px;
  padding: 10px;
  background-color: #4b644c;
  display: flex;
  flex-direction: row;
  border: 4px outset #324432;
  border-radius: 4px;
  justify-content: center;
  cursor: pointer;
  text-align: center;
  transition: transform 0.1s ease;
  overflow: hidden;
}
.view-cart-btn:active {
  transform: scale(0.9);
}
.view-cart-btn:hover {
  transition: all 0.3s ease;
  background-color: #324432;
}

.view-cart-header {
  color: white;
  padding: 6px;
  letter-spacing: 1px;
}

.cart-head {
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: nowrap;
  border-bottom: 1px solid #ccc;
  padding: 4px;
}

.cart-header {
  align-self: center;
  font-family: "Public Sans", sans-serif;
  color: black;
  font-weight: normal;
  font-size: large;
  position: relative;
  letter-spacing: 1px;
  top: 0px;
  left: 16px;
}

.close-img {
  height: 35px;
  width: 35px;
}

.remove-img {
  height: 20px;
  width: 20px;
}

.item-img {
  padding-top: 16px;
  width: 100px;
  height: 120px;
}

.item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 10px;
}

.item-name {
  color: black;
}

.item-subtotal {
  color: black;
}

.cart-overlay {
  position: fixed;
  background-color: white;
  bottom: 0;
  right: 0;
  width: 40vw;
  min-width: 300px;
  max-width: 600px;
  height: 50vh;
  overflow: hidden;
  border: 2px outset #324432;
  border-radius: 4px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  transition: opacity 0.5s, visibility 0.5s;
  opacity: 1;
}

.cart-items {
  overflow: auto;
  display: flex;
  flex-direction: column;

  border-bottom: 1px solid black;
  table-layout: fixed;
}

.cart-table {
  width: 100%;
  border-collapse: collapse;
}
.cart-table th {
  width: 50px;
}
.cart-table thead th {
  width: 150px;
  z-index: 1;
}
.cart-table tr {
  padding-bottom: 1px;
  border-bottom: 1px solid #ccc;
}

.cart-table td {
  height: 80px;
}
.cart-table th:first-child {
  width: 50px;
}

.cart-table th:nth-child(2) {
  width: 200px;
}

.cart-table th:nth-child(3) {
  width: 80px;
}

.cart-table th:nth-child(4) {
  width: 100px;
}

.cart-table th:nth-child(5) {
  width: 100px;
}

.cart-table td.subtotal {
  font-weight: bold;
  font-size: large;
}

.item {
  width: 250px;
}

.item-img {
  height: 80px;
  width: 80px;
  object-fit: contain;
}

.cart-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  margin-top: 10px;
}

.clear-cart {
  position: relative;
  right: 12px;
  top: 0px;
  background-color: #4b644c;
  color: white;
  font-family: "Public Sans", sans-serif;
  font-weight: medium;
  font-size: small;
  height: auto;
  width: auto;
  padding: 2px;
  border: 4px outset #4b644c;
  border-radius: 4px;
}

.clear-cart:hover {
  transition: all 0.3s ease;
  background-color: #324432;
}

.checkout {
  position: relative;
  background-color: #4b644c;
  color: white;
  border-radius: 4px;
  height: 40px;
  width: 250px;
  align-self: center;
  letter-spacing: 1px;
  border: 4px outset #4b644c;
}
.checkout:hover {
  transition: all 0.3s ease;
  background-color: #324432;
}

.checkout:active {
  transform: scale(0.9);
}

.checkout.disabled {
  cursor: not-allowed;
}

.checkout.shake {
  animation: shake 0.5s;
  animation-iteration-count: 1;
}

@keyframes shake {
  0% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-3px);
  }
  40% {
    transform: translateX(3px);
  }
  60% {
    transform: translateX(-3px);
  }
  80% {
    transform: translateX(3px);
  }
  100% {
    transform: translateX(0);
  }
}

.total-price {
  white-space: nowrap;
  text-align: left;
  color: black;
  margin-bottom: 8px;
  font-weight: medium;
  font-size: large;
  letter-spacing: 1px;
}

.qty-container {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  text-align: center;
  align-self: center;
  border: 1px inset #ccc;
}

.qty-input {
  font-size: large;
  text-align: center;
  width: 50px;
}

.qty-edit {
  font-size: x-large;
}
</style>
