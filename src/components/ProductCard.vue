<template>
    <div class="product-card">
        <img :src="listing.imageUrl" alt="Product Image" class="img">
        <div class="product-details">
            <h2 class="name">{{ listing.name }}</h2>
            <h3 class="category">{{ listing.category }}</h3>
            <h3 class="price">Price: ${{ listing.price.toFixed(2) }}</h3>
            <h3 class="expiry">Expires: {{ listing.expirationDate }}</h3>
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
export default {
    props: ['listing'],

    data() {
        return {
            cart : [],
        };
    },

    methods : {
        addToCart(listing) {
            this.cart.push(listing);
            console.log(this.cart);
            this.$emit('add-to-cart', listing);
        },
    },
};
</script>

<style scoped>

.product-card {
    display: flex;
    flex-direction: column;
    align-items: left;
    border: 4px solid lightslategray;
    border-radius: 30px;
    padding: 16px;
    margin: 8px;
    width: 250px;
    height:400px;
    background-color:darkslategray;
}

.img {
    border-radius: 20px;
    align-self: center;
    height: 200px;
    width: 220px;
    margin-bottom: 0px;
    object-fit: cover; /* Ensures the image fills the container without distortion */
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

