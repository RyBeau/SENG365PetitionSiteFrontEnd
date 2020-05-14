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
            <router-link v-if="this.getAuth()===''" class="nav-link disabled" :to="{name:'Home'}">Profile</router-link>
            <router-link v-else class="nav-link" :to="{name:'Home'}">Profile</router-link>
          </li>
        </ul>
    <router-link v-if='this.getAuth()===""' tag="button" class="btn btn-outline-light ml-md-auto" :to="{name: 'Login'}"> Log In</router-link>
    <button v-else class="btn btn-outline-light ml-md-auto" v-on:click="this.logOut">Log Out</button>
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
</div>
</template>

<script>
    export default {
        name: "Home"
    }
</script>
