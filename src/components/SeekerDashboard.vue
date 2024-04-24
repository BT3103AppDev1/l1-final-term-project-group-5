<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useStore } from "vuex";
import {
  collection,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { db, auth } from "../firebase.js";
import SvgIcon from "@jamescoyle/vue-icon";
import {
  mdiTrashCanOutline,
  mdiSortCalendarDescending,
  mdiSortCalendarAscending,
  mdiFilterVariant,
} from "@mdi/js";

const store = useStore();

// Vuetify icons
const trashCan = mdiTrashCanOutline;
const sortCalDesc = mdiSortCalendarDescending;
const sortCalAsc = mdiSortCalendarAscending;
const filterVariant = mdiFilterVariant;

// Reactive reference to store the documents
const orders = ref([]);

// Fetch documents once the component is mounted
onMounted(fetchDocuments);

// Function to fetch documents from a specified collection
async function fetchDocuments() {
  const ordersCollectionRef = collection(db, "order");
  let queryRef = query(
    ordersCollectionRef,
    orderBy("datePurchased", dateSortOrder.value)
  );
  const querySnapshot = await getDocs(queryRef);
  orders.value = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    order: Array.isArray(doc.data().order)
      ? doc
          .data()
          .order.map((item) => `${item.name} x${item.quantity}`)
          .join("<br>")
      : "Invalid order data",
  }));
}

// Reactive states for filtering and searching
const searchTerm = ref("");
const appliedSearchTerm = ref("");
const currentFilter = ref("All");
const dateSortOrder = ref("desc");

// Reactive state for pagination
const currentPage = ref(1);
const ordersPerPage = 10;

// Computed properties
const userOrders = computed(() =>
  orders.value.filter((order) => order.buyerId == auth.currentUser.uid)
);

const nonDeletedOrders = computed(() =>
  userOrders.value.filter((order) => !order.customerDeleted)
);

const searchedOrders = computed(() => {
  if (!appliedSearchTerm.value) {
    return nonDeletedOrders.value;
  }
  return nonDeletedOrders.value.filter((order) =>
    order.order.toLowerCase().includes(appliedSearchTerm.value)
  );
});

const filteredOrders = computed(() => {
  return searchedOrders.value.filter(
    (order) =>
      currentFilter.value === "All" || order.status === currentFilter.value
  );
});

const totalOrders = computed(() => filteredOrders.value.length);
const totalPages = computed(() => Math.ceil(totalOrders.value / ordersPerPage));

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * ordersPerPage;
  return filteredOrders.value.slice(start, start + ordersPerPage);
});

// Handlers for search and pagination
const applySearch = () => {
  appliedSearchTerm.value = searchTerm.value.trim().toLowerCase();
  currentPage.value = 1;
};

const clearSearch = () => {
  searchTerm.value = "";
  appliedSearchTerm.value = "";
  currentPage.value = 1;
};

const navigateToPage = (pageNum) => {
  currentPage.value = pageNum;
};

const toggleDateSortOrder = () => {
  dateSortOrder.value = dateSortOrder.value === "asc" ? "desc" : "asc";
  fetchDocuments();
};

const deleteOrder = async (orderId) => {
  if (confirm("Are you sure you want to delete this order?")) {
    const orderDocRef = doc(db, "order", orderId);
    const orderSnapshot = await getDoc(orderDocRef);
    if (!orderSnapshot.exists()) {
      console.error("Document does not exist!");
      return;
    }
    const orderData = orderSnapshot.data();
    if (orderData.companyDeleted) {
      await deleteDoc(orderDocRef);
    } else {
      await updateDoc(orderDocRef, { customerDeleted: true });
    }
    store.dispatch("addNotification", {
      type: "success",
      message: "Successfully deleted order!",
    });
    fetchDocuments();
  }
};

// Additional handlers for dropdown and formatting
const showFilterDropdown = ref(false);
const toggleFilterDropdown = () => {
  showFilterDropdown.value = !showFilterDropdown.value;
};
const selectFilter = (filterValue) => {
  currentFilter.value = filterValue;
  showFilterDropdown.value = false;
};
const closeDropdown = (event) => {
  if (!event.target.closest(".headerContent")) {
    showFilterDropdown.value = false;
  }
};
onMounted(() => {
  window.addEventListener("click", closeDropdown);
});
onUnmounted(() => {
  window.removeEventListener("click", closeDropdown);
});

function formatDate(timestamp) {
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${date.getFullYear().toString().substr(-2)}`;
}
</script>

<template>
  <div class="orderDashboardContainer">
    <div class="searchContainer">
      <div class="inputWithClear">
        <input
          type="text"
          v-model="searchTerm"
          @keyup.enter="applySearch"
          placeholder="Search orders..."
        />
      </div>
      <button @click="applySearch" class="searchButton">Search</button>
      <button
        @click="clearSearch"
        :disabled="!appliedSearchTerm"
        class="clearButton"
      >
        Clear
      </button>
      <span v-if="appliedSearchTerm" class="currentSearch">
        Current search: {{ appliedSearchTerm }}
      </span>
    </div>

    <div class="orderContainer">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Order</th>
            <th>Company</th>
            <th>Address</th>
            <th>
              <div class="headerContent">
                Date
                <button @click="toggleDateSortOrder" class="headerIcons">
                  <svg-icon
                    :type="'mdi'"
                    :path="dateSortOrder === 'desc' ? sortCalAsc : sortCalDesc"
                    style="color: rgba(255, 255, 255, 0.844)"
                  ></svg-icon>
                </button>
              </div>
            </th>
            <th>Price</th>
            <th>
              <div class="headerContent">
                Status
                <button @click="toggleFilterDropdown" class="headerIcons">
                  <svg-icon type="mdi" :path="filterVariant"></svg-icon>
                </button>
                <div v-if="showFilterDropdown" class="customDropdown">
                  <div @click="selectFilter('All')">All</div>
                  <div @click="selectFilter('Ongoing')">Ongoing</div>
                  <div @click="selectFilter('Completed')">Completed</div>
                  <div @click="selectFilter('Expired')">Expired</div>
                </div>
              </div>
            </th>
            <th>Comments</th>
          </tr>
        </thead>
        <tbody v-if="paginatedOrders.length > 0">
          <tr v-for="order in paginatedOrders" :key="order.id">
            <td>{{ order.orderId }}</td>
            <td v-html="order.order"></td>
            <td>{{ order.companyName }}</td>
            <td>{{ order.companyAddress }}</td>
            <td>{{ formatDate(order.datePurchased) }}</td>
            <td>${{ order.totalPrice }}</td>
            <td>
              <div :class="`orderStatus-${order.status.toLowerCase()}`">
                {{ order.status }}
              </div>
            </td>
            <td v-if="order.status === 'Ongoing'" style="text-align: center">
              To be collected
            </td>
            <td
              v-else-if="order.status === 'Completed'"
              style="text-align: center"
            >
              <button @click="deleteOrder(order.id)">
                <svg-icon
                  type="mdi"
                  :path="trashCan"
                  style="color: darkred"
                ></svg-icon>
              </button>
            </td>
            <td
              v-else-if="order.status === 'Expired'"
              style="text-align: center"
            >
              <button @click="deleteOrder(order.id)">
                <svg-icon
                  type="mdi"
                  :path="trashCan"
                  style="color: darkred"
                ></svg-icon>
              </button>
            </td>
            <td v-else></td>
          </tr>
        </tbody>
        <tbody v-else class="emptyTable">
          <tr>
            <td colspan="8">No orders found</td>
          </tr>
        </tbody>
      </table>

      <div v-show="totalPages >= 1" class="pageNavigation">
        <button
          @click="currentPage--"
          :disabled="currentPage <= 1"
          class="previousButton"
          :class="{ fadeOut: currentPage <= 1 }"
        >
          Previous
        </button>
        <button
          v-for="pageNum in totalPages"
          :key="pageNum"
          @click="navigateToPage(pageNum)"
          :disabled="currentPage === pageNum"
          class="paginationButton"
          :class="{ activePage: currentPage === pageNum }"
        >
          {{ pageNum }}
        </button>
        <button
          @click="currentPage++"
          :disabled="currentPage >= totalPages"
          class="nextButton"
          :class="{ fadeOut: currentPage >= totalPages }"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.orderDashboardContainer {
  width: 100vw;
  min-height: calc(100vh - 64px);
  max-width: 100%;
  padding: 20px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: top;
  justify-content: top;
}
.orderContainer {
  padding: 20px;
  height: 100%;
  width: 100%;
}

table {
  width: 100%;
  border-collapse: collapse;
}
th {
  background-color: #4e644b;
  color: white;
  padding: 12px;
  text-align: center;
  font-size: 16px;
  white-space: nowrap;
}
td {
  padding: 8px;
  text-align: center;
  font-size: 14px;
  white-space: normal;
}
.headerContent {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.headerIcons {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 4px;
}
tbody tr:nth-child(even) {
  background-color: #c3d2c3;
}
tbody tr:nth-child(odd) {
  background-color: #e6e6e6;
}
tbody.emptyTable {
  text-align: center;
}
th:nth-child(1),
td:nth-child(1) {
  width: 5%;
}
th:nth-child(2),
td:nth-child(2) {
  width: 25%;
}
th:nth-child(3),
td:nth-child(3),
th:nth-child(5),
td:nth-child(5),
th:nth-child(6),
td:nth-child(6),
th:nth-child(7),
td:nth-child(7) {
  width: 10%;
}
th:nth-child(4),
td:nth-child(4) {
  width: 15%;
}
th:nth-child(8),
td:nth-child(8) {
  width: 15%;
}

.orderStatus-completed {
  display: inline-block;
  text-align: center;
  border: 1px solid green;
  border-radius: 20px;
  padding: 4px 8px;
  background-color: lightcyan;
  color: #155724;
  font-size: 12px;
}
.orderStatus-expired {
  display: inline-block;
  text-align: center;
  border: 1px solid red;
  border-radius: 20px;
  padding: 2px 8px 2px 8px;
  background-color: lightcyan;
  color: red;
  font-size: 12px;
}
.orderStatus-ongoing {
  display: inline-block;
  text-align: center;
  border: 1px solid #ffbf00;
  border-radius: 20px;
  padding: 2px 8px 2px 8px;
  background-color: lightcyan;
  color: #ffbf00;
  font-size: 12px;
}

.pageNavigation {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 10px 10px 10px;
}
.paginationButton,
.previousButton,
.nextButton {
  background-color: #f5f5f5;
  color: #222;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  padding: 8px 12px;
  margin: 0 4px;
  transition: background-color 0.2s;
}
.previousButton:hover,
.paginationButton:hover,
.nextButton:hover {
  background-color: #848b6e;
}
.paginationButton:focus,
.previousButton:focus,
.nextButton:focus {
  outline: none;
  box-shadow: 0 0 2px 1px rgba(0, 123, 54, 0.2);
}
.previousButton {
  margin-right: 8px;
}
.nextButton {
  margin-left: 8px;
}
.activePage {
  background-color: #6b7b38;
  color: white;
}
.fadeOut {
  opacity: 0.5; /* Adjust the opacity value as needed */
  cursor: not-allowed;
}

.customDropdown {
  position: absolute;
  top: 110%;
  left: 0;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  padding: 10px;
  z-index: 100;
}
.customDropdown div {
  padding: 5px;
  cursor: pointer;
  color: black;
}
.customDropdown div:hover {
  background-color: #f0f0f0;
}

.inputWithClear {
  position: relative;
  display: flex;
  align-items: center;
}
.inputWithClear input {
  padding-right: 30px;
}
.inputWithClear button {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  padding: 0 8px;
  cursor: pointer;
  background-color: transparent;
  border: none;
  color: #333;
}
.inputWithClear button:disabled {
  pointer-events: none;
  color: #ccc;
}
.searchContainer {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: left;
  margin-top: 20px;
  padding: 10px 10px 10px 20px;
}
.searchContainer input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 8px;
}

.searchButton,
.clearButton {
  background-color: #f5f5f5;
  color: #222;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  padding: 8px 12px;
  margin-right: 4px;
  transition: background-color 0.2s;
}

.searchButton:hover,
.clearButton:hover {
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
