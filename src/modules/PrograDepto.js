import Vue from 'vue'

export default{
	namespaced: true,
	state:{
		loading: true,
		bordados:[],
		digital:[],
		offset:[],
		serigrafia:[],
		empaque:[],
		sublimacion:[],
		tampografia:[],
		uv:[],

    filtros_bordados: { },
    filtros_digital: { },
    filtros_offset: { },
    filtros_serigrafia: { },
    filtros_empaque: { },
    filtros_sublimacion: { },
    filtros_tampografia: { },
    filtros_uv: { },
	},

	mutations:{
		LOADING(state, data){
			state.loading = data
		},
		
		BORDADOS(state, data){ state.bordados = data; },
		PARAMETROS_BORDADOS(state, data){ state.filtros_bordados = data },

    DIGITAL(state, data){ state.digital = data; },
		PARAMETROS_DIGITAL(state, data){ state.filtros_digital = data },

    OFFSET(state, data){ state.offset = data; },
		PARAMETROS_OFSSET(state, data){ state.filtros_offset = data },

    SERIGRAFIA(state, data){ state.serigrafia = data; },
		PARAMETROS_SERIGRAFIA(state, data){ state.filtros_serigrafia = data },

    EMPAQUE(state, data){ state.empaque = data; },
		PARAMETROS_EMPAQUE(state, data){ state.filtros_empaque = data },

    SUBLIMACION(state, data){ state.sublimacion = data; },
		PARAMETROS_SUBLIMACION(state, data){ state.filtros_sublimacion = data },

    TAMPOGRAFIA(state, data){ state.tampografia = data; },
		PARAMETROS_TAMPOGRAFIA(state, data){ state.filtros_tampografia = data },

    UV(state, data){ state.uv = data; },
		PARAMETROS_UV(state, data){ state.filtros_uv = data },
	},

	actions:{
    //! === CONSULTAS PARA TODOS LOS DEPARTAMENTOS === 
    finalizar_Producto_Bordados({commit}, payload){
			return new Promise((resolve, reject) => {
        Vue.http.post('finalizar.producto.bordados',payload).then(response=>{
					resolve(response);
				}).catch((error)=>{
					console.log('error',error)
					reject(error)
				})
      })
    },
    finalizar_Producto_Digital({commit}, payload){
			return new Promise((resolve, reject) => {
        Vue.http.post('finalizar.producto.digital',payload).then(response=>{
					resolve(response);
				}).catch((error)=>{
					console.log('error',error)
					reject(error)
				})
      })
    },
    finalizar_Producto_Offset({commit}, payload){
			return new Promise((resolve, reject) => {
        Vue.http.post('finalizar.producto.offset',payload).then(response=>{
					resolve(response);
				}).catch((error)=>{
					console.log('error',error)
					reject(error)
				})
      })
    },
    finalizar_Producto_Serigrafia({commit}, payload){
			return new Promise((resolve, reject) => {
        Vue.http.post('finalizar.producto.serigrafia',payload).then(response=>{
					resolve(response);
				}).catch((error)=>{
					console.log('error',error)
					reject(error)
				})
      })
    },
    finalizar_Producto_Empaque({commit}, payload){
			return new Promise((resolve, reject) => {
        Vue.http.post('finalizar.producto.empaque',payload).then(response=>{
					resolve(response);
				}).catch((error)=>{
					console.log('error',error)
					reject(error)
				})
      })
    },
    finalizar_Producto_Sublimacion({commit}, payload){
			return new Promise((resolve, reject) => {
        Vue.http.post('finalizar.producto.sublimacion',payload).then(response=>{
					resolve(response);
				}).catch((error)=>{
					console.log('error',error)
					reject(error)
				})
      })
    },
    finalizar_Producto_Tampografia({commit}, payload){
			return new Promise((resolve, reject) => {
        Vue.http.post('finalizar.producto.tampografia',payload).then(response=>{
					resolve(response);
				}).catch((error)=>{
					console.log('error',error)
					reject(error)
				})
      })
    },
    finalizar_Producto_Uv({commit}, payload){
			return new Promise((resolve, reject) => {
        Vue.http.post('finalizar.producto.uv',payload).then(response=>{
					resolve(response);
				}).catch((error)=>{
					console.log('error',error)
					reject(error)
				})
      })
    },
    
    //! === CONSULTAS PARA TODOS LOS DEPARTAMENTOS === 
		obtener_Programaciones_Bordados({commit}, payload){
			commit('PARAMETROS_BORDADOS', payload); commit('LOADING', true); 
			commit('BORDADOS', []); 
			Vue.http.post('obtener.programaciones.bordados',payload).then(response=>{
				commit('BORDADOS',  response.body)
			}).catch((error)=>{
				console.log('error',error)
			}).finally(()=>{ commit('LOADING', false)})
    },
    obtener_Programaciones_Digital({commit}, payload){
			commit('PARAMETROS_DIGITAL', payload); commit('LOADING', true); 
			commit('DIGITAL', []); 
			Vue.http.post('obtener.programaciones.digital',payload).then(response=>{
				commit('DIGITAL',  response.body)
			}).catch((error)=>{
				console.log('error',error)
			}).finally(()=>{ commit('LOADING', false)})
    },
    obtener_Programaciones_Offset({commit}, payload){
			commit('PARAMETROS_OFSSET', payload); commit('LOADING', true); 
			commit('OFFSET', []); 
			Vue.http.post('obtener.programaciones.offset',payload).then(response=>{
				commit('OFFSET',  response.body)
			}).catch((error)=>{
				console.log('error',error)
			}).finally(()=>{ commit('LOADING', false)})
    },
    obtener_Programaciones_Serigrafia({commit}, payload){
			commit('PARAMETROS_SERIGRAFIA', payload); commit('LOADING', true); 
			commit('SERIGRAFIA', []); 
			Vue.http.post('obtener.programaciones.serigrafia',payload).then(response=>{
				commit('SERIGRAFIA',  response.body)
			}).catch((error)=>{
				console.log('error',error)
			}).finally(()=>{ commit('LOADING', false)})
    },
    obtener_Programaciones_Empaque({commit}, payload){
			commit('PARAMETROS_EMPAQUE', payload); commit('LOADING', true); 
			commit('EMPAQUE', []); 
			Vue.http.post('obtener.programaciones.empaque',payload).then(response=>{
				commit('EMPAQUE',  response.body)
			}).catch((error)=>{
				console.log('error',error)
			}).finally(()=>{ commit('LOADING', false)})
    },
    obtener_Programaciones_Sublimacion({commit}, payload){
			commit('PARAMETROS_SUBLIMACION', payload); commit('LOADING', true); 
			commit('SUBLIMACION', []); 
			Vue.http.post('obtener.programaciones.sublimacion',payload).then(response=>{
				commit('SUBLIMACION',  response.body)
			}).catch((error)=>{
				console.log('error',error)
			}).finally(()=>{ commit('LOADING', false)})
    },
    obtener_Programaciones_Tampografia({commit}, payload){
			commit('PARAMETROS_TAMPOGRAFIA', payload); commit('LOADING', true); 
			commit('TAMPOGRAFIA', []); 
			Vue.http.post('obtener.programaciones.tampografia',payload).then(response=>{
				commit('TAMPOGRAFIA',  response.body)
			}).catch((error)=>{
				console.log('error',error)
			}).finally(()=>{ commit('LOADING', false)})
    },
    obtener_Programaciones_Uv({commit}, payload){
			commit('PARAMETROS_UV', payload); commit('LOADING', true); 
			commit('UV', []); 
			Vue.http.post('obtener.programaciones.uv',payload).then(response=>{
				commit('UV',  response.body)
			}).catch((error)=>{
				console.log('error',error)
			}).finally(()=>{ commit('LOADING', false)})
    }
	
	},

	getters:{
		Loading(state){
			return state.loading
		},
		Bordados(state){ return state.bordados },
		Parametros_Bordados(state){ return state.filtros_bordados },

    Digital(state){ return state.digital },
		Parametros_Digital(state){ return state.filtros_digital },

    Offset(state){ return state.offset },
		Parametros_Offset(state){ return state.filtros_offset },

    Serigrafia(state){ return state.serigrafia },
		Parametros_Serigrafia(state){ return state.filtros_serigrafia },

    Empaque(state){ return state.empaque },
		Parametros_Empaque(state){ return state.filtros_empaque },

    Sublimacion(state){ return state.sublimacion },
		Parametros_Sublimacion(state){ return state.filtros_sublimacion },

    Tampografia(state){ return state.tampografia },
		Parametros_Tampografia(state){ return state.filtros_tampografia },

    UV(state){ return state.uv },
		Parametros_UV(state){ return state.filtros_uv },

	}
}