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
  { path:'/flexografia'          , name:'flexografia'         , component:catProgramacion , meta: { libre:true }},
  { path:'/maquinas-por-operador', name:'maquinas-por-operador', component:()=> import('@/views/Maquinas/maquinaxOp.vue')   , meta: { ADMIN:true,SUPER:true, OP: false, PROGRA: false }},
  { path:'/operaciones'          , name:'operaciones'          , component:()=> import('@/views/Operacion/operacion.vue')   , meta: { ADMIN:true,SUPER:true, OP: true , PROGRA: false }},
  { path:'/form/flexografia'     , name:'form/flexografia'     , component:()=> import('@/views/Operacion/form_flexo.vue')  , meta: { ADMIN:true,SUPER:true, OP: true , PROGRA: false }},
  { path:'/registro-de-tintas'   , name:'registro-de-tintas'   , component:()=> import('@/views/Tintas/registro_tintas.vue'), meta: { ADMIN:true,SUPER:true, OP: true , PROGRA: false }},
  { path:'/monitor-master'       , name:'monitor-master'	     , component:()=> import('@/views/Monitor/Monitor.vue')       , meta: { ADMIN:true,SUPER:false,OP: false, PROGRA: true }},
 

  { path:'/programacion-bordados'    , name:'programacion-bordados'	  , component:()=> import('@/views/Programaciones/bordados.vue')   , meta: { ADMIN:true,SUPER:true,OP: false, PROGRA: false }},
  { path:'/programacion-digital'     , name:'programacion-digital'	  , component:()=> import('@/views/Programaciones/digital.vue')    , meta: { ADMIN:true,SUPER:true,OP: false, PROGRA: false }},
  { path:'/programacion-offset'      , name:'programacion-offset'	    , component:()=> import('@/views/Programaciones/offset.vue')     , meta: { ADMIN:true,SUPER:true,OP: false, PROGRA: false }},
  { path:'/programacion-serigrafia'  , name:'programacion-serigrafia'	, component:()=> import('@/views/Programaciones/serigrafia.vue') , meta: { ADMIN:true,SUPER:true,OP: false, PROGRA: false }},
  { path:'/programacion-empaque'     , name:'programacion-empaque'	  , component:()=> import('@/views/Programaciones/empaque.vue')    , meta: { ADMIN:true,SUPER:true,OP: false, PROGRA: false }},
  { path:'/programacion-sublimación' , name:'programacion-sublimación', component:()=> import('@/views/Programaciones/sublimacion.vue'), meta: { ADMIN:true,SUPER:true,OP: false, PROGRA: false }},
  { path:'/programacion-tampografia' , name:'programacion-tampografia', component:()=> import('@/views/Programaciones/tampografia.vue'), meta: { ADMIN:true,SUPER:true,OP: false, PROGRA: false }},
  { path:'/programacion-uv'          , name:'programacion-uv'	        , component:()=> import('@/views/Programaciones/uv.vue')         , meta: { ADMIN:true,SUPER:true,OP: false, PROGRA: false }},
  
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
  }else if(store.state.Login.datosUsuario.nivel === 5){
    if(to.matched.some(record => record.meta.PROGRA)){
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
