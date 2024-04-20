<template>
    <div class="checkout-page">
        <CheckoutPage />
    </div>
</template>

<script>
import CheckoutPage from "@/components/CheckoutPage.vue";

export default {
    components : {
        CheckoutPage,
    },
}
</script>

<style scoped>
.checkout-page {
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