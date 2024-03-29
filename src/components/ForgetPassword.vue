<template>
  <div class="forget-password">
    <h1>Forget Password</h1>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" autocomplete="off" required />
      </div>
      <button type="submit">Confirm</button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'


export default {
  name: "ForgetPassword",
  setup() {
    const store = useStore()
    const email = ref('')

    const submitForm = async () => {
      await store.dispatch('forgetPassword', email.value)
    }
    return { submitForm, email }
  }

};
</script>

<style scoped>
.forget-password {
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.forget-password .form-group {
  margin-bottom: 20px;
}

.forget-password label {
  display: block;
  margin-bottom: 10px;
}

.forget-password input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.forget-password button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
