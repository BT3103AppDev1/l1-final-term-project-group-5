<template>
    <div class="MarketplaceView">
        <div class="searchBar">
            <SearchBar @search="searchHandler" />
        </div>
        <div class="center">
            <ProductCard @listings="updateListings" />
        </div>
    </div>
</template>

<script>
import ProductCard from "@/components/ProductCard.vue";
//import SearchBar from "@/components/SearchBar.vue";

export default {
    components: {
        ProductCard,
        //SearchBar,
    },

    data() {
        return {
            //searchTerm: '',
            listings: [],
        };
    },

    methods: {
        /*searchHandler(searchTerm) {
            console.log('Search term:', searchTerm);
            this.searchTerm = searchTerm;
        },*/

        updateListings(listings) {
            console.log('Listings:', listings);
            this.listings = listings;
        }
    },
};
</script>

<style>
.center {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}
</style>

