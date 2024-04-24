<template>
  <div class="product-card">
    <div class="img-container" @mouseleave="showOverlay = false">
      <img :src="listing.product.imageUrl" alt="Product Image" class="img" />
      <div class="company-picture">
        <img
          :src="seller?.photoURL"
          alt="logo"
          class="company"
          @click="showOverlay = !showOverlay"
        />
      </div>
      <transition name="fade">
        <div class="company-overlay" v-show="showOverlay">
          <img
            :src="seller?.photoURL"
            alt="Company Logo"
            class="company-logo"
          />
          <h3>{{ seller?.displayName }}</h3>
          <p>Address: {{ seller?.address }}</p>
        </div>
      </transition>
    </div>
    <div class="product-details">
      <h2 class="name">{{ listing.product.name }}</h2>
      <h3 class="price">${{ listing.price.toFixed(2) }}</h3>
      <h3 class="category">{{ listing.product.category }}</h3>
      <h3 class="expiry">Expires: {{ formattedDate }}</h3>
      <h5 class="rem">Left: {{ remainingUnits }}</h5>
    </div>
    <div class="qty-btn-container">
      <div class="qty-selector">
        <label for="quantity">Quantity: </label>
        <button
          class="qty-edit"
          @mousedown="startDecrement"
          @mouseup="stopDecrement"
          @mouseleave="stopDecrement"
          :class="{ pressed: isDecrementPressed }"
        >
          -
        </button>
        <input
          type="number"
          class="input-qty"
          v-model="listing.quantity"
          @input="handleQtyInputs"
          :max="listing.unitsRemaining"
          ref="qtyInput"
        />
        <button
          class="qty-edit"
          @mousedown="startIncrement"
          @mouseup="stopIncrement"
          @mouseleave="stopIncrement"
          :class="{ pressed: isIncrementPressed }"
        >
          +
        </button>
      </div>
      <div
        class="add-btn"
        @click="handleAddToCart"
        @mousedown="isPressed = true"
        @mouseup="isPressed = false"
        @mouseleave="isPressed = false"
        :class="{ pressed: isPressed, disabled: isAddToCartDisabled }"
      >
        <img
          src="@/assets/cart.png"
          alt="Add to Cart"
          :class="{ pressed: isPressed }"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useStore } from "vuex";
import { mapActions, mapGetters, mapMutations } from "vuex";

export default {
  props: ["listing"],

  data() {
    return {
      quantity: 0,
      showOverlay: false,
      seller: null,
      isPressed: false,
      isIncrementPressed: false,
      isDecrementPressed: false,
    };
  },

  async created() {
    this.listing.quantity = 1;
    this.maxQuantity = this.listing.unitsRemaining;

    const sellerRef = doc(db, "users", this.listing.sellerId);
    const sellerDoc = await getDoc(sellerRef);

    if (sellerDoc.exists()) {
      this.seller = sellerDoc.data();
    } else {
      console.log("No such document!");
    }
  },

  watch: {
    "listing.quantity": function (newVal, oldVal) {
      if (newVal > this.listing.unitsRemaining) {
        this.listing.quantity = this.listing.unitsRemaining;
      } else if (newVal < 1) {
        this.listing.quantity = 1;
      }
    },
  },
  computed: {
    ...mapGetters(["cartItems"]),

    cartItems() {
      return this.$store.getters.cartItems;
    },

    formattedQuantity() {
      return this.listing.quantity.toString().padStart(2, "0");
    },

    formattedDate() {
      const date = new Date(this.listing.expirationDate.seconds * 1000);
      const day = ("0" + date.getDate()).slice(-2);
      const month = ("0" + (date.getMonth() + 1)).slice(-2);
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    },

    cartQty() {
      console.log("cartItems: ", this.cartItems);
      const cartItem = this.cartItems.find(
        (item) => item.id === this.listing.id
      );
      //console.log(cartItem.name, cartItem.quantity)
      return cartItem ? cartItem.quantity : 0;
    },

    remainingUnits() {
      const found = this.cartItems.find((item) => item.listingId === this.listing.listingId);
      //console.log("found: ", found);
      if (found) {
        return this.listing.unitsRemaining - found.quantity;
      } else {
        return this.listing.unitsRemaining;
      }
    },

    isAddToCartDisabled() {

      return this.remainingUnits > 0 ? false : true;
    },
  },

  methods: {
    handleAddToCart() {
      this.$emit("add-to-cart", {
          ...this.listing,
          quantity: this.listing.quantity,
        });
        this.$store.dispatch("addNotification", {
          type: "success",
          message: "Added to cart succesfully!",
        });
        this.listing.quantity = 1; // reset quantity to 1 after adding to cart
    },

    increment() {
      if (this.listing.quantity < this.listing.unitsRemaining) {
        this.listing.quantity++;
        console.log("units remaining : ", this.listing.unitsRemaining);
      }
    },

    decrement() {
      if (this.listing.quantity > 1) {
        console.log("Decreased listing quantity");
        this.listing.quantity--;
      }
    },

    /*handleQtyInput(event) {
      if (this.listing.quantity === this.listing.unitsRemaining) {
        this.listing.quantity = this.listing.unitsRemaining;
        return;
      }
      const qty = parseInt(event.target.value);
      if (!isNaN(qty)) {
        if (qty > this.listing.unitsRemaining) {
          this.listing.quantity = this.listing.unitsRemaining; // if input is more than max
        } else if (qty < 1) {
          this.listing.quantity = 1; // if input is less than 1
        } else {
          this.listing.quantity = qty;
        }
      }
    },*/
    handleQtyInputs(event) {
      const qty = parseInt(event.target.value);
      if (!isNaN(qty)) {
        if (qty > this.listing.unitsRemaining) {
          this.listing.quantity = this.listing.unitsRemaining;
          this.$nextTick(() => {
            this.$refs.qtyInput.value = this.listing.quantity;
          });
        } else if (qty < 1) {
          this.listing.quantity = 1;
          this.$nextTick(() => {
            this.$refs.qtyInput.value = this.listing.quantity;
          });
        } else {
          this.listing.quantity = qty;
        }
      }
    },

    /*onlyNumber($event) {
            let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
            if ((keyCode < 48 || keyCode > 57) && keyCode !== 8) { // 8 is backspace
                $event.preventDefault();
            }
        },*/

    startIncrement() {
      this.increment();
      this.incrementPressed = true;
      this.incrementTimeout = setTimeout(() => {
        this.incrementInterval = setInterval(this.increment, 80);
      }, 500);
    },

    stopIncrement() {
      this.incrementPressed = false;
      clearTimeout(this.incrementTimeout);
      clearInterval(this.incrementInterval);
    },

    startDecrement() {
      this.decrement();
      this.decrementPressed = true;
      this.decrementTimeout = setTimeout(() => {
        this.decrementInterval = setInterval(this.decrement, 80);
      }, 500);
    },

    stopDecrement() {
      this.decrementPressed = false;
      clearTimeout(this.decrementTimeout);
      clearInterval(this.decrementInterval);
    },
  },
};
</script>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  align-items: left;
  border: 4px groove #4b644c;
  border-radius: 12px;
  padding: 16px;
  margin: 8px;
  width: fit-content;
  height: fit-content;
  background-color: #4b644c;
  box-shadow: 0 0 3px #4b644c;
  transition: transform 0.2s ease-in-out;
}
.product-card:hover {
  transform: scale(1.05);
}

.img-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.company-logo {
  height: 40px;
  width: 40px;
}
.company-overlay {
  border-radius: 15px;
  color: #ccc;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  color: #00350a;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 50;
  transition: opacity 0.5s ease;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter,
.fade-leave-to {
  transition: opacity 0.2s ease;
  opacity: 0;
}

.img {
  border-radius: 15px;
  align-self: center;
  height: 200px;
  width: 210px;
  margin-bottom: 3px;
  object-fit: cover; /* Ensures the image fills the container without distortion */
}
.product-details {
  color: #ccc;
}
.name {
  color: white;
  text-align: left;
  border-top: 2px white;
  border-bottom: 2px white;
}
.price {
  color: white;
}
.category {
  text-align: left;
}
.expiry {
  text-align: left;
  padding-bottom: 5px;
}

.qty-selector {
  align-self: flex-start;
}
.qty-btn-container {
  color: white;
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.add-btn {
  align-self: flex-end;
  cursor: pointer;
  display: inline-block;
  padding: 0;
}
.add-btn img {
  width: 35px;
  height: 35px;
  display: inline-block;
  padding: 0;
}
.add-btn.disabled {
  cursor: not-allowed;
  opacity: 0.5;
  pointer-events: none;
}
.input-qty {
  width: 50px;
  color: white;
  text-align: center;
  padding: 3px;
  font-size: larger;
}
.input-qty:focus {
  outline: none;
  box-shadow: 0 0 0 1px white;
}
.qty-edit {
  font-weight: bold;
  width: 16px;
  height: 16px;
  font-size: x-large;
}
.pressed {
  transform: scale(0.8);
  transition: transform 0.1s ease;
}
.company {
  width: 40px;
  height: 40px;
  background-color: white;
  border: 1px solid black;
  border-radius: 80%;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}

.input-qty::-webkit-outer-spin-button,
.input-qty::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
