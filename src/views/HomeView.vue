<script setup>
import HomePartnerDisplay from "@/components/HomePartnerDisplay.vue";
import HomePageInfo from "@/components/HomePageInfo.vue";
</script>

<template>
  <main>
    <div class="parent">
      <HomePageInfo />
      <HomePartnerDisplay class="home-partner-display" />
    </div>
  </main>
</template>

<style scoped>
.parent {
  position: relative;
}

.home-partner-display {
  position: absolute;
  top: 320px;
  left: 0px;
  z-index: 2;
}
</style>
