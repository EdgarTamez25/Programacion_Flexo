<template>
  <v-main class="pa-0 ma-3 mt-5">
    <v-snackbar v-model="alerta.activo" multi-line vertical top right :color="alerta.color" > 
      <strong> {{alerta.texto}} </strong>
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text @click="alerta.activo = false" v-bind="attrs"> Cerrar </v-btn>
      </template>
    </v-snackbar>
    
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="pa-2 " >
          <v-container style="height: 400px;" v-if="Loading">
            <loading/>
          </v-container>
          
          <v-row justify="center" class="pa-5" v-if="!Loading && !programaciones_Maquina.length  ">
            <v-col cols="12" class="text-justify font-weight-black subtitle-1 text-sm-h6 text-md-h5">
              {{ mensajeError}}
            </v-col>
            <v-col cols="12" class="text-center">
              <img src="http://producciongama.com:8080/PROGRAMACION-FLEXO/IMAGENES/error.svg" width="100%" loading="lazy"/>
            </v-col>
            
            <v-col cols="12">
              <v-btn block large color="rosa" dark class="text-h6 text-sm-h6 text-md-h5" @click="init()">
                Recargar Información
              </v-btn>
            </v-col>
            
          </v-row>
          <v-row v-if="!Loading && programaciones_Maquina.length">
            <v-col cols="12"  class="subtitle-1 text-sm-h5  font-weight-black text-center mt-3">
              PRODUCCIÓN FLEXOGRAFIA
            </v-col>

            <v-col cols="12" sm="6" >
              <v-autocomplete
                :items="maquinas" v-model="maquina" item-text="nombre" item-value="id" label="Maquinas" disabled
                dense filled hide-details return-object color="celeste" append-icon="mdi-slot-machine-outline"
              ></v-autocomplete>
            </v-col>

            <v-col cols="12" sm="6">
              <v-btn color="rosa" class="subtitle-1" block large outlined height="53" @click="init()">
                Recargar Información
              </v-btn>
            </v-col>

            <v-col cols="12">
              <v-list two-line subheader >
                <v-list-item v-for="(item , i) in programaciones_Maquina" :key="i" link @click="ver_Detalle_Produccion(item)" >
                  <v-list-item-avatar size="40" >
                    <v-btn icon v-if="item.urgencia === 1" class="red darken-4" dark>{{ item.id}} </v-btn>
                    <v-btn icon v-else>{{ item.id}} </v-btn>
                  </v-list-item-avatar >
                  
                  <v-list-item-content >
                    <v-list-item-title    class="font-weight-black caption">PRODUCTO: {{ item.producto }}</v-list-item-title>
                    <v-list-item-subtitle class="font-weight-black caption">CLIENTE: {{ item.nomcli }}</v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-list-item-title    class="font-weight-black caption">CANT:{{ item.cantidad }}</v-list-item-title>
                    <v-list-item-subtitle class="font-weight-black caption">O.T:{{ item.ot }}</v-list-item-subtitle>
                  </v-list-item-action>

                  <v-list-item-action>
                    <v-list-item-title class="font-weight-black caption rosa--text">INICIO:{{ item.hora_inicio }}</v-list-item-title>
                    <v-list-item-title class="font-weight-black caption celeste--text">FINAL :{{ item.hora_fin }}</v-list-item-title>
                  </v-list-item-action>
                
                </v-list-item>
              </v-list>
            </v-col>

          </v-row>
        </v-card>
        
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

    data:() => ({
      maquina	: {id:null, nombre:''},
			maquinas: [],

      alerta: { activo: false, texto:'', color:'error', vertical:true },
      mensajeError: '',
    }),
    
    created(){
			this.consultar_Maqinas();

      this.init()
      // this.init();
    },
    computed:{
			...mapGetters('Maquinas' ,['Loading','maquina_Asignada','programaciones_Maquina']), // IMPORTANDO USO DE VUEX  (GETTERS)
			...mapGetters('Login'    ,['getdatosUsuario']), // IMPORTANDO USO DE VUEX  (GETTERS)
    },

    methods:{
			...mapActions('Maquinas',['obtener_maquina_asignada','obtener_programaciones_maquina','loading']), 

      init(){
        this.loading(true);

        const payload  = new Object();
            payload.fecha       = this.traerFechaActual(),
            payload.id_operador = this.getdatosUsuario.id
      
        this.obtener_maquina_asignada(payload).then(response => {
          this.maquina = { id: this.maquina_Asignada.id_maquina };
         
          this.obtener_programaciones_maquina(this.maquina_Asignada.id_maquina).catch( error =>{
            this.alerta = { activo: true, texto: error , color:'error'}
            this.mensajeError = error;
          }).finally(()=>{ this.loading(false) })

        }).catch(error =>{
            this.alerta = { activo: true, texto: error , color:'error'}
            this.mensajeError = error;
        }).finally(()=>{ this.loading(false) })
      },
      ver_Detalle_Produccion(item){
        this.$router.push({name: 'form/flexografia', params:{ detalle:item }})
      }
      
      
    }


  }
</script>