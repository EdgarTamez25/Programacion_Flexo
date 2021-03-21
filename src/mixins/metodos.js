import Vue from 'vue'

export default {

	methods: {
		traerFechaActual(){
			var f = new Date(); 
			return f.getFullYear() +'-'+ (f.getMonth() + 1 < 10? '0' + (f.getMonth() + 1): f.getMonth() + 1 ) +'-'+ (f.getDate()<10?'0'+f.getDate():f.getDate());
		},
		traerHoraActual(){
			var f = new Date(); 
			return (f.getHours()<10? '0'+f.getHours(): f.getHours()) + ':' + (f.getMinutes()<10? '0'+ f.getMinutes(): f.getMinutes())
		},
		
		consultar_Clientes(){  // AUTOCOMPLETE -> CLIENTES
			return new Promise( resolve => {
				this.$http.get('clientes').then((response)=>{
					// console.log('clientes', response.body)
					this.clientes = response.body //LLENNO ARRAY
					resolve(true);
				}).catch(error =>{
					console.log('error', error)
				})
			})	
		},

		consultar_Operadores(){  // AUTOCOMPLETE -> CLIENTES
			return new Promise( resolve => {
				this.$http.get('obtener.operadores').then((response)=>{
					// console.log('Maquinas', response.body)
					this.operadores = response.body //LLENNO ARRAY
					resolve(this.operadores);
				}).catch(error =>{
					console.log('errorOp', error)
				})
			})	
		},

		consutlar_ProdxCli(id_cliente){  // AUTOCOMPLETE -> CLIENTES
			return new Promise( resolve => {
				this.productos = [] //VACIO ARRAY
				this.$http.get('productos.cliente/'+ id_cliente).then((response)=>{
					// console.log('prod', response.body)
					this.productos = response.body //LLENNO ARRAY
					resolve(this.productos);
				}).catch(error =>{
					console.log('errorProd', error)
				})
			})	
		},

		consultar_Maqinas(){  // AUTOCOMPLETE -> CLIENTES
			return new Promise( resolve => {
				this.$http.get('obtener.maquinas').then((response)=>{
					// console.log('Maquinas', response.body)
					this.maquinas = response.body //LLENNO ARRAY
					resolve(this.maquinas);
				}).catch(error =>{
					console.log('errorMaquina', error)
				})
			})	
		},

		consulta_Materiales(depto_id){
			return new Promise( resolve => {
				this.$http.get('materiales/'+ depto_id).then((response)=>{
					for(let i=0; i< response.body.length; i++){
						if(response.body[i].tipo != 2){
							this.materiales.push(response.body[i])
						}else{
							this.materiales2.push(response.body[i])
						}
					}
					resolve(true)
				}).catch(error =>{
					console.log('error materiales', error)
				})
			})
		},

		consultar_Plecas(){  // AUTOCOMPLETE -> CLIENTES
			return new Promise( resolve => {
				this.$http.get('obtener.plecas').then((response)=>{
					// console.log('plecas', response.body)
					this.plecas = response.body//LLENNO ARRAY
					resolve(this.plecas);
				}).catch(error =>{
					console.log('errorMaquina', error)
				})
			})	
		},

		consultar_Suajes(){  // AUTOCOMPLETE -> CLIENTES
			return new Promise( resolve => {
				this.$http.get('obtener.suajes').then((response)=>{
					// console.log('suajes', response.body)
					this.suajes = response.body //LLENNO ARRAY
					resolve(this.suajes);
				}).catch(error =>{
					console.log('errorMaquina', error)
				})
			})	
		},
	
		consultaMateriales(depto_id){
			return new Promise( resolve => {
				this.$http.get('materiales/'+ depto_id).then((response)=>{
					for(let i=0; i< response.body.length; i++){
						if(response.body[i].tipo != 2){
							this.materiales.push(response.body[i])
						}else{
							this.materiales2.push(response.body[i])
						}
					}
					resolve(true)
					// this.materiales = response.body  // LLENO ARREGLO CON RESPUESTA COMPLETA
				}).catch(error =>{
					console.log('error materiales', error)
				})
			})
		},
		
  }
}