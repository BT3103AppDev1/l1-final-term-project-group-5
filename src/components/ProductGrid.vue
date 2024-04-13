<template>
    <div class="product-grid">
        <ProductCard v-for="listing in filteredActiveListings" :key="listing.listinId"
            :listing="listing" @add-to-cart="addToCart" />
        
        <button v-if="!showCart" @click="showCart = !showCart" class="view-cart-btn">View Cart</button>
        <div v-if="showCart" class="cart-overlay">
            <button @click="showCart = false" class="close-btn">Close</button>
            <div class="cart-items">
                <div v-for="item in cartItems" :key="item.listingId" class="cart-item">
                    <h3> {{ item.name }} - ${{ item.price.toFixed(2) }} x {{ item.quantity }}</h3>
                    <p> Subtotal: $ {{ (item.price * item.quantity).toFixed(2) }}</p>
                    <button @click="removeFromCart(item)">Remove From Cart</button>
                </div>
            </div>
            <div class="cart-contents">
                <div v-for="item in cartItems" :key="item.listingId" class="item">
                <img :src="item.imageUrl" alt="Product Image" class="item-img">
                <h2 class="item-name"> {{ item.name }}</h2>
                <p class="item-price">Price: ${{ parseFloat(item.price).toFixed(2) }}</p>
                <p class="item-qty"> Qty: x{{ item.quantity }}</p>
                <p class="item-subtotal"> Subtotal : $ {{ (parseFloat(item.price) * item.quantity).toFixed(2) }}</p>
                </div>
                <div class="cart-footer">
                <button class="clear-cart">Clear Cart</button>
                <button class="checkout" @click="checkout">Checkout</button>
            </div>
            
            </div>
            <div class="total-price">
                <h2> Total: $ {{ totalPrice }}</h2>
            </div>
        </div>
    </div>
</template>

<script>
import ProductCard from './ProductCard.vue';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import { firebaseApp } from '@/firebase';
import { getFirestore, collection, getDocs } from "firebase/firestore";
const db = getFirestore(firebaseApp);

export default {

    components:{
        ProductCard,
    },

    props: {
        searchQuery : String,
        selectedCategories: Array,
        sortOption: String, 
    }, 

    data() {
        return {
            products : [],
            listings: [],
            //cart: [],
            //totalPrice:0,
            filteredActiveListings: [], // holds filtered listings
            showCart:false,
        };
    },

    async created() {

        const productSnapshot = await getDocs(collection(db, "products"));
        this.products = productSnapshot.docs.map(doc => doc.data());

        const listingSnapshot = await getDocs(collection(db, "listings"));
        this.listings = listingSnapshot.docs.map(doc => doc.data());

        this.filteredActiveListings = this.activeListings;
        //console.log(this.filteredActiveListings)

        //sort listings by expiry-date
        this.filteredActiveListings.sort((a,b) => {
            return new Date(a.expirationDate) - new Date(b.expirationDate)
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

        ...mapGetters(['cartItems', 'totalPrice']),

        cartItems() {
            console.log('Cart items: ', this.$store.getters.cartItems);
            return this.$store.getters.cartItems;
        },

        totalPrice() {
            return this.$store.getters.totalPrice;
        },

        activeListings() {
            return this.listings.filter(listing => listing.isActive)
                .map(listing => {
                    const product = this.products.find(product => product.productId === listing.productId);
                    return {
                        ...product,
                        ...listing
                    };
                });
        },

        /*totalPrice() {
            return this.cart.reduce((total, item) => {
                return total + parseFloat(item.price) * item.quantity;
            }, 0).toFixed(2);
        }*/
    },

    methods: {

        ...mapActions(['addToCart', 'clearCart', 'removeFromCart']),
        
        /*handleAddToCart(item) {
            this.addToCart(item);
        },*/

        /*addToCart(listing) {
            this.$store.dispatch('addToCart', listing);
            console.log(this.$store.getters.cartItems);
        },*/


        applyFilters() {
            // initialise with all active listings first
            let filtered = this.activeListings;

            //Filter by selected categories if any 
            if (this.selectedCategories.length > 0) {
                filtered = filtered.filter(listing => 
                    this.selectedCategories.includes(listing.category));
            }
            //Filter by search query if present

            if (this.searchQuery) {
                filtered = filtered.filter(listing => 
                    listing.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
            }

            this.filteredActiveListings = filtered;
        },

        /*clearCart() {
            this.cart = [];
        },*/

        sortProducts() {
            if (this.sortOption === 'lowToHigh') {
                this.filteredActiveListings = [...this.filteredActiveListings].sort((a, b) => {
                    return Number(a.price) - Number(b.price);
                });
            } else if (this.sortOption === 'highToLow') {
                this.filteredActiveListings = [...this.filteredActiveListings].sort((a, b) => {
                    return Number(b.price) - Number(a.price);
                });
            } else {
            this.filteredActiveListings = this.activeListings;
            }
        },

        checkout() {
            this.$router.push('/seeker/checkout');
            //this.$router.push({ name: 'CheckoutPage', params: { cart: this.cart, totalPrice: this.totalPrice } });
            
            //this.$router.push('/seeker/checkout');
        },
    },
};
</script>

<style scoped>
.product-grid {
    display:grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
}

.view-cart-btn {
    position:absolute;
    bottom: 30px;
    right: 30px;
    height: 60px;
    width: 100px;
    background-color: darkslategray;
    color: white;
    border: 2px solid lightslategray;
    border-radius: 20px;
}

.close-btn {
    padding-bottom: 16px;
    border:2px solid darkslategray;
    border-radius: 10px;
    height:25px;
    width: 60px;
}

.item-img {
    padding-top:16px;
    width: 100px;
    height: 120px;
}

.item{
    display: flex;
    align-items: center;
    gap: 16px;
    padding-bottom: 10px;
    
    border-bottom: 2px solid darkslategray;
}

.item-name {
    color:black;
}

.item-subtotal {
    color:black;
}

.cart-overlay {
    position:fixed;
    background-color: white;
    bottom: 0;
    right: 0;
    width: 500px;
    height: 500px;
    padding: 20px;
    overflow: auto;
    border: 5px solid darkslategray;
    border-radius: 20px;
    z-index:1000;
    display:flex;
    flex-direction: column;
}

.cart-contents {
    overflow:auto;
    flex-grow:1;
    display:flex;
    flex-direction: column;
    padding-bottom: 16px;

}

.cart-footer {
    display:flex;
    justify-content: space-between;
    align-items:center;
    padding:20px;
    padding-top: 16px;
}

.clear-cart {
    padding-bottom: 16px;
    border:2px solid darkslategray;
    border-radius: 10px;
    height:25px;
    width: 100px;
    position:absolute;
    bottom:0px;
    left: 16px;
    margin-bottom: 8px;
}

.checkout {
    padding-bottom: 16px;
    border:2px solid darkslategray;
    border-radius: 10px;
    height:25px;
    width: 100px;
    position:absolute;
    bottom:0px;
    right: 16px;
    margin-bottom: 8px;
    z-index: 1000;
}

.total-price {
    position:absolute;
    overflow: auto;
    top: 16px;
    right: 24px;
    color:black;
    margin-top: auto;
    margin-bottom: 8px;
    font-weight:bold;
}

</style>