<template>
  <v-main class="pa-0 ma-3">
  	<v-row class="justify-center">
  		<v-col cols="12">
				<v-card class="mt-3" outlined>
					
					<v-row class="ma-2 py-0">

						<v-col cols="12"  >
							<v-card-actions class="font-weight-black subtitle-1 text-sm-h6   py-0 mt-1 " > INVENTARIO DE TINTAS </v-card-actions>
						</v-col>

							<!-- <v-col cols="12" sm="4" >
							<v-select
                  v-model="estatus" :items="Estatus" item-text="nombre" item-value="id"  dense
                   hide-details  placeholder="Estatus " return-object outlined append-icon="mdi-circle-slice-5"
                ></v-select> 
						</v-col> -->
					
					</v-row>
					

					<v-card-actions>
			      <v-text-field
			        v-model="search"
			        append-icon="search"
			        label="Buscar programación"
			        single-line
			        hide-details
			      ></v-text-field>
			      <v-spacer></v-spacer>
			      <v-btn small class="celeste" @click="abrirModal(1)" dark>Agregar  </v-btn>
			      <v-btn small class="gris" icon dark @click="init()" ><v-icon>refresh</v-icon> </v-btn>
			    </v-card-actions>
					
			    <v-data-table
			      :headers="headers"
			      :items="registros_tinta"
			      :search="search"
			      fixed-header
				    :height="tamanioPantalla"
				    hide-default-footer
						:loading ="Loading"
						loading-text="Cargando... Por favor espere."
						:page.sync="page"
      			:items-per-page="itemsPerPage"
						@page-count="pageCount = $event"
						dense
			    >
						<template v-slot:item.fecha_entrega="{ item }">
							{{  moment(item.fecha_entrega).format('LL') }} 
						</template>
						<template v-slot:item.action="{ item }" > 
			    		<v-btn  class=" ma-1 celeste" icon dark @click="abrirModal(2, item)"><v-icon> create </v-icon></v-btn> <!-- Editar -->
			    		<v-btn  class=" ma-1 orange"  icon dark @click="salidaAlmacen(item)"><v-icon> exit_to_app </v-icon></v-btn> <!-- Editar -->
				    </template>

			    </v-data-table>
			  </v-card>
				
				<!-- PAGINACION -->
				<div class="text-center pt-2">
					<v-pagination v-model="page" :length="pageCount"></v-pagination>
				</div>

				<v-dialog persistent v-model="dialog" width="700px" >	
					<v-card class="pa-0">
		    		<controlTintas :modoVista="modoVista" :parametros="parametros" @modal="dialog = $event" />
		    	</v-card>
		    </v-dialog>

				 <v-dialog persistent v-model="formSalidaAlm" width="700px" >	
					<v-card class="pa-4">
		    		<controlSalidasAlm :parametros="parametros" @modal="formSalidaAlm = $event" />
		    	</v-card>
		    </v-dialog>


  		</v-col>
  	</v-row>
  </v-main >
</template>

<script>
	var moment = require('moment'); moment.locale('es') /// inciar Moment 
	import controlTintas  from '@/views/Tintas/controlTintas.vue';
	import controlSalidasAlm  from '@/views/Tintas/controlSalidasAlm.vue';
	import {mapGetters, mapActions} from 'vuex';

	export default {
		components: {
			controlTintas,
			controlSalidasAlm
		},
		data () {
			return {
				page: 1,
				pageCount: 0,
				itemsPerPage: 20,
				search: '',
				dialog: false,
				formSalidaAlm: true,

				modoVista: 0,
				parametros:'',
			
				headers:[
					{ text: 'Pantone'          , align: 'left'  , value: 'nompantone'	          },
					{ text: 'Material'         , align: 'left'  , value: 'nommaterial'          },
					{ text: 'Existencia'       , align: 'left'  , value: 'existencia' 	        },
					{ text: 'Presentación'	   , align: 'left'  , value: 'cant'									},
					{ text: 'Fecha de entrega' , align: 'left'  , value: 'fecha_entrega'        },
					{ text: ' '                , align: 'right' , value: 'action', sortable: false },

				],

				// estatus: {  id: 1, nombre:'Activo'},
				// Estatus:[ { id: 1, nombre:'Activo'},
				// 					{ id: 3, nombre:'Terminado'},
				// 					{ id: 2, nombre:'Cancelado'},
				// 					// { id: 4, nombre:'Cancelado'}
				// 				],
				// fecha1: moment().subtract(1, 'months').startOf('month').format("YYYY-MM-DD"),
				// fechamodal1:false,
				// fecha2: moment().subtract('months').endOf('months').format("YYYY-MM-DD"),
				// fechamodal2:false,
				
			}
		},

		created(){
			// if(this.Parametros.estatus != undefined){
			// 	this.estatus = { id: this.Parametros.estatus};
			// 	this.fecha1  = this.Parametros.fecha1
			// 	this.fecha2  = this.Parametros.fecha2
			// }
			// this.consultaUsuarios()// CONSULTAR CLIENTES A VUEX
			this.init();
		},

		watch:{
			// estatus: function(){
			// 	this.init()
			// },

			// fecha1: function(){
			// 	this.init();
			// },
			// fecha2: function(){
			// 	this.init();
			// }
		},

		computed:{
			...mapGetters('Tintas' ,['Loading','registros_tinta']), // IMPORTANDO USO DE VUEX  (GETTERS)
			
			tamanioPantalla () {
				switch (this.$vuetify.breakpoint.name) {
					case 'xs':
						return this.$vuetify.breakpoint.height -300
					break;
					case 'sm': 
						return this.$vuetify.breakpoint.height -300
					break;
					case 'md':
						return this.$vuetify.breakpoint.height -300
					break;
					case 'lg':
						return this.$vuetify.breakpoint.height -300
					break;
					case 'xl':
						return this.$vuetify.breakpoint.height -300
					break;
				}
			},
		},

		methods:{
			...mapActions('Tintas'  ,['obtener_registros_tinta']), 

			
			init(){
				// const payload = new Object();
				// 			payload.fecha1  = this.fecha1;
				// 			payload.fecha2  = this.fecha2;
				// 			payload.estatus = this.estatus.id;
				this.obtener_registros_tinta();
			},

			abrirModal(action, items){
				this.modoVista = action;
				this.parametros = items;
				this.dialog = true;
			},

			salidaAlmacen(items){
				this.parametros    = items;
				this.formSalidaAlm = true;
			},

			cambiaEstatus(data){
				const payload = { id: data.id, estatus: !data.estatus };
				this.$http.post('estatus.user',payload).then((res)=>{
					// console.log('cambio estatus', res.body)
					this.consultaUsuarios();
				}).catch((err)=>{
					console.log('err', err)
				})
			}

			
			
		}
	}
</script>
