<template>
  <div class="background">
    <div class="stack">
      <div class="search-bar-container">
        <OrderDashPartnerSearchBar @search="handleSearch" />
      </div>
      <div class="table-container">
        <OrderDashPartnerTable
          class="table"
          :currentPage="currentPage"
          :entriesPerPage="entriesPerPage"
          :searchQuery="searchQuery"
          @total-page="updateTotalPage($event)"
          @handleStatus="handleStatus"
        />
      </div>
      <div class="page-bar-container">
        <OrderDashPartnerPageBar
          class="page-bar"
          :currentPage="currentPage"
          :totalPages="totalPages"
          :searchQuery="searchQuery"
          @page-change="handlePageChange"
        />
      </div>
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
      entriesPerPage: 10,
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
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover; /* Cover the entire container with the background image */
  background-position: center;
}
.background {
  background: url("../assets/bg2.png") no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  width: 100vw;
  height: 100%;
}

.stack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: calc(100vh - 64px);
  padding: 20px;
}
.search-bar-container {
  display: flex;
  flex-direction: column;
  justify-content: left;
  align-items: center;
  margin-top: 20px;
  padding: 10px 10px 10px 20px;
}
.table-container {
  background-color: transparent;
  top: 0; /* Set the top position to 0 */
  padding: 20px;
  max-width: 100%;
  min-width: 1100px;
  overflow-x: auto;
}
.page-bar-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -75px;
}
</style>
