import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentUser: null,
    isLogin: false,
    // token: ''
  },
  mutations: {
    userStatus(state, user) {
      if (user) {
        state.currentUser = user
        state.isLogin = true
      } else if (user == null) {
        sessionStorage.setItem('userName', null)
        sessionStorage.setItem('userToken', '')
        state.currentUser = null
        state.isLogin = false
        // state.token = ''
      }
    }
  },
  actions: {
    setUser({commit}, user) {
      commit('userStatus', user)
    }
  },
  modules: {
    currentUser: state => state.currentUser,
    isLogin: state => state.isLogin
  }
})
