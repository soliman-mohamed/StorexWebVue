<template>
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5 ">
          <div class="card">
            <div class="card-body">
              <h4 class="text-center">Register</h4>
              <p class="text-center">Create your account</p>

              <div v-if="errors.error" class="alert alert-danger text-center">
                {{ errors.error }}
              </div>
              <form @submit.prevent="register()" method="POST">

                <div class="mb-3">
                  <label for="name">Name</label>
                  <input class="form-control" :class="errors.name ? 'is-invalid' : ''" id="name" placeholder="Enter your name"
                    v-model="form.name" autofocus />
                  <div v-if="errors.name" class="text-danger">
                    {{ errors.name[0] }}
                  </div>
                </div>

                <div class="mb-3">
                  <label for="email">Email</label>
                  <input class="form-control" :class="errors.email ? 'is-invalid' : ''" id="email"
                    placeholder="Enter your email" v-model="form.email" />
                  <div v-if="errors.email" class="text-danger">
                    {{ errors.email[0] }}
                  </div>
                </div>

                <div class="mb-3">
                  <label for="password">Password</label>
                  <input class="form-control" :class="errors.password ? 'is-invalid' : ''" type="password" id="password"
                    placeholder="Enter your password" v-model="form.password" />
                  <div v-if="errors.password" class="text-danger">
                    {{ errors.password[0] }}
                  </div>
                </div>

                <div class="mb-3 text-center">
                  <button :disabled="lodding" class="btn btn-primary px-5">Register</button>
                </div>

              </form>
              <div class="mb-3 text-center">
                <hr>
                <h6 class="text-center mb-3">Have an Account?</h6>
                <router-link to="/login" class="btn px-5 btn-outline-primary">Login</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Register',
  data() {
    return {
      lodding: false,
      errors: [],
      form: {
        name: "",
        email: "", 
        password: "" 
      }
    }
  },
  methods: {
    async register() {
      this.lodding = true;
      this.errors = [];
      await axios.post('register', this.form)
        .then((response) => {
          if (response.data.status && response.data.status == 'failed') {
            this.errors = response.data.message;
          } else if (response.data.status && response.data.status == 'success') {
            this.$store.dispatch('login', response.data.authorisation);
            this.$router.push({ name: 'Home' });
          }
        })
        .catch((error) => {
          if (error.response && error.response.data && error.response.data.errors) {
            this.errors = error.response.data.errors;
          } else {
            this.errors = { 'error': 'Unauthorized' };
          }
        })
        .finally(() => {
          this.lodding = false;
        });
    }
  }
}
</script>