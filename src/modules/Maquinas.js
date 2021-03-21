import Vue from 'vue'

export default{
	namespaced: true,
	state:{
		asignaciones:[],
		loading: true,
		maquina_Asignada:{},
		programaciones: [],
    filtros: { },
	},

	mutations:{
		LOADING(state, data){
			state.loading = data;
		},
		AGREGAR_ASIGNACION_MAQUINA(state, data){
			state.asignaciones.push(data)
		},
		ASIGNACION_MAQUINA(state, data){
			state.asignaciones = data;
		},
		MAQUINA_ASIGNADA(state, data){
			state.maquina_Asignada = data
		},
		PRORAMACIONES_MAQUINA(state, data){
			state.programaciones = data;
		},
		PARAMETROS(state, data){
			state.filtros = data
		}
	},

	actions:{
		loading({commit}, estatus){
			commit('LOADING', estatus);
		},
		obtener_Operador_Maquina({commit}, payload){
			commit('LOADING', true);
			commit('ASIGNACION_MAQUINA',[]);

        Vue.http.post('obtener.maquina.operador',payload).then(response=>{
					commit('ASIGNACION_MAQUINA',  response.body)
				}).catch((error)=>{
					console.log('error',error)
				}).finally(()=>{ 
					commit('LOADING', false)
				})
    },

    agregar_Operador_Maquina({commit}, payload){
			return new Promise((resolve, reject) => {
        Vue.http.post('agregar.maquina.operador',payload).then(response=>{
					resolve(true);
				}).catch((error)=>{
					console.log('error',error)
					reject(error.bodyText)
				})
      })
    },

		editar_Operador_Maquina({commit}, payload){
			return new Promise((resolve, reject) => {
        Vue.http.post('editar.maquina.operador',payload).then(response=>{
					resolve(response.bodyText);
				}).catch((error)=>{
					console.log('error',error)
					reject(error.bodyText)
				})
      })
		},

		obtener_maquina_asignada({dispatch,commit}, payload){
			return new Promise((resolve, reject) => {
        Vue.http.post('obtener.maquina.asignada',payload).then(response=>{
					commit('MAQUINA_ASIGNADA', response.body[0]);
					resolve(response.body);
				}).catch((error)=>{
					console.log('error',error)
					reject(error.bodyText)
				}).finally(()=>{ commit('LOADING', false)})
      })
		},

		obtener_programaciones_maquina({commit}, id_maquina){
			commit('PRORAMACIONES_MAQUINA',[])
			return new Promise((resolve, reject) => {
				Vue.http.get('obtener.programaciones.maquina/'+ id_maquina).then(response=>{
					commit('PRORAMACIONES_MAQUINA', response.body);
					resolve(response.body);
				}).catch((error)=>{
					console.log('error',error)
					reject(error.bodyText)
				}).finally(()=>{ commit('LOADING', false)})
			})
			
		},
		
	},

	getters:{
		Loading(state){
			return state.loading
		},
		asignaciones_Maquinas(state){
			return state.asignaciones
		},
		maquina_Asignada(state){
			return state.maquina_Asignada;
		},
		programaciones_Maquina(state){
			return state.programaciones;
		},
		Parametros(state){
			return state.filtros
		},

	}
}