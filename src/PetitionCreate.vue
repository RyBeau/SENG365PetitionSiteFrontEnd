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
            <router-link v-if="this.getAuth()===''" class="nav-link disabled" :to="{name:'Profile'}">Profile</router-link>
            <router-link v-else class="nav-link" :to="{name:'Profile'}">Profile</router-link>
          </li>
        </ul>
    <router-link v-if='this.getAuth()===""' tag="button" class="btn btn-outline-light ml-md-auto" :to="{name: 'Login'}"> Log In</router-link>
    <button v-else class="btn btn-outline-light ml-md-auto" v-on:click="this.logOut">Log Out</button>
  </nav>
  <div class="jumbotron text-center" style="height:90vh;" v-if="this.getAuth() !== ''">
    <div v-show="error_flag" class="alert alert-danger alert-dismissible fade show" role="alert">
      {{error}}
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
      <div class="container">
        <h1 class="display-4">Create a Petition</h1>
        <div class="card mx-auto w-50">
          <div class="card-body">
            <form v-on:submit.prevent="createPetition">
                <label for="createTitle">Title:</label>
                <input id="createTitle" class="form-control" type="text" required>
                <label for="createCategory">Category:</label>
                <select id="createCategory" class="form-control" required>
                  <option v-for="category in categories">{{category.name}}</option>
                </select>
                <label for="createDescription">Description:</label>
                <textarea id="createDescription" class="form-control scroll" rows="10" required></textarea>
                <label for="createClosingDate">Closing Date:</label>
                <input class="form-control" type="date" id="createClosingDate" :min="this.$moment().add(2,'days').format('YYYY-MM-DD')"
                       :value="this.$moment().add(2,'days').format('YYYY-MM-DD')" required>
                <label for="addImage">Picture:</label>
                <input @change="handleImage" class="form-control mb-2" type = "file" id="addImage" accept="image/jpeg,image/gif,image/png">
                <div class="modal-footer d-block">
                  <button type="submit" class="btn btn-dark">Create</button>
                  <button type="button" class="btn btn-dark" v-on:click="$router.back()">Cancel</button>
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
        name: "PetitionCreate",
      data(){
          return {
            error: "",
            error_flag: false,
            categories: []

          }
      },
      mounted() {
        if(this.getAuth() === ""){
          this.$router.push("/");
        }else{
          this.getCategories();
        }
      },
      methods: {
      getCategories: function () {
        this.$http.get(this.route_prefix + "petitions/categories")
          .then((response) => {
            this.categories = response.data;
          }).catch((error) => {
          this.error = "Unable to retrieve petition categories";
          this.error_flag = true;
        });
      },
        getCategoryId : function (name) {
          for (let i = 0; i < this.categories.length; i++) {
            if (this.categories[i].name === name) {
              return this.categories[i].categoryId;
            }
          }
        },
        checkData: function(data, image){
          if(image.length === 0){
            this.error_flag=true;
            this.error = "Petitions required images";
            return false
          }
          if (!(['image/png','image/jpeg','image/gif'].includes(image[0]['type']))){
            this.error_flag=true;
            this.error = "Invalid Image Format";
            return false;
          }
          if(data.title === ""){
            this.error_flag=true;
            this.error = "Title cannot be empty";
            return false;
          }
          if(data.description === ""){
            this.error_flag=true;
            this.error = "Description cannot be empty";
            return false;
          }
          if(this.$moment().utc().format("YYYY-MM-DD") > data.closingDate){
            this.error_flag=true;
            this.error = "Date cannot be in the past";
            return false;
          }
          return true;
        },
        createPetition: function () {
          let data = {};
          data.title = document.getElementById('createTitle').value.trim();
          data.description = document.getElementById('createDescription').value.trim();
          data.categoryId = this.getCategoryId(document.getElementById('createCategory').value);
          data.closingDate = this.$moment(document.getElementById('createClosingDate').value).utc().format("YYYY-MM-DD");
          const image = document.getElementById('addImage').files;

          if(this.checkData(data, image)){
            this.$http.post(this.route_prefix + "petitions", data, {headers: {
                "X-Authorization": this.getAuth()
              }})
              .then((response) => {
                this.uploadImage("petitions", response.data.petitionId);
                this.authorSignPetition(response.data.petitionId);
              }).catch((error) => {
              this.error_flag = true;
              this.error = "Unable to create petition"
            });
          }
        },
        authorSignPetition: function (petitionId) {
            this.$http.post(this.route_prefix + "petitions/" + petitionId + "/signatures", {},{headers: {
                "X-Authorization": this.getAuth()
              }})
              .then((response) => {
                this.$router.push("/petitions/" + petitionId)
              }).catch((error) => {
              this.error_flag = true;
              this.error = "Unable to sign petition";
            });
        }
      }
    }
</script>
