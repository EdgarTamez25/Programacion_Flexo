import Vue from 'vue'
import VueRouter from 'vue-router'
import store          from '@/store'

import Home from '../views/Home.vue'
// import Login from '@/views/AppController/Login.vue'
import catProgramacion from '@/views/Catalogos/catProgramacion.vue'


Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'Home', component: Home , meta: { libre:true }},
  // { path:'/', name: 'Login'        , component: Login            , meta: { libre:true }},
  { path:'/programacion'  , name:'programacion', component:catProgramacion , meta: { libre:true }},
  { path:'/maquinas-por-operador'  , name:'maquinas-por-operador', component:()=> import('@/views/Maquinas/maquinaxOp.vue')       , meta: { ADMIN:true,SUPER:true, OP: false }},
  { path:'/operaciones'            , name:'operaciones'          , component:()=> import('@/views/Operacion/operacion.vue')       , meta: { ADMIN:true,SUPER:true, OP: true }},
  { path:'/form/flexografia'       , name:'form/flexografia'     , component:()=> import('@/views/Operacion/form_flexo.vue')      , meta: { ADMIN:true,SUPER:true, OP: true }},
  
]

const router = new VueRouter({
  mode:'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach( (to, from, next) => {
  if(to.matched.some(record => record.meta.libre)){
    next()
  }else if(store.state.Login.datosUsuario.nivel === 1){
    if(to.matched.some(record => record.meta.ADMIN)){
      next()
    }
  }else if(store.state.Login.datosUsuario.nivel === 2){
    if(to.matched.some(record => record.meta.SUPER)){
      next()
    }
  }else if(store.state.Login.datosUsuario.nivel === 9 ){
    if(to.matched.some(record => record.meta.OP)){
      next()
    }
  }else{
    // store.state.Login.datosUsuario.auth = true;
    next({
      name: 'Home'
    })
  }
})

export default router
