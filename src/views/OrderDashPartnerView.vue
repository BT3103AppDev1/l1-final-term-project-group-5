<template>
  <div class="background">
    <div class="stack">
      <div class="search-bar-container">
        <OrderDashPartnerSearchBar @search="handleSearch" />
      </div>
      <OrderDashPartnerTable
        class="table"
        :currentPage="currentPage"
        :entriesPerPage="entriesPerPage"
        :searchQuery="searchQuery"
        @total-page="updateTotalPage($event)"
        @handleStatus="handleStatus"
      />
      <br />
      <OrderDashPartnerPageBar
        class="page-bar"
        :currentPage="currentPage"
        :totalPages="totalPages"
        :searchQuery="searchQuery"
        @page-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script>
import OrderDashPartnerSearchBar from "@/components/OrderDashPartnerSearchBar.vue";
import OrderDashPartnerTable from "@/components/OrderDashPartnerTable.vue";
import OrderDashPartnerPageBar from "@/components/OrderDashPartnerPageBar.vue";
import { db } from "@/firebase.js";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default {
  name: "OrderDashPartner",
  components: {
    OrderDashPartnerSearchBar,
    OrderDashPartnerTable,
    OrderDashPartnerPageBar,
  },
  data() {
    return {
      currentPage: 1,
      entriesPerPage: 5,
      totalEntries: 0,
      searchQuery: "",
      entriesToComplete: [],
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalEntries / this.entriesPerPage);
    },
  },
  async mounted() {
    const auth = getAuth();
    this.sellerId = auth.currentUser.uid;
    await this.fetchTotalEntries(); // Fetch total entries when the component is mounted
  },
  methods: {
    async fetchTotalEntries() {
      try {
        const queryRef = query(
          collection(db, "order"),
          where("sellerId", "==", this.sellerId)
        );
        const querySnapshot = await getDocs(queryRef);
        this.totalEntries = querySnapshot.size; // Update totalEntries with the number of documents in the filtered collection
      } catch (error) {
        console.error("Error fetching total entries:", error);
      }
    },
    handlePageChange(page) {
      if (this.searchQuery === "") {
        this.currentPage = page;
      }
    },
    handleSearch(query) {
      console.log("ran handleSearch()");
      this.searchQuery = query;
      if (query !== "") {
        this.currentPage = 1; // Switch to page 1 when a non empty search is initiated
      }
    },
    updateTotalPage(size) {
      this.totalEntries = size;
    },
    handleStatus() {
      console.log("ran handleStatus()");
      this.currentPage = 1; // changePage runs display()
    },
  },
};
</script>

<style scoped>
.container {
  width: 100vw; /* Ensure the container takes the full width */
  max-width: 100%; /* Limit the container's width to the viewport width */
  margin: 0 auto; /* Center align the container */
  padding: 20px; /* Add padding to the container */
  background-image: url(""); /* Set background image */
  background: url("..\\..\\public\\bg2.png") no-repeat center center fixed; /* Set background image */
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover; /* Cover the entire container with the background image */
  background-position: center;
}
.background {
  background: url("..\\..\\public\\bg2.png") no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.stack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: 100%;
}
.search-bar-container {
  margin-left: 10px;
}
.page-bar {
  margin: auto;
}
.table {
  margin: auto;
  background-color: transparent;
}
</style>
