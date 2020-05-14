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
            <router-link v-if="this.getAuth()===''" class="nav-link disabled" :to="{name:'Profile'}">Profile</router-link>
            <router-link v-else class="nav-link active" :to="{name:'Profile'}">Profile</router-link>
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
        <h1 class="display-4">Your Profile</h1>
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Profile Information</h4>
          </div>
          <div class="row no-gutters">
            <div class="col-md-3">
              <img v-bind:src="profile_picture" class="card-img" alt="Profile Picture">
            </div>
            <div class="col-md-9">
              <div class="card-body text-left">
                <h5>Name: {{name}}</h5>
                <h5>Email Address: {{email}}</h5>
                <h5>City: {{city}}</h5>
                <h5>Country: {{country}}</h5>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <button class="btn btn-dark">Update Information</button>
          </div>
        </div>
      </div>

   </div>
</div>
</template>

<script>
    export default {
        name: "Profile",
      data(){
        return {
          name: "",
          email: "",
          city: "None Given",
          country: "None Given",
          profile_picture: "https://i.imgur.com/XdhaLFP.png",
          error_flag: false,
          error:""
        }
      },
      mounted(){
        this.getProfileInformation();
        this.getProfilePicture();
      },
        methods:{
          getProfileInformation: function() {
            this.$http.get(this.route_prefix + "users/" + this.getUserId(), {headers: {
                "X-Authorization": this.getAuth()
              }}).then((response) => {
              this.name = response.data.name;
              this.email = response.data.email;
              if (response.data.city !== null){
                this.city = response.data.city;
              }
              if(response.data.country !== null){
                this.country = response.data.country;
              }
              this.$forceUpdate();
            }).catch((error) => {
              this.error_flag = true;
              this.error = error.response.statusText;
            });
          },
          getProfilePicture: function(){
              this.$http.get(this.route_prefix + "users/" + this.getUserId() + "/photo")
            .then((response) => {
              this.profile_picture = this.route_prefix + "users/" + this.getUserId() + "/photo";
            }).catch((error) => {
              if(error.response){
                if (error.response.status !== 404){
                  this.error_flag = true;
                  this.error = error.response.statusText;
                }
              } else {
                console.log(error);
                this.error_flag = true;
                this.error = error;
              }

            });
          }
        }
    }
</script>
