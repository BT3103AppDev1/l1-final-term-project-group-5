<template>
    <div class="checkout-body">
        <div class="checkout-qr">
            <h1>PayNow QR</h1>
            <h3>To complete your order, please follow the steps below : </h3>
            <div class="qr-steps-container">
                <img src="@/assets/paynow.png" alt="QR Code" class="qr-code">
                <div class="steps">
                    <ul>
                        <li>Scan QR on your PayNow supported app (or)</li> 
                        <li>Save the QR code and upload QR into your PayNow banking app to complete payment</li> 
                    </ul>
                </div>
            </div>
        </div>
        <div class="cart-items">
            <h2 class="summary">Order Summary</h2>
            <div class="table-container">
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
                                <button class="remove-btn" @click="removeFromCart(item)">
                                    <img src="@/assets/close.png" alt="x" class="remove-img">
                                </button>
                            </td>
                            <td class="item">
                                <img :src="item.imageUrl" alt="Product Image" class="item-img"> 
                                <h3 class="item-name">{{ item.name }}</h3>
                            </td>
                            <td class="item-price">${{ item.price.toFixed(2) }} </td>
                            <td class="item-qty">
                                <div class="qty-container">
                                <button class="qty-edit"@click="decrementQuantity(item)">-</button>
                                <input type="text" v-model= "item.quantity" min="1" max="item.remainingUnits" class="qty-input" readonly>
                                <button class="qty-edit" @click="incrementQuantity(item)">+</button>
                                </div>
                            </td>
                            <td class="subtotal"> ${{ (item.price * item.quantity).toFixed(2) }}</td>    
                        </tr>
                    </tbody>
                </table>
            </div>
            <h1 class="total">Total : ${{ totalPrice }}</h1>
        </div>
    </div>
    <div class="checkout-footer-btns">
        <button class="back"@click="continueShopping">
            <img src="@/assets/Go Back.png" class="back-img">
            Continue Shopping
        </button>
        <button class="order"@click="placeOrders()">Place Order</button>
    </div>
    
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import { db } from '@/firebase';
import { firebaseApp } from '@/firebase';
import { getFirestore, collection, doc, getDoc, setDoc } from "firebase/firestore";

export default {

    computed: {
    ...mapGetters(['cartItems', 'totalPrice','getUser',])
    },
    methods: {

        ...mapActions(['removeFromCart']),

        continueShopping() {
            this.$router.push('/seeker/marketplace');
        },
        async fetchSellers(cartItems) {
            const uniqueSellers = Array.from(new Set(cartItems.map(item => item.sellerId)));
            if (uniqueSellers.length === 1) {
                return uniqueSellers[0]; //if only 1 unique seller
            } else {
                return uniqueSellers; // if more than 1 seller, return array of unique sellers
            }
        },
        async placeOrders() {
            let counter = 0; // track how many orders made
            const datePurchased = new Date();
            const sellers = await this.fetchSellers(this.cartItems); //returns either a single seller or array of sellers
            try {
                for (const sellerId of sellers) {
                    let orderId = Math.floor(Math.random() * 900) + 100; // generate random orderID
                    const sellerRef = doc(db, 'users', sellerId);
                    const sellerSnap = await getDoc(sellerRef);
                    const sellerData = sellerSnap.data();
                    const sellerItems = this.cartItems.filter(item => item.sellerId === sellerId);
                    //console.log(sellerData.displayName + ":" + sellerItems);

                    await setDoc(doc(db, 'order', orderId.toString()), {
                        buyerId: this.getUser.uid,
                        companyName: sellerData.displayName,
                        companyAddress: sellerData.address,
                        datePurchased: datePurchased,
                        expirationDate: sellerItems[0].expirationDate,
                        name: this.getUser.displayName,
                        order: sellerItems.map(item => ({ name: item.name, quantity: item.quantity })),
                        orderId: orderId,
                        sellerId: sellerId,
                        status: 'Ongoing',
                        totalPrice: sellerItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2),
                    });
                    console.log('Order placed successfully with orderID: ' + orderId);
                    
                }
            } catch (error) {
                console.error('Error placing order', error);
                alert('Failed to place the order');
            }
            this.$store.commit('CLEAR_CART');
            this.$router.push('/seeker/order-dashboard');
            this.$store.dispatch("addNotification", {type: "success", message: "Order placed succesfully!"});
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
        }
    }
}
</script>
<style scoped>

.checkout-body {
    margin-top: 50px;
    display:flex;
    justify-content: space-evenly;
    margin-bottom: 50px;
    height:500px;
}
.checkout-qr {
    border: 2px solid #4B644C;
    border-radius: 8px;
    padding: 16px;
    width: 45%;
    box-shadow: 0 0 3px #4B644C;
}

.qr-code {
    width:45%;
    margin-right:16px;
}

.qr-steps-container {
    display:flex;
    margin-top: 20px;
}

.table-container {
    overflow:auto;
    height:70%;
}
.cart-items {
    width: 45%;
    border:2px solid #4B644C;
    border-radius:8px;
    align-items: center;
    text-align:center;
    box-shadow: 0 0 3px #4B644C;
}

.summary {
    text-align:left;
    padding-left: 16px;
}

.cart-table {
    overflow:hidden;
    width:100%;
    height: auto;
    border-bottom: 1px solid #ccc;
}

.cart-table thead th {
    width:150px;
    position:sticky;
    top:0;
}

.cart-table td {
    height:80px;
}

.subtotal {
    font-weight:bold;
    font-size: large;
}
.total {
    font-weight: bolder;
    padding-top:48px;
}

.remove-img {
    height:20px;
    width:20px;
}

.item-img {
    height:50px;
    width:50px;
}

.checkout-footer-btns {
    display:flex;
    justify-content: space-evenly;
    margin-top: 20px;
}

.back {
    background-color: #4B644C;
    color: white;
    padding: 8px 16px;
    border-radius: 4px;
    border: 4px outset #4B644C;
    cursor: pointer;
    display:flex;
    gap: 8px;
    justify-content: space-between;
    align-items: center;
}

.back:hover {
    background-color: #3B523C;
}

.back:active {
    transform: scale(0.90);
}

.order {
    background-color: #4B644C;
    color: white;
    padding: 8px 16px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
}
.back-img {
    height: 30px;
    width: 30px;
}
.item-qty {
    align-items:center;
}
.qty-container {
    display:flex;
    justify-content: space-evenly;
    align-items: center;
    text-align:center;
    align-self:center;
    border:1px inset #ccc;
    
}

.qty-input {
    font-size:large;
    text-align:center;
    width: 25px;
}

.qty-edit {
    font-size:x-large;
}



</style>