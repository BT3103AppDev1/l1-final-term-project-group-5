<script setup>
import { ref, onMounted, computed } from "vue";
import { collection, getDocs, orderBy } from "firebase/firestore";
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
          <th>Status</th>
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
        </tr>
      </tbody>
    </table>

    <div>
      <button @click="currentPage--" :disabled="currentPage <= 1">
        Previous
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
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
/* Style for odd rows */
tbody tr:nth-child(odd) {
  background-color: #b3d2b3;
}
/* Style for even rows */
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
</style>
