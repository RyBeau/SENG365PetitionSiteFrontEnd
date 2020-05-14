<template>
<div>
  <nav class="navbar sticky-top navbar-expand navbar-dark bg-dark">
    <router-link class="navbar-brand" :to="{name: 'Home'}">
      <h3>SENG365 Petitions Site</h3>
    </router-link>
        <ul class="navbar-nav">
          <li class="nav-item">
          <router-link class="nav-link" :to="{name:'Home'}">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{name:'Petitions'}">Petitions</router-link>
          </li>
          <li class="nav-item">
            <router-link v-if="this.getAuth()===''" class="nav-link disabled" :to="{name:'Home'}">Profile</router-link>
            <router-link v-else class="nav-link" :to="{name:'Home'}">Profile</router-link>
          </li>
        </ul>
    <router-link tag="button" class="btn btn-outline-light ml-md-auto" :to="{name: 'Login'}"> Log In</router-link>
  </nav>

  <div class="jumbotron text-center" style="height:90vh;">
      <div class="card border-secondary mx-auto" style="width: 30rem;">
        <div class="card-header display-4">Log In</div>
        <div class="card-body">
          <div v-show="invalidInfo" class="alert alert-danger fade-in" role="alert" :key="invalidInfo">Invalid Email Address or Password</div>
          <div v-show="this.error_flag" class="alert alert-warning fade-in" role="alert" :key="this.error_flag">{{this.error}}</div>
        <form v-on:submit.prevent="logOn()">
          <div class="form-group">
            <label for="loginEmail">Email Address:</label>
            <input type="email" class="form-control text-center" id="loginEmail" placeholder="Email Address" required>
          </div>
          <div class="form-group">
          <label for="loginPassword">Password:</label>
          <input type="password" class="form-control text-center" id="loginPassword" placeholder="Password" required>
          </div>
          <div class="form-group">
            <label>Don't have an account? <a href="#exampleModal" data-toggle="modal" data-target="#exampleModal">Register Here</a></label>
          </div>
          <button class="btn btn-dark" type="submit">Log In</button>
        </form>
        </div>
      </div>
  </div>
  <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          Register info
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-dark" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-dark">Save changes</button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
    export default {
      data () {
        return{
          error: "",
          error_flag: false,
          invalidInfo: false
        }
      },
        name: "Home",
      methods:{
          logOn: function () {
            const email = document.getElementById("loginEmail").value;
            const password = document.getElementById("loginPassword").value;
            this.$http.post(this.route_prefix + "users/login", {"email": email,"password":password})
              .then((response) => {
                if (response.status === 200) {
                  this.logUserIn(response.data.token, response.data.userId);
                  this.$router.go(-1);
                }
            }).catch((error) => {
              if (error.response.status === 400) {
                this.invalidInfo = true;
              } else {
                this.error = error;
                this.error_flag = true;
              }
            });
          }
      }
    }
</script>
