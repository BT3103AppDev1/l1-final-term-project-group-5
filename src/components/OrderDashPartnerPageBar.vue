<template>
  <div class="pagination-container">
    <button
      class="previous-button"
      @click="handlePrev"
      :disabled="currentPage < 4 || searchQuery !== ''"
      :class="{ 'fade-out': currentPage < 4 }"
    >
      Previous
    </button>
    <button
      v-for="pageNumber in visiblePages"
      :key="pageNumber"
      class="pagination-button"
      @click="goToPage(pageNumber)"
      :class="{ 'current-page': currentPage === pageNumber }"
    >
      {{ pageNumber }}
    </button>
    <button
      class="next-button"
      @click="handleNext"
      :disabled="isNextDisabled"
      :class="{ 'fade-out': isNextDisabled }"
    >
      Next
    </button>
  </div>
</template>

<script>
export default {
  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
    searchQuery: {
      type: String,
      default: "",
    },
  },
  computed: {
    visiblePages() {
      const start = Math.floor((this.currentPage - 1) / 3) * 3 + 1;
      const end = Math.min(start + 2, this.totalPages);
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    },
    isNextDisabled() {
      if (this.searchQuery !== "") {
        return true;
      }
      let remainder = this.currentPage % 3;
      let page = this.currentPage;
      if (remainder === 2) {
        page = this.currentPage - 1;
      } else if (remainder === 0) {
        page = this.currentPage - 2;
      }
      return page + 3 > this.totalPages;
    },
  },
  methods: {
    handlePrev() {
      if (this.currentPage > 1 && this.searchQuery === "") {
        let remainder = this.currentPage % 3;
        if (remainder === 0) {
          remainder = 3;
        }
        this.$emit("page-change", this.currentPage - remainder - 2);
      }
    },
    handleNext() {
      if (this.currentPage < this.totalPages && this.searchQuery === "") {
        let remainder = this.currentPage % 3;
        if (remainder === 0) {
          remainder = 1;
        } else if (remainder === 1) {
          remainder = 3;
        }
        this.$emit("page-change", this.currentPage + remainder);
      }
    },
    goToPage(pageNumber) {
      if (this.currentPage !== pageNumber && this.searchQuery === "") {
        this.$emit("page-change", pageNumber);
      }
    },
  },
};
</script>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 10px 10px 10px;
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

.previous-button {
  background-color: #e6f5d9;
  color: #007b36;
  box-shadow: 0 0 2px 1px rgba(0, 123, 54, 0.2);
}

.previous-button:hover,
.pagination-button:hover,
.next-button:hover {
  background-color: #848b6e;
}

.pagination-button:focus,
.previous-button:focus,
.next-button:focus {
  outline: none;
  box-shadow: 0 0 2px 1px rgba(0, 123, 54, 0.2);
}

.next-button {
  margin-left: 8px;
}

.previous-button:focus,
.previous-button:hover,
.previous-button {
  margin-right: 8px;
}

.current-page {
  background-color: #6b7b38;
  color: #fff;
}

.fade-out {
  opacity: 0.5; /* Adjust the opacity value as needed */
  cursor: not-allowed;
}
</style>
