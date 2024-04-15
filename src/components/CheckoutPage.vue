<template>
    <div class="checkout-page">
      <h1>Welcome, {{ getUser.displayName }}</h1>
      <p> UID : {{ getUser.uid }}</p>
      <div class="cart-items">
        <div v-for="item in cartItems" :key="item.id" class="cart-item">
          <h3>{{ item.name }} - ${{ item.price.toFixed(2) }} x {{ item.quantity }}</h3>
          <p>Subtotal: ${{ (item.price * item.quantity).toFixed(2) }}</p>
        </div>
        <div class="total">
          <h2>Total: ${{ totalPrice.toFixed(2) }}</h2>
        </div>
      </div>
      <button @click="placeOrder">Place Order</button>
    </div>
    <button @click="continueShopping">Continue Shopping</button>
</template>
  
<script>
import { mapGetters } from 'vuex';
import { db } from '@/firebase';
import { firebaseApp } from '@/firebase';
import { getFirestore, collection, doc, getDoc, setDoc } from "firebase/firestore";
  
  export default {
    data() {
      return {
        currOrderId: 0,
      }
    },

    computed: {
      ...mapGetters(['cartItems', 'totalPrice','getUser'])
    },
    methods: {
        continueShopping() {
            this.$router.push('/seeker/marketplace');
        },

        async fetchSeller(sellerId) {
            const sellerRef = doc(db, 'users', sellerId);
            try {
                const sellerSnap = await getDoc(sellerRef);
                if (sellerSnap.exists()) {
                    return sellerSnap.data();
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error fetching seller details', error);
            }
        },

        async placeOrder() {
        // Logic to handle order placement
            const orderId = this.currOrderId + 1;
            const datePurchased = new Date(); // get current Date for purchase
            const sellerDetails = await this.fetchSeller(this.cartItems[0].sellerId);

            let ordersBySeller = this.cartItems.reduce((acc, item) => {
                (acc[item.sellerId] = acc[item.sellerId] || []).push(item);
                return acc;
            }, {});
            console.log(orderId);
            console.log(this.cartItems[0]);
            console.log(sellerDetails);
            try {
                await setDoc(doc(db, 'order', orderId.toString()), {
                    buyerId: this.getUser.uid,
                    companyName: sellerDetails.displayName,
                    companyAddress: sellerDetails.address,
                    datePurchased: datePurchased,
                    expirationDate: this.cartItems[0].expirationDate,
                    name: this.getUser.displayName,
                    order: this.cartItems.map(item => ({ name: item.name, quantity: item.quantity })),
                    orderId: orderId,
                    sellerId: this.cartItems[0].sellerId,
                    status: 'Ongoing',
                    totalPrice: this.totalPrice,
                });
                    //await db.collection("order").add(orderRef);
                    console.log('Order placed successfully');
                    this.$store.commit('CLEAR_CART');
                    alert('Order placed successfully!');
                    // redirect to confirmation page
                    //this.$router.push('/seeker/confirmation');
                } catch(error) {
                    console.log(error);
                    alert('Failed to place the order');
                };
      },
    }
  }
  </script>
  
  <style scoped>
  .checkout-page {
    padding: 20px;
  }
  .cart-item {
    margin-bottom: 10px;
  }
  .total {
    font-weight: bold;
    margin-top: 20px;
  }
  </style>
  