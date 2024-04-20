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
  background: url("..\\..\\bg2.png") no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  width: 100%;
  height: calc(100vh - 64px);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
