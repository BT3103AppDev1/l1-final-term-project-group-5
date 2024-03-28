<template>
    <div class="product-grid">
        <ProductCard v-for="listing in filteredActiveListings" :key="listing.listinId"
            :listing="listing" @add-to-cart="addToCart" />
        
        <button @click="showCart = !showCart" class="view-cart-btn">View Cart</button>
        <div v-if="showCart" class="cart-overlay">
            <button @click="showCart = false" class="close-btn">Close</button>
            <div class="cart-contents">
                <div v-for="item in cart" :key="item.listingId" class="item">
                <img :src="item.imageUrl" alt="Product Image" class="item-img">
                <h2 class="item-name"> {{ item.name }}</h2>
                <p class="item-price">Price: {{ item.price }}</p>
                </div>
                <div class="cart-fotter">
                <button class="clear-cart" @click="clearCart">Clear Cart</button>
                <button class="checkout">Checkout</button>
            </div>
            </div>
            <div class="total-price">
                <h2> Total Price: $ {{ totalPrice }}</h2>
            </div>
        </div>
    </div>
</template>

<script>
import ProductCard from './ProductCard.vue';
import { firebaseApp } from '@/firebase';
import { getFirestore, collection, getDocs } from "firebase/firestore";
const db = getFirestore(firebaseApp);

export default {

    components:{
        ProductCard,
    },

    props: {
        searchQuery : String,
        selectedCategories: Array
    }, 

    data() {
        return {
            products : [],
            listings: [],
            filteredActiveListings: [], // holds filtered listings
            cart: [],
            showCart:false,
        };
    },

    async created() {

        const productSnapshot = await getDocs(collection(db, "products"));
        this.products = productSnapshot.docs.map(doc => doc.data());

        const listingSnapshot = await getDocs(collection(db, "listings"));
        this.listings = listingSnapshot.docs.map(doc => doc.data());

        this.filteredActiveListings = this.activeListings;
        console.log(this.filteredActiveListings)

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
        }
    },

    computed: {
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

        totalPrice() {
            return this.cart.reduce((total, item) => total + item.price, 0);
        }
    },

    methods: {
        /*filterActiveListings(query) {
            if (query) {
                this.filteredActiveListings = this.activeListings.filter(listing=> 
                    listing.name.toLowerCase().includes(query.toLowerCase()));
            } else {
                this.filteredActiveListings = this.activeListings;
            }
        },*/

        applyFilters() {
            // initialise with all active listings first
            let filtered = this.activeListings;

            //Filter by selected categories if any 
            console.log(this.selectedCategories);
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

        addToCart(listing) {
            this.cart.push(listing);
        },

        clearCart() {
            this.cart = [];
        },
    }
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
    color:white;
}



.cart-overlay {
    position:fixed;
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
}

.total-price {
    position:absolute;
    overflow: auto;
    top: 16px;
    right: 24px;
    color:white;
    margin-top: auto;
    margin-bottom: 8px;
}

</style>