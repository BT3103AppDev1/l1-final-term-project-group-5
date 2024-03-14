<template>
    <div id="nav">
      <router-link to="/">
        <img src="../assets/GreenHarborLogo.png" alt="Green Harbor Logo" />
      </router-link>
      | 
      <router-link to="/Register">Sign Up</router-link>
      | 
      <router-link to="/Login">Login</router-link>
    </div>
  </template>
  
  <script>
  export default {
    name: 'NavLoggedOut'
  }
  </script>
  
  <style scoped>
    /* Add any specific styles for your Nav component here */
  </style>