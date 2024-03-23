<template>
    <div class="marketplace-view">
        <div class="search-bar">
            <SearchBar @update-search-query="updateSearchQuery" />
        </div>  
        <div class="product-card">
            <ProductCard :searchQuery="searchQuery" :selectedCategories="selectedCategories" />
        </div>
        <div class="sidebar">
            <div class="category-filter">
                <CategoryFilter @update-categories="updateSelectedCategories" />
            </div>
        </div>
    </div>
</template>

<script>
import ProductCard from "@/components/ProductCard.vue";
import SearchBar from "@/components/SearchBar.vue";
import CategoryFilter from "@/components/CategoryFilter.vue";

export default {
    components: {
        ProductCard,
        SearchBar,
        CategoryFilter
    },

    data() {
        return {
            searchQuery: '',
            selectedCategories: []
        };
    },

    methods: {
        updateSearchQuery(newQuery) {
            this.searchQuery = newQuery;
        },

        updateSelectedCategories(categories) {
            this.selectedCategories = categories;
        }
    },
};
</script>

<style>

.narketplace-view {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    padding: 20px;
}

.sidebar {
    flex-basis: 20%;
    padding-right:20px;
}

.category-filter {
    align-items: right;
    text-align: right;
}

</style>

