<template>
 <div class="inputContainer">
  <input type="text" v-model="localSearchQuery" @input="emitSearchQuery" placeholder="Search for ..."/>
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
    },
  };
  
  </script>
  
<style>
.inputContainer {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

</style>
  