<template>
    <div class="product-grid">
        <div v-for="listing in filteredActiveListings"  :key="listing.listingId" class="product-card">
            <img :src="listing.imageUrl" alt="Product Image" class="product-image">
            <h2 class="name">{{ listing.name }}</h2>
            <p class="category"> {{ listing.category }}</p>
            <p class="price">Price: ${{ listing.price.toFixed(2) }}</p>
            <p class="expiry">Expires: {{ listing.expirationDate }}</p>
            <div class="qty-selector">
                <label for="quantity">Quantity:</label>
                <input type="number" id="quantity" name="quantity" min="1" :max="listing.unitsRemaining" v-model="listing.quantity">
            </div>

            <div class="add-btn" @click="addToCart(listing)">
                <img src="@/assets/cart.svg" alt="Add to Cart">
            </div>
        </div>
    </div>
</template>

<script>
import { firebaseApp } from '@/firebase';
import { getFirestore, collection, getDocs } from "firebase/firestore";
const db = getFirestore(firebaseApp);

export default {

    props: {
        searchQuery : String,
        selectedCategories: Array
    }, 

    data() {
        return {
            products : [],
            listings: [],
            filteredActiveListings: [] // holds filtered listings
        };
    },

    async created() {

        const productSnapshot = await getDocs(collection(db, "products"));
        this.products = productSnapshot.docs.map(doc => doc.data());

        const listingSnapshot = await getDocs(collection(db, "listings"));
        this.listings = listingSnapshot.docs.map(doc => doc.data());
        console.log(this.listings);
        this.filteredActiveListings = this.activeListings;
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
            console.log('Added to cart:', listing);
        }
    }
};
</script>

<style scoped>
.product-grid {
    display:grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
}

.name {
    color: white;
    border-bottom:1px solid lightslategray;
    text-align: left;
    width: 200px;

}

.category {
    color:white;
    text-align : left;
}

.price {
    color:white;;
}

.product-card {
    display: flex;
    flex-direction: column;
    align-items: left;
    border: 3px solid lightslategray;
    border-radius: 4px;
    padding: 16px;
    margin: 16px;
    width: 250px;
    height:375px;
}

.product-image {
    align-self:center;
    background-color: lightslategray;
    width: 100%;
    height: 200px;
    width: 200px;
    margin-bottom: 16px;
    border-bottom: 1px solid #e1e1e1;
}

.product-details {
    color: white;
    text-align: left;
}

.qty-selector {
    color:white;
    margin-top: auto;
}

.add-btn {
    align-self: flex-end;
    padding: 0px;
    border: none;
    cursor: pointer;
    margin-top: auto;
}

.add-btn img {
    width: 30px;
    height: 30px;
    border: 1px solid white;
    color:white;
    background-color: white;
}

</style>