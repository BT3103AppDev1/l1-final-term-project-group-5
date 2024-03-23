<template>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header">Profile Page</div>
            <div class="card-body">
              <div v-if="error" class="alert alert-danger">{{error}}</div>

              <form action="#" @submit.prevent="RegisterWithEmail">

                <div class="form-group row">
                  <label for="name" class="col-md-4 col-form-label text-md-right">Name</label>
  
                  <div class="col-md-6">
                    <input
                      id="name"
                      type="name"
                      class="form-control"
                      name="name"
                      value
                      required
                      autofocus
                      v-model="name"
                      autocomplete="name"
                    />
                  </div>
                </div>
  
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
                    <button type="submit" class="btn-primary" @click="RegisterWithEmail">Register</button>
                  </div>
                </div>

                <div class="form-group row mb-0">
                  <div class="col-md-8 offset-md-4">
                    <button type="button" class="btn-primary" >Reset Password</button>
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

</script>

<style>
.btn.active {
  background-color: #30c77b; /* Eco-friendly green */
  border-color: #30c77b;
  color: white; /* You might want to change the text color to ensure it's readable on the green background */
}

.container {
  display: block;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}

.container .btn-primary {
  display: flex;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10px;
}

.form-group .col-md-6 {
  display: flex;
  justify-content: center;
}

.card-header {
  font-size: 2em;
}
</style>