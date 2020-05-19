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
        <div class="card mb-3">
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
            <button class="btn btn-dark" data-toggle="modal" data-target="#updateProfileModal">Update Information</button>
          </div>
        </div>
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Your Petitions</h4>
          </div>
          <div class="card-body">
            <div v-for="petition in userPetitions" class="card mb-3 mx-auto text-left" style="max-width: 540px;">
              <div class="row no-gutters">
                <div class="col-md-4 text-center">
                  <img :src="getPhotoUrl(petition.petitionId)" class="card-img" alt="No Image Available">
                </div>
                <div class="col-md-8">
                  <div class="card-body">
                    <h5 class="card-title">{{petition.title}}</h5>
                    <p class="card-text">Author: {{petition.authorName}}<br>
                      Category: {{petition.category}}<br>
                      Signatures: {{petition.signatureCount}}<br>
                      <a :href="'/petitions/' + petition.petitionId" class="stretched-link">View Petition</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
   </div>
  <div class="modal fade" id="updateProfileModal" tabindex="-1" role="dialog" aria-labelledby="updateProfileModal" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Update Profile Information</h5>
          <button type="button" id="updateModalClose" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body" >
          <div v-show="updateSuccess!==''" class="alert alert-success alert-dismissible fade-in" role="alert" :key="updateSuccess + 'success'">{{updateSuccess}}
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div v-show="updateError!==''" class="alert alert-danger fade-in" role="alert" :key="updateError + 'error'">{{updateError}}</div>
          <form v-on:submit.prevent="updateUserInfo">
            <div class="form-group">
              <label for="updateName">Name:</label>
              <input class="form-control" type = "text" id="updateName" :value="name" required>
            </div>
            <div class="form-group">
              <label for="updateEmail">Email:</label>
              <input class="form-control" type = "email" id="updateEmail" :value="email" required>
            </div>
            <div class="form-group">
              <label for="updateCity">City:</label>
              <input class="form-control" type = "text" id="updateCity" :value="city">
            </div>
            <div class="form-group">
              <label for="updateCountry" >Country:</label>
              <input class="form-control" type = "text" id="updateCountry" :value="country">
            </div>
            <div class="form-group">
              <label for="updateNewPassword">New Password:</label>
              <input class="form-control" type = "password" id="updateNewPassword">
            </div>
            <div class="form-group">
              <label for="updateCurrentPassword">Current Password:</label>
              <input class="form-control" type = "password" id="updateCurrentPassword">
            </div>
            <div class="form-group">
              <label for="updateImage">Profile Picture:</label>
              <div class="form-inline">
                <input @change="handleImage" class="form-control" type = "file" id="updateImage" accept="image/jpeg,image/gif,image/png">
                <button type="button" class="btn btn-danger mx-sm-3" v-on:click="deletePhoto">Delete Photo</button>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-dark" type="submit">Update</button>
              <button type="button" class="btn btn-dark" data-dismiss="modal">Close</button>
            </div>
          </form>
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
          city: "",
          country: "",
          profile_picture: "",
          error_flag: false,
          error:"",
          updateSuccess:"",
          updateError: "",
          image:"",
          userPetitions: {}
        }
      },
      mounted(){
        this.getProfileInformation();
        this.getProfilePicture();
        this.getUserPetitions();
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
              this.profile_picture = this.route_prefix + "users/" + this.getUserId() + "/photo?x=" + new Date().getTime();
            }).catch((error) => {
              if(error.response){
                if (error.response.status !== 404){
                  this.error_flag = true;
                  this.error = error.response.statusText;
                } else {
                  this.profile_picture = "https://i.imgur.com/XdhaLFP.png";
                }
              } else {
                console.log(error);
                this.error_flag = true;
                this.error = error;
              }

            });
          },
          sendUpdate : function (data){
            this.$http.patch(this.route_prefix + "users/" + this.getUserId(), data, {headers: {
              "X-Authorization": this.getAuth()
              }}).then((response) => {
                this.getProfileInformation();
                this.updateSuccess = "Profile Updated Successfully";
                this.updateError = "";
                this.$forceUpdate()
            }).catch((error) => {
              this.updateSuccess = "";
              if(error.response){
                this.updateError = error.response.statusText;
              } else {
                this.updateError = error;
              }
            })
          },
          checkFields : function (data, image){
            if (data.city && !(/^[a-zA-Z\s]+$/.test(data.city))){
              throw("Invalid City Name: letters and spaces only");
            }
            if (data.country && !(/^[a-zA-Z\s]+$/.test(data.country))){
              throw("Invalid Country Name: letters and spaces only");
            }
            if (data.name && !(/^[a-zA-Z\s]+$/.test(data.name))){
              throw("Invalid name: letters and spaces only");
            }
            if (image.length !== 0 && !(['image/png','image/jpeg','image/gif'].includes(image[0]['type']))){
              throw("Invalid Image Format");
            }
            if (data.password && !data.currentPassword){
              throw("Must Enter Previous Password");
            }
            return data
          },
          deletePhoto: function(){
            this.$http.delete(this.route_prefix + "users/" + this.getUserId() + "/photo", {headers: {
              "X-Authorization": this.getAuth()
              }}).then((response) => {
                this.updateSuccess = "Profile Picture Deleted";
                this.getProfilePicture();
            }).catch((error) => {
              if ( error.response.status === 404){
                this.updateError = "No Profile Picture to delete"
              } else {
                this.updateError = error.response.statusText;
              }
            })
          }
          ,
          updateUserInfo : function () {
            const newName = document.getElementById("updateName").value;
            const newEmail = document.getElementById("updateEmail").value;
            const newCity = document.getElementById("updateCity").value;
            const newCountry = document.getElementById("updateCountry").value;
            const newPass = document.getElementById("updateNewPassword").value;
            const currentPass = document.getElementById("updateCurrentPassword").value;
            const image = document.getElementById("updateImage").files;
            let data = {};
            if(newName !== this.name) {data.name = newName}
            if(newEmail !== this.email) {data.email = newEmail}
            if(newCity !== this.city && newCity !== "") {data.city = newCity}
            if(newCountry !== this.country && newCountry !== ""){data.country = newCountry}
            if(newPass !== "") {data.password = newPass}
            if(currentPass !== "") {data.currentPassword = currentPass}
            if (Object.keys(data).length !== 0 || image.length !== 0){
              try{
                this.checkFields(data, image);
              } catch (error) {
                this.updateError = error;
                this.updateSuccess = "";
              }
              if(Object.keys(data).length !== 0){
                this.sendUpdate(data);
              }
              if (image.length !== 0){
                this.uploadImage("users", this.getUserId()).then((success) => {
                  if(success === 0) {
                    if (this.updateSuccess === ""){
                      this.updateSuccess = "Profile Picture Successfully";
                    }
                    this.getProfilePicture();
                  } else {
                    this.updateError = "Error updating profile picture"
                  }
                  });
              }
            } else {
              this.updateError="No changes made";
            }
            },
          getUserPetitions: function (){
            this.$http.get(this.route_prefix + "petitions?authorId=" + this.getUserId())
              .then((response) => {
                this.userPetitions = response.data;
              }).catch((error) => {
                this.error_flag = true;
                this.error = "Unable to get petitions for this user."
            });
          },
          getPhotoUrl: function (petitionId){
            return this.route_prefix + "petitions/" + petitionId + "/photo"
          }
        }
    }
</script>
