<template>
  <div class="pagination-container">
    <button class="previous-button" @click="handlePrev" :disabled="currentPage < 4 || searchQuery !== ''" :class="{ 'fade-out': currentPage < 4 }">Previous</button>
    <button v-for="pageNumber in visiblePages" :key="pageNumber" class="pagination-button" @click="goToPage(pageNumber)" :class="{ 'current-page': currentPage === pageNumber }">{{ pageNumber }}</button>
    <button class="next-button" @click="handleNext" :disabled="currentPage + 2 > totalPages - 1 || searchQuery !== ''" :class="{ 'fade-out': currentPage + 2 > totalPages - 1}">Next</button>
  </div>
</template>

<script>
export default {
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    },
    searchQuery: {
      type: String,
      default: ''
    }
  },
  computed: {
    visiblePages() {
      const start = Math.floor((this.currentPage - 1) / 3) * 3 + 1;
      const end = Math.min(start + 2, this.totalPages);
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }
  },
  methods: {
    handlePrev() {
      if (this.currentPage > 1 && this.searchQuery === '') {
        let remainder = this.currentPage % 3
        if (remainder === 0) {
          remainder = 3
        }
        this.$emit('page-change', this.currentPage - remainder - 2);
      }
    },
    handleNext() {
      if (this.currentPage < this.totalPages && this.searchQuery === '') {
        let remainder = this.currentPage % 3
        if (remainder === 0) {
          remainder = 1
        } else if (remainder === 1) {
          remainder = 3
        }
        this.$emit('page-change', this.currentPage + remainder);
      }
    },
    goToPage(pageNumber) {
      if (this.currentPage !== pageNumber && this.searchQuery === '') {
        this.$emit('page-change', pageNumber);
      }
    }
  }
}
</script>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
}

.pagination-button,
.previous-button,
.next-button {
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

.previous-button-focused {
  background-color: #e6f5d9;
  color: #007b36;
  box-shadow: 0 0 2px 1px rgba(0, 123, 54, 0.2);
}

.previous-button-focused:hover,
.pagination-button:hover,
.next-button:hover {
  background-color: #f0f0f0;
}

.pagination-button:focus,
.previous-button-focused:focus {
  outline: none;
  box-shadow: 0 0 2px 1px rgba(0, 123, 54, 0.2);
}

.next-button {
  margin-left: 8px;
}

.previous-button-focused:focus,
.previous-button-focused:hover,
.previous-button {
  margin-right: 8px;
}

.current-page {
  background-color: #6b7b38;
  color: #fff;
}

.fade-out {
  opacity: 0.5; /* Adjust the opacity value as needed */
}
</style>
