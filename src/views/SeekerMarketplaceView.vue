<template>
    <div class="marketplace-view">
        <div class="search-bar">
            <SearchBar @update-search-query="updateSearchQuery" />
        </div>
        <div class="main-content">
             <div class="product-grid">
                <ProductGrid :searchQuery="searchQuery" :selectedCategories="selectedCategories" />
            </div>
            <div class="sidebar">
                <div class="filter">
                    <CategoryFilter @update-categories="updateSelectedCategories" />
                </div>
                <div class="sort-by">
                    <p> Sort By</p>
                    <PriceSorter @update-sort="updateSort" />
                </div>
            </div>
            
        </div>
    </div>
</template>

<script>
import ProductGrid from "@/components/ProductGrid.vue";
import SearchBar from "@/components/SearchBar.vue";
import CategoryFilter from "@/components/CategoryFilter.vue";
import PriceSorter from "@/components/PriceSorter.vue";
import NavBarLoggedIn from "@/components/NavBarLoggedIn.vue";

export default {
    components: {
        NavBarLoggedIn,
        ProductGrid,
        SearchBar,
        CategoryFilter,
        PriceSorter,
    },

    data() {
        return {
            searchQuery: '',
            selectedCategories: [],
            sortOption: '',
        };
    },

    methods: {
        updateSearchQuery(newQuery) {
            this.searchQuery = newQuery;
        },

        updateSelectedCategories(categories) {
            this.selectedCategories = categories;
        },

        updateSort(sortOption) {
            this.sortOption = sortOption;
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

.search-bar {
    margin-top: 30px;
    flex: 0;
    align-self: center;
}

.main-content {
    display:flex;
    justify-content: space-between;
    width:100%;
}

.sidebar {
    display:flex;
    flex-direction: column;
    width:200px;
    padding:20px;
    border-left: 1px solid #ccc;
}

.filter {
    padding-bottom: 8px;
}

.filter, .sort-by {
    margin-bottom:20px;
}
.sidebar .category-filter {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 20px;
}


.sidebar .category-filter .category {
    display: flex;
    align-items: center;
    margin: 5px 0;
}

.sidebar .category-filter input[type="checkbox"] {
    margin-right: 10px;
}

.sidebar .category-filter label {
    cursor: pointer;
}




</style>

