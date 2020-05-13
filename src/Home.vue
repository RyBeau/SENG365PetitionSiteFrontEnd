<template>
<div>
  <nav class="navbar sticky-top navbar-expand navbar-dark bg-dark">
    <router-link class="navbar-brand" :to="{name: 'Home'}">
      <h3>SENG365 Petitions Site</h3>
    </router-link>
        <ul class="navbar-nav">
          <li class="nav-item">
          <router-link class="nav-link active" :to="{name:'Home'}">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{name:'Petitions'}">Petitions</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{name:'Home'}">Profile</router-link>
          </li>
        </ul>
    <button type="button" class="btn btn-outline-light ml-md-auto" data-toggle="modal"
            data-target="#loginModal">Log In</button>
  </nav>
  <div class="jumbotron text-center" style="height:90vh;">
      <div class="container">
        <h1 class="display-4">Welcome to the SENG365 Petitions Site</h1>
        <p class="lead">Browse our countless petitions for great causes.</p>
        <router-link class="btn btn-dark" :to="{name:'Petitions'}" tag="button">
          Browse
        </router-link>
      </div>
      </div>
  <div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="loginModal" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-sm">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Log In</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form>
            <div class="form-group">
              <input type="text" class="form-control" id="loginEmail" placeholder="Email Address" required>
            </div>
            <div class="form-group">
              <input type="password" class="form-control" id="loginPassword" placeholder="Password" required>
              <div class="invalid-feedback">
                Invalid Email or Password
              </div>
            </div>
            <button class="btn btn-dark" type="submit" v-on:click="logIn()">Log In</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
    export default {
        name: "Home",
      methods:{
          logIn: function () {
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            this.$http.get("localhost:")
          }
      }
    }
</script>
