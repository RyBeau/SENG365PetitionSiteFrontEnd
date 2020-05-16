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
            <router-link v-if="this.getAuth()===''" class="nav-link disabled" :to="{name:'Profile'}">Profile</router-link>
            <router-link v-else class="nav-link" :to="{name:'Profile'}">Profile</router-link>
          </li>
        </ul>
    <router-link v-if='this.getAuth()===""' tag="button" class="btn btn-outline-light ml-md-auto" :to="{name: 'Login'}"> Log In</router-link>
    <button v-else class="btn btn-outline-light ml-md-auto" v-on:click="this.logOut">Log Out</button>
  </nav>
  <div class="jumbotron text-center">
    <div v-show="error_flag" class="alert alert-danger alert-dismissible fade show" role="alert">
      {{error}}
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
      <div class="container">
        <h1 class="display-4">Petitions</h1>
        <p class="lead">Browse our countless petitions for great causes below.</p>
      </div>
    <div v-for="petition in petitions" class="card mb-3 mx-auto text-left" style="max-width: 540px;">
      <div class="row no-gutters">
        <div class="col-md-4 text-center">
          <img :src="getPetitionPhotoUrl(petition.petitionId)" class="card-img" alt="No Image Available">
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">{{petition.title}}</h5>
            <p class="card-text">Author: {{petition.authorName}}<br>
              Category: {{petition.category}}<br>
              Number of Signature: {{petition.signatureCount}}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>


</div>

</template>

<script>
    export default {
        name: "Petitions",
        data(){
            return{
              error:"",
              error_flag:false,
              petitions: [],
              categories: []
            }
          },
      mounted() {
          this.getPetitions();
          this.getCategories();
      },
      methods: {
          getCategories: function(){
            this.$http.get(this.route_prefix + "petitions/categories")
            .then((response) => {
              this.categories = response.data;
            }).catch((error) => {
              this.error = "Unable to retrieve petition categories";
              this.error_flag = true;
            });
          },
          getPetitionPhotoUrl: function (id){
            return this.route_prefix + "petitions/" + id + "/photo";
          },
          getPetitions: function(){
            const query_params = "";
            this.$http.get(this.route_prefix + "petitions?" + query_params)
            .then((response) => {
              this.petitions = response.data;
            }).catch((error) => {
              this.error = error.response.statusText;
              this.error_flag = true;
            });
            console.log(this.petitions);
          }
      }
    }
</script>
