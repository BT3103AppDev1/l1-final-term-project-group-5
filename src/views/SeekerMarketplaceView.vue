<template>
    <div class="marketplace-view">
        <div class="search-bar">
            <SearchBar @update-search-query="updateSearchQuery" />
        </div>
        <div class="product-card">
            <ProductGrid :searchQuery="searchQuery" :selectedCategories="selectedCategories" />
        </div>
        <div class="sidebar">
            <div class="category-filter">
                <CategoryFilter @update-categories="updateSelectedCategories" />
            </div>
        </div>
    </div>
</template>

<script>
import ProductGrid from "@/components/ProductGrid.vue";
import SearchBar from "@/components/SearchBar.vue";
import CategoryFilter from "@/components/CategoryFilter.vue";
import NavBarLoggedIn from "@/components/NavBarLoggedIn.vue";

export default {
    components: {
        NavBarLoggedIn,
        ProductGrid,
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
.marketplace-view {
    display:flex;
    flex-direction:column;
    align-items: center;
}
.content {
    display:flex;
    justify-content: space-between;
    width: 80%;
}

.product-grid {
    flex: 3;
}

.sidebar {
    flex:1;
}


</style>

