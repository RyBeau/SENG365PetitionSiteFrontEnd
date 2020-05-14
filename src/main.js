import Vue from 'vue'
import App from './App.vue'
import Home from './Home.vue'
import Login from './Login.vue'
import Petitions from "./Petitions"
import VueRouter from 'vue-router'
import Vuex from "vuex";
Vue.use(VueRouter, Vuex);

import axios from 'axios';
import VueAxios from 'vue-axios';
Vue.use(VueAxios, axios);



const routes = [
  {
    path: "/",
    name: 'Home',
    component: Home
  },
  {
    path: "/petitions",
    name: "Petitions",
    component: Petitions
  },
  {
    path:"/login",
    name:"Login",
    component: Login
  }
];

let store = {
  state:{
    auth_token: "",
    userId: null
  },
  loggedUserIn: function (token, id) {
    this.state.auth_token = token;
    this.state.userId = id;

  },
  loggedOut: function () {
    this.state.auth_token = "";
    this.state.userId = null;
  }
};

const router = new VueRouter({
  routes: routes,
  mode: 'history'
});

Vue.mixin({
  data() {
    return {
      route_prefix: "http://localhost:4941/api/v1/"
    }
  },
  methods:
    {
      logOut: function(){
        store.loggedOut();
        this.$forceUpdate();
        localStorage.removeItem('auth_token');
        localStorage.removeItem('userId');
      },
      logUserIn: function (token, id) {
        store.loggedUserIn(token, id);
        localStorage.auth_token = token;
        localStorage.userId = id;
      },
      getAuth: function () {
        return store.state.auth_token;
      },
      getUserId: function () {
        return store.state.userId;
      },
      handleImage: function (event){
        const uploadedImage = event.target.files[0];
        this.image_type = uploadedImage['type'];
        this.createRawImage(uploadedImage);
      },
      createRawImage: function (uploadedImage){
        const reader = new FileReader();
        reader.onload = (event) => {
          this.image = event.target.result;
          console.log("loaded")
        };
        reader.readAsArrayBuffer(uploadedImage);
      },
      uploadImage : function(){
        this.$http.put(this.route_prefix + "users/" + this.getUserId() + "/photo", this.image, {
          headers: {
            "Content-Type": this.image_type,
            "X-Authorization": this.getAuth()
          }
        })
          .then((response) => {
            this.image = "";
            this.image_type = "";
          }).catch((error) => {
            this.error_flag = true;
            this.error = error.statusText;
          }
        );
      },
    }
});

new Vue({
  el: '#app',
  created () {
    if (localStorage.auth_token){
      store.state.auth_token = localStorage.auth_token;
    }
    if (localStorage.userId){
      store.state.userId = localStorage.userId;
    }
  },
  router: router,
  render: h => h(App)
});
