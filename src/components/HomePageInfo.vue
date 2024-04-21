<template>
  <div class="background">
    <div class="info">
      <h2> WELCOME TO </h2>
      <h1 style="font-weight: 500">GreenHarbor</h1>
      <h4>GreenHarbour is on a mission to revolutionize sustainability in the food industry. </h4>
      <h4>Join us in making every bite count towards a waste-free future.</h4>
    </div>

    <div class="ecograde">
      <h2>What is EcoGrade?</h2>
      <img src="../assets/EcoGradeInfo.png"></img>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomePageInfo",
};
</script>

<style scoped>
.background {
  background: url("../assets/bg1.png") no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  width: 100%;
  height: 135vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.info {
  text-align: center;
  color: black;
  position: absolute;
  top: 50px;
  width: 100%;
}

h1 {
  font-size: 5rem;
}

h2 {
  font-size: 2.5rem;
}

h4 {
  font-size: 1rem;
}

.ecograde {
  text-align: center;
  color: black;
  position: absolute;
  bottom: 0;
}
</style>
