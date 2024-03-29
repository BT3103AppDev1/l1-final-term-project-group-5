<template>
    <div class="category-filter">
        <p>Filter by Category</p>
        <div v-for="category in categories" :key="category" class="category-checkbox">
            <input type="checkbox" :id="category" :value="category" v-model="selectedCategories" @change="emitCategories"/>
            <label :for="category">{{ category }}</label>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            selectedCategories: [],
            categories: ['Fruit', 'Vegetable']
        };
    },

    methods : {
        emiteCategories() {
            this.$emit('update-categories', this.selectedCategories);
        }
    }
};
</script>

<style scoped>

.category-filter {
    align-items: right;
    text-align: right;
}
</style>

