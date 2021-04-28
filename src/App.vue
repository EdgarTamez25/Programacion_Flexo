<template>
  <v-app id="inspire">
    <!-- <div :class="loading">Loading&#8230;</div> -->

    <v-navigation-drawer app v-model="drawer" temporary width="300px" >

        <v-list dense nav class="py-0">
          <v-list-item two-line>
            <v-list-item-avatar>
              <img src="http://producciongama.com:8080/PROGRAMACION-FLEXO/IMAGENES/H1.png">
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title> {{ getdatosUsuario.nombre }} </v-list-item-title>
              <!-- <v-list-item-subtitle> {{ getdatosUsuario.flexo_prog === 1? 'Administrador':'Operador'}}</v-list-item-subtitle> -->
              <!-- <v-list-item-subtitle> {{ getdatosUsuario.flexo_prog === 1? 'Administrador':'Operador'}}</v-list-item-subtitle> -->
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

        </v-list>
      
     <v-list dense shaped>
        <template v-for="control in AppControl">
          <v-list-item
            v-for="(child, i) in control.admin"
            :key="i"
            :to="child.path"
            color="celeste"
            class="pa-1 ma-1"
          >
            <v-list-item-icon>
              <v-icon>{{ child.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content >
              <v-list-item-title >
                {{ child.text }} 
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

        </template>
      </v-list>

      <!-- ADMINISTRACION -->
      <v-list dense shaped>
        <template v-for="admin in AppControl">

          <v-list-group  v-if="admin.administracion" :key="admin.title" v-model="admin.model" :prepend-icon="admin.model ? admin.icon : admin['icon-alt']"
            color="rosa"
          >
            <template v-slot:activator>
              <v-list-item>
                <v-list-item-content >
                  <v-list-item-title > 
                   {{ admin.title}}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>

            <v-list-item
              v-for="(child, i) in admin.administracion"
              :key="i"
              :to="child.path"
              dense
              
            >
              <v-list-item-content >
                <v-list-item-title >
                  {{ child.text }}
                </v-list-item-title>
              </v-list-item-content>
               <v-list-item-action v-if="child.icon">
                
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-item-action>
            </v-list-item>
          </v-list-group>
        </template>
      </v-list>

      <!-- <v-divider></v-divider> -->

      <v-footer absolute>
        <v-btn color="red" outlined block small @click="cerrar_sesion=true">Cerrar Sesión
          <v-icon right>mdi-exit-to-app</v-icon>
        </v-btn>
      </v-footer>
    </v-navigation-drawer>


    <v-main id="fondo">
      <v-slide-y-transition mode="out-in">
        <router-view/>
      </v-slide-y-transition>
    </v-main>

    <v-snackbar v-model="alerta.activo" multi-line :vertical="true" top right :color="alerta.color" > 
      <strong> {{alerta.texto}} </strong>
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text @click="alerta.activo = false" v-bind="attrs"> Cerrar </v-btn>
      </template>
    </v-snackbar>

    <v-app-bar app dark class="elevation-0 color_fondo" v-ripple dense v-if="getLogeado">
       <img src="http://producciongama.com:8080/PROGRAMACION-FLEXO/IMAGENES/logo.png" height="40" @click.stop="drawer = !drawer">
    </v-app-bar>

    <v-dialog v-model="cerrar_sesion" width="400px">
      <v-card color="grey darken-4" class="pa-4">
        <v-card-title class=" white--text font-weight-medium pa-0">
         ¿Quiere cerrar la sesión?
        </v-card-title>
        <v-card-actions class="mt-5">
          <v-spacer></v-spacer>
          <v-btn color="celeste" outlined small @click="cerrar_sesion=false">Cancelar</v-btn>
          <v-btn color="rosa" dark small @click="salir">Cerrar Sesión</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-overlay v-if="blocked">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
   
  </v-app>
</template>

<script>
// import  SelectMixin from '@/mixins/SelectMixin.js';
import store from '@/store'
import { mapGetters,mapActions } from 'vuex';

export default {
  // mixins:[SelectMixin],
  components: {
  },
  data: () => ({
    syster_number: 5,
    urlSistemaPrincipal: 'http://producciongama.com:8080/',
    Logeado: true,
    cerrar_sesion:false,

    drawer: null,
     AppControl: [
        {
          admin: [ 
            { text: 'Monitor '              ,icon: 'mdi-monitor-eye'      ,path: '/monitor-master'},
            { text: 'Flexografía'           ,icon: 'home'                 ,path: '/flexografia'},
            { text: 'Maquina por Operador'  ,icon: 'chrome_reader_mode'   ,path: '/maquinas-por-operador'},
            // { text: 'Registro de tintas'    ,icon: 'print'                ,path: '/registro-de-tintas'},
            // { text: 'Resultados' ,icon: 'ballot'                     ,path: '/solicitudes'},
            ],
        },

        {
          icon: 'menu_book',
          title :' Programaciones',
          model: true,
          administracion: [ 
            { text: 'Bordados'    , icon: 'mdi-monitor-star' , path: '/programacion-bordados'},
            { text: 'Digital'     , icon: 'mdi-monitor-star' , path: '/programacion-digital'},
            { text: 'Offset'      , icon: 'mdi-monitor-star' , path: '/programacion-offset'},
            { text: 'Serigrafía'  , icon: 'mdi-monitor-star' , path: '/programacion-serigrafia'},
            { text: 'Empaque'     , icon: 'mdi-monitor-star' , path: '/programacion-empaque'},
            { text: 'Sublimación' , icon: 'mdi-monitor-star' , path: '/programacion-sublimación'},
            { text: 'Tampografía' , icon: 'mdi-monitor-star' , path: '/programacion-tampografia'},
            { text: 'UV'          , icon: 'mdi-monitor-star' , path: '/programacion-uv'},
          ],
        },
       
      ],
      
      alerta: { activo: false, texto:'', color:'error' },
      blocked: true,
      loading: true,
  }),

  created(){
    if (typeof(Storage) !== "undefined") {
        // VERIFICO SI EXISTE UN USUARIO ACTIVO 
        if(localStorage.getItem("KeyLogger") != null){
          this.validaSession().then( response =>{ // VERIFICO SI LA SESSION DEL KEYLOGGER ESTA ACTIVA
            const payload = new Object();
                  payload.id       = response.id_usuario
                  payload.sistema  = this.syster_number

            this.ObtenerDatosUsuario(payload).then(response =>{
              this.alerta = { activo: true, texto: `HOLA DE NUEVO ${ response.nombre }`, color :'success' };
              
              if(response.nivel === 1 || response.nivel === 5){
                if(this.$router.currentRoute.name != 'monitor-master'){  // COMPARO LA RUTA EN LA QUE ME ENCUENTRO 
                  this.$router.push({ name: 'monitor-master' });         // SI ES ADMINISTRADOR LO MANDO A PROGRAMACIONES
                }
              }else if(response.nivel === 2){
                if(this.$router.currentRoute.name != 'flexografia'){  // COMPARO LA RUTA EN LA QUE ME ENCUENTRO 
                  this.$router.push({ name: 'flexografia' });         // SI ES ADMINISTRADOR LO MANDO A PROGRAMACIONES
                }
              }else if(response.nivel === 9){
                if(this.$router.currentRoute.name != 'operaciones'){  // COMPARO LA RUTA EN LA QUE ME ENCUENTRO 
                  this.$router.push({ name: 'operaciones' })        // SI ES DIFERENTE A 1 LO TOMO COMO OPERADOR
                }
              }

              this.blocked = false;  // DESACTIVO BLOCKEO DE OVERLAY
            }).catch( error=>{    
              this.alerta = { activo: true, texto: error.bodyText, color:'error'}
              window.location.href = this.urlSistemaPrincipal;
            });  

          }).catch( error =>{
            // console.log('Error validacion', error.bodyText)
            window.location.href = this.urlSistemaPrincipal;
          })

          if(this.$router.currentRoute.name != 'flexografia'){  // COMPARO LA RUTA EN LA QUE ME ENCUENTRO 
            // console.log('Si esta bien')
            this.$router.push({ name: 'flexografia' });         // SI ES DIFERENTE ENRUTO A PAGINA ARRANQUE
          }

        }else{ 
            // console.log('NO HAY KEYLOG')
            window.location.href = this.urlSistemaPrincipal;
        }
    } else {
      // console.log('NO ES COMPATIBLE LOCAL')
      window.location.href = this.urlSistemaPrincipal;
    }
  },

  computed:{
    // IMPORTANDO USO DE VUEX - ZONAS (GETTERS)
    // ...mapGetters('Monedas' ,['getMonedas']), 
    ...mapGetters('Login' ,['getLogeado','getdatosUsuario']), 
  },

  mounted(){
    setTimeout(()=>{ this.loading = false; }, 5000);
  },

  methods:{
    // ...mapActions('Login' ,['salirLogin']), 
    ...mapActions('Login' ,['salirLogin','ObtenerDatosUsuario','validaSession']), 

    salir(){
      this.alerta = { activo: true, texto: `HASTA PRONTO ${ this.getdatosUsuario.nombre }`, color :'success'  };
      this.cerrar_sesion= false;
      this.salirLogin()
      this.$store.dispatch("salir")
    },


  }
};
</script>

<style scoped>
  #fondo{
      background: #af9cee36;  
      background: -webkit-linear-gradient(to right, #f76c7c, #af9cee9a);  
      background: linear-gradient(to right, hsla(353, 34%, 53%, 0.619), #554af5a0),url('http://producciongama.com:8080/CRM-GAMA-2020/imagenes/fondo2.jpg'); 
      background-attachment: fixed;
      background-size: cover;
      padding: 0px;
      margin: 0px;
      width: auto;
      height: 100%;
    }

  .color_fondo{
    background: #af9cee36;  
    background: -webkit-linear-gradient(to right, #f76c7ca3, #af9cee9a);  
    background: linear-gradient(to right, hsla(354, 30%, 57%, 0.619), #554af5a0); 
    background-attachment: fixed;
    background-size: cover;
  }

</style>



