<script>
import PartnerMarketplace from "../components/PartnerMarketplace.vue";

export default {
  components: {
    PartnerMarketplace,
  },
};
</script>

<template>
  <PartnerMarketplace class="background" />
</template>

<style scoped>
.background {
  background: url("..\\..\\bg2.png") no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  width: 100%;
  height: 140vh;
  display: flex;
}
</style>
