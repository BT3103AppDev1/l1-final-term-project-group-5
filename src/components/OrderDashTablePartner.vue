<template>
  <div>
    <table id="table" class="'auto-index'">
      <thead>
        <tr>
          <th>ID</th>
          <th>Order</th>
          <th>Customer</th>
          <th>Date</th>
          <th>Price</th>
          <th>
            <div class="status-container">
              <span>Status</span>
              <select @change="filterByStatus(statusField)" v-model="statusField" >
                <option value="All">All</option>
                <option value="Completed">Completed</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Expired">Expired</option>
              </select>
            </div>
          </th>
          <th>Mark as Completed</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
    <br><br>
    <button id="completeButton" @click="completeSelectedEntries">Complete Selected</button>
    <br><br>
  </div>
</template>

<script>
import { firebaseApp } from '../firebase.js'
import { getFirestore, query, where, collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import trash from "@/assets/Trash.svg"

const db = getFirestore(firebaseApp);

export default {
  data() {
    return {
      sortField: null,
      sortDirection: 'asc',
      statusField: 'All',
      entriesToComplete: [],
    };
  },
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    entriesPerPage: {
      type: Number,
      required: true
    },
    searchQuery: {
      type: String,
      default: ''
    },
  },
  async mounted() {
    this.display();
  },
  watch: {
    currentPage: 'pageChange',
    searchQuery: 'queryChange',
  },

  methods: {
    async pageChange() {
      // To ensure display() is not ran twice when query changes
      console.log('ran pageChange()')
      if (this.searchQuery === '') {
        await this.display();
      }
    },

    async queryChange() {
      console.log('ran queryChange()');
      await this.display();
    },

    async display() {
      // Clear existing table content
      const tableBody = document.getElementById("table").getElementsByTagName('tbody')[0];
      tableBody.innerHTML = '';

      // Calculate start and end index based on current page
      const startIndex = (this.currentPage - 1) * this.entriesPerPage;
      const endIndex = this.currentPage * this.entriesPerPage;

      // Create a Firestore query
      let queryRef = collection(db, 'order');

      // Apply search filter if searchQuery is not empty
      if (this.searchQuery) {
        queryRef = query(queryRef, where('orderId', '==', this.searchQuery));
      }

      // Filter based on status
      if (this.statusField != 'All') {
        queryRef = query(queryRef, where('status', '==', this.statusField))
      }

      const querySnapshot = await getDocs(queryRef);
      const filteredDocuments = querySnapshot.docs.map(doc => doc.data());

      // Update number of pages
      this.$emit('total-page', filteredDocuments.length)

      // Filter documents based on pagination
      const paginatedDocuments = filteredDocuments.slice(startIndex, endIndex);

      // Populate table with paginated documents
      paginatedDocuments.forEach(documentData => {
        let row = tableBody.insertRow();
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        let cell4 = row.insertCell(3);
        let cell5 = row.insertCell(4);
        let cell6 = row.insertCell(5);
        let cell7 = row.insertCell(6);

        cell1.innerHTML = documentData.orderId;
        cell2.innerHTML = documentData.order;
        cell3.innerHTML = documentData.name;
        const date = new Date(documentData.datePurchased.seconds * 1000);
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        cell4.innerHTML = formattedDate;
        cell5.innerHTML = documentData.totalPrice;
        cell6.innerHTML = documentData.status;

        if (documentData.status === 'Ongoing' || documentData.status === 'Collected') {
          // Render a checkbox
          let checkbox = document.createElement('input')
          checkbox.type = 'checkbox'
          checkbox.name = 'completed'
          checkbox.addEventListener('change', (event) => {
          this.handleCheckboxChange(event, documentData.orderId);
        });
          cell7.appendChild(checkbox)
        } else if (documentData.status === 'Expired') {
          // Render a delete button
          let deleteButton = document.createElement('img');
          deleteButton.src = trash;
          deleteButton.className = "trash-bwt"
          deleteButton.innerHTML = "Delete"
          deleteButton.addEventListener('click', () => {
            this.deleteInstrument(documentData.orderId)
          })
          cell7.appendChild(deleteButton)
        }
      });
    },
    async deleteInstrument(id) {
      try {
        const confirmDelete = confirm("Are you sure you want to delete order " + id + "?");
        if (!confirmDelete) {
          return; // If user cancels, exit the function
        }
        await deleteDoc(doc(db, 'order', id));
        this.display(); // Refresh table after deletion
      } catch (error) {
        console.error('Error deleting document:', error);
      }
    },
    filterByStatus(status) {
      this.statusField = status;
      if (this.currentPage === 1) {
        this.display(); // changePage wouldn't occur so need to manually call display()
      } else {
      this.$emit('handleStatus');
      }
    },
    sortBy(header) {
      // insert code here
    },
    // Method to handle checkbox change
    handleCheckboxChange(event, orderId) {
      if (event.target.checked) {
        this.entriesToComplete.push(orderId); // Add entry to selected list
      } else {
        const index = this.entriesToComplete.indexOf(orderId);
        if (index !== -1) {
          this.entriesToComplete.splice(index, 1); // Remove entry from selected list
        }
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
        const docRef = doc(db, 'order', orderId);
        await updateDoc(docRef, { status: 'Completed' });
        this.display();
      }
      // Clear the selected entries list after completion
      this.entriesToComplete = [];
    },
  }
}
</script>

<style>
/* Table styles */
table {
    font-family: 'Montserrat', sans-serif; /* Applying Montserrat font */
    border-collapse: collapse;
    width: 100%;
}

/* Table header styles */
th {
    background-color: #4E644B;
    color: #fff;
    padding: 12px;
    text-align: center;
    border: 1px solid #ddd;
    font-size: 16px;
}

/* Table cell styles */
td {
    padding: 8px;
    text-align: center;
    border: 1px solid #ddd;
    font-size: 14px;
}

/* Alternate row background color for better readability */
tbody tr:nth-child(even) {
    background-color: #F0F4F0;
}

tbody tr:nth-child(odd) {
    background-color: #fff;
}

/* Button style for delete button */
.bwt {
    color: #fff;
    /* Remove background-color and border */
    background-color: transparent;
    border: none;
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
    width: 20%;
}

.trash-bwt:hover {
    transform: scale(1.1); /* Scale up by 10% */
}

/* Styles for status container */
.status-container {
  display: flex;
  align-items: center;
}

.status-container select {
  margin-left: 8px; /* Adjust the spacing between the text and the select box */
}
</style>