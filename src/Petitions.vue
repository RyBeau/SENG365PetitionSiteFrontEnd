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
            <router-link class="nav-link active" :to="{name:'Petitions'}">Petitions</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{name:'Home'}">Profile</router-link>
          </li>
        </ul>
    <router-link tag="button" class="btn btn-outline-light ml-md-auto" :to="{name: 'Login'}"> Log In</router-link>
  </nav>
  <div class="jumbotron text-center">
      <div class="container">
        <h1 class="display-4">Petitions</h1>
        <p class="lead">Browse our countless petitions for great causes below.</p>
      </div>
      </div>
    </div>
</template>

<script>
    export default {
        name: "Home"
    }
</script>
