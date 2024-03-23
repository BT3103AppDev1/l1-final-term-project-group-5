<template>
    <div class="MarketplaceView">
        <SearchBar @update-search-query="updateSearchQuery" />
        <ProductCard :searchQuery="searchQuery" />
    </div>
</template>

<script>
import ProductCard from "@/components/ProductCard.vue";
import SearchBar from "@/components/SearchBar.vue";

export default {
    components: {
        ProductCard,
        SearchBar,
    },

    data() {
        return {
            searchQuery: '',
        };
    },

    methods: {
        updateSearchQuery(newQuery) {
            this.searchQuery = newQuery;
        },

        /*updateListings(listings) {
            console.log('Listings:', listings);
            this.listings = listings;
        }*/
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

