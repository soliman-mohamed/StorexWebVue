import { createStore } from 'vuex'
import axios from 'axios'

export default createStore({
  state: {
    user: null
  },
  getters: {
    isLogged: state => !!state.user,
    user(state) {
      return state.user;
    }
  },
  mutations: {
    setUserData (state, userData) {
      state.user = userData;
      localStorage.setItem('user', JSON.stringify(userData));
      axios.defaults.headers.common.Authorization = `Bearer ${userData.token}`
    },
    clearUserData () {
      localStorage.removeItem('user');
      axios.defaults.headers.common.Authorization = '';
    }
  },
  actions: {
    login({ commit }, data) {
      commit('setUserData', data)
    },
    logout ({ commit }) {
      commit('clearUserData')
    }
  },
  modules: {
  }
})
