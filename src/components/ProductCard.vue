<template>
    <div class="product-card">
        <div class="img-container" @mouseover="showOverlay = true" @mouseleave="showOverlay = false">
            <img :src="listing.imageUrl" alt="Product Image" class="img">
            <transition name="fade">
            <div class="company-overlay" v-show="showOverlay">
                <img :src="seller?.photoURL" alt="Company Logo" class="company-logo">
                <h3>{{ seller?.displayName }}</h3>
                <p>Address: {{ seller?.address }}</p>  
            </div>
            </transition>
        </div>
        <div class="product-details">
            <h2 class="name">{{ listing.name }}</h2>
            <h3 class="category">{{ listing.category }} </h3>
            <h3 class="price">Price: ${{ listing.price.toFixed(2) }}</h3>
            <h3 class="expiry">Expires: {{ listing.expirationDate }} </h3>
        </div>
        <div class="qty-btn-container">
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
import { doc, getDoc } from "firebase/firestore";
import { db } from '@/firebase';
import { useStore } from 'vuex';

export default {
    props: ['listing'],

    data() {
        return {
            cart : [],
            showOverlay:false,
            seller:null,
        };
    },

    async created() {
        this.listing.quantity = 1;

        const sellerRef = doc(db, 'users', this.listing.sellerId);
        const sellerDoc = await getDoc(sellerRef);
        

        if (sellerDoc.exists()) {
            this.seller = sellerDoc.data();
        } else {
            console.log("No such document!");
        }
    },

    methods : {
        addToCart(listing) {
            const itemInCart = this.cart.find(item => item.listingId === listing.listingId);

            if (itemInCart) {
                itemInCart.quantity += listing.quantity || 1; // Add 1 if no quantity is selected
            } else {
                this.cart.push({
                    ...listing,
                    quantity: listing.quantity || 1, // Set quantity to 1 if no quantity is selected
                });
            }
            this.$emit('add-to-cart', listing);

        }
    },
};
</script>

<style scoped>

.product-card {
    display: flex;
    flex-direction: column;
    align-items: left;
    border: 4px solid lightslategray;
    border-radius: 15px;
    padding: 16px;
    margin: 8px;
    width: 250px;
    height:400px;
    background-color:darkslategray;
}

.img-container {
    position:relative;
    width:100%;
    height:100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.company-overlay {
    border-radius: 15px;
    color:white;
    position:absolute;
    top:0;
    left:0;
    width:100%;
    height:100%;
    background-color: aliceblue;
    color:green;
    display:flex;
    flex-direction:column;
    justify-content: center;
    align-items:center;
    opacity:50;
    transition:opacity 1s ease;
}

.fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter, .fade-leave-to {
    transition: opacity 0.5s ease;
    opacity: 0;
}

.img {
    border-radius: 15px;
    align-self: center;
    height: 200px;
    width: 210px;
    margin-bottom: 0px;
    object-fit: cover; /* Ensures the image fills the container without distortion */
}

.product-details {
    color:white;
}

.name {
    color:white;
    text-align: left;
    border-top: 2px white;
    border-bottom: 2px white;
}

.category {
    text-align:left;

}

.expiry {
    text-align:left;
    padding-bottom: 8px;
}

.qty-selector {
    align-self:flex-start;
}

.qty-btn-container {
    color:white;
    display:flex;
    justify-content: space-between;
    width: 100%;
}

.add-btn {
    align-self: flex-end;
    cursor: pointer;
}

.add-btn img {
    width: 35px;
    height: 35px;
}
</style>

