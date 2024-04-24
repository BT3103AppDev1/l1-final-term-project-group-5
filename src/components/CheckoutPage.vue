<template>
  <div class="background" :class="backgroundClass">
    <div class="checkout-body">
      <div class="cart-items">
        <h2 class="summary"><b>Order Summary</b></h2>
        <div class="table-container">
          <table class="cart-table">
            <thead>
              <tr>
                <th></th>
                <th>Product</th>
                <th>Company</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in cartItems"
                :key="item.listingId"
                class="cart-item">
                <td>
                  <button class="remove-btn" @click="removeFromCart(item)">
                    <img src="@/assets/close.png" alt="x" class="remove-img" />
                  </button>
                </td>
                <td class="item">
                  <img
                    :src="item.product.imageUrl"
                    alt="Product Image"
                    class="item-img"
                  />
                  <div class="name-expiry">
                    <h3 class="item-name">{{ item.product.name }}</h3>
                    <h5 class="expiry-date"> Expiry: {{ formattedDate(item.expirationDate) }} </h5>
                  </div>
                  
                </td>
                <td class="item-company">{{ sellerNames[item.sellerId] }}</td>
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
        <h1 class="total">Total : ${{ totalPrice }}</h1>
      </div>
    </div>
    <div class="checkout-footer-btns">
      <button class="back" @click="continueShopping">
        <img src="@/assets/Go Back.png" class="back-img" />
        Continue Shopping
      </button>
      <button class="make-payment" @click="makePayment">Make Payment</button>
    </div>
  </div>
  <div v-if="showQR" class="checkout-qr">
    <button class="close-qr" @click="makePayment">
      <img src="@/assets/close.png" alt="x" class="close-img" />
    </button>
    <button class="generate-qr" @click="genQR">Generate QR for Payment</button>
    <div v-if="isLoading" class="loading">
      <div class="spinner"></div>
    </div>
    <div v-if="generateQR" class="qr-code">
      <img src="@/assets/paynow.png" alt="QR Code" class="qr-img" />
      <div class="steps">
        <ul>
          <li>Scan QR on your PayNow supported app (or)</li>
          <li>
            Save the QR code and upload QR into your PayNow banking app to
            complete payment
          </li>
        </ul>
      </div>
    </div>
    <div v-if="showPlaceOrder || showButtonLoading" class="placeOrder">
      <div v-if="showButtonLoading" class="small-spinner"></div>
      <button v-if="showPlaceOrder" class="order" @click="placeOrders">
        Place Order
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import { db } from "@/firebase";
import { firebaseApp } from "@/firebase";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

export default {
  data() {
    return {
      showQR: false,
      generateQR: false,
      isLoading: false,
      showPlaceOrder: false,
      showButtonLoading: false,
      sellerNames: {},
    };
  },

  created() {
    for (const item of this.cartItems) {
      this.fetchSellerName(item.sellerId);
    }
  },
  computed: {
    ...mapGetters(["cartItems", "totalPrice", "getUser"]),

    backgroundClass() {
      return this.showQR ? "background active" : "background";
    },
    
  },
  methods: {
    ...mapActions(["removeFromCart", "checkAndUpdateListingStatus"]),

    continueShopping() {
      this.$router.push("/seeker/marketplace");
    },
    async fetchSellers(cartItems) {
      const uniqueSellers = Array.from(
        new Set(cartItems.map((item) => item.sellerId))
      );
      return uniqueSellers; // if more than 1 seller, return array of unique sellers
    },
    async placeOrders() {
      if (!this.cartItems.length) {
        this.$store.dispatch("addNotification", {
          type: "warning",
          message: "Cart is empty! Cannot place order.",
        });
        return;
      }
      //let counter = 0; // track how many orders made
      const datePurchased = new Date();
      const sellers = await this.fetchSellers(this.cartItems); //returns either a single seller or array of sellers
      console.log(sellers);
      try {
        for (const sellerId of sellers) {
          let orderId = Math.floor(Math.random() * 900) + 100; // generate random orderID
          const sellerRef = doc(db, "users", sellerId);
          //console.log('SellerRef: ', sellerRef);
          const sellerSnap = await getDoc(sellerRef);
          const sellerData = sellerSnap.data();
          console.log(sellerData.displayName);
          const sellerItems = this.cartItems.filter(
            (item) => item.sellerId === sellerId
          );
          const totalWeight = sellerItems.reduce(
            (acc, item) =>
              acc + Number(item.product.weight) * Number(item.quantity),
            0
          );

          await setDoc(doc(db, "order", orderId.toString()), {
            buyerId: this.getUser.uid,
            companyName: sellerData.displayName,
            companyAddress: sellerData.address,
            datePurchased: datePurchased,
            expirationDate: sellerItems[0].expirationDate,
            name: this.getUser.displayName,
            order: sellerItems.map((item) => ({
              name: item.product.name,
              quantity: item.quantity,
            })),
            orderId: orderId,
            sellerId: sellerId,
            status: "Ongoing",
            totalPrice: sellerItems
              .reduce((acc, item) => acc + item.price * item.quantity, 0)
              .toFixed(2),
            totalWeight: totalWeight,
            companyDeleted: false,
            customerDeleted: false,
          });

          for (const item of sellerItems) {
            const listingRef = doc(db, "listings", item.listingId);
            const listingSnap = await getDoc(listingRef);

            if (listingSnap.exists()) {
              const listingData = listingSnap.data();

              const newUnitsRemaining =
                listingData.unitsRemaining - item.quantity;

              await setDoc(
                listingRef,
                { unitsRemaining: newUnitsRemaining },
                { merge: true }
              );
              console.log(
                "Updated units remaining for listing: " + item.listingId
              );
            }
          }
          this.checkAndUpdateListingStatus();
          console.log("check and update listing status");
          console.log("Order placed successfully with orderID: " + orderId);
        }
      } catch (error) {
        console.error("Error placing order", error);
        alert("Failed to place the order");
      }
      this.$store.commit("CLEAR_CART");
      this.$router.push("/seeker/order-dashboard");
      this.$store.dispatch("addNotification", {
        type: "success",
        message: "Order placed succesfully!",
      });
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
    makePayment() {
      this.showQR = !this.showQR;
      this.generateQR = false;
      this.showPlaceOrder = false;
    },
    genQR() {
      this.isLoading = true;
      this.generateQR = false;
      this.showPlaceOrder = false;
      setTimeout(() => {
        this.isLoading = false;
        this.generateQR = true;
        this.showButtonLoading = true;
      }, 3000);
      setTimeout(() => {
        this.showPlaceOrder = true;
        this.showButtonLoading = false;
      }, 8000);
    },

    async fetchSellerName(sellerId) {
      const sellerRef = doc(db, "users", sellerId);
      const sellerSnap = await getDoc(sellerRef);
      const sellerData = sellerSnap.data();
      this.sellerNames[sellerId] = sellerData.displayName;
    },
    formattedDate(expirationDate) {
      const date = new Date(expirationDate.seconds * 1000);
      //const date = new Date(this.listing.expirationDate.seconds * 1000);
      const day = ("0" + date.getDate()).slice(-2);
      const month = ("0" + (date.getMonth() + 1)).slice(-2);
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    },
  },
};
</script>
<style scoped>
.checkout-qr {
  position: fixed;
  top: 48%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: whitesmoke;
  border: 2px outset #4b644c;
  border-radius: 8px;
  padding: 24px;
  width: 60%;
  height: 70%;
  align-items: center;
  z-index: 100;
}
.generate-qr {
  background-color: rgb(75, 100, 76);
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  border: 4px outset #4b644c;
  cursor: pointer;
  display: flex;
  gap: 8px;
  align-self: center;
  align-items: center;
  position: relative;
}
.qr-code {
  display: flex;
  justify-content: space-around;
  gap: 18px;
  align-items: center;
  margin: 24px;
}
.qr-img {
  height: 350px;
  width: 350px;
}
.background {
  background: url("../assets/bg2.png") no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: calc(100vh - 64px);
}
.background.active {
  opacity: 0.5;
  background-color: rgba(255, 255, 255, 0.6);
}
.checkout-body {
  width: 100vw;
  height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.checkout-body.active {
  opacity: 0.5;
}
.cart-items {
  width: 98%;

  border-radius: 8px;
  text-align: center;
}
.table-container {
  overflow: auto;
  height: 50vh;
}

.summary {
  text-align: center;
}

.cart-table {
  overflow: hidden;
  width: 100%;
  height: auto;
  border-bottom: 1px solid #ccc;
}

.cart-table thead th {
  width: 150px;
  position: sticky;
  top: 0;
}

.cart-table td {
  height: 100px;
}

.cart-table td.item {
  display: flex;
  justify-content: left;
  padding-left: 24px;
  gap: 8px;
  align-items: center;
}
.item-price {
  font-size: large;
}
.subtotal {
  font-weight: bold;
  font-size: larger;
}
.total {
  font-weight: bolder;
  padding-top: 48px;
}

.remove-img {
  height: 30px;
  width: 30px;
}

.item-img {
  height: 80px;
  width: 80px;
}

.checkout-footer-btns {
  display: flex;
  justify-content: space-around;
  width: auto;
  margin-top: 20px;
  padding: 4px;
}

.back {
  background-color: #4b644c;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  border: 4px outset #4b644c;
  cursor: pointer;
  display: flex;
  gap: 8px;
  justify-content: space-between;
  align-items: center;
}

.back:hover {
  background-color: #3b523c;
}

.back:active {
  transform: scale(0.9);
}

.back-img {
  height: 30px;
  width: 30px;
}
.item-qty {
  align-items: center;
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
  width: 80px;
}

.cart-table th:nth-child(5) {
  width: 100px;
}

.cart-table td.subtotal {
  font-weight: bold;
  font-size: large;
}

.make-payment {
  background-color: #4b644c;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  border: 4px outset #4b644c;
}

.make-payment:hover {
  background-color: #3b523c;
}

.make-payment:active {
  transform: scale(0.9);
}

.close-img {
  height: 30px;
  width: 30px;
}

.loading {
  position: fixed;
  z-index: 2;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4); /* Semi-transparent black */
  display: flex;
  justify-content: center;
  align-items: center;
}

.spinner {
  border: 16px solid #f3f3f3;
  border-top: 16px solid #4b644c;
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.order {
  font-size: larger;
  letter-spacing: 1px;
  background-color: #4b644c;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  border: 4px outset #4b644c;
  height: 60px;
  width: 150px;
}
.order:hover {
  background-color: #3b523c;
}

.order:active {
  transform: scale(0.9);
}

.placeOrder {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
}
.small-spinner {
  /* Adjust as needed */
  width: 30px;
  height: 30px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.name-expiry {
  text-align:left;
}
</style>
