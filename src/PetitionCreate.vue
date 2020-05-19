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
  <div class="jumbotron text-center" style="height:90vh;">
    <div v-show="error_flag" class="alert alert-danger alert-dismissible fade show" role="alert">
      {{error}}
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
      <div class="container">
        <h1 class="display-4">Create a Petition</h1>
        <div class="card">
          <div class="card-body">
            <form v-on:submit.prevent="">
                <label for="editTitle">Title:</label>
                <input id="editTitle" class="form-control" type="text" required>
                <label for="editCategory">Category:</label>
                <select id="editCategory" class="form-control" required>
                  <option v-for="category in categories">{{category.name}}</option>
                </select>
                <label for="editDescription">Description:</label>
                <textarea id="editDescription" class="form-control scroll" rows="10" required></textarea>
                <label for="editClosingDate">Closing Date:</label>
                <input class="form-control" type="date" id="editClosingDate" :min="this.$moment().add(1,'days').format('YYYY-MM-DD')"
                       :value="this.$moment().add(1,'days').format('YYYY-MM-DD')" required>
                <label for="updateImage">Picture:</label>
                <input @change="handleImage" class="form-control mb-2" type = "file" id="updateImage" accept="image/jpeg,image/gif,image/png">
                <div class="modal-footer">
                  <button type="submit" class="btn btn-dark">Create Petition</button>
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
          this.getCategories();
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
      }
      }
    }
</script>
