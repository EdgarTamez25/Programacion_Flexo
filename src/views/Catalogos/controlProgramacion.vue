<template>
	<v-main class="pa-3">
		<v-row justify="center" class="ma-1">
			<v-col cols="12" >
        
        <!-- LOADING -->
				<v-snackbar v-model="snackbar" :timeout="1000" top :color="color"> {{text}}
					<v-btn color="white" text @click="snackbar = false" > Cerrar </v-btn>
				</v-snackbar>
				
				<v-card-actions class="pa-0 " >
					<h3> <strong class="subtitle-1 text-sm-h6"> {{ modoVista === 1? 'NUEVA PROGRAMACIÓN':'EDITAR PROGRAMACIÓN' }} </strong></h3> 
					<v-spacer></v-spacer>
					<v-btn color="error" small @click="$emit('modal',false)" ><v-icon>clear</v-icon></v-btn>
				</v-card-actions>

				<v-row class="mt-5">
          <v-col cols="12" sm="4" >
            <v-autocomplete
              :items="maquinas" v-model="maquina" item-text="nombre" item-value="id" label="Maquinas" 
              dense filled hide-details return-object color="celeste" 
            ></v-autocomplete>
          </v-col>
           <v-col cols="6" sm="4" >
						<v-autocomplete
							:items="suajes" v-model="suaje" item-text="suaje" item-value="id" label="Suajes" 
							dense filled hide-details return-object color="celeste" 
						></v-autocomplete>
					</v-col>

          <v-col cols="6" sm="4" >
						<v-autocomplete
							:items="plecas" v-model="pleca" item-text="pleca" item-value="id" label="Pleca" 
							dense filled hide-details return-object color="celeste" 
						></v-autocomplete>
					</v-col>

          <!-- <v-col cols="12" sm="6" lg="4">
						<v-text-field
							label="Orden de trabajo"
							placeholder="Orden de trabajo"
							hide-details
							dense
							clearable
							v-model ="orden_trabajo"
							filled
						></v-text-field>
					</v-col> -->

					<!-- <v-col cols="12" sm="6" lg="4">
						<v-text-field
							label="# Partida"
							placeholder="# Partida "
							hide-details
							dense
							clearable
							v-model ="num_partida"
							filled
						></v-text-field>
					</v-col> -->

          <!-- <v-col cols="12" sm="12" lg="6">
            <v-autocomplete
              :items="clientes" v-model="cliente" item-text="nombre" item-value="id" label="Clientes" 
              dense filled hide-details return-object color="celeste" 
            ></v-autocomplete>
          </v-col>

          <v-col cols="12" sm="6" lg="6">
						<v-autocomplete
							:items="productos" v-model="producto" item-text="codigo" item-value="id" label="Productos" 
							dense filled hide-details return-object color="celeste" 
						></v-autocomplete>
					</v-col> -->
<!--          
          <v-col cols="12" sm="6" lg="6">
						<v-text-field
							label="Cantidad"
							placeholder="Cantidad "
							hide-details
							dense
							clearable
							v-model ="cantidad"
							filled
						></v-text-field>
					</v-col> -->

          <v-col cols="12" sm="4" > <!-- FECHA DE COMPROMISO -->
            <v-dialog ref="fecha1" v-model="fechamodal1" :return-value.sync="fecha1" persistent width="290px">
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="fecha1" label="Programación" append-icon="event" readonly v-on="on"
                    dense hide-details color="celeste" filled
                ></v-text-field>
              </template>
              <v-date-picker v-model="fecha1" locale="es-es" color="rosa"  scrollable>
                <v-spacer></v-spacer>
                <v-btn text small color="gris" @click="fechamodal1 = false">Cancelar</v-btn>
                <v-btn dark small color="rosa" @click="$refs.fecha1.save(fecha1)">OK</v-btn>
              </v-date-picker>
            </v-dialog>
          </v-col>

          <v-col cols="6" sm="4" > <!-- HORA DEL INICIO -->
						<v-dialog ref="hora1" v-model="horamodal1" :return-value.sync="hora1" persistent width="290px" >
							<template v-slot:activator="{ on }">
								<v-text-field
									v-model="hora1" label="Hora inicio" append-icon="access_time" readonly v-on="on"
									filled dense hide-details color="celeste"
								></v-text-field>
							</template>

							<v-time-picker v-if="horamodal1" locale="es-es" color="rosa" v-model="hora1" full-width ampm-in-title	>
								<v-spacer></v-spacer>
								<v-btn small text color="gris" @click="horamodal1 = false">Cancel</v-btn>
								<v-btn small dark color="rosa" @click="$refs.hora1.save(hora1)">OK</v-btn>
							</v-time-picker>
						</v-dialog>
					</v-col>

          <v-col cols="6" sm="4"> <!-- HORA DEL INICIO -->
						<v-dialog ref="hora2" v-model="horamodal2" :return-value.sync="hora2" persistent width="290px" >
							<template v-slot:activator="{ on }">
								<v-text-field
									v-model="hora2" label="Hora fin" append-icon="access_time" readonly v-on="on"
									filled dense hide-details color="celeste" 
								></v-text-field>
							</template>

							<v-time-picker v-if="horamodal2" locale="es-es" color="rosa" v-model="hora2" full-width ampm-in-title	>
								<v-spacer></v-spacer>
								<v-btn small text color="gris" @click="horamodal2 = false">Cancel</v-btn>
								<v-btn small dark color="rosa" @click="$refs.hora2.save(hora2)">OK</v-btn>
							</v-time-picker>
						</v-dialog>
					</v-col>

					<!-- <v-col>
						<v-switch
							v-model="urgencia"
							label="ALTA PRIORIDAD"
							color="red"
							large
						></v-switch>
					</v-col> -->

				</v-row>
        
				<!-- //DIALOG PARA GUARDAR LA INFORMACION -->
				<v-card-actions class="mt-6">
          <v-btn persistent 
								 :loading="overlay" 
								 outlined 
								 color="red darken-4" 
								 dark 
								 @click="cancelarModal = true"
								 v-if="modoVista != 1"
					>CANCELAR O.T.</v-btn>
          <v-spacer></v-spacer>
          <v-btn :disabled="overlay" persistent :loading="overlay" dark center class="white--text" color="success" @click="validaInfo" v-if="modoVista === 1">
            Confirmar  
          </v-btn>
          <v-btn :disabled="overlay" persistent :loading="overlay" dark center class="white--text" color="success" @click="validaInfo" v-else>
            Actualizar  
          </v-btn>
				</v-card-actions>

				<v-dialog v-model="cancelarModal" persistent max-width="400" v-if="modoVista === 2"> <!-- PROCESO PARA ELIMINAR  -->
					<v-card>
						<v-col cols="12"  class="pa-4">
							<strong >¿ ESTAS SEGURO DE CANCELAR LA ORDEN DE TRABAJO  ?</strong>
						</v-col>
						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn color="red darken-1"   text small @click="cancelarModal = false">Regresar</v-btn>
							<v-btn color="green darken-1" dark small @click="cancelarOT">Cancelar O.T.</v-btn>
						</v-card-actions>
					</v-card>
				</v-dialog> <!-- FIN DEL PROCESO PARA ELIMINAR  -->
				<v-dialog v-model="Correcto" hide-overlay persistent width="350">
					<v-card :color="colorCorrecto" dark class="pa-3">
						<v-card-text class="font-weight-black headline pa-3 white--text" align="center">
							{{ textCorrecto }}
						</v-card-text>
					</v-card>
				</v-dialog>


				<!-- OVERLAY -->
        <overlay v-if="overlay"/>

			</v-col>
      
		</v-row>
   
	</v-main>
</template>

<script>
	import  metodos from '@/mixins/metodos.js';
	import {mapGetters, mapActions} from 'vuex'
	import loading     from '@/components/loading.vue'
  import overlay     from '@/components/overlay.vue'

	export default {
		mixins:[metodos],
	  components: {
			overlay
		},
		props:[
			'modoVista',
			'parametros',
	  ],
	  data () {
			return {
				titleModal: 'Programación Flexografía',
				// VARIABLES PRINCIPALES
				id_programacion: null,
				maquina	: {id:null, nombre:''},
				maquinas: [],
				// SELECTORES
				suaje    : { id:null, suaje: ''},
				suajes   : [],

        pleca    : { id:null, pleca: ''},
				plecas   : [{id:1, pleca:'SI'}, { id:2, pleca:'NO'}],

        orden_trabajo : '',
        num_partida: '',
        
        cliente    : { id:null, nombre: ''},
				clientes   : [],

        producto    : { id:null, nombre: ''},
				productos   : [],
        cantidad    : '',

        fecha1: new Date().toISOString().substr(0, 10),
				fechamodal1:false,

				hora1 					 : null,
        horamodal1		   : false,
        hora2 					 : null,
        horamodal2		   : false,
				urgencia         : false,
				// hora_compromiso: false,

				// ALERTAS
				snackbar: false,
				text		: '',
				color		: 'error',
        Loading : false,
        overlay : false,

				textDialog : "Guardando Información",
				Correcto   : false,
				colorCorrecto: 'green',
				textCorrecto : 'La información se guardo correctamente',
				colorDialog: 'blue darken-4',
				// BOTON DE cancelarOT
				cancelarModal: false
			}
		},
		
		created(){
      this.hora1 = this.traerHoraActual();
      this.hora2 = this.traerHoraActual();
			this.consultar_Maqinas_Depto(1);
			// this.consultar_Plecas();
			this.consultar_Suajes();
			this.validarModoVista()

			// this.consultar_Clientes().then(res =>{ 
			// 	// console.log('res', res)
      // 	; 	  // VALIDO EL MODO DE LA VISTA

			// }).finally(()=>{ 
			// 	this.loading = false
			// }); //MANDO A CONSULTAR SUCURSALES A MIXINS

		},
			
		computed:{
			// IMPORTANDO USO DE VUEX - CLIENTES (GETTERS)
			...mapGetters('Programacion'  ,['Parametros']),
		},

		watch:{
			parametros: function () {
				this.validarModoVista();
			},

			// cliente: function(){
			// 	// console.log(this.cliente.id)

			// 	this.consutlar_ProdxCli(this.cliente.id? this.cliente.id: 0)
			// }
		},

		methods:{
			// IMPORTANDO USO DE VUEX - CLIENTES(ACCIONES)
			// ...mapActions('Usuarios'  ,['consultaUsuarios']),
			...mapActions('Programacion'  ,['obtener_Programaciones']), // IMPORTANDO USO DE VUEX - CLIENTES(ACCIONES)

			validarModoVista(){

				if(this.modoVista === 2){
					// ASIGNAR VALORES AL FORMULARIO
					this.id_programacion =  this.parametros.id;
					this.maquina       = { id: this.parametros.id_maquina },
					this.suaje 				 = { id: this.parametros.id_suaje   },
					this.pleca 				 = { id: this.parametros.id_pleca   },
          // this.orden_trabajo = this.parametros.ot
					// this.num_partida 	 = this.parametros.num_partida
					// this.cliente       = { id: this.parametros.id_cliente }
					// this.producto      = { id: this.parametros.id_producto }
					// this.cantidad        = this.parametros.cantidad
          this.fecha1       = this.parametros.fecha_prog;
          this.hora1        = this.parametros.hora_inicio;
          this.hora2        = this.parametros.hora_fin;
					// this.urgencia     = this.parametros.urgencia === 1 ? true : false;
				}else{
					this.limpiarCampos()
				}
			},

			validaInfo(){
				if(!this.maquina.id)	  { this.snackbar = true; this.text="NO PUEDES OMITIR LA MAQUINA"   ; return }
				if(!this.suaje.id)	    { this.snackbar = true; this.text="NO PUEDES OMITIR EL SUAJE"   ; return }
				if(!this.pleca.id)	    { this.snackbar = true; this.text="NO PUEDES OMITIR LA PLECA" ; return }
				// if(!this.orden_trabajo)	{ this.snackbar = true; this.text="NO PUEDES OMITIR LA ORDEN DE TRABAJO" ; return }
				// if(!this.num_partida)	  { this.snackbar = true; this.text="NO PUEDES OMITIR EL NÚMERO DE PARTIDA" ; return }
				// if(!this.cliente.id)	  { this.snackbar = true; this.text="NO PUEDES OMITIR EL CLIENTE" ; return }
				// if(!this.producto.id)	  { this.snackbar = true; this.text="NO PUEDES OMITIR EL PRODUCTO" ; return }
				// if(!this.cantidad)	    { this.snackbar = true; this.text="NO PUEDES OMITIR LA CANTIDAD " ; return }
				if(!this.fecha1)	      { this.snackbar = true; this.text="NO PUEDES OMITIR LA PROGRAMACIÓN " ; return }
				if(!this.hora1)	        { this.snackbar = true; this.text="NO PUEDES OMITIR LA HORA INICIO " ; return }
				if(!this.hora2)	        { this.snackbar = true; this.text="NO PUEDES OMITIR LA HORA FIN " ; return }

        this.PrepararPeticion();
			},

			PrepararPeticion(){
				const payload =  new Object();
              payload.id_maquina    = this.maquina.id;
              payload.id_suaje      = this.suaje.id;
              payload.id_pleca      = this.pleca.id;
              payload.fecha_prog    = this.fecha1;
              payload.hora_inicio   = this.hora1;
              payload.hora_fin      = this.hora2;
							payload.estatus       = 2
							// payload.orden_trabajo = this.orden_trabajo;
              // payload.num_partida   = this.num_partida;
              // payload.id_cliente    = this.cliente.id;
              // payload.id_producto   = this.producto.id;
							// payload.cantidad      = this.cantidad;
							// payload.urgencia      = this.urgencia ? 1 : 0;
				// console.log('payload', payload)
				// VALIDO QUE ACCION VOY A EJECUTAR SEGUN EL MODO DE LA VISTA
				this.modoVista === 1 ? this.crear_Programacion(payload): this.actualiza_Programacion(payload);
			},

			crear_Programacion(payload){
				this.overlay = true ;
				// MANDO A INSERTAR 
				this.$http.post('agregar.programacion', payload).then(response =>{
					this.TerminarProceso(response.bodyText);					
				}).catch(error =>{
					this.MensajeError(error.bodyText)
				}).finally(()=>{ this.overlay = false })
			},

			actualiza_Programacion(payload){
				// ACTIVO DIALOGO -> GUARDANDO INFO
				this.overlay = true ;
				this.$http.put('actualizar.programacion/'+ this.id_programacion, payload).then(response =>{
					this.TerminarProceso(response.bodyText);					
				}).catch(error =>{
					this.MensajeError(error.bodyText)
				}).finally(()=>{ this.overlay = false })
			},

			TerminarProceso(mensaje){
				var me = this ;
				this.Correcto = true; this.colorCorrecto = "green"; this.textCorrecto = mensaje;
				this.obtener_Programaciones(this.Parametros)
				setTimeout(()=> { me.$emit('modal',false)}, 2000);
				this.limpiarCampos();  //LIMPIAR FORMULARIO
			},

			MensajeError(mensaje){
			  this.Correcto 		= true ; this.colorCorrecto	="red"	; this.textCorrecto = mensaje;
				setTimeout(() => (this.Correcto = false), 2000)
			},

			cancelarOT(){
				this.cancelarModal = false; this.overlay = true;
				this.$http.put('cancelar.orden.trabajo/'+ this.parametros.id).then((response)=>{
					this.TerminarProceso(response.bodyText);
				}).catch( error => {
					this.MensajeError(error.bodyText)
				}).finally(()=>{ this.overlay = false })
			},

			limpiarCampos(){
				this.maquina        = { id: null, nombre:''};
				this.suaje          = { id: null, suaje:''};
				this.pleca          = { id: null, pleca:''};
				this.orden_trabajo  = '',
				this.num_partida    = '';
				this.cliente        =  { id:null, nombre: '' };
				this.producto       =  { id:null, nombre: '' };
				this.cantidad       = '';
				this.fecha1         = new Date().toISOString().substr(0, 10);
				this.hora1 			    = this.traerHoraActual();
      	this.hora2		      = this.traerHoraActual();
				this.urgencia       = false;
			}
		}
	}
</script>