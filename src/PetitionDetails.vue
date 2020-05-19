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
    <div v-show="signSuccess" class="alert alert-success alert-dismissible fade show" role="alert">
      {{signSuccess}}
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
          <button v-if="canBeSigned()" class="btn btn-dark" type="button" v-on:click="addSignature">Sign this Petition</button>
          <button v-if="canDeleteSignature()" class="btn btn-danger" type="button" v-on:click="deleteSignature">Remove Signature</button>
          <button v-if="canBeEdited()" class="btn btn-dark" type="button" data-toggle="modal" data-target="#editModal">Edit Petition</button>
          <button v-if="String(petition.authorId) === this.getUserId()" class="btn btn-danger"
                    type="button" data-toggle="modal" data-target="#deleteConfirm">Delete Petition</button>
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
  <div v-if="String(this.petition.authorId) === this.getUserId()" id="deleteConfirm" class="modal fade" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Are you sure you want to delete the petition?</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body mx-auto">
          <button type="button" class="btn btn-danger" data-dismiss="modal" v-on:click="deletePetition">Delete</button>
          <button type="button" class="btn btn-dark" data-dismiss="modal">Cancel</button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="canBeEdited()" class="modal fade" tabindex="-1" id="editModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Edit Petition</h5>
          <button type="button" class="close" data-dismiss="modal">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div v-show="updateSuccess!==''" class="alert alert-success alert-dismissible fade-in" role="alert" :key="updateSuccess + 'success'">{{updateSuccess}}
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div v-show="updateError!==''" class="alert alert-danger fade-in" role="alert" :key="updateError + 'error'">{{updateError}}</div>
          <form v-on:submit.prevent="updatePetition">
            <label for="editTitle">Title:</label>
            <input id="editTitle" class="form-control" type="text" :value="petition.title" required>
            <label for="editCategory">Category:</label>
            <select id="editCategory" class="form-control" :value="petition.category" required>
            <option v-for="category in categories">{{category.name}}</option>
            </select>
            <label for="editDescription">Description:</label>
            <textarea id="editDescription" class="form-control scroll" :value="petition.description" rows="10" required></textarea>
            <label for="editClosingDate">Closing Date:</label>
            <input class="form-control" type="date" id="editClosingDate" :min="this.$moment().add(1,'days').format('YYYY-MM-DD')"
                   :value="this.$moment.utc(this.petition.closingDate).local().format('YYYY-MM-DD')" required>
            <label for="updateImage">Picture:</label>
            <input @change="handleImage" class="form-control mb-2" type = "file" id="updateImage" accept="image/jpeg,image/gif,image/png">
            <div class="modal-footer">
              <button type="submit" class="btn btn-dark">Update Petition</button>
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
        name: "PetitionDetails",
      data(){
          return {
            error: "",
            error_flag: false,
            petition: {},
            signatures: {},
            categories: {},
            updateSuccess: "",
            updateError:"",
            signSuccess: ""
          }
      },
      mounted(){
        this.getPetition();
        this.getSignatures();
      },
      methods: {
        getPetition: function () {
          const petitionId = this.$route.params.id;
          if(!Number.isInteger(Number(petitionId))){this.$router.back()}
          this.$http.get(this.route_prefix + "petitions/" + petitionId)
            .then((response) => {
              this.petition = response.data;
              this.authorProfilePic();
              if (this.canBeEdited()) {
                this.getCategories()
              };
            }).catch((error) => {
            this.error = "Unable to get Petition with ID " + petitionId;
            this.error_flag = true;
          });
        },
        getLocalDate: function (utcDate) {
          if (utcDate) {
            return this.$moment.utc(utcDate).local().format("dddd, MMMM Do YYYY");
          } else {
            return "No Closing Date"
          }
        },
        getPhotoUrl: function () {
          return this.route_prefix + "petitions/" + this.petition.petitionId + "/photo?" + new Date();
        },
        authorProfilePic: function () {
          this.getProfilePicture(this.petition.authorId)
            .then((result) => {
              this.petition.photo = result;
              this.$forceUpdate();
            })
        },
        getProfilePicture: function (id) {
          return this.$http.get(this.route_prefix + "users/" + id + "/photo")
            .then((response) => {
              return this.route_prefix + "users/" + id + "/photo"
            }).catch((error) => {
              if (error.response) {
                if (error.response.status !== 404) {
                  this.error_flag = true;
                  this.error = "Unable to get User Profile Photos";
                }
              }
              return "https://i.imgur.com/XdhaLFP.png";
            });
        },
        getSignatures: function () {
          const petitionId = this.$route.params.id;
          if(Number.isInteger(Number(petitionId))) {
            this.$http.get(this.route_prefix + "petitions/" + petitionId + "/signatures")
              .then((response) => {
                this.signatures = response.data;
                this.getSignatureProfilePics();
              }).catch((error) => {
              this.error = "Unable to get petition signatures";
              this.error_flag = true;
            });
          }
        },
        getSignatureProfilePics: function () {
          for (let i = 0; i < this.signatures.length; i++) {
            this.getProfilePicture(this.signatures[i].signatoryId)
              .then((result) => {
                this.signatures[i].photo = result;
                this.$forceUpdate();
              });
          }
        },
        canBeEdited: function () {
          return (String(this.petition.authorId) === this.getUserId() && !this.hasClosed());
        },
        deletePetition: function () {
          this.$http.delete(this.route_prefix + "petitions/" + this.petition.petitionId, {
            headers: {
              "X-Authorization": this.getAuth()
            }
          })
            .then((response) => {
              this.$router.back();
            })
        },
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
              console.log(this.categories[i]);
              return this.categories[i].categoryId;
            }
          }
        },
        updatePetition: function () {
          const title = document.getElementById('editTitle').value;
          const description = document.getElementById('editDescription').value;
          const category = document.getElementById('editCategory').value;
          const closingDate = this.$moment(document.getElementById('editClosingDate').value).utc().format();
          const image = document.getElementById('updateImage').files;

          let data = {};
          if (title !== String(this.petition.title)){data.title = title}
          if (description !== this.petition.description){data.description = description}
          if (category !== String(this.petition.category)){data.categoryId = this.getCategoryId(category)}
          if (closingDate !== this.$moment(this.petition.closingDate).utc().format()){data.closingDate = closingDate}
          if(Object.keys(data).length === 0 && image.length === 0){
            this.updateError = "No changes were made"
          } else {
            if (Object.keys(data).length){
            this.$http.patch(this.route_prefix + "petitions/" + this.petition.petitionId, data, {headers: {
                "X-Authorization": this.getAuth()
              }})
              .then((response) => {
                this.updateSuccess = "Petition Updated";
                this.getPetition();
              }).catch((error) => {
                this.updateError = "Unable to update petition"
              });
            }
            if (image.length !== 0){
              if (image.length !== 0 && !(['image/png','image/jpeg','image/gif'].includes(image[0]['type']))){
                this.updateError = "Invalid Image Format";
              } else {
                this.uploadImage("petitions", this.petition.petitionId).then((response) => {
                  this.updateSuccess = "Petition Updated";
                }).catch((error) => {
                  this.updateError = "Error updating petition photo";
                })
              }
            }
          }
        },
        hasClosed : function () {
          return this.$moment(this.petition.closingDate) < this.$moment() && this.petition.closingDate !== null;
        },
        isSignedBy : function (userId){
          for(let i = 0; i < this.signatures.length; i++){
            if(this.signatures[i].signatoryId === userId){
              return true
            }
          }
          return false;
        },
        canBeSigned: function () {
          let userId = Number(this.getUserId());
          return userId !== null && this.petition.authorId !== userId &&
            !this.isSignedBy(userId) && !this.hasClosed();
        },
        canDeleteSignature: function (){
          let userId = Number(this.getUserId());
          return userId !== null && this.petition.authorId !== userId &&
            this.isSignedBy(userId) && !this.hasClosed();
        },
        addSignature: function (){
          this.$http.post(this.route_prefix + "petitions/" + this.petition.petitionId + "/signatures", {},{headers: {
            "X-Authorization": this.getAuth()
            }})
          .then((response) => {
            this.signSuccess = "Signature added to petition";
            this.getPetition();
            this.getSignatures();
          }).catch((error) => {
            this.error_flag = true;
            this.error = "Unable to sign petition";
            console.log(error);
          });
        },
        deleteSignature: function () {
          this.$http.delete(this.route_prefix + "petitions/" + this.petition.petitionId + "/signatures", {headers: {
              "X-Authorization": this.getAuth()
            }})
            .then((response) => {
              this.signSuccess = "Signature removed from petition";
              this.getPetition();
              this.getSignatures();
            }).catch((error) => {
            this.error_flag = true;
            this.error = "Unable to remove signature from petition";
            console.log(error);
          });
        }
      }
    }
</script>
