<template>
  <v-main class="pa-0 ma-3">
  	<v-row class="justify-center">
  		<v-col cols="12">

				<v-snackbar v-model="alerta.activo" multi-line vertical top right :color="alerta.color" > 
          <strong> {{alerta.text}} </strong>
          <template v-slot:action="{ attrs }">
            <v-btn color="white" text @click="alerta.activo = false" v-bind="attrs"> Cerrar </v-btn>
          </template>
        </v-snackbar>

				<v-card class="mt-3" outlined>
					
					<v-row class="ma-2 py-0">

						<v-col cols="12" sm="8" md="6">
							<v-card-actions class="font-weight-black subtitle-1 text-sm-h6   py-0 mt-1 " > PROGRAMACIÓN FLEXOGRAFÍA </v-card-actions>
						</v-col>

						<v-col cols="12" sm="4" md="2">
							<v-select
                v-model="estatus" :items="Estatus" item-text="nombre" item-value="id"  dense
                 hide-details  placeholder="Estatus " return-object outlined append-icon="mdi-circle-slice-5"
              ></v-select> 
						</v-col>

						<v-col cols="6" md="2" > <!-- FECHA DE COMPROMISO -->
							<v-dialog ref="fecha1" v-model="fechamodal1" :return-value.sync="fecha1" persistent width="290px">
								<template v-slot:activator="{ on }">
									<v-text-field
										v-model="fecha1" label="Fecha Inicio" append-icon="event" readonly v-on="on"
										 dense hide-details color="celeste" outlined
									></v-text-field>
								</template>
								<v-date-picker v-model="fecha1" locale="es-es" color="rosa"  scrollable>
									<v-spacer></v-spacer>
									<v-btn text small color="gris" @click="fechamodal1 = false">Cancelar</v-btn>
									<v-btn dark small color="rosa" @click="$refs.fecha1.save(fecha1)">OK</v-btn>
								</v-date-picker>
							</v-dialog>
						</v-col>

						<v-col cols="6" md="2"  > <!-- FECHA DE COMPROMISO -->
							<v-dialog ref="fecha2" v-model="fechamodal2" :return-value.sync="fecha2" persistent width="290px">
								<template v-slot:activator="{ on }">
									<v-text-field
										v-model="fecha2" label="Fecha fin" append-icon="event" readonly v-on="on"
									  dense hide-details color="celeste" outlined
									></v-text-field>
								</template>
								<v-date-picker v-model="fecha2" locale="es-es" color="rosa"  scrollable>
									<v-spacer></v-spacer>
									<v-btn text small color="gris" @click="fechamodal2 = false">Cancelar</v-btn>
									<v-btn dark small color="rosa" @click="$refs.fecha2.save(fecha2)">OK</v-btn>
								</v-date-picker>
							</v-dialog>
						</v-col>
					
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
			      <!-- <v-btn small class="celeste" @click="abrirModal(1)" dark>Agregar  </v-btn> -->
			      <v-btn  class="gris" icon dark @click="init()" ><v-icon>refresh</v-icon> </v-btn>
			    </v-card-actions>
					
			    <v-data-table
			      :headers="headers"
			      :items="Programaciones"
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
						<template v-slot:item.id_det_ot="{ item }" >
							<div v-if="item.urgencia === 1" class="black--text font-weight-black"> {{  item.id_det_ot }}</div>
							<div v-if="item.urgencia === 2" class="orange--text font-weight-black">{{  item.id_det_ot }}</div>
							<div v-if="item.urgencia === 3" class="error--text font-weight-black"> {{  item.id_det_ot }}</div>
						</template>
						<template v-slot:item.maquina="{ item }" >
							<div v-if="item.urgencia === 1" class="black--text font-weight-black"> {{  item.maquina }}</div>
							<div v-if="item.urgencia === 2" class="orange--text font-weight-black">{{  item.maquina }}</div>
							<div v-if="item.urgencia === 3" class="error--text font-weight-black"> {{  item.maquina }}</div>
						</template>
						<template v-slot:item.codigo="{ item }" >
							<div v-if="item.urgencia === 1" class="black--text font-weight-black"> {{  item.codigo }}</div>
							<div v-if="item.urgencia === 2" class="orange--text font-weight-black">{{  item.codigo }}</div>
							<div v-if="item.urgencia === 3" class="error--text font-weight-black"> {{  item.codigo }}</div>
						</template>
						<template v-slot:item.cantidad="{ item }" >
							<div v-if="item.urgencia === 1" class="black--text font-weight-black"> {{  item.cantidad }}</div>
							<div v-if="item.urgencia === 2" class="orange--text font-weight-black">{{  item.cantidad }}</div>
							<div v-if="item.urgencia === 3" class="error--text font-weight-black"> {{  item.cantidad }}</div>
						</template>
						<template v-slot:item.nomcli="{ item }" >
							<div v-if="item.urgencia === 1" class="black--text font-weight-black"> {{  item.nomcli }}</div>
							<div v-if="item.urgencia === 2" class="orange--text font-weight-black">{{  item.nomcli }}</div>
							<div v-if="item.urgencia === 3" class="error--text font-weight-black"> {{  item.nomcli }}</div>
						</template>
						<template v-slot:item.id_ot="{ item }" >
							<div v-if="item.urgencia === 1" class="black--text font-weight-black"> {{  item.id_ot }}</div>
							<div v-if="item.urgencia === 2" class="orange--text font-weight-black">{{  item.id_ot }}</div>
							<div v-if="item.urgencia === 3" class="error--text font-weight-black"> {{  item.id_ot }}</div>
						</template>
						<template v-slot:item.fecha_prog="{ item }">
							<div v-if="item.urgencia === 1" class="black--text font-weight-black"> {{  moment(item.fecha_prog).format('LL') }}</div>
							<div v-if="item.urgencia === 2" class="orange--text font-weight-black">{{  moment(item.fecha_prog).format('LL') }}</div>
							<div v-if="item.urgencia === 3" class="error--text font-weight-black"> {{  moment(item.fecha_prog).format('LL') }}</div>
						</template>
						<template v-slot:item.action="{ item }" > 
			    		<v-btn  class=" ma-1 celeste" icon dark @click="abrirModal(2, item)"><v-icon> create </v-icon></v-btn> <!-- Editar -->
			    		<v-btn  class=" ma-1 green" icon dark  @click="abrir_Resultados(item)" v-if="item.estatus===2"><v-icon> check </v-icon></v-btn> 
				    </template>
						<template v-slot:item.finalizacion="{ item }" v-if="estatus.id === 3 || estatus.id === 4">
              <v-btn color="rosa" dark small @click="alertaFinalizacion =true; productoAFinalizar = item" v-if="!item.finalizacion"> FINALIZAR </v-btn>
							<div class="black--text font-weight-black" v-else> {{  moment(item.finalizacion).format('LL') }}</div>

            </template>
			

			    </v-data-table>
			  </v-card>
				
				<!-- PAGINACION -->
				<div class="text-center pt-2">
					<v-pagination v-model="page" :length="pageCount"></v-pagination>
				</div>

				 <v-dialog persistent v-model="dialog" width="700px" >	
					<v-card class="pa-0">
		    		<controlProgramacion :modoVista="modoVista" :parametros="parametros" @modal="dialog = $event" />
		    	</v-card>
		    </v-dialog>

				 <v-dialog persistent v-model="formFlexo" width="700px" >	
					<v-card class="pa-4">
		    		<resultados :parametros="parametros" @modal="formFlexo = $event" />
		    	</v-card>
		    </v-dialog>

				<v-dialog v-model="alertaFinalizacion" persistent max-width="500">
					<v-card >
						<v-card-title class="subtitle-1 font-weight-black" style="word-break:normal;" > 
							LA PARTIDA NÚMERO  <span class="blue--text mx-2">{{productoAFinalizar.id_det_ot}}</span>  PASARA A FINALIZARCE  
						</v-card-title>
						<v-card-subtitle class=" mt-1 subtitle-2 font-weight-black">¿ ESTA SEGURO DE QUERER CONTINUAR ?</v-card-subtitle>
						<v-divider class="my-0 py-3" ></v-divider>
						<v-card-subtitle align="center" class="red--text font-weight-bold "> NO SE PODRAN EFECTUAR CAMBIOS POSTERIORES </v-card-subtitle>
						<v-divider class="my-0 py-2 " ></v-divider>
						<v-card-actions>
							<v-spacer/>
							<v-btn dark outlined color="gris" @click="alertaFinalizacion = false">Regresar</v-btn>
							<v-btn dark color="error" @click="finalizarOT()"  >Continuar</v-btn>
						</v-card-actions>
					</v-card>
				</v-dialog>

      	<overlay v-if="overlay"/>

  		</v-col>
  	</v-row>
  </v-main >
</template>

<script>
	var moment = require('moment'); moment.locale('es') /// inciar Moment 
	import controlProgramacion  from '@/views/Catalogos/controlProgramacion.vue';
	import resultados     from '@/views/Catalogos/resultados.vue';
	import {mapGetters, mapActions} from 'vuex';
  import overlay     from '@/components/overlay.vue';
	import  metodos from '@/mixins/metodos.js';

	export default {
		mixins:[metodos],
		components: {
			controlProgramacion,
			resultados,
			overlay
		},
		data () {
			return {
				page: 1,
				pageCount: 0,
				itemsPerPage: 20,
				search: '',
				dialog: false,
				formFlexo: false,

				modoVista: 0,
				parametros:'',
			
				headers:[
					{ text: 'Partida'       , align: 'left'  , value: 'id_det_ot'	},
					{ text: 'Maquina'       , align: 'left'  , value: 'maquina'	  },
					{ text: 'Producto'      , align: 'left'  , value: 'codigo'    },
					{ text: 'Cantidad'      , align: 'left'  , value: 'cantidad' 	},
					{ text: 'Cliente'	      , align: 'left'  , value: 'nomcli' 		},
					{ text: 'O.T.'					, align: 'left'  , value: 'id_ot' 		},
					{ text: 'Programación'  , align: 'left'  , value: 'fecha_prog'},
					{ text: 'Finalización'  , align: 'center' , value: 'finalizacion', sortable: false },
					{ text: ' '             , align: 'right' , value: 'action', sortable: false },


				],
				overlay: false,
				alertaFinalizacion: false,
				productoAFinalizar: {},
      	sucursal:{ id:null, nombre:''},
				estatus: {  id: 1, nombre:'Pendiente'},
				Estatus:[ { id: 1, nombre:'Pendiente'},
									{ id: 2, nombre:'Programado'},
									{ id: 3, nombre:'Terminado'},
									{ id: 4, nombre:'Cancelado'},
									// { id: 4, nombre:'Cancelado'}
								],
				fecha1: moment().subtract(1, 'months').startOf('month').format("YYYY-MM-DD"),
				fechamodal1:false,
				fecha2: moment().subtract('months').endOf('months').format("YYYY-MM-DD"),
				fechamodal2:false,

				alerta: { 
					activo: false,
					text: '',
					color: 'error',
				},
				
			}
		},

		created(){
			
      this.sucursal = { id: this.getdatosUsuario.id_sucursal }

			if(this.Parametros.estatus != undefined){
				this.estatus = { id: this.Parametros.estatus};
				this.fecha1  = this.Parametros.fecha1
				this.fecha2  = this.Parametros.fecha2
			}
			// this.consultaUsuarios()// CONSULTAR CLIENTES A VUEX
			this.init();
		},

		watch:{
			estatus: function(){
				this.init()
			},

			fecha1: function(){
				this.init();
			},
			fecha2: function(){
				this.init();
			}
		},

		computed:{
			...mapGetters('Programacion' ,['Loading','Programaciones','Parametros']), // IMPORTANDO USO DE VUEX  (GETTERS)
      ...mapGetters('Login' ,['getdatosUsuario']), 
			
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
			...mapActions('Programacion'  ,['obtener_Programaciones','finalizar_Producto_flexo']), // IMPORTANDO USO DE VUEX - CLIENTES(ACCIONES)
			
			init(){
				const payload = new Object();
							payload.estatus     = this.estatus.id;
							payload.id_sucursal = this.sucursal.id;
							payload.fecha1      = this.fecha1;
							payload.fecha2      = this.fecha2;

				this.obtener_Programaciones(payload);
			},

			abrirModal(action, items){
				this.modoVista = action;
				this.parametros = items;
				this.dialog = true;
			},

			abrir_Resultados(items){
				this.parametros = items;
				this.formFlexo = true;
			},

			cambiaEstatus(data){
				const payload = { id: data.id, estatus: !data.estatus };
				this.$http.post('estatus.user',payload).then((res)=>{
					// console.log('cambio estatus', res.body)
					this.consultaUsuarios();
				}).catch((err)=>{
					console.log('err', err)
				})
			},

			finalizarOT(){
        this.alertaFinalizacion = false; this.overlay = true

        const payload = new Object({
          finalizacion : this.traerFechaActual() + ' ' + this.traerHoraActual(),   
          id           : this.productoAFinalizar.id,
					id_ot        : this.productoAFinalizar.id_ot,
					id_det_ot		 : this.productoAFinalizar.id_det_ot
        })

        this.finalizar_Producto_flexo(payload).then(response =>{
          this.alerta = { activo: true, text:response.bodyText, color:'green'};
          this.init();
        }).catch(error =>{
          this.alerta = { activo: true, text:error.bodyText, color:'error'};
        }).finally(()=>{
          this.overlay = false
        })

      },


			
			
		}
	}
</script>
