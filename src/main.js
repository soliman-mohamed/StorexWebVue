import { createApp, h } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from "axios";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";

axios.defaults.baseURL = "https://test-api.storexweb.com/api";
const domain = "https://test-api.storexweb.com/";

const app = createApp({
    created() {
        const userInfo = localStorage.getItem('user') ?? false;
        if (userInfo) {
            const userData = JSON.parse(userInfo);
            this.$store.commit('setUserData', userData)
        }
        axios.interceptors.response.use(
            response => response,
            error => {
                if (error.response.status === 401) {
                    this.$store.dispatch('logout');
                    this.$router.push({ name: 'Login' });
                }
                return Promise.reject(error)
            });
    },
    render: () => h(App)
})
.use(store).use(router);
app.config.globalProperties.$myGlobalVariable = domain;
app.mount('#app');