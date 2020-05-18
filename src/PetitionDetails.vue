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
  <div class="jumbotron text-center" style="height:90vh;">
    <div v-show="error_flag" class="alert alert-danger alert-dismissible fade show" role="alert">
      {{error}}
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="container">
      <h1 class="display-4">{{petition.title}}</h1>
      <p class="lead">{{petition.signatureCount + " Signatures"}}</p>
      <div class="card">
        <img :src="getPhotoUrl(petition.authorId)" class="card-img-top" alt="No Petition Image">
        <div class="card-body text-left">
          <p class="card-text">
            Category: {{petition.category}}<br><br>
            {{petition.description}}<br><br>
            Created: {{getLocalDate(petition.createdDate)}}<br>
            Closing Date: {{getLocalDate(petition.closingDate)}}
          </p>
            <button  v-if="canBeEdited()" class="btn btn-dark">Edit Petition</button>
            <button  v-if="String(petition.authorId) === this.getUserId()" class="btn btn-danger" v-on:click="deletePetition">Delete Petition</button>
        </div>
        <div class="card-footer text-left">
          <div class="row no-gutters">
            <div class="col-md-2">
            <img :src="petition.photo" class="card-img" alt="Profile Picture">
            </div>
          <div class="col-md-8">
            <div class="card-body">
              <p class="card-text">
              {{petition.authorName}}<br>
              {{petition.authorCity}}
              {{petition.authorCountry}}
              </p>
            </div>
          </div>
        </div>
        </div>
      </div>
      <div class="accordion" id="signatures">
        <div class="card">
          <div class="card-header" id="headingOne">
            <h2 class="mb-0">
              <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#signatureCollapse">
                View Signatures
              </button>
            </h2>
          </div>

          <div id="signatureCollapse" class="collapse" data-parent="#signatures">
            <div class="card-body">
              <div v-for="signature in signatures" class="card text-left mb-2">
                <div class="row no-gutters">
                  <div class="col-md-2">
                    <img :src="signature.photo" class="card-img" alt="Profile Picture">
                  </div>
                  <div class="col-md-8">
                    <div class="card-body">
                      <p class="card-text">
                        {{signature.name}}<br>
                        {{signature.city}}
                        {{signature.country}}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
    export default {
        name: "Home",
      data(){
          return {
            error: "",
            error_flag: false,
            petition: {},
            signatures: {}
          }
      },
      mounted(){
        this.getPetition();
        this.getSignatures();
      },
      methods:{
        getPetition: function () {
          const petitionId = this.$route.params.id;
          this.$http.get(this.route_prefix + "petitions/" + petitionId)
          .then((response) => {
            this.petition = response.data;
            this.$nextTick();
            this.authorProfilePic();
          }).catch((error) => {
            this.error = "Unable to get Petition with ID " + petitionId;
            this.error_flag = true;
          });
        },
        getLocalDate: function (utcDate) {
          if(utcDate){
            return this.$moment.utc(utcDate).local().format("dddd, MMMM Do YYYY");
          } else {
            return "No Closing Date"
          }
        },
        getPhotoUrl: function () {
          return this.route_prefix + "petitions/" + this.petition.petitionId + "/photo";
        },
        authorProfilePic: function (){
          this.getProfilePicture(this.petition.authorId)
          .then((result) => {
            this.petition.photo = result;
            this.$forceUpdate();
          })
        },
        getProfilePicture: function (id){
          return this.$http.get(this.route_prefix + "users/" + id + "/photo")
            .then((response) => {
              return this.route_prefix + "users/" + id + "/photo"
            }).catch((error) => {
            if(error.response) {
              if (error.response.status !== 404) {
                this.error_flag = true;
                this.error = "Unable to get User Profile Photos";
              }
            }
            return "https://i.imgur.com/XdhaLFP.png";
          });
        },
        getSignatures: function (){
          const petitionId = this.$route.params.id;
          this.$http.get(this.route_prefix + "petitions/" + petitionId + "/signatures")
          .then((response) => {
            this.signatures = response.data;
            this.getSignatureProfilePics();
          }).catch( (error) => {
            this.error = "Unable to get petition signatures";
            this.error_flag = true;
          });
        },
        getSignatureProfilePics: function () {
          for (let i = 0; i < this.signatures.length; i++){
            this.getProfilePicture(this.signatures[i].signatoryId)
            .then((result) => {
              this.signatures[i].photo = result;
              this.$forceUpdate();
            });
          }
        },
        canBeEdited: function (){
          return (String(this.petition.authorId) === this.getUserId() && new Date(this.petition.closingDate) > new Date());
        },
        deletePetition: function(){
          this.$http.delete(this.route_prefix + "petitions/" + this.petition.petitionId, {headers: {
            "X-Authorization": this.getAuth()
            }})
          .then((response) => {
            this.$router.back();
          })
        }
      }
    }
</script>
