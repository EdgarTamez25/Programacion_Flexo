<template>
  <v-main class="pa-0 ma-3 mt-5">
    <v-snackbar v-model="alerta.activo" multi-line vertical top right :color="alerta.color" > 
      <strong> {{alerta.texto}} </strong>
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text @click="alerta.activo = false" v-bind="attrs"> Cerrar </v-btn>
      </template>
    </v-snackbar>
    
    <v-row justify="center">
      <v-col cols="12" md="9" lg="6">
        <v-card class="pa-4 ">
          
          <v-row>
            <v-col cols="6" class="text-left">
              <v-btn color="grey lighten-2" onClick="history.go(-1); return false;"> <v-icon left >keyboard_backspace</v-icon> REGRESAR</v-btn>
            </v-col>  
            <v-col cols="6" class="text-right" v-if="detalle.urgencia === 1">
              <v-btn color="grey lighten-2" text class="font-weight-black headline error--text">  PRIORIDAD</v-btn>
            </v-col>  

            <v-col cols="12">
              <v-list two-line subheader outlined >
                <v-list-item >
                  <v-list-item-content >
                    <v-list-item-title class="overline"> <span class="font-weight-black"> PRODUCTO:</span> {{ detalle.codigo}} </v-list-item-title>
                    <v-list-item-title class="overline"> <span class="font-weight-black"> CLIENTE: </span> {{ detalle.nomcli}}   </v-list-item-title>
                    <v-list-item-title class="overline"> <span class="font-weight-black"> O.T:     </span> {{ detalle.id_ot}}       </v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-content >
                    <v-list-item-title class="overline"> 
                      <span class="font-weight-black"> CANTIDAD: </span> {{ detalle.cantidad}} 
                    </v-list-item-title>
                    <v-list-item-title class="overline rosa--text font-weight-black"> 
                      <span> PLECA: </span> {{ detalle.id_pleca ===1? 'SI':'NO'}} 
                    </v-list-item-title>
                    <v-list-item-title class="overline">            
                      <span class="font-weight-black"> PARTIDA:  </span> {{ detalle.id_det_ot}}              
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>

            
            <v-col cols="12" sm="6" lg="6">
              <v-select
                v-model="dificultad" :items="dificultades" filled 
                dense hide-details label="Dificultad" return-object placeholder="Dificultad" 
              ></v-select>
            </v-col>

            <v-col cols="12" sm="6" lg="6">
              <v-text-field
                v-model ="velocidad" label="Velocidad" placeholder="Velocidad" hide-details dense clearable filled type="number"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" lg="6">
              <v-autocomplete
                :items="materiales" v-model="material" item-text="codigo" item-value="id" label="Materiales" 
                dense filled hide-details return-object 
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" sm="6" lg="6">
              <v-text-field
                v-model ="bobinas" label="Bobinas" placeholder="Bobinas" hide-details dense clearable filled type="number"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" lg="6">
              <v-text-field
                v-model ="mtsxbobina" label="Metros por Bobina" placeholder="Metros por Bobina" hide-details dense clearable filled type="number"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" lg="6">
              <v-text-field
                v-model ="mts_fabricados" label="Metros Fabricados" placeholder="Metros Fabricados" hide-details dense clearable filled type="number"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" lg="6">
              <v-text-field
                v-model ="scrap" label="Registros" placeholder="Registros" hide-details dense clearable filled type="number"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" lg="6">
              <v-text-field
                v-model ="ancho_bobina" label="Ancho Bobina" placeholder="Ancho Bobina" hide-details dense clearable filled type="number"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" lg="6">
              <v-text-field
                v-model ="largo_bobina" label="Largo Bobina" placeholder="Largo Bobina" hide-details dense clearable filled type="number"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" v-if="detalle.id_pleca === 1">
              <v-autocomplete
                :items="plecas" v-model="pleca" item-text="suaje" item-value="id" label="Pleca" 
                dense filled hide-details return-object color="celeste" 
              ></v-autocomplete>
            </v-col>

            <v-col cols="12" sm="6" v-if="detalle.id_pleca === 2"/>

            <v-col cols="12" sm="3" lg="6">
              <v-text-field
                v-model ="est1" label="Estación 1 " placeholder="Estación 1 " hide-details dense  outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="3" lg="6">
              <v-text-field
                v-model ="cant1" label="Cantidad" placeholder="Cantidad" hide-details dense  outlined type="number"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="3" lg="6">
              <v-text-field
                v-model ="est2" label="Estación 2 " placeholder="Estación 1 " hide-details dense outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="3" lg="6">
              <v-text-field
                v-model ="cant2" label="Cantidad" placeholder="Cantidad" hide-details dense outlined type="number"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="3" lg="6">
              <v-text-field
                v-model ="est3" label="Estación 3 " placeholder="Estación 1 " hide-details dense outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="3" lg="6">
              <v-text-field
                v-model ="cant3" label="Cantidad" placeholder="Cantidad" hide-details dense outlined type="number"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="3" lg="6">
              <v-text-field
                v-model ="est4" label="Estación 4 " placeholder="Estación 1 " hide-details dense outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="3" lg="6">
              <v-text-field
                v-model ="cant4" label="Cantidad" placeholder="Cantidad" hide-details dense outlined type="number"
              ></v-text-field>
            </v-col>

            <v-col cols="12" class="py-1 my-0 pb-0">
              <v-textarea
                v-model="comentario" outlined rows="3" label="Comentario" placeholder="Agrega un comentario..."
              ></v-textarea>
            </v-col>
          </v-row>

         
         <v-row>
           <v-col cols="12" sm="6" >
            <v-btn block color="green" class="white--text subtitle-1" height="40" @click="PrepararPeticion()"> Guardar Información</v-btn>
           </v-col>
           <v-col cols="12" sm="6" md="6">
            <v-btn block color="celeste" class="white--text subtitle-1" height="40" @click="finalizarModal =true"> Finalizar Orden </v-btn>
           </v-col>
         </v-row>

          <!-- <v-footer class="white">
            <v-btn color="green" class="white--text subtitle-1" height="40" @click="PrepararPeticion()"> Guardar Información</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="celeste" class="white--text subtitle-1" height="40" @click="validarInformacion()"> Finalizar Orden </v-btn>
          </v-footer> -->
        </v-card>

         <v-dialog v-model="Inicializar_Orden" persistent width="400px" >
          <v-btn height="100px" color="celeste" class="white--text text-h5 mt-2" @click="Inicializar_OT()" > 
            <span v-if="!inicializando">  INICIALIZAR ORDEN</span>
            <v-progress-circular indeterminate color="white" align="center" v-else></v-progress-circular>
          </v-btn>
          <v-btn height="50px" color="purple darken-1" class="white--text text-h5 mt-2" onClick="history.go(-1); return false;" > 
            REGRESAR
          </v-btn>
        </v-dialog>

        <v-dialog v-model="finalizarModal" persistent width="400px" >
          <v-card class="pa-1">
            <v-card-text class="font-weight-black subtitle-1 text-left ma-0 mt-5">
              <!-- ¿ Estas seguro de finalizar está orden de trabajo ? -->
              ¿ ESTAS SEGURO DE FINALIZAR ESTÁ ORDEN DE TRABAJO ?
            </v-card-text>
            <v-card-actions>
              <v-btn outlined color="error" @click="finalizarModal = false">No, Cancelar</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="success" @click="validarInformacion()">Si, Continuar</v-btn>
            </v-card-actions>
          </v-card> 
        </v-dialog>

        <overlay v-if="overlay"/>

      </v-col>
    </v-row>
  </v-main>
</template>

<script>
  import  metodos from '@/mixins/metodos.js';
  import { mapActions , mapGetters } from 'vuex'
  import loading     from '@/components/loading.vue'
  import overlay     from '@/components/overlay.vue'

  export default {
    mixins:[metodos],
    components: {
			overlay,
      loading
		},

    data:()=>({
      Inicializar_Orden: false, 

      id_det_flexo_ot: null,
      velocidad:'',
      depto: { id: 1},
      material: { id:null, codigo:''},
      materiales:[],
      bobinas:'',
      mtsxbobina: '',
      mts_fabricados:'',
      scrap: '',
      dificultad:'',
      dificultades:['A','B','C','D','E'],
      ancho_bobina:'',
      largo_bobina:'',
      pleca    : { id:null, suaje: ''},
			plecas   : [],

      estaciones:[],
      comentario:'',
      est1: '',
      cant1: '',
      est2: '',
      cant2: '',
      est3: '',
      cant3: '',
      est4: '',
      cant4: '',


      alerta: { activo: false, texto:'', color:'error', vertical:true },
      overlay:false,
      inicializando: false,
      finalizarModal: false
    }),
    computed:{
      ...mapGetters('Login',['getdatosUsuario']),
    },

    created(){
      if(!this.$route.params.detalle){  window.history.go(-1); } // SI NO OBTENGO LA INFORMACION RETORNO VISTA.
      this.detalle = this.$route.params.detalle;
      this.consulta_Materiales(1);
			this.consultar_Plecas();
      this.init();
    },

    methods:{
			// IMPORTANDO USO DE VUEX - CLIENTES(ACCIONES)
			// ...mapActions('Usuarios'  ,['consultaUsuarios']),
			...mapActions('Programacion'  ,['obtener_Programaciones']), // IMPORTANDO USO DE VUEX - CLIENTES(ACCIONES)

			init(){
        // console.log('init',this.detalle)
        // CONSULTAR LA INFORMACION QUE SE TENGA DEL FORMULARIO
        this.$http.get('obtener.detalle.programacion/'+ this.detalle.id).then( response =>{
          this.id_det_flexo_ot = response.body[0].id;
          this.dificultad     = response.body[0].dificultad;
          this.velocidad      = response.body[0].velocidad;
          this.material       = { id: response.body[0].id_material };
          this.bobinas        = response.body[0].bobinas;
          this.mtsxbobina     = response.body[0].mtsxbobina;
          this.mts_fabricados = response.body[0].mts_fabricados;
          this.scrap          = response.body[0].scrap;
          this.ancho_bobina   = response.body[0].ancho_bobina;
          this.largo_bobina   = response.body[0].largo_bobina;
          this.pleca          = {id: response.body[0].id_pleca};

          this.est1 = response.body[0].est1; this.cant1 = response.body[0].cant1;
          this.est2 = response.body[0].est2; this.cant2 = response.body[0].cant2;
          this.est3 = response.body[0].est3; this.cant3 = response.body[0].cant3;
          this.est4 = response.body[0].est4; this.cant4 = response.body[0].cant4;
          this.comentario = response.body[0].comentario;
          this.Inicializar_Orden = false;

        }).catch(error =>{
          // console.log('error', error.bodyText)
          this.Inicializar_Orden = true;
        })
      },

      Inicializar_OT(){
        this.inicializando =true;
        const payload = new Object();
              payload.id = this.detalle.id;
              payload.id_usuario = this.getdatosUsuario.id;
              payload.inicio = this.traerFechaActual() + ' ' + this.traerHoraActual();

        this.$http.post('iniciaizar.ot.flexo', payload).then( response =>{
          this.alerta = { activo: true, texto: response.bodyText , color:'green'}
          this.init()
        }).catch( error =>{
          this.alerta = { activo: true, texto: error.bodyText , color:'green'}
        }).finally(()=>{
          this.inicializando =false;
        })
      },

			PrepararPeticion(){
				const payload =  new Object();
              payload.dificultad     = this.dificultad? this.dificultad : '';
              payload.velocidad      = this.velocidad? this.velocidad: '';
              payload.id_material    = this.material.id? this.material.id: null;
              payload.bobinas        = this.bobinas? this.bobinas: '';
              payload.mtsxbobina     = this.mtsxbobina? this.mtsxbobina: null;
              payload.mts_fabricados = this.mts_fabricados? this.mts_fabricados:null;
              payload.scrap          = this.scrap? this.scrap:null;
							payload.ancho_bobina   = this.ancho_bobina? this.ancho_bobina: null;
              payload.largo_bobina   = this.largo_bobina? this.largo_bobina: null;
              payload.id_pleca       = this.pleca.id? this.pleca.id: null;
              payload.est1           = this.est1? this.est1: null;
              payload.est2           = this.est2? this.est2: null;
              payload.est3           = this.est3? this.est3: null;
              payload.est4           = this.est4? this.est4: null;
              payload.cant1          = this.cant1? this.cant1: null;
              payload.cant2          = this.cant2? this.cant2: null ;
              payload.cant3          = this.cant3? this.cant3: null;
              payload.cant4          = this.cant4? this.cant4: null ;
              payload.comentario     = this.comentario ? this.comentario: null; 
				// console.log('payload', payload)
				// VALIDO QUE ACCION VOY A EJECUTAR SEGUN EL MODO DE LA VISTA
				this.actualiza_Informacion(payload);
			},

      validarInformacion(){
				if(!this.dificultad)	   { this.alerta = { activo: true, texto: 'OLVIDASTE LA DIFICULTAD' , color:'error'} ; return };
				if(!this.velocidad)	     { this.alerta = { activo: true, texto: 'OLVIDASTE LA VELOCIDAD' , color:'error'} ; return };
				if(!this.material.id)	   { this.alerta = { activo: true, texto: 'OLVIDASTE EL MATERIAL' , color:'error'} ; return };
				if(!this.mtsxbobina)	   { this.alerta = { activo: true, texto: 'OLVIDASTE LOS METROS POR BOBINA' , color:'error'} ; return };
				if(!this.mts_fabricados) { this.alerta = { activo: true, texto: 'OLVIDASTE LOS METROS FABRICADOS' , color:'error'} ; return };
				if(!this.scrap)          { this.alerta = { activo: true, texto: 'OLVIDASTE LOS REGISTROS' , color:'error'} ; return };
				if(!this.ancho_bobina)   { this.alerta = { activo: true, texto: 'OLVIDASTE EL ANCHO DE LA BOBINA' , color:'error'} ; return };
				if(!this.largo_bobina)   { this.alerta = { activo: true, texto: 'OLVIDASTE EL LARGO DE LA BOBINA' , color:'error'} ; return };
				if(this.detalle.id_pleca === 1 && !this.pleca.id) { this.alerta = { activo: true, texto: 'OLVIDASTE LA PLECA ' , color:'error'} ; return };

				// if(!this.est1)           { this.alerta = { activo: true, texto: 'OLVIDASTE LA ESTACIÓN 1' , color:'error'} ; return };
				// if(!this.est2)           { this.alerta = { activo: true, texto: 'OLVIDASTE LA ESTACIÓN 2' , color:'error'} ; return };
				// if(!this.est3)           { this.alerta = { activo: true, texto: 'OLVIDASTE LA ESTACIÓN 3' , color:'error'} ; return };
				// if(!this.est4)           { this.alerta = { activo: true, texto: 'OLVIDASTE LA ESTACIÓN 4' , color:'error'} ; return };

        this.PrepararPeticion();
        this.finalizarCompromiso();
      },
			
			actualiza_Informacion(payload){
				this.overlay = true ;
				this.$http.put('actualizar.detalle.orden.flexo/'+ this.id_det_flexo_ot, payload).then(response =>{
          this.alerta = { activo: true, texto: response.bodyText , color:'green'}
				}).catch(error =>{
           this.alerta = { activo: true, texto: error.bodyText , color:'green'}
				}).finally(()=>{ this.overlay = false })
			},

      finalizarCompromiso(){
        const payload = new Object();
              payload.id_flexo_ot = this.detalle.id;
              payload.fin = this.traerFechaActual() + ' ' + this.traerHoraActual();
              payload.estatus = 1;

        this.finalizarModal = false ; this.overlay = true ;
				this.$http.put('finalizar.orden.flexo/'+ this.id_det_flexo_ot, payload).then(response =>{
          this.alerta = { activo: true, texto: response.bodyText , color:'green'};
          var me = this; setTimeout(()=> me.$router.push({name: 'operaciones'}), 2000);
          this.limpiarCampos();
				}).catch(error =>{
           this.alerta = { activo: true, texto: error.bodyText , color:'error'}
				}).finally(()=>{ this.overlay = false })
      },

			limpiarCampos(){
				this.id_det_flexo_ot = null
        this.dificultad     = ''
        this.velocidad      = ''
        this.material       = { id: null, codigo:'' };
        this.pleca          = { id: null, suaje:'' };
        this.bobinas        = '';
        this.mtsxbobina     = ''
        this.mts_fabricados = ''
        this.scrap          = ''
        this.ancho_bobina   = ''
        this.largo_bobina   = ''

        this.est1 = ''; this.cant1 = '';
        this.est2 = ''; this.cant2 = '';
        this.est3 = ''; this.cant3 = '';
        this.est4 = ''; this.cant4 = '';
        this.comentario = '';
			}
    }
  }
</script>


