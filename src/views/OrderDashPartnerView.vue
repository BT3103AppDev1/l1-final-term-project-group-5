<template>
  <div class='container' >
    <div class="search-bar-container">
      <SearchBar @search="handleSearch" />
    </div>
    <OrderDashTablePartner :currentPage="currentPage" :entriesPerPage="entriesPerPage" :searchQuery="searchQuery" @total-page="updateTotalPage($event)" @handleStatus="handleStatus" /> 
    <br>
    <PageBar :currentPage="currentPage" :totalPages="totalPages" :searchQuery="searchQuery" @page-change="handlePageChange" />
  </div>
</template>

<script>
import SearchBar from '@/components/SearchBar.vue';
import OrderDashTablePartner from '@/components/OrderDashTablePartner.vue';
import PageBar from '@/components/PageBar.vue';
import { db } from '@/firebase.js';
import { collection, getDocs } from 'firebase/firestore';

export default {
  name: 'OrderDashPartner',
  components: {
    SearchBar,
    OrderDashTablePartner,
    PageBar,
  },
  data() {
    return {
      currentPage: 1,
      entriesPerPage: 5,
      totalEntries: 0,
      searchQuery: '',
      entriesToComplete: [],
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalEntries / this.entriesPerPage);
    }
  },
  async mounted() {
    await this.fetchTotalEntries(); // Fetch total entries when the component is mounted
  },
  methods: {
    async fetchTotalEntries() {
      try {
        const querySnapshot = await getDocs(collection(db, 'order'))
        this.totalEntries = querySnapshot.size; // Update totalEntries with the number of documents in the collection
      } catch (error) {
        console.error('Error fetching total entries:', error);
      }
    },
    handlePageChange(page) {
      if (this.searchQuery === '') {
        this.currentPage = page;
      }
    },
    handleSearch(query) {
      console.log('ran handleSearch()');
      this.searchQuery = query;
      if (query !== '') {
        this.currentPage = 1; // Switch to page 1 when a non empty search is initiated
      }
    },
    updateTotalPage(size) {
      this.totalEntries = size;
    },
    handleStatus() {
      console.log('ran handleStatus()');
      this.currentPage = 1; // changePage runs display()
    },
  }
}
</script>

<style>
.container {
  width: 95vw; /* Ensure the container takes the full width */
  max-width: 100%; /* Limit the container's width to the viewport width */
  margin: 0 auto; /* Center align the container */
  padding: 20px; /* Add padding to the container */
  background-image: url(''); /* Set background image */
  background-size: cover; /* Cover the entire container with the background image */
  background-position: center; /* Center the background image */
}

.search-bar-container {
  margin-left: 10px;
}
</style>

