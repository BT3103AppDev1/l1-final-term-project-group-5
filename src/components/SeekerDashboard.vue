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
import SvgIcon from "@jamescoyle/vue-icon";
import {
  mdiTrashCanOutline,
  mdiCheckCircle,
  mdiFilterCogOutline,
  mdiChevronUpBox,
  mdiChevronDownBox,
  mdiAlphaX,
} from "@mdi/js";

// Vuetify icons
const trashCan = mdiTrashCanOutline;
const checkCircle = mdiCheckCircle;
const filterCog = mdiFilterCogOutline;
const chevronUp = mdiChevronUpBox;
const chevronDown = mdiChevronDownBox;
const alphaX = mdiAlphaX;

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

  orders.value = querySnapshot.docs.map((doc) => {
    const orderData = doc.data();
    const transformedOrder = {
      id: doc.id,
      ...orderData,
    };

    // Check if orderData.order exists and is an array before mapping
    if (Array.isArray(orderData.order)) {
      transformedOrder.order = orderData.order
        .map((item) => `${item.name} x${item.quantity}`)
        .join(", ");
    } else {
      // Handle the case where orderData.order is not an array
      transformedOrder.order = "Invalid order data";
    }

    return transformedOrder;
  });
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
const ordersPerPage = 4;
const totalOrders = computed(() => searchedOrders.value.length);
const totalPages = computed(() => Math.ceil(totalOrders.value / ordersPerPage));

const navigateToPage = (pageNum) => {
  currentPage.value = pageNum;
};

// Update order status
// const updateOrderStatus = async (orderId) => {
//   const orderDocRef = doc(db, "order", orderId);
//   await updateDoc(orderDocRef, { status: "Completed" });
//   fetchDocuments(); // Refresh the list after update
// };

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
    // order.buyerId === auth.currentUser.uid
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
  return orders.value.filter((order) => {
    // Check if order.order is a string before calling toLowerCase()
    if (typeof order.order === "string") {
      return order.order
        .toLowerCase()
        .includes(appliedSearchTerm.value.toLowerCase());
    } else {
      return false; // Return false if order.order is not a string
    }
  });
});
const clearSearch = () => {
  searchTerm.value = "";
  appliedSearchTerm.value = "";
};
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
        <button @click="clearSearch" :disabled="!searchTerm">
          <div class="removeSearch">
            <svg-icon type="mdi" :path="alphaX"></svg-icon>
          </div>
        </button>
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
              <div class="headerContent">
                Date
                <button @click="toggleDateSortOrder" class="headerIcons">
                  <svg-icon
                    :type="'mdi'"
                    :path="dateSortOrder === 'desc' ? chevronUp : chevronDown"
                    style="color: white"
                  ></svg-icon>
                </button>
              </div>
            </th>
            <th>Price</th>
            <th>
              <div class="headerContent">
                Status
                <button @click="toggleFilterDropdown" class="headerIcons">
                  <svg-icon type="mdi" :path="filterCog"></svg-icon>
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
        <tbody v-if="filteredOrders.length > 0">
          <tr v-for="order in filteredOrders" :key="order.id">
            <td>{{ order.orderId }}</td>
            <td>{{ order.order }}</td>
            <td>{{ order.companyName }}</td>
            <td>{{ order.companyAddress }}</td>
            <td>{{ formatDate(order.datePurchased) }}</td>
            <td>{{ order.totalPrice }}</td>
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
              <button disabled>
                <svg-icon
                  type="mdi"
                  :path="checkCircle"
                  style="color: rgba(0, 128, 0, 0.317)"
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

      <div class="pageNavigation" v-if="totalPages > 1">
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
      <div
        class="pageNavigation"
        v-else-if="totalPages === 1 && filteredOrders.length > 0"
      >
        <button
          @click="navigateToPage(1)"
          :class="{ activePage: currentPage === 1 }"
        >
          1
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.orderDashboardContainer {
  height: calc(100vh - 64px);
  width: calc(100vw - 40px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: top;
  margin: 0px 20px 0px 20px;
}
.orderContainer {
  padding: 10px;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: top;
  align-items: center;
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
.headerContent {
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
  background-color: #b3d2b3;
}
tbody tr:nth-child(odd) {
  background-color: #e6e6e6;
}
tbody.emptyTable {
  text-align: center;
}
th,
td {
  white-space: normal;
}
th:nth-child(1),
td:nth-child(1) {
  width: 5%;
}
th:nth-child(2),
td:nth-child(2) {
  width: 30%;
}
th:nth-child(3),
td:nth-child(3),
th:nth-child(4),
td:nth-child(4),
th:nth-child(5),
td:nth-child(5),
th:nth-child(6),
td:nth-child(6),
th:nth-child(7),
td:nth-child(7) {
  width: 10%;
}
th:nth-child(8),
td:nth-child(8) {
  width: 15%;
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
  padding-left: 8px;
  padding-right: 8px;
  cursor: pointer;
  border-radius: 5px;
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
  pointer-events: none;
  color: #ccc;
}
.searchContainer {
  height: 35px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: left;
  margin-top: 10px;
  padding-left: 10px;
  padding-right: 10px;
}
.searchContainer input {
  width: 100%;
  height: 35px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
}
.searchContainer > button {
  padding: 8px 15px;
  border: 1px solid #ccc;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.removeSearch {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
