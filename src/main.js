import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/base.css'
import '@/assets/css/element_base.css'
Vue.use(ElementUI)

import axios from 'axios'
Vue.prototype.axios = axios
axios.defaults.withCredentials = true
// axios.defaults.baseURL = 'http://127.0.0.1:8080'
// axios.defaults.baseURL = 'http://tucodec1111.natapp1.cc'
axios.defaults.baseURL = '/api'
// axios.defaults.baseURL = 'http://192.168.1.161:8080'


Vue.config.productionTip = false

// router.beforeEach((to, from, next) => {
//   next(vm => {
//     vm.$store.dispatch('setUser',null)
//   })
// })

// 获取当前时间
Vue.prototype.$getTime = () => {
  var date = new Date(),
      year = date.getFullYear(),
      month = date.getMonth() + 1 < 10 ? "0"+(date.getMonth()+1) : date.getMonth() + 1,
      day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate(),
      hours = date.getHours()<10 ? "0" + date.getHours() : date.getHours(),
      minutes = date.getMinutes()<10 ? "0" + date.getMinutes() : date.getMinutes(),
      seconds = date.getSeconds()<10 ? "0" + date.getSeconds() : date.getSeconds()
  return  year + "-" + month + "-" + day + " " + hours+":" + minutes + ":" + seconds
}

router.beforeEach((to, from, next) => {
  if(sessionStorage.getItem('userName')){
    // store.state.isLogin = true
    next()
    //如果已登录，还想想进入登录注册界面，则定向回首页
    if (!to.meta.isLogin) {
      next({
        path: '/Home'
      })
    }
  }else{
    //用户想进入需要登录的页面，则定向回登录界面
    if(to.meta.isLogin){
      next({
        path: '/',
      })
    //用户进入无需登录的界面，则跳转继续
    }else{
      next()
    }
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
