<template>
  <div class="search-bar">
    <input
      type="text"
      v-model="searchText"
      placeholder="Search by ID..."
      class="search-input"
      @keyup.enter="handleSearch"
    />
    <button @click="handleSearch" class="search-button">Search</button>
    <button @click="clearSearch" class="clear-button">Clear</button>
    <div v-if="searchMade && appliedSearchText" class="currentSearch">
      Current search: {{ appliedSearchText }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchText: "",
      appliedSearchText: "",
      searchMade: false,
    };
  },
  methods: {
    handleSearch() {
      this.searchMade = true;
      this.appliedSearchText = this.searchText;
      // Emit an event with the search text
      this.$emit("search", this.searchText);
    },
    clearSearch() {
      // Clear the search text and emit an event to clear the search
      this.searchText = "";
      this.searchMade = false;
      this.appliedSearchText = "";
      this.$emit("search", "");
    },
  },
};
</script>

<style scoped>
.search-bar {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: left;
  margin: 0;
}

.search-input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 8px;
}

.search-button,
.clear-button {
  background-color: #f5f5f5;
  color: #222;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  padding: 8px 12px;
  margin-right: 4px;
  transition: background-color 0.2s;
}

.search-button:hover,
.clear-button:hover {
  background-color: #f0f0f0;
}

.currentSearch {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 20px;
  font-size: 0.85rem;
  color: #333333ce;
}
</style>
