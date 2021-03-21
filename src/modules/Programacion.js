import Vue from 'vue'

export default{
	namespaced: true,
	state:{
		loading: true,
		programacion:[],
    filtros: { },
	},

	mutations:{
		LOADING(state, data){
			state.loading = data
		},
		AGREGAR_PROGRAMACION(state, data){
			state.programacion.push(data)
		},
		
		PROGRAMACIONES(state, data){
			state.programacion = data;
		},
		PARAMETROS(state, data){
			state.filtros = data
		}


	},

	actions:{
    agregar_Programacion({commit}, payload){
			return new Promise((resolve, reject) => {
        Vue.http.post('agregar.programacion',payload).then(response=>{
          commit('AGREGAR_PROGRAMACION',  response.bodyText)
					resolve(true);
				}).catch((error)=>{
					console.log('error',error)
					reject(error.bodyText)
				})
      })
    },

		obtener_Programaciones({commit}, payload){
			commit('PARAMETROS', payload); commit('LOADING', true); 
			commit('PROGRAMACIONES', []); 
			Vue.http.post('obtener.programaciones',payload).then(response=>{
				commit('PROGRAMACIONES',  response.body)
			}).catch((error)=>{
				console.log('error',error)
			}).finally(()=>{ commit('LOADING', false)})
    },
	
	},

	getters:{
		Loading(state){
			return state.loading
		},
		Programaciones(state){
			return state.programacion
		},

		Parametros(state){
			return state.filtros
		},

	}
}