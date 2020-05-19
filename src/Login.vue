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
            <router-link v-else class="nav-link" :to="{name:'Profile'}">Profile</router-link>
          </li>
        </ul>
    <router-link tag="button" class="btn btn-outline-light ml-md-auto" :to="{name: 'Login'}"> Log In</router-link>
  </nav>

  <div class="jumbotron text-center" style="height:90vh;">
      <div class="card border-secondary mx-auto" style="width: 30rem;">
        <div class="card-header display-4">Log In</div>
        <div class="card-body">
          <div v-show="invalidInfo" class="alert alert-danger fade-in" role="alert" :key="invalidInfo + 'info'">Invalid Email Address or Password</div>
          <div v-show="error_flag" class="alert alert-warning fade-in" role="alert" :key="error_flag + 'error'">{{error}}</div>
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
            <label>Don't have an account? <a href="#registerModal" data-toggle="modal" data-target="#registerModal">Register Here</a></label>
          </div>
          <button class="btn btn-dark" type="submit">Log In</button>
        </form>
        </div>
      </div>
  </div>
  <div class="modal fade" id="registerModal" tabindex="-1" role="dialog" aria-labelledby="registerModal" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Register</h5>
          <button type="button" id="registerModalClose" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body" >
          <div v-show="registerError!==''" class="alert alert-danger fade-in" role="alert" :key="registerError">{{this.registerError}}</div>
          <form v-on:submit.prevent="register()">
            <div class="form-group row">
              <label for="registerName" class="col-sm-2 col-form-label">Name:</label>
              <input class="form-control col-sm-9" type = "text" id="registerName" required>
            </div>
            <div class="form-group row">
              <label for="registerEmail" class="col-sm-2 col-form-label">Email:</label>
              <input class="form-control col-sm-9" type = "email" id="registerEmail" placeholder="example@example.com" required>
            </div>
            <div class="form-group row">
              <label for="registerPassword" class="col-sm-2 col-form-label">Password:</label>
              <input class="form-control col-sm-9" type = "password" id="registerPassword" required>
            </div>
            <div class="form-group row">
              <label for="registerCity" class="col-sm-2 col-form-label">City:</label>
              <input class="form-control col-sm-9" type = "text" id="registerCity">
            </div>
            <div class="form-group row">
              <label for="registerCountry" class="col-sm-2 col-form-label">Country:</label>
              <input class="form-control col-sm-9" type = "text" id="registerCountry">
            </div>
            <div class="form-group row">
              <label for="registerImage" class="col-sm-2 col-form-label">Profile Picture:</label>
              <input @change="handleImage" class="form-control col-sm-9" type = "file" id="registerImage" accept="image/jpeg,image/gif,image/png">
            </div>
              <div class="modal-footer">
                <button class="btn btn-dark" type="submit">Register</button>
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
      data () {
        return{
          error: "",
          error_flag: false,
          invalidInfo: false,
          registerError: "",
          image: "",
          image_type: ""
        }
      },
        name: "Login",
      methods:{
          logOn: function () {
            const email = document.getElementById("loginEmail").value;
            const password = document.getElementById("loginPassword").value;
            this.logOnSend(email, password);
          },
        logOnSend : function (email, password) {
          this.$http.post(this.route_prefix + "users/login", {"email": email, "password": password})
            .then((response) => {
              if (response.status === 200) {
                this.logUserIn(response.data.token, response.data.userId);
                if (this.image !== ""){
                  this.uploadImage("users/", this.getUserId());
                }
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
        },
        checkRegister : function(city, country, image, data){
          if (/^[a-zA-Z\s]+$/.test(city)){
            data.city = city;
          } else if (city !=="") {
            this.registerError = "Invalid City Name";
            data = -1;
          }
          if(/^[a-zA-Z\s]+$/.test(country)){
            data.country = country
          } else if (country !== "") {
            this.registerError = "Invalid Country Name";
            data = -1;
          }
          if (image.length !== 0 && !(['image/png','image/jpeg','image/gif'].includes(image[0]['type']))){
            this.registerError = "Invalid Image Format";
            data = -1;
          }
          return data
        },
        register: function () {
          const name = document.getElementById("registerName").value;
          const email = document.getElementById("registerEmail").value;
          const password = document.getElementById("registerPassword").value;
          const city = document.getElementById("registerCity").value.trim();
          const country = document.getElementById("registerCountry").value.trim();
          const image = document.getElementById("registerImage").files;

          let data = {
            "name": name,
            "email": email,
            "password": password
          };
          data = this.checkRegister(city, country, image, data);
          if (data !== -1){
            this.$http.post(this.route_prefix + "users/register", data)
              .then((response) => {
                $('.modal-backdrop').remove();
                if(response.status===201){
                  this.logOnSend(email, password);
                } else {
                  throw("Unexpected response code");
                }
              }).catch((error) => {
              if(error.response.statusText === "Bad Request: email already in use"){
                this.registerError = "Email is already associated with an account"
              } else {
                this.registerError = error.response.statusText;
              }
            });
          }

        }
      }
    }
</script>
