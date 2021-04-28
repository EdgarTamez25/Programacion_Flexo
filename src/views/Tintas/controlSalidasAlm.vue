<template>
	<v-main class="pa-3">
		<v-row justify="center">
			<v-col cols="12" >

				<v-snackbar v-model="alerta.activo" multi-line vertical top right :color="alerta.color" > 
					<strong> {{alerta.texto}} </strong>
					<template v-slot:action="{ attrs }">
						<v-btn color="white" text @click="alerta.activo = false" v-bind="attrs"> Cerrar </v-btn>
					</template>
				</v-snackbar>
				
				<v-card-actions class="pa-0 " >
					<h3> <strong class="subtitle-1 text-sm-h6"> SALIDA DE TINTAS </strong></h3> 
					<v-spacer></v-spacer>
					<v-btn color="error" small @click="$emit('modal',false)" ><v-icon>clear</v-icon></v-btn>
				</v-card-actions>

				<v-row class="mt-5">
          <v-col cols="6" sm="6" lg="6">
						<v-autocomplete
							:items="pantones" v-model="pantone" item-text="nombre" item-value="id" label="Pantones" 
							dense outlined hide-details return-object color="celeste" disabled
						></v-autocomplete>
					</v-col>

          <v-col cols="12" sm="6" lg="6">
						<v-text-field 
							v-model ="existencia" type="number" label="Existencia" placeholder="Existencia"	
							hide-details dense clearable outlined suffix="KG" disabled
						></v-text-field>
					</v-col>

					<v-col cols="6">
						<v-select
							v-model="tipo_salida" :items="tipos_salida" item-text="nombre" item-value="id"	
							label="Tipo de salida" filled dense hide-details return-object
						></v-select>
					</v-col>

          <v-col cols="12" sm="6" lg="6" v-if="tipo_salida.id === 2">
						<v-text-field
							v-model ="cantidad" type="number" label="Cantidad" placeholder="Cantidad" hide-details dense clearable filled
						></v-text-field>
					</v-col>

					<v-col cols="12" sm="6" lg="6"> <!-- FECHA DE COMPROMISO -->
            <v-dialog ref="fecha1" v-model="fechamodal1" :return-value.sync="fecha1" persistent width="290px">
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="fecha1" label="Fecha de salida" append-icon="event" readonly v-on="on"
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

					<v-col cols="12" >
						<v-textarea
							v-model="concepto" label="Concepto de salida"	placeholder="Escribe aqui el concepto de salida..."	outlined rows="3" hide-details
						></v-textarea>
					</v-col>


				</v-row>
				<!-- //DIALOG PARA GUARDAR LA INFORMACION -->
				<v-card-actions  class="mt-5">
          <v-spacer></v-spacer>
          <v-btn :disabled="overlay" persistent :loading="overlay" dark center class="white--text" color="success" @click="validaInfo" >
            Generar salida  
          </v-btn>
				</v-card-actions>
			
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

				// SELECTORES
				pantone     : { id:null, nombre: ''},
				pantones    : [],

				tipo_salida     : { id:1, nombre: 'TODO'},
				tipos_salida    : [{ id:1, nombre: 'TODO'},{ id:2, nombre: 'PARCIAL'}],

        existencia  : '',
        cantidad    : '',

				fecha1: new Date().toISOString().substr(0, 10),
				fechamodal1:false,
				concepto:'', 
     		alerta: { activo: false, texto:'', color:'error', vertical:true },
				
        // Loading : false,
        overlay : false,

				Correcto   : false,
				colorCorrecto: 'green',
				textCorrecto : 'La información se guardo correctamente',
			}
		},
		
		created(){
			// this.validarModoVista();
			this.init()
		},
			
		computed:{
			...mapGetters('Programacion'  ,['Parametros']),
			...mapGetters('Login'         ,['getdatosUsuario']), // IMPORTANDO USO DE VUEX  (GETTERS)

		},

		methods:{
			...mapActions('Tintas'  ,['obtener_registros_tinta','agregar_registro_tinta','actualizar_registro_tinta']), 
			init(){
					this.id_registro   =  this.parametros.id;
					// this.consulta_pantones().then( res =>{  this.pantone = { id: this.parametros.id_pantone   }; })
          this.existencia    = this.parametros.existencia
			},

			validaInfo(){
				if(this.tipo_salida === 2 && !this.cantidad){  this.alerta = { activo: true, texto:'NO PUEDES OMITIR LA CANTIDAD'   , color:'error'} ; return } 
				if(!this.concepto){  this.alerta = { activo: true, texto:'NO PUEDES OMITIR EL CONCEPTO', color:'error'} ; return } 
        this.PrepararPeticion();
			},

			PrepararPeticion(){

				const payload =  new Object();
              payload.cant_ant      = this.parametros.existencia;
              payload.unidad_exist  = this.parametros.unidad_exist;
              payload.cant_act      = this.existencia - this.cantidad;
              payload.unidad_act    = this.parametros.unidad_act;
              payload.fecha    			= this.fecha;
  			      payload.id_usuario    = this.getdatosUsuario.id;  
              payload.concepto      = this.concepto;
              payload.estatus       = 4;

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
				this.pantone        = { id: null, nombre:''};
				this.tipo_salida    = { id: 1, nombre:'TODO'};
				this.existencia     = 0,
				this.cantidad       = 0;
				this.fecha1         = new Date().toISOString().substr(0, 10);
			}
		}
	}
</script>