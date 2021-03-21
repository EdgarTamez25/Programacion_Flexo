import Vue from 'vue'
import Vuex from 'vuex'
import router  from '@/router'


import Login   from '@/modules/AppController/Login'
import Maquinas   from '@/modules/Maquinas'
import Programacion   from '@/modules/Programacion'



Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
    salir({commit}){
      // commit("setUsuario", '')
      // commit("setToken", '')
      // localStorage.removeItem("tlaKey")
      // router.push({name: 'Login'})
      setTimeout(()=>{ window.location.href = "http://producciongama.com:8080/"; }, 2000)
    }
  },
  modules: {
    Login,
    Maquinas,
    Programacion
  }
})
