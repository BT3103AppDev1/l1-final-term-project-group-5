<script setup>
import SeekerDashboard from "../components/SeekerDashboard.vue";
</script>

<template>
  <main>
    <SeekerDashboard class="background"/>
  </main>
</template>

<style scoped>
.background {
  background: url("..\\assets\\bg2.png") no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
