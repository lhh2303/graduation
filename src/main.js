import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
Vue.config.productionTip = false

import VueRouter from 'vue-router'
Vue.use(VueRouter);

// import axios from './api/axios.js'
// import VueAxios from 'vue-axios'

import axios from "axios";
import VueAxios from "vue-axios";

axios.interceptors.request.use((config) => {
 
  config.headers.Authorization = localStorage.getItem("token");
  return config;
});


Vue.use(VueAxios, axios);
axios.defaults.baseURL = "http://127.0.0.1:8888/";
// axios.defaults.withCredentials = true

Vue.use(VueAxios, axios)
Vue.prototype.$axios = axios

import moment from 'moment'
Vue.prototype.moment = moment;
import router from "./router/router.js";
import store from "./store/main.js";
import 'default-passive-events'
import './assets/icon/iconfont.css'

import echarts from 'echarts'
import vueEcharts from 'vue-echarts'
Vue.component('v-chart', vueEcharts)
Vue.prototype.$echarts = echarts

new Vue({
    render: h => h(App),
    store,
    router,
}).$mount('#app')