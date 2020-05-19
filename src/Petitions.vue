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
    <form class="form-inline" v-on:submit.prevent="applyFilter">
      <div class="form-row mx-auto">
        <label for="petitionFilterSort" class="mb-2 mr-sm-2">Sort By:</label>
        <select class="form-control mb-2 mr-sm-2" id="petitionFilterSort" :value="sort">
          <option v-for="sort in sort_types">{{sort.name}}</option>
        </select>
        <label for="petitionFilterCategory" class="mb-2 mr-sm-2">Category:</label>
        <select class="form-control mb-2 mr-sm-2" id="petitionFilterCategory" :value="category">
          <option></option>
          <option v-for="category in this.categories">{{category.name}}</option>
        </select>
        <label for="petitionFilterSearch" class="mb-2 mr-sm-2">Search:</label>
        <input class="form-control mb-2 mr-sm-2" type="text" id="petitionFilterSearch" :value="search">
        <input type="submit" class="btn btn-dark mb-2 mr-sm-2" value="Apply" :onclick="createURL(1)">
      </div>
    </form>
    <div v-for="(petition, index) in petitions" v-if="index >= start && index <= stop" class="card mb-3 mx-auto text-left" style="max-width: 540px;">
      <div class="row no-gutters">
        <div class="col-md-4 text-center">
          <img :src="getPetitionPhotoUrl(petition.petitionId)" class="card-img" alt="No Image Available">
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
    <nav aria-label="Page Navigation">
      <ul class="pagination justify-content-center">
        <li v-if="current_page !== 1" class="page-item"><a class="page-link" :href="goToFirst()">First</a></li>
        <li v-else class="page-item disabled"><a class="page-link" href="#">First</a></li>
        <li v-if="current_page !== 1"  class="page-item"><a class="page-link" :href="previous()">&laquo;</a></li>
        <li v-else class="page-item disabled"><a class="page-link" href="#">&laquo;</a></li>
        <li class="page-item active"><a class="page-link" v-on:click.prevent>{{current_page}}</a></li>
        <li v-if="current_page !== num_pages" class="page-item"><a class="page-link" :href="next()">&raquo;</a></li>
        <li  v-else class="page-item disabled"><a class="page-link">&raquo;</a></li>
        <li v-if="current_page !== num_pages" class="page-item" ><a class="page-link" :href="goToLast()">Last</a></li>
        <li v-else class="page-item disabled"><a class="page-link">Last</a></li>
      </ul>
    </nav>
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
              categories: [],
              start: 0,
              stop: 9,
              number_petitions: 0,
              num_pages: 0,
              current_page: 1,
              search: this.$route.query.search,
              category: this.$route.query.category,
              sort: this.$route.query.sort,
              sort_types: [{name:"Most to Least", query:"SIGNATURES_DESC"},
                {name:"Least to Most", query: "SIGNATURES_ASC"},
                {name:"A-Z", query: "ALPHABETICAL_ASC"},
                {name:"Z-A", query: "ALPHABETICAL_DESC"}],
            }
          },
      mounted() {
        this.checkParameters();
        this.getCategories();
      },
      methods: {
          checkParameters: function (){
            if(this.search === undefined){this.search = ""}
            if(this.category === undefined){this.category = ""}
            if(this.sort === undefined){this.sort = this.sort_types[0].name}
          },
          getCategories: function(){
            this.$http.get(this.route_prefix + "petitions/categories")
            .then((response) => {
              this.categories = response.data;
              this.getPetitions();
            }).catch((error) => {
              this.error = "Unable to retrieve petition categories";
              this.error_flag = true;
            });
          },
          getPetitionPhotoUrl: function (id){
            return this.route_prefix + "petitions/" + id + "/photo";
          },
        getCategoryId : function (name){
          for (let i = 0; i < this.categories.length; i++){
            if(this.categories[i].name === name){
              console.log(this.categories[i]);
              return this.categories[i].categoryId;
            }
          }
        },
        getSortType: function(sort){
          for (let i = 0; i < this.sort_types.length; i++) {
            if (sort === this.sort_types[i].name) {
              return this.sort_types[i].query;
            }
          }
        },
        getPetitionParameters: function(){
          if (this.search || this.category || this.sort){
            let params = "?";
            this.search === undefined || this.search === ""? params += "" : params += "q=" + this.search;
            if(this.category !== undefined){
              const categoryId = this.getCategoryId(this.category);
              if(categoryId !== undefined){
                params === "?" ? params += "categoryId=" + categoryId : params += "&categoryId=" + categoryId;
              }
            }
            if(this.sort !== undefined){
              const sortType = this.getSortType(this.sort);
              if(sortType !== undefined){
                params === "?" ? params += "sortBy=" + sortType: params += "&sortBy=" + sortType;
              }
            }
            return params;
          }
          return "";
        },
          getPetitions: function(){
            const query_params = this.getPetitionParameters();
            this.$http.get(this.route_prefix + "petitions" + query_params)
            .then((response) => {
              this.petitions = response.data;
              this.number_petitions = this.petitions.length;
              this.paginationConfig();
            }).catch((error) => {
              this.error = error.response.statusText;
              this.error_flag = true;
            });
          },
          paginationConfig: function () {
            this.num_pages = Math.ceil(this.number_petitions / 10);
            if(this.num_pages === 0){this.num_pages = 1};
            this.current_page = Number(this.$route.query.current_page);
            if (!Number.isInteger(this.current_page) || this.current_page < 1){
              this.current_page = 1;
            } else if (this.current_page > this.num_pages){
              this.current_page = this.num_pages;
            }
            this.setStartStop();
          },
        setStartStop: function (){
          this.start = 10 * (this.current_page - 1);
          this.stop = 10 * (this.current_page - 1) + 9;
          this.$forceUpdate();
        },
        createURL : function (page) {
          let url = "petitions?current_page=" + page;
          this.search !== undefined && this.search !== "" ? url += "&search=" + this.search: url += "";
          this.category !== undefined && this.category !== "" ? url +="&category=" + this.category : url += "";
          this.sort !== undefined && this.sort !== "" ? url +="&sort=" + this.sort : url += "";
          return url;
        },
        applyFilter: function () {
          this.sort = document.getElementById("petitionFilterSort").value;
          this.search = document.getElementById("petitionFilterSearch").value;
          this.category = document.getElementById("petitionFilterCategory").value;
          window.location.href = this.createURL(1);
        },
        next: function(){
          let page = this.current_page + 1;
          return this.createURL(page);
        },
        previous: function(){
          let page = this.current_page - 1;
          return this.createURL(page);
        },
        goToFirst: function (){
          return this.createURL(1);
        },
        goToLast: function (){
            return this.createURL(this.num_pages);
        }
      }
    }
</script>
