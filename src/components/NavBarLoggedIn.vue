<template>
    <div id="nav">
      <router-link to="/">
        <img src="../assets/GreenHarborLogo.png" alt="Green Harbor Logo" />
      </router-link>
      | 
      <router-link to="/">Home</router-link>
      | 
      <router-link to="/">Marketplace</router-link>
      <router-link to="/myorders">My Orders</router-link>
      |
      <button @click.prevent="signOut" class="btn btn-primary">Log Out</button>
    </div>
  </template>
  
  <script>
  import { useStore } from "vuex";
  import { useRouter } from "vue-router";
  
    
  export default {
    name: 'NavLoggedIn',

    setup() {
    const store = useStore()  
    const router = useRouter()
    const signOut = async () => {
        await store.dispatch('logOut')
        router.push('/login')
    }
    return { signOut }
  }
  
  }
  </script>
  
  <style scoped>
    /* Add any specific styles for your Nav component here */
  </style>