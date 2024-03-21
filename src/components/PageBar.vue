<template>
  <div>
    <button @click="handlePrev" :disabled="currentPage === 1 || searchQuery !== ''">Prev</button>
    <span>{{ currentPage }}</span>
    <button @click="handleNext" :disabled="currentPage === totalPages || searchQuery !== ''">Next</button>
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
  methods: {
    handlePrev() {
      if (this.currentPage > 1 && this.searchQuery === '') {
        this.$emit('page-change', this.currentPage - 1);
      }
    },
    handleNext() {
      if (this.currentPage < this.totalPages && this.searchQuery === '') {
        this.$emit('page-change', this.currentPage + 1);
      }
    }
  }
}
</script>

<style scoped>
  .page-bar {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  button {
    margin: 0 5px;
    padding: 5px 10px;
    border: 1px solid #ccc;
    border-radius: 3px;
    background-color: #fff;
    cursor: pointer;
  }

  button:disabled {
    color: #aaa;
    cursor: not-allowed;
  }

  button.active {
    background-color: #007bff;
    color: #fff;
  }
</style>
