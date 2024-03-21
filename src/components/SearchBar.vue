<template>
  <div>
    <input type="text" v-model="searchText" placeholder="Search by ID">
    <button @click="handleSearch">Search</button>
    <button @click="clearSearch">Clear</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchText: ''
    };
  },
  methods: {
    handleSearch() {
      // Emit an event with the search text
      this.$emit('search', this.searchText);
    },
    clearSearch() {
      // Clear the search text and emit an event to clear the search
      this.searchText = '';
      this.$emit('search', '');
    }
  }
}
</script>

<style scoped>
/* Add your component-specific styles here */
</style>
