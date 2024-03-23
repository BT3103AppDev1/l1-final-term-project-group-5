<template>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header">Login</div>
            <div class="card-body">
              <div v-if="error" class="alert alert-danger">{{error}}</div>
              <form action="#"  @submit.prevent="LoginWithEmail">
                <div class="form-group row">
                  <label for="email" class="col-md-4 col-form-label text-md-right">Email</label>
  
                  <div class="col-md-6">
                    <input
                      id="email"
                      type="email"
                      class="form-control"
                      name="email"
                      value
                      required
                      autofocus
                      v-model="email"
                      autocomplete="email"
                    />
                  </div>
                </div>
  
                <div class="form-group row">
                  <label for="password" class="col-md-4 col-form-label text-md-right">Password</label>
  
                  <div class="col-md-6">
                    <input
                      id="password"
                      type="password"
                      class="form-control"
                      name="password"
                      required
                      v-model="password"
                    />
                  </div>
                </div>
  
                <div class="form-group row mb-0">
                  <div class="col-md-8 offset-md-4">
                    <button type="submit" class="btn btn-primary" @click="LoginWithEmail">Login</button>
                  </div>
                </div>

                <div class="form-group row mb-0">
                  <div class="col-md-8 offset-md-4">
                    <button type="submit" class="btn btn-primary" @click="LoginWithGoogle">Login With Google</button>
                  </div>
                </div>

                <div class="form-group row">
                  <div class="col-md-6">
                    <p>If you aren't registered, you can <router-link to="/register">register here</router-link>.</p>
                  </div>
                </div>

                <div class="form-group row">
                  <div class="col-md-6">
                    <p><router-link to="/forgetPassword">Forget Password</router-link>.</p>
                  </div>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
name: "LoginComponent",
    setup() {
    const email = ref('')
    const password = ref('')
    const error = ref(null)

    const store = useStore()
    const router = useRouter()

    const LoginWithEmail = async () => {
      try {
          await store.dispatch('loginWithEmail', {
          email: email.value,
          password: password.value
          })
          router.push('/')
      }
      catch (err) {
          error.value = err.message
      }
    }

    const LoginWithGoogle = async () => {
      try {
          await store.dispatch('loginWithGoogle', {}).then(
          router.push('/'))
      }
      catch (err) {
          error.value = err.message
      }
    }
    return { LoginWithEmail, email, password, error, LoginWithGoogle }
}
};
</script>