<template>
  <div class="price-sorter">
      <label class="label" for="sort">Sort: </label>
      <select class="sort-select">
        <option disabled value>Please select one</option>
        <option @click="selectSort('lowToHigh')">Price (Low to High)</option>
        <option @click="selectSort('highToLow')">Price (High to Low)</option>
      </select>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selected: "",
    };
  },
  methods: {
    selectSort(option) {
      this.selected = option;
      this.updateSort();
    },
    updateSort() {
      //console.log('Selected Sort: ', this.selected);
      this.$emit("update-sort", this.selected);
    },
  },
};
</script>

<style scoped>
.pricesorter {
  display: flex;
  padding: 5px;
  width: 280px;
  flex-wrap: nowrap;
  gap: 10px;
  align-items: center;
}

.customDropdown {
  cursor: pointer;
}

.customerDropdown:hover {
  box-shadow: 0 0 5px darkgreen;
}

.sort-select {
  width: 100%;
  padding: 5px;
  border-radius: 5px;
  border: 1px inset #4b644c;
  letter-spacing:1px;
  cursor:pointer;
  text-align:center;
}

.sort-select:hover {
  box-shadow:0 0 0 2px #ccc;
}

.sort-select:focus {
  outline:none;
}

.sort-select option {
  padding: 5px;
  cursor: pointer;
  text-align:left;
}

</style>
