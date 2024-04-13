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
            categories: ['Dairy', 'Baked Good','Fruit', 'Vegetable']
        };
    },

    methods : {
        emitCategories() {
            this.$emit('update-categories', this.selectedCategories);
        }
    }
};
</script>

<style scoped>

.category-filter {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin-bottom: 20px;
}

.category-filter .category {
    margin: 5px 0;
}

.category-filter input[type="checkbox"] {
    margin-right: 10px;
}

.category-filter label {
    cursor: pointer;
}

</style>