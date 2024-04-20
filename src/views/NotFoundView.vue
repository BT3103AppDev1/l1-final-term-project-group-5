<script>
import NotFound from "../components/NotFound.vue";

export default {
  components: {
    NotFound,
  },
};
</script>

<template>
  <NotFound class="background" />
</template>

<style scoped>
.background {
  background: url("..\\..\\public\\bg2.png") no-repeat center center fixed;
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
