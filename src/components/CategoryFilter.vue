<template>
    <div class="category-filter">
        <h2 class="header">Filter by Category</h2>
        <div v-for="category in categories" :key="category" class="category-checkbox">
            <input type="checkbox" :id="category" :value="category" v-model="selectedCategories" @change="emitCategories"/>
            <label :for="category" class="label">{{ category }}</label>
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
@import url('https://fonts.googleapis.com/css2?family=Public+Sans&display=swap');

.header {
    letter-spacing: 1px;
    font-family: 'Public Sans', sans-serif;
    color:#00350a;
    font-weight:bold;
}
.label {
    font-family: 'Public Sans', sans-serif;
    color:#00350a;

}
.category-filter {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    margin-bottom: 20px;
}

.category-filter .category {
    margin: 5px 0;
}

.category-filter input[type="checkbox"]:checked ~ .checkmark {
    background-color:red;
}



.category-filter label {
    cursor: pointer;
}

</style>