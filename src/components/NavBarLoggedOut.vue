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
    #nav {
      position: fixed;
      top: 0;
      width: 100%;
      z-index: 1000; /* This ensures the navbar stays on top of other elements */
      background-color: #f8f9fa; /* This sets the background color of the navbar */
      padding-top: 10px;
    }
  </style>