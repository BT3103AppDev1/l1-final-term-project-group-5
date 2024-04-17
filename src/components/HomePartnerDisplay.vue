<template>
  <div class="container">
    <div class="horizontal-scrolling-items">
      <div
        v-for="(item, index) in items.concat(items)"
        :key="index"
        class="horizontal-scrolling-items__item"
      >
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        "Item1&nbsp",
        "Item1&nbsp",
        "Item1&nbsp",
        "Item1&nbsp",
        "Item1&nbsp",
        "Item1&nbsp",
        "Item1&nbsp",
      ],
    };
  },
};
</script>

<style>
@keyframes infiniteScroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}
.container {
  width: 800px !important; /* Adjust this to control the width of the container */
  overflow-x: hidden;
  margin: 10px 20px; /* Adjust this to control the margin around the container */
  border-width: 7px 10px; /* Adjust this to change the border width */
  border-style: solid;
  border-color: #7C8E76; /* Adjust this to change the border color */
}
.horizontal-scrolling-items {
  display: flex;
  font-size: 40px;
  width: 2600px;
  animation-name: infiniteScroll;
  animation-duration: 20s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}
.horizontal-scrolling-items__item {
  white-space: nowrap;
  margin-right: 20px; /* Adjust this to control the space between items */
  border: 1px solid black; /* Adjust this to change the border around items */
}
</style>
