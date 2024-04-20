<template>
    <div class="price-sorter">
        <label class="label" for="sort">Sort By: </label>
        <button @click="toggleSortDropdown">
            <img src="@/assets/CaretDown.png" alt="Options" class="img">
        </button>
        <div v-if="showSortDropdown" class="customDropdown">
            <div @click="selectSort('')">Please select one</div>
            <div @click="selectSort('lowToHigh')">Price - Low to High</div>
            <div @click="selectSort('highToLow')">Price - High to Low</div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            selected: '',
            showSortDropdown: false,
        }
    },
    methods: {
        toggleSortDropdown() {
            this.showSortDropdown = !this.showSortDropdown;
        },
        selectSort(option) {
            this.selected = option;
            this.updateSort();
        },
        updateSort() {
            //console.log('Selected Sort: ', this.selected);
            this.$emit('update-sort', this.selected);
        }
    }
}
</script>

<style scoped>
.pricesorter {
    display:flex;
    padding: 5px;
    width:280px;
    flex-wrap:nowrap;
    gap:10px;
    align-items: center;
}


.customDropdown {
    cursor:pointer;
}

.customerDropdown:hover {
    box-shadow: 0 0 5px darkgreen;
}

</style>