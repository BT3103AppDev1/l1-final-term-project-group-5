<template>
  <div class="marketplace-view">
    <div class="search-bar">
      <SearchBar @update-search-query="updateSearchQuery" />
    </div>
    <div class="main-content">
      <div class="grid">
        <ProductGrid
          :searchQuery="searchQuery"
          :selectedCategories="selectedCategories"
          :sortOption="sortOption"
        />
      </div>
      <div class="sidebar">
        <div class="sort-by">
          <PriceSorter @update-sort="updateSort" />
        </div>
        <div class="filter">
          <CategoryFilter @update-categories="updateSelectedCategories" />
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
      searchQuery: "",
      selectedCategories: [],
      sortOption: "",
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
    },
  },
};
</script>

<style>
.marketplace-view {
  background: url("../assets/bg2.png") no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: calc(100vh - 64px);
  height: 100%;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  overflow: auto;
}

.search-bar {
  margin-top: 30px;
  flex: 0;
  align-self: center;
  width: 500px;
}

.sort-by {
  align-self: left;
  width: 200px;
}

.main-content {
  display: flex;
  width: 100vw;
}

.grid {
  width: 80%;
}
.sidebar {
  width: 25%;
  display: flex;
  align-items: center;
  flex-direction: column;

  min-width: 200px;
  max-width: 400px;
}

.filter {
  padding-bottom: 8px;
}

.filter,
.sort-by {
  margin-bottom: 20px;
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
