import Vue from 'vue'

export default{
	namespaced: true,
	state:{
		loading: true,
		registros:[],
    filtros: { },
	},

	mutations:{
		LOADING(state, data){
			state.loading = data
		},
		REGISTROS_TINTA(state, data){
			state.registros = data;
		},
    // AGREGAR_REGISTRO_TINTAS(state, data){
		// 	state.programacion.push(data)
		// }
		// PARAMETROS(state, data){
		// 	state.filtros = data
		// }


	},

	actions:{
    agregar_registro_tinta({commit}, payload){
			return new Promise((resolve, reject) => {
        Vue.http.post('agregar.registro.tinta',payload).then(response=>{
					resolve(response.bodyText);
				}).catch((error)=>{
					console.log('error',error)
					reject(error.bodyText)
				})
      })
    },

    actualizar_registro_tinta({commit}, id, payload){
			return new Promise((resolve, reject) => {
        Vue.http.put('agregar.registro.tinta/'+ id ,payload).then(response=>{
					resolve(response.bodyText);
				}).catch((error)=>{
					console.log('error',error)
					reject(error.bodyText)
				})
      })
    },

		obtener_registros_tinta({commit}, payload){
			// commit('PARAMETROS', payload); commit('LOADING', true); 
			commit('REGISTROS_TINTA', []); 
			Vue.http.post('obtener.registros.tinta',payload).then(response=>{
				commit('REGISTROS_TINTA',response.body)
			}).catch((error)=>{
				console.log('error',error)
			}).finally(()=>{ commit('LOADING', false)})
    },
	
	},

	getters:{
		Loading(state){
			return state.loading
		},
		registros_tinta(state){
			return state.registros
		},

		// Parametros(state){
		// 	return state.filtros
		// },

	}
}