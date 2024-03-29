<template>
  <div class="container">
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
          <th>Select</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
    <br>
    <div id="completeButtonContainer">
      <button id="completeButton" @click="completeSelectedEntries">Mark as Completed</button>
    </div>
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

        // Apply oval border and color based on status
        const statusCellContent = document.createElement('div');
        statusCellContent.classList.add('status-cell-content');
        const statusWords = documentData.status.split(' ');
        statusWords.forEach(word => {
          const oval = document.createElement('div');
          oval.classList.add('status-oval');
          oval.textContent = word;
          if (word === 'Completed') {
            oval.classList.add('green');
          } else if (word === 'Expired') {
            oval.classList.add('red');
          } else if (word === 'Ongoing') {
            oval.classList.add('yellow');
          }
          statusCellContent.appendChild(oval);
        });
        cell6.appendChild(statusCellContent);

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
      })
      this.entriesToComplete = []; // Ensure previously checked boxes are unchecked
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
        console.log('handleCheckboxChange ran, checked')
        console.log('Before: ' , this.entriesToComplete)
        this.entriesToComplete.push(orderId); // Add entry to selected list
        console.log('After: ', this.entriesToComplete)
      } else {
        const index = this.entriesToComplete.indexOf(orderId);
        console.log('Index to remove: ', index)
        console.log('Before: ' , this.entriesToComplete)
        if (index !== -1) {
          this.entriesToComplete.splice(index, 1); // Remove entry from selected list
        }
        console.log('handleCheckboxChange ran, unchecked')
        console.log('After:' ,this.entriesToComplete)
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
      }
      this.display();
      // Clear the selected entries list after completion
      this.entriesToComplete = [];
    },
  }
}
</script>

<style>
/* Shared styles for both components */
.container {
  width: 95vw; /* Ensure the container takes the full width */
  max-width: 100%; /* Limit the container's width to the viewport width */
  margin: 0 auto; /* Center align the container */
  padding: 20px; /* Add padding to the container */
}

/* Table styles */
table {
  font-family: 'Montserrat', sans-serif;
  border-collapse: collapse;
  width: 100%; /* Set table width to 100% of its container */
  border: none;
}

/* Table header styles */
th {
  background-color: #4E644B;
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
  white-space: nowrap; /* Prevent text wrapping in cells */
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

/* Styles for status container */
.status-container {
  display: flex;
  align-items: center;
  justify-content: center; /* Center the content horizontally */
}

.status-container select {
  margin-left: 8px;
  vertical-align: middle; /* Align the select element vertically */
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
  margin-right: 4px;
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
  border-color: #FFBF00;
  color: #FFBF00;
}

/* Complete button styles */
#completeButton {
  background-color: #4CAF50; /* Green background color */
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

#completeButton:hover {
  background-color: #45a049; /* Darker green color on hover */
}


</style>
