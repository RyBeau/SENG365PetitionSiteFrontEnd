import Vue from 'vue'
import App from './App.vue'
import Home from './Home.vue'
import Petitions from "./Petitions";
import VueRouter from 'vue-router'
Vue.use(VueRouter);

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
