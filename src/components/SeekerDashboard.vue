<script setup>
import { ref, onMounted, computed } from "vue";
import {
  collection,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase.js";

// Reactive reference to store the documents
const orders = ref([]);

// Function to fetch documents from a specified collection
async function fetchDocuments() {
  const querySnapshot = await getDocs(
    collection(db, "order"),
    orderBy("datePurchased", "desc")
  );
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

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * ordersPerPage;
  return orders.value.slice(start, start + ordersPerPage);
});

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
  if (currentFilter.value === "All") {
    return paginatedOrders.value;
  }
  return paginatedOrders.value.filter(
    (order) => order.status === currentFilter.value
  );
});

const showFilterDropdown = ref(false);
const toggleFilterDropdown = () => {
  showFilterDropdown.value = !showFilterDropdown.value;
};
</script>

<template>
  <div class="orderContainer">
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Order</th>
          <th>Company</th>
          <th>Address</th>
          <th>Date</th>
          <th>Price</th>
          <th>
            Status <button @click="toggleFilterDropdown">⚙️</button>
            <div v-if="showFilterDropdown" class="filterDropdown">
              <select v-model="currentFilter">
                <option value="All">All</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
                <option value="Expired">Expired</option>
              </select>
            </div>
          </th>
          <th>Mark as Collected</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in paginatedOrders" :key="order.id">
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

.filterDropdown {
  position: absolute;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
  padding: 5px;
}
.filterDropdown select {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px;
  min-width: 120px;
}
</style>
