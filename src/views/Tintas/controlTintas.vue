<template>
	<v-main class="pa-5">
		<v-row justify="center">
			<v-col cols="12" >

				<v-snackbar v-model="alerta.activo" multi-line vertical top right :color="alerta.color" > 
					<strong> {{alerta.texto}} </strong>
					<template v-slot:action="{ attrs }">
						<v-btn color="white" text @click="alerta.activo = false" v-bind="attrs"> Cerrar </v-btn>
					</template>
				</v-snackbar>
				
				<v-card-actions class="pa-0 " >
					<h3> <strong class="subtitle-1 text-sm-h6"> {{ modoVista === 1? 'NUEVA TINTA':'EDITAR TINTA' }} </strong></h3> 
					<v-spacer></v-spacer>
					<v-btn color="error" small @click="$emit('modal',false)" ><v-icon>clear</v-icon></v-btn>
				</v-card-actions>

				<v-row class="mt-5">
          <v-col cols="12" sm="6" lg="6">
            <v-autocomplete
              :items="colores" v-model="color" item-text="nombre" item-value="id" label="Colores" 
              dense filled hide-details return-object color="celeste" 
            ></v-autocomplete>
          </v-col>
          <v-col cols="6" sm="6" lg="6">
						<v-autocomplete
							:items="pantones" v-model="pantone" item-text="nombre" item-value="id" label="Pantones" 
							dense filled hide-details return-object color="celeste" 
						></v-autocomplete>
					</v-col>

          <v-col cols="6" sm="6" lg="6">
						<v-autocomplete
							:items="materiales" v-model="material" item-text="nombre" item-value="id" label="Materiales" 
							dense filled hide-details return-object color="celeste" 
						></v-autocomplete>
					</v-col>

          <v-col cols="12" sm="6" lg="6">
						<v-text-field 
							v-model ="existencia" type="number" label="Existencia" placeholder="Existencia"	hide-details dense clearable filled suffix="KG"
						></v-text-field>
					</v-col>

					<v-col cols="12" class="pa-0">
						<v-card-text class="font-weight-black subtitle-1"> Presentación </v-card-text>
					</v-col>

          <v-col cols="12" sm="6" lg="6">
						<v-text-field
							v-model ="cantidad" type="number" label="Cantidad" placeholder="Cantidad" hide-details dense clearable filled
						></v-text-field>
					</v-col>

					<v-col cols="6" sm="6" lg="6">
						<v-autocomplete
							:items="unidades" v-model="unidad" item-text="nombre" item-value="id" label="Unidades" 
							dense filled hide-details return-object color="celeste" 
						></v-autocomplete>
					</v-col>

					<v-col cols="12" sm="6" lg="6"> <!-- FECHA DE COMPROMISO -->
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
				</v-row>
				<!-- //DIALOG PARA GUARDAR LA INFORMACION -->
				<v-card-actions class="mt-2">
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
            Guardad información  
          </v-btn>
          <v-btn :disabled="overlay" persistent :loading="overlay" dark center class="white--text" color="success" @click="validaInfo" v-else>
            Actualizar información  
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
	// import loading     from '@/components/loading.vue'
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
				id_registro: null,
				color	 : { id:null, nombre:''},
				colores: [{id:1   , nombre:'AMARILLO'  },
								  {id:2   , nombre:'ROSA'      },
									{id:3   , nombre:'MORADO'    },
									{id:4   , nombre:'AZUL'      },
									{id:5   , nombre:'GRIS'      },
									{id:6   , nombre:'CAFE'      },
									{id:7   , nombre:'VERDE'     },
									{id:8   , nombre:'ROJO'      },
									{id:9   , nombre:'NARANJA'   },
									{id:10  , nombre:'BLANCO'    },
									{id:11  , nombre:'NEGRO'     },  
								],
				// SELECTORES
				pantone     : { id:null, nombre: ''},
				pantones    : [],
        material    : { id:null, nombre: ''},
				materiales  : [],
				materiales2 : [],

        existencia  : '',
        cantidad    : '',
        unidad      : { id:null, nombre: ''},
				unidades    : [],

				fecha1: new Date().toISOString().substr(0, 10),
				fechamodal1:false,

     		alerta: { activo: false, texto:'', color:'error', vertical:true },
				
        // Loading : false,
        overlay : false,

				Correcto   : false,
				colorCorrecto: 'green',
				textCorrecto : 'La información se guardo correctamente',
				// BOTON DE cancelarOT
				cancelarModal: false
			}
		},
		
		created(){
			this.consulta_Unidades();
			this.consulta_Materiales();
			this.validarModoVista();
		},
			
		computed:{
			// IMPORTANDO USO DE VUEX - CLIENTES (GETTERS)
			...mapGetters('Programacion'  ,['Parametros']),
		},

		watch:{
			parametros: function () {
				this.validarModoVista();
			},

			color: function(){
				console.log('color', this.color)
				// this.consultaPantonesxColor(this.color.id? this.color.id: 0)
			}
		},

		methods:{
			...mapActions('Tintas'  ,['obtener_registros_tinta','agregar_registro_tinta','actualizar_registro_tinta']), 

			validarModoVista(){
				if(this.modoVista === 2){
					// ASIGNAR VALORES AL FORMULARIO
					this.id_registro   =  this.parametros.id;
					this.color         = { id: this.parametros.color },
					this.consulta_pantones_x_color().then( res =>{ this.pantone = { id: this.parametros.id_pantone   };	})	
					this.material 	   = { id: this.parametros.id_material  },
          this.existencia    = this.parametros.existencia
				  this.cantidad 	   = this.parametros.cantidad
		  	  this.unidad        = { id: this.parametros.id_unidad    }
				}else{
					this.limpiarCampos()
				}
			},

			validaInfo(){
				if(!this.color.id)	    {  this.alerta = { activo: true, texto:'NO PUEDES OMITIR EL COLOR'      , color:'error'} ; return }
				if(!this.pantone.id)	  {  this.alerta = { activo: true, texto:'NO PUEDES OMITIR EL PANTONE'    , color:'error'} ; return } 
				if(!this.material.id)	  {  this.alerta = { activo: true, texto:'NO PUEDES OMITIR EL MATERIAL'   , color:'error'} ; return } 
				if(!this.existencia)	  {  this.alerta = { activo: true, texto:'NO PUEDES OMITIR LA EXISTENCIA' , color:'error'} ; return } 
				if(!this.cantidad)	    {  this.alerta = { activo: true, texto:'NO PUEDES OMITIR LA CANTIDAD'   , color:'error'} ; return } 
				if(!this.unidad.id)	    {  this.alerta = { activo: true, texto:'NO PUEDES OMITIR LA UNIDAD'     , color:'error'} ; return } 
        this.PrepararPeticion();
			},

			PrepararPeticion(){
				const payload =  new Object();
              payload.id_pantone    = this.pantone.id;
              payload.id_material   = this.material.id;
              payload.existencia    = this.existencia;
              payload.unidad_exist  = 8;  // corresponde a los Kg
              payload.cantidad      = this.cantidad;
              payload.id_unidad     = this.unidad.id;
              payload.fecha_entrega = this.fecha1;

				console.log('payload', payload)
				// VALIDO QUE ACCION VOY A EJECUTAR SEGUN EL MODO DE LA VISTA
				this.modoVista === 1 ? this.crear_registro(payload): this.actualizar_registro(payload);
			},

			crear_registro(payload){
				this.overlay = true ;
				this.agregar_registro_tinta().then( response =>{
					this.TerminarProceso(response.bodyText);					
				}).catch( error =>{
					this.alerta = { activo: true, texto:error.bodyText, color:'error'}
				}).finally(()=>{ this.overlay = false })
			},

			actualizar_registro(payload){
				this.overlay = true ;
				this.actualizar_registro_tinta(this.id_registro, payload).then(response =>{
					this.TerminarProceso(response.bodyText);					
				}).catch(error =>{
					this.alerta = { activo: true, texto:error.bodyText, color:'error'}
				}).finally(()=>{ this.overlay = false })
			},

			TerminarProceso(mensaje){
				var that = this ;	this.Correcto = true; this.colorCorrecto = "green"; this.textCorrecto = mensaje;
				this.obtener_registros_tinta(); 
				setTimeout(()=> { that.$emit('modal',false)}, 2000);
				this.limpiarCampos();  
			},

			limpiarCampos(){
				this.color          = { id: null, nombre:''};
				this.pantone        = { id: null, nombre:''};
				this.material       = { id: null, nombre:''};
				this.existencia     = 0,
				this.cantidad       = 0;
				this.unidad         = { id:null, nombre: '' };
				this.fecha1         = new Date().toISOString().substr(0, 10);
			}
		}
	}
</script>