<template>
  <div class="container">
    <table id="table" class="'auto-index'">
      <thead>
        <tr>
          <th>ID</th>
          <th>Order</th>
          <th>Customer</th>
          <th>
            <div class="date-container">
              <span>Date Ordered</span>
              <button class="header-icons" @click="toggleSortOrder">
                <svg-icon
                  :type="'mdi'"
                  :path="sortIcon"
                  style="color: rgba(255, 255, 255, 0.844)"
                ></svg-icon>
              </button>
            </div>
          </th>
          <th>Expiry Date</th>
          <th>Price</th>
          <th>
            <div class="status-container">
              <span>Status</span>
              <div class="dropdown">
                <button class="header-icons" @click="toggleDropdown">
                  <svg-icon type="mdi" :path="filterIcon"></svg-icon>
                </button>
                <div class="custom-dropdown" v-show="isDropdownOpen">
                  <div @click="selectStatus('All')">All</div>
                  <div @click="selectStatus('Ongoing')">Ongoing</div>
                  <div @click="selectStatus('Completed')">Completed</div>
                  <div @click="selectStatus('Expired')">Expired</div>
                </div>
              </div>
            </div>
          </th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody></tbody>
      <tbody v-if="numDocs < 1">
        <tr>
          <td colspan="8">No orders found</td>
        </tr>
      </tbody>
    </table>
    <br />
    <div id="completeButtonContainer">
      <button
        id="completeButton"
        @click="completeSelectedEntries"
        :disabled="entriesToComplete.length === 0"
      >
        Mark as Completed
      </button>
    </div>
    <br /><br />
  </div>
</template>

<script>
import { firebaseApp } from "../firebase.js";
import {
  getFirestore,
  query,
  where,
  collection,
  getDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import SvgIcon from "@jamescoyle/vue-icon";
import {
  mdiTrashCanOutline,
  mdiFilterVariant,
  mdiSortCalendarDescending,
  mdiSortCalendarAscending,
} from "@mdi/js";

const db = getFirestore(firebaseApp);

export default {
  components: {
    SvgIcon,
  },

  data() {
    return {
      trashIcon: mdiTrashCanOutline,
      filterIcon: mdiFilterVariant,
      statusField: "All",
      entriesToComplete: [],
      store: null, // initialize store
      isDropdownOpen: false,
      numDocs: 1,
      sortIcon: mdiSortCalendarAscending,
      sortOrder: "desc",
    };
  },
  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    entriesPerPage: {
      type: Number,
      required: true,
    },
    searchQuery: {
      type: String,
      default: "",
    },
  },
  async mounted() {
    this.store = this.$store;
    const auth = getAuth();
    this.sellerId = auth.currentUser.uid;
    this.checkAndExpireOrders();
    this.display();
  },
  watch: {
    currentPage: "pageChange",
    searchQuery: "queryChange",
  },

  methods: {
    async pageChange() {
      // To ensure display() is not ran twice when query changes
      console.log("ran pageChange()");
      if (this.searchQuery === "") {
        await this.display();
      }
    },

    async queryChange() {
      console.log("ran queryChange()");
      await this.display();
    },

    async display() {
      console.log("display() ran");

      // Clear existing table content
      const tableBody = document
        .getElementById("table")
        .getElementsByTagName("tbody")[0];
      tableBody.innerHTML = "";

      // Calculate start and end index based on current page
      const startIndex = (this.currentPage - 1) * this.entriesPerPage;
      const endIndex = this.currentPage * this.entriesPerPage;

      // Create a Firestore query
      let queryRef = collection(db, "order");

      // Apply filter for orders that have not been deleted
      queryRef = query(queryRef, where("companyDeleted", "==", false));

      // Apply filter for partnerUID
      queryRef = query(queryRef, where("sellerId", "==", this.sellerId));

      // Apply search filter if searchQuery is not empty
      if (this.searchQuery) {
        queryRef = query(
          queryRef,
          where("orderId", "==", parseInt(this.searchQuery))
        );
      }

      // Filter based on status
      if (this.statusField != "All") {
        queryRef = query(queryRef, where("status", "==", this.statusField));
      }

      const querySnapshot = await getDocs(queryRef);
      const filteredDocuments = querySnapshot.docs.map((doc) => doc.data());
      this.numDocs = filteredDocuments.length;

      // Update number of pages
      this.$emit("total-page", filteredDocuments.length);

      // Sort documents by date ordered based on sortOrder
      filteredDocuments.sort((a, b) => {
        const dateA = new Date(a.datePurchased.seconds * 1000);
        const dateB = new Date(b.datePurchased.seconds * 1000);
        return this.sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });

      // Filter documents based on pagination
      const paginatedDocuments = filteredDocuments.slice(startIndex, endIndex);

      // Populate table with paginated documents
      paginatedDocuments.forEach((documentData) => {
        let row = tableBody.insertRow();
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        let cell4 = row.insertCell(3);
        let cell5 = row.insertCell(4);
        let cell6 = row.insertCell(5);
        let cell7 = row.insertCell(6);
        let cell8 = row.insertCell(7);

        cell1.innerHTML = documentData.orderId.toString().padStart(3, "00");
        cell2.innerHTML = documentData.order
          .map((item) => item.name + " x" + item.quantity + "<br>")
          .join("");
        cell3.innerHTML = documentData.name;
        let date = new Date(documentData.datePurchased.seconds * 1000);
        let formattedDate = `${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()}`;
        cell4.innerHTML = formattedDate;
        date = new Date(documentData.expirationDate.seconds * 1000);
        formattedDate = `${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()}`;
        cell5.innerHTML = formattedDate;
        cell6.innerHTML = "$" + documentData.totalPrice;

        // Apply oval border and color based on status
        const statusCellContent = document.createElement("div");
        statusCellContent.classList.add("status-cell-content");
        const statusWords = documentData.status.split(" ");
        statusWords.forEach((word) => {
          const oval = document.createElement("div");
          oval.classList.add("status-oval");
          oval.textContent = word;
          if (word === "Completed") {
            oval.classList.add("green");
          } else if (word === "Expired") {
            oval.classList.add("red");
          } else if (word === "Ongoing") {
            oval.classList.add("yellow");
          }
          statusCellContent.appendChild(oval);
        });
        cell7.appendChild(statusCellContent);

        if (documentData.status === "Ongoing") {
          // Render a checkbox
          let checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.name = "completed";
          checkbox.addEventListener("change", (event) => {
            this.handleCheckboxChange(event, documentData.orderId);
          });
          cell8.appendChild(checkbox);
        } else if (
          documentData.status === "Expired" ||
          documentData.status === "Completed"
        ) {
          // Render a delete button
          let deleteButton = document.createElement("button");
          deleteButton.className = "trash-bwt";
          deleteButton.innerHTML = `
            <svg style="width:24px; height:24px" viewBox="0 0 24 24">
              <path fill="darkred" d="${this.trashIcon}"></path>
            </svg>
          `;
          deleteButton.addEventListener("click", () => {
            this.deleteInstrument(documentData.orderId);
          });
          cell8.appendChild(deleteButton);
        }
      });
      this.entriesToComplete = []; // Ensure previously checked boxes are unchecked
    },
    toggleSortOrder() {
      this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
      this.sortIcon =
        this.sortOrder === "asc"
          ? mdiSortCalendarDescending
          : mdiSortCalendarAscending;
      this.display(); // Refresh the display with the new sort order
    },
    async deleteInstrument(id) {
      try {
        const confirmDelete = confirm(
          "Are you sure you want to delete order " + id + "?"
        );
        if (!confirmDelete) {
          return; // If user cancels, exit the function
        }
        const currDoc = doc(db, "order", id.toString());
        const currDocSnapshot = await getDoc(currDoc);
        const currDocData = currDocSnapshot.data();
        if (currDocData.customerDeleted) {
          await deleteDoc(currDoc);
        } else {
          await updateDoc(currDoc, { companyDeleted: true });
        }
        this.display(); // Refresh table after deletion
        this.store.dispatch("addNotification", {
          // use store from instance
          type: "success",
          message: "Successfully deleted order!",
        });
      } catch (error) {
        console.error("Error deleting document:", error);
        this.store.dispatch("addNotification", {
          // use store from instance
          type: "error",
          message: err.message,
        });
      }
    },
    filterByStatus(status) {
      this.statusField = status;
      if (this.currentPage === 1) {
        this.display(); // changePage wouldn't occur so need to manually call display()
      } else {
        this.$emit("handleStatus");
      }
    },
    // Method to handle checkbox change
    handleCheckboxChange(event, orderId) {
      if (event.target.checked) {
        console.log("handleCheckboxChange ran, checked");
        console.log("Before: ", this.entriesToComplete);
        this.entriesToComplete.push(orderId); // Add entry to selected list
        console.log("After: ", this.entriesToComplete);
      } else {
        const index = this.entriesToComplete.indexOf(orderId);
        console.log("Index to remove: ", index);
        console.log("Before: ", this.entriesToComplete);
        if (index !== -1) {
          this.entriesToComplete.splice(index, 1); // Remove entry from selected list
        }
        console.log("handleCheckboxChange ran, unchecked");
        console.log("After:", this.entriesToComplete);
      }
    },

    // Eco ranks calculation
    getEcoRank(weight) {
      if (weight >= 0 && weight <= 9999) {
        return 5;
      } else if (weight >= 10000 && weight <= 19999) {
        return 4;
      } else if (weight >= 20000 && weight <= 29999) {
        return 3;
      } else if (weight >= 30000 && weight <= 39999) {
        return 2;
      } else {
        return 1;
      }
    },

    // Method to complete selected entries
    async completeSelectedEntries() {
      // Perform completion action for selected entries
      const confirmComplete = confirm("Mark checked orders as complete?");
      if (!confirmComplete) {
        return; // If user cancels, exit the function
      }
      for (const orderId of this.entriesToComplete) {
        const docRef = doc(db, "order", orderId.toString());
        const docSnapshot = await getDoc(docRef);
        const docData = docSnapshot.data();
        const sellerId = docData.sellerId;
        const buyerId = docData.buyerId;
        const foodWeight = docData.totalWeight;

        const sellerDocRef = doc(db, "users", sellerId);
        const sellerDocSnapshot = await getDoc(sellerDocRef);
        const sellerDocData = sellerDocSnapshot.data();
        const sellerWeight = sellerDocData.weight + foodWeight;

        const buyerDocRef = doc(db, "users", buyerId);
        const buyerDocSnapshot = await getDoc(buyerDocRef);
        const buyerDocData = buyerDocSnapshot.data();
        const buyerWeight = buyerDocData.weight + foodWeight;

        await updateDoc(docRef, { status: "Completed" });
        await updateDoc(sellerDocRef, { weight: sellerWeight });
        await updateDoc(sellerDocRef, {
          rank: this.getEcoRank(sellerWeight),
        });
        await updateDoc(buyerDocRef, { weight: buyerWeight });
        await updateDoc(buyerDocRef, { rank: this.getEcoRank(buyerWeight) });
      }
      this.display();
      this.store.dispatch("addNotification", {
        // use store from instance
        type: "success",
        message: "Order(s) successfully completed!",
      });
      // Clear the selected entries list after completion
      this.entriesToComplete = [];
    },
    async checkAndExpireOrders() {
      console.log("checkAndExpireOrders() ran");
      const currentDate = new Date();
      let queryRef = collection(db, "order");
      queryRef = query(queryRef, where("sellerId", "==", this.sellerId));
      const querySnapshot = await getDocs(queryRef);
      querySnapshot.forEach(async (documentData) => {
        const order = documentData.data();
        if (
          order.status === "Ongoing" &&
          order.expirationDate.toMillis() < currentDate.getTime()
        ) {
          const docRef = doc(db, "order", order.orderId.toString());
          await updateDoc(docRef, { status: "Expired" });
        }
      });
    },
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    selectStatus(status) {
      this.statusField = status;
      this.isDropdownOpen = false;
      this.filterByStatus(status);
    },
  },
};
</script>

<style>
/* Shared styles for both components */
.container {
  max-width: 100%; /* Limit the container's width to the viewport width */
  margin: 0 auto; /* Center align the container */
  overflow-x: auto;
}

/* Table styles */
table {
  table-layout: fixed;
  border-collapse: collapse;
  width: 100%; /* Set table width to 100% of its container */
}

/* Table header styles */
th {
  background-color: #4e644b;
  color: #fff;
  padding: 12px;
  text-align: center;
  font-size: 16px;
  white-space: nowrap; /* Prevent text wrapping in header */
}

/* Table cell styles */
td {
  padding: 8px;
  text-align: center;
  font-size: 14px;
  white-space: normal;
}

/* Alternate row background color for better readability */
tbody tr:nth-child(even) {
  background-color: #c3d2c3;
}

tbody tr:nth-child(odd) {
  background-color: #e6e6e6;
}

/* Button style for delete button */
.bwt {
  color: #fff;
  background-color: transparent; /* Remove background color */
  border: none; /* Remove border */
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
}

/* Hover effect for delete button */
.bwt:hover {
  background-color: transparent; /* Keep the hover effect */
}

/* Adjust the width and height of the trash button */
.trash-bwt {
  width: 20px;
  height: 20px;
}

.trash-bwt:hover {
  transform: scale(1.1); /* Scale up by 10% on hover */
}

/* Styles for date and status container */
.date-container,
.status-container {
  display: flex;
  align-items: center;
  justify-content: center; /* Center the content horizontally */
}

.status-container select {
  border-radius: 4px;
  border: 2px solid #ccc;
  background-color: #fff;
  font-size: 14px;
}

.status-option:hover select {
  border-color: black; /* Change border color on hover */
}

/* Oval border styles */
.status-cell-content {
  display: flex;
  align-items: center; /* Center vertically */
  justify-content: center; /* Center horizontally */
}

.status-oval {
  border: 1px solid #ccc;
  border-radius: 20px; /* Half of the height to create an oval shape */
  padding: 4px 8px;
  font-size: 12px;
  background-color: lightcyan;
}

/* Color classes for status ovals */
.green {
  border-color: green;
  color: green;
}

.red {
  border-color: red;
  color: red;
}

.yellow {
  border-color: #ffbf00;
  color: #ffbf00;
}

/* Button styles */
#completeButton {
  background-color: #4caf50; /* Green background color */
  border: none; /* Remove border */
  color: white; /* White text color */
  padding: 10px 30px; /* Padding */
  text-align: center; /* Center align text */
  text-decoration: none; /* Remove underline */
  display: inline-block; /* Make it inline-block */
  font-size: 12px; /* Font size */
  cursor: pointer; /* Add cursor pointer on hover */
  border-radius: 4px; /* Rounded corners */
  transition: background-color 0.3s; /* Smooth transition on hover */
}

#completeButtonContainer {
  display: flex;
}

/* Hover effect for button */
#completeButton:hover {
  background-color: #45a049; /* Darker green color on hover */
}

/* Disabled button styles */
#completeButton:disabled {
  opacity: 0.5;
  cursor: not-allowed; /* Change cursor to 'not-allowed' */
}

.header-icons {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 4px;
}

.custom-dropdown {
  position: absolute;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  padding: 10px;
  z-index: 100;
  margin-left: -75px;
}

.custom-dropdown div {
  padding: 5px;
  cursor: pointer;
  color: black;
}
.custom-dropdown div:hover {
  background-color: #f0f0f0;
}
</style>
