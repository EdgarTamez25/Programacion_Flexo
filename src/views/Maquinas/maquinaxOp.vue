<template>
  <v-main class="pa-0 ma-3 mt-2">

    <v-snackbar v-model="alerta.activo" multi-line vertical top right :color="alerta.color" > 
      <strong> {{alerta.texto}} </strong>
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text @click="alerta.activo = false" v-bind="attrs"> Cerrar </v-btn>
      </template>
    </v-snackbar>


    <v-row justify="center">
      <v-col cols="12" md="10" lg="7">
        <v-card class="pa-3">

          <v-row >
            <v-col cols="12" >
              <v-card-text class="subtitle-1 text-sm-h5  font-weight-black text-center">
                ASIGNACIÓN DE MAQUINA POR OPERADOR
              </v-card-text>
            </v-col>

            <v-col cols="12" sm="3" > <!-- FECHA DE COMPROMISO -->
							<v-dialog ref="fecha1" v-model="fechamodal1" :return-value.sync="fecha1" persistent width="290px">
								<template v-slot:activator="{ on }">
									<v-text-field
										v-model="fecha1" label="Fecha Inicio" append-icon="event" readonly v-on="on"
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

            <v-col cols="12" sm="3">
              <v-autocomplete
                :items="maquinas" v-model="maquina" item-text="nombre" item-value="id" label="Maquinas" 
                dense filled hide-details return-object color="celeste"  append-icon="mdi-slot-machine-outline"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" sm="6">
              <v-autocomplete
                :items="operadores" v-model="operador" item-text="nombre" item-value="id" label="Operadores" 
                dense filled hide-details return-object color="celeste" append-icon="mdi-account-tie"
              ></v-autocomplete>
            </v-col>

            <v-col cols="12" v-if="!btnEditar">
              <v-btn color="rosa" :disabled="maquina.id && operador.id? false:true" block class="white--text"
                     @click="agregar_Asignacion_Maquina()"> Agregar asignación
              </v-btn>
            </v-col>

            <v-col cols="6" v-if="btnEditar">
              <v-btn color="error" block  class="white--text" @click="limpiar_Campos()"> Cancelar </v-btn>
            </v-col>
            <v-col cols="6" v-if="btnEditar">
              <v-btn color="celeste" block  class="white--text" @click="editar_Asignacion_Maquina()"> Editar asignación </v-btn>
            </v-col>

            <!-- <v-row justify="center" class="pa-8" v-if="!Loading && !asignaciones_Maquinas.length"> -->
              <v-col cols="12" class="text-center pa-9" v-if="!Loading && !asignaciones_Maquinas.length">
                <img src="http://producciongama.com:8080/PROGRAMACION-FLEXO/IMAGENES/error.svg" width="100%"  loading="lazy"/>
              </v-col>
              <v-col cols="12" class="text-center " v-if="!Loading && !asignaciones_Maquinas.length">
                <v-btn block large color="celeste" dark class="text-h6 text-sm-h6 text-md-h5" @click="init()">
                  Recargar Información
                </v-btn>
              </v-col>
            <!-- </v-row> -->

            <v-col cols="12" >
               <v-container style="height: 400px;" v-if="Loading">
                <loading/>
              </v-container>

              <v-list two-line subheader v-else>
                <v-list-item v-for="(item , i) in asignaciones_Maquinas" :key="i" link >
                  <v-list-item-avatar >  
                    <v-img src="http://producciongama.com:8080/PROGRAMACION-FLEXO/IMAGENES/H1.png"></v-img>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title class="font-weight-black">{{ item.maquina }}</v-list-item-title>
                    <v-list-item-subtitle class="font-weight-black">{{ item.operador }}</v-list-item-subtitle>
                    <v-list-item-subtitle>{{ item.fecha }}</v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-btn icon :disabled="HABILITAR_CAMBIOS"> <v-icon color="celeste" @click="llenar_Campos_AEditar(item)"> create</v-icon></v-btn>
                  </v-list-item-action>
                  <v-list-item-action>
                    <v-btn icon :disabled="HABILITAR_CAMBIOS"> <v-icon color="rosa" @click="eliminar_Asignacion(item)"> close</v-icon></v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-col>

            <v-col cols="12" v-if="fecha1 != fechaActual && !Loading && asignaciones_Maquinas.length">
              <v-btn color="celeste" dark @click="conservar_Asignacion()"> Conservar esta asignación </v-btn>
            </v-col>
          </v-row>

          <v-dialog v-model="editarAsignacion" width="500px">
            <v-card class="pa-4">
              
            </v-card>
          </v-dialog>

        </v-card>

        <overlay v-if="overlay"/>

      </v-col>
    </v-row>
  </v-main>
</template>

<script>
	import  metodos from '@/mixins/metodos.js';
  import { mapActions , mapGetters } from 'vuex'
  import overlay     from '@/components/overlay.vue'
  import loading     from '@/components/loading.vue'

  export default {
		mixins:[metodos],
    components: {
			overlay,
      loading
		},
    data:()=>({
      maquina	: {id:null, nombre:''},
      maquinas: [],
      
      operador: { id: null , nombre:''},
      operadores: [],

      fechaActual:'',
      fecha1: '',
			fechamodal1:false,


      alerta: { activo: false, texto:'', color:'error', vertical:true },
      editarAsignacion: false,
      btnEditar:false,
      paramAEditar: {},
      overlay: false,
    }),

    created(){
      this.fecha1      = this.traerFechaActual();
      this.fechaActual = this.traerFechaActual();
      this.consultar_Maqinas();
      this.consultar_Operadores();

      if(this.Parametros.fecha != undefined){
				this.fecha1  = this.Parametros.fecha1
			}


      this.init();
    },

    computed:{
			...mapGetters('Maquinas' ,['Loading','asignaciones_Maquinas','Parametros']), // IMPORTANDO USO DE VUEX  (GETTERS)
      
      HABILITAR_CAMBIOS: function(){
        return this.fechaActual != this.fecha1 ? true : false; 
      },

      

    },
    watch:{
			fecha1: function () {
				this.init();
			}, 
    },
   

    methods:{
			...mapActions('Maquinas'  ,['agregar_Operador_Maquina','obtener_Operador_Maquina','editar_Operador_Maquina']), // IMPORTANDO USO DE VUEX - CLIENTES(ACCIONES)

      init(){
        const payload = new Object();
              payload.fecha = this.fecha1;

        this.obtener_Operador_Maquina(payload);
      },

      agregar_Asignacion_Maquina(){
        this.overlay = true;
        const payload = new Object();
              payload.id_maquina  = this.maquina.id;
              payload.maquina     = this.maquina.nombre;
              payload.id_operador = this.operador.id;
              payload.operador    = this.operador.nombre;
              payload.fecha       = this.fecha1;
        
        if(!this.valida_Asignacion_Maquina(payload)){ this.overlay= false ; return };

        this.agregar_Operador_Maquina(payload).then(res => {
          this.alerta = { activo: true, texto:'Agregado Correctamente', color:'green'}
          this.init();
          this.limpiar_Campos();
        }).catch(error =>{
          console.log('error', error)
        }).finally(()=> { this.overlay = false; })
      },

      llenar_Campos_AEditar(data){
        this.fecha1 = data.fecha;
        this.paramAEditar = data;
        this.maquina = { id: data.id_maquina , nombre:data.maquina    };
        this.operador = { id: data.id_operador, nombre:data.id_operador};
        this.btnEditar = true;

      },
      
      editar_Asignacion_Maquina(){
        this.overlay = true;
        const payload = new Object();
              payload.id          = this.paramAEditar.id;
              payload.id_maquina  = this.maquina.id;
              payload.id_operador = this.operador.id;
              payload.fecha       = this.fecha1;

        if(!this.valida_Edicion_Asignacion_Maquina(payload)){ this.overlay= false ; return };

        this.editar_Operador_Maquina(payload).then(res => {
          this.alerta = { activo: true, texto: res , color:'green'}
          this.init();
          this.limpiar_Campos();
        }).catch(error =>{
          this.alerta = { activo: true, texto: error , color:'error'}
          console.log('error', error)
        }).finally(()=> { this.overlay = false; })

      },

      valida_Asignacion_Maquina(data){

        for(let i=0; i< this.asignaciones_Maquinas.length; i++){
          if(data.id_maquina === this.asignaciones_Maquinas[i].id_maquina){
            this.alerta = { activo: true, texto:'ESTÁ MAQUINA YA TIENE OPERADOR.', color:'error'}
            return false; 
          }
          if(data.id_operador === this.asignaciones_Maquinas[i].id_operador){
            this.alerta = { activo: true, texto:'ESTE OPERADOR YA ESTA ASIGNADO', color:'error'}
            return false;
          }
        }
        return true;
      },

      valida_Edicion_Asignacion_Maquina(data){
        for(let i=0; i< this.asignaciones_Maquinas.length; i++){
          if(this.paramAEditar.id != this.asignaciones_Maquinas[i].id){

            if(data.id_maquina === this.asignaciones_Maquinas[i].id_maquina){
              this.alerta = { activo: true, texto:'ESTÁ MAQUINA YA TIENE OPERADOR.', color:'error'}
              return false;
            }
            if(data.id_operador === this.asignaciones_Maquinas[i].id_operador){
              this.alerta = { activo: true, texto:'ESTE OPERADOR YA ESTA ASIGNADO', color:'error'}
              return false;
            }
          }
          
        }
        return true;
      },

      limpiar_Campos(){
        // this.fecha1 = this.traerFechaActual();
        this.maquina = { id:null , nombre:''};
        this.operador = { id:null , nombre:''};
        this.btnEditar = false;
      },

      conservar_Asignacion(){
        this.overlay = true;
        const payload = new Object();
              payload.fecha = this.traerFechaActual();

        this.$http.post('valida.conservacion.asignación', payload).then( response =>{

          if(response.body.length){
           this.alerta = { activo: true, texto:'Ya existe una asignación el día de hoy.', color:'error'};
           this.overlay = false;
           return;
          }

          for(let i=0; i< this.asignaciones_Maquinas.length;i++){
            const payload = new Object();
                payload.id_maquina  = this.asignaciones_Maquinas[i].id_maquina;
                payload.id_operador = this.asignaciones_Maquinas[i].id_operador;
                payload.fecha       = this.traerFechaActual()

            this.agregar_Operador_Maquina(payload).then(res => {
              this.alerta = { activo: true, texto:'Agregado Correctamente', color:'green'}
            }).catch(error =>{
              console.log('error', error)
            }).finally(()=> { this.overlay = false; })
          }

        })


        
      },

      eliminar_Asignacion(item){
        this.overlay = true;
        this.$http.delete('eliminar.asignacion.maquina/'+ item.id).then( response =>{
          this.alerta = { activo: true, texto:response.bodyText, color:'green'}
          this.init();
        this.limpiar_Campos();
        }).catch(error =>{
          this.alerta = { activo: true, texto:error.bodyText , color:'error'}
        }).finally(()=> { this.overlay = false; })
      }
    }
  }
</script>