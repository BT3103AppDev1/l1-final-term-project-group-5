<template>
<div class="inputContainer">
  <input type="text" class="input" v-model="localSearchQuery" @input="emitSearchQuery" placeholder="Search for ..."/>
  <button class='clear-btn' @click="clearSearch">
    <img src="@/assets/searchcross.png" alt="X" class="clear-img">
  </button>

</div> 
</template>
  
  <script>
  export default {
    data() {
      return {
        localSearchQuery: '',
      };
    },

    methods: {
      emitSearchQuery() {
        this.$emit('update-search-query', this.localSearchQuery);
      },

      clearSearch() {
        console.log("Clear search");
        this.localSearchQuery = '';
        this.emitSearchQuery();
      },
    },
  };
  
  </script>
  
<style>
.inputContainer {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  padding:3px;
  border: 2px ridge #ccc;
  border-radius:8px;
}

.inputContainer:focus-within {
  box-shadow: 0 0 8px darkgreen;
}

.input {
  width:100%;
  padding: 5px;
  text-align: left;
}

input:focus {
  outline:#4B644C;
}

.clear-btn {
  align-self: center;
  height:30px;
  width:30px;
  align-items: center;
}
.clear-img {
  border:1px solid #4B644C;
  border-radius: 80%;
  width:30px;
  height:30px;
}

.clear-img:hover {
  box-shadow: 0 0 3px gray;
}

</style>
  