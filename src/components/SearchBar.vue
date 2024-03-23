<template>
    <div class="search-bar">
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
  </style>
  