import Vue from 'vue';
import Vuex from 'vuex';


Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        token: localStorage.getItem('token') ? localStorage.getItem('token') : '',
        pt_id: ""
    },
    mutations: {
        setToken(state, token) {
            state.token = token;
            localStorage.setItem("token", token.token);
        },
        setpt_id(state, pt_id) {
            state.pt_id = pt_id
        }
    }
})

export default store;