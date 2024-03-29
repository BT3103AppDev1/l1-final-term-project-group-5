<script setup>
import { ref, onMounted, computed } from "vue";
import {
  collection,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase.js";

// Reactive reference to store the documents
const orders = ref([]);

// Function to fetch documents from a specified collection
async function fetchDocuments() {
  const ordersCollectionRef = collection(db, "order");
  let queryRef;
  if (dateSortOrder.value === "desc") {
    queryRef = query(ordersCollectionRef, orderBy("datePurchased", "desc"));
  } else {
    queryRef = query(ordersCollectionRef, orderBy("datePurchased", "asc"));
  }
  const querySnapshot = await getDocs(queryRef);
  orders.value = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

// Fetch documents once the component is mounted
onMounted(fetchDocuments);

// Date formatting function
function formatDate(timestamp) {
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().substr(-2);
  return `${day}/${month}/${year}`;
}

// Pagination
const currentPage = ref(1);
const ordersPerPage = 10;
const totalOrders = computed(() => orders.value.length);
const totalPages = computed(() => Math.ceil(totalOrders.value / ordersPerPage));

const navigateToPage = (pageNum) => {
  currentPage.value = pageNum;
};

// Update order status
const updateOrderStatus = async (orderId) => {
  const orderDocRef = doc(db, "order", orderId);
  await updateDoc(orderDocRef, { status: "Completed" });
  fetchDocuments(); // Refresh the list after update
};

// Delete order
const deleteOrder = async (orderId) => {
  const orderDocRef = doc(db, "order", orderId);
  await deleteDoc(orderDocRef);
  fetchDocuments(); // Refresh the list after deletion
};

// Filtering by order status
const currentFilter = ref("All");
const filteredOrders = computed(() => {
  // Apply the filter first on searched orders.
  let filtered = searchedOrders.value.filter(
    (order) =>
      currentFilter.value === "All" || order.status === currentFilter.value
  );

  // Then, apply pagination to the filtered list.
  const start = (currentPage.value - 1) * ordersPerPage;
  return filtered.slice(start, start + ordersPerPage);
});

const showFilterDropdown = ref(false);
const toggleFilterDropdown = () => {
  showFilterDropdown.value = !showFilterDropdown.value;
};
const selectFilter = (filterValue) => {
  currentFilter.value = filterValue;
  showFilterDropdown.value = false; // Hide dropdown after selection
};

// Filtering by date purchased
const dateSortOrder = ref("desc");
const toggleDateSortOrder = () => {
  dateSortOrder.value = dateSortOrder.value === "asc" ? "desc" : "asc";
  fetchDocuments(); // Re-fetch documents with the new sort order
};

// Search based on order name
const searchTerm = ref("");
const appliedSearchTerm = ref("");
const applySearch = () => {
  appliedSearchTerm.value = searchTerm.value;
};
const searchedOrders = computed(() => {
  if (appliedSearchTerm.value.trim() === "") {
    return orders.value;
  }
  return orders.value.filter((order) =>
    (order.order ? order.order.toLowerCase() : "").includes(
      appliedSearchTerm.value.toLowerCase()
    )
  );
});
const clearSearch = () => {
  searchTerm.value = "";
  appliedSearchTerm.value = "";
};
</script>

<template>
  <div class="searchContainer">
    <div class="inputWithClear">
      <input
        type="text"
        v-model="searchTerm"
        @keyup.enter="applySearch"
        placeholder="Search orders..."
      />
      <button @click="clearSearch" :disabled="!searchTerm">✕</button>
    </div>
    <button @click="applySearch">Search</button>
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
            Date
            <button @click="toggleDateSortOrder">
              {{ dateSortOrder === "desc" ? "🔽" : "🔼" }}
            </button>
          </th>

          <th>Price</th>
          <th>
            Status <button @click="toggleFilterDropdown">⚙️</button>
            <div v-if="showFilterDropdown" class="customDropdown">
              <div @click="selectFilter('All')">All</div>
              <div @click="selectFilter('Ongoing')">Ongoing</div>
              <div @click="selectFilter('Completed')">Completed</div>
              <div @click="selectFilter('Expired')">Expired</div>
            </div>
          </th>
          <th>Mark as Collected</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in filteredOrders" :key="order.id">
          <td>{{ order.orderId }}</td>
          <td>{{ order.order }}</td>
          <td>{{ order.companyName }}</td>
          <td>{{ order.companyAddress }}</td>
          <td>{{ formatDate(order.datePurchased) }}</td>
          <td>{{ order.totalPrice }}</td>
          <td class="orderStatus">
            <div :class="`orderStatus-${order.status.toLowerCase()}`">
              {{ order.status }}
            </div>
          </td>
          <td v-if="order.status === 'Ongoing'" style="text-align: center">
            <button @click="updateOrderStatus(order.id)">✓</button>
          </td>
          <td
            v-else-if="order.status === 'Completed'"
            style="text-align: center"
          >
            <button disabled>✓</button>
          </td>
          <td v-else-if="order.status === 'Expired'" style="text-align: center">
            <button @click="deleteOrder(order.id)">🗑</button>
          </td>
          <td v-else></td>
        </tr>
      </tbody>
    </table>

    <div class="pageNavigation">
      <button @click="currentPage--" :disabled="currentPage <= 1">
        Previous
      </button>
      <button
        v-for="pageNum in totalPages"
        :key="pageNum"
        @click="navigateToPage(pageNum)"
        :disabled="currentPage === pageNum"
        :class="{ activePage: currentPage === pageNum }"
      >
        {{ pageNum }}
      </button>
      <button @click="currentPage++" :disabled="currentPage >= totalPages">
        Next
      </button>
    </div>
  </div>
</template>

<style scoped>
.orderContainer {
  margin-top: 20px;
  background-color: white;
  color: black;
}

table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  padding: 8px;
}
th {
  background-color: #00350a;
  color: white;
}
tbody tr:nth-child(odd) {
  background-color: #b3d2b3;
}
tbody tr:nth-child(even) {
  background-color: #e6e6e6;
}

.orderStatus {
  display: flex;
  align-items: center;
  justify-content: center;
}
.orderStatus-completed {
  text-align: center;
  border-radius: 8px;
  padding: 2px 5px 2px 5px;
  background-color: #d4edda;
  color: #155724;
}
.orderStatus-expired {
  text-align: center;
  border-radius: 8px;
  padding: 2px 8px 2px 8px;
  background-color: #f8d7da;
  color: #721c24;
  width: fit-content;
}
.orderStatus-ongoing {
  text-align: center;
  border-radius: 8px;
  padding: 2px 8px 2px 8px;
  background-color: #fff3cd;
  color: #856404;
}

.pageNavigation {
  display: flex;
  justify-content: center;
  padding-top: 20px;
  padding-bottom: 10px;
}
.activePage {
  background-color: #00350a;
  color: white;
  border: none;
}
.pageNavigation button {
  margin-right: 5px;
  cursor: pointer;
}
.pageNavigation button:disabled {
  cursor: default;
  opacity: 0.7;
}

.customDropdown {
  position: absolute;
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
  cursor: not-allowed;
  color: #ccc;
}
.searchContainer {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}
.searchContainer input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
}
.searchContainer > button {
  padding: 8px 15px;
  border: 1px solid #ccc;
  background-color: #f0f0f0;
  cursor: pointer;
  border-radius: 4px;
}
</style>