<template>
    <div class="price-sorter">
        <input type="radio" id="lowToHigh" value="lowToHigh" v-model="selected" @change="updateSort">
        <label for="lowToHigh">Price - Low to High</label><br>
        <input type="radio" id="highToLow" value="highToLow" v-model="selected" @change="updateSort">
        <label for="highToLow">Price - High to Low</label><br>
    </div>
</template>

<script>
export default {
    data() {
        return {
            selected: '',
        }
    },
    methods: {
        updateSort() {
            console.log('Selected Sort: ', this.selected);
            this.$emit('update-sort', this.selected);
        }
    }
}
</script>

<style scoped>
.price-sorter {
    margin-bottom: 20px;
    width:100%;
}
</style>