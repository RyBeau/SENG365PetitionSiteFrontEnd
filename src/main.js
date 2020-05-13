import Vue from 'vue'
import App from './App.vue'
import Home from './Home.vue'
import Login from './Login.vue'
import Petitions from "./Petitions"
import VueRouter from 'vue-router'
Vue.use(VueRouter);

import axios from 'axios';
import VueAxios from 'vue-axios';
Vue.use(VueAxios, axios);

Vue.mixin({
  data() {
    return{
      route_prefix: "http://localhost:4941/api/v1/",
      user_id: null,
      auth_token: null,
      error: null,
      error_flag: false
    }
  },
  methods:
    {

    }
});

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
]

const router = new VueRouter({
  routes: routes,
  mode: 'history'
})

new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
})
