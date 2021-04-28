<template>
  <v-main class="pa-0 ma-3">
    <v-row justify="center">
      <v-col cols="12">

        <v-snackbar v-model="alerta.activo" multi-line vertical top right :color="alerta.color" > 
          <strong> {{alerta.text}} </strong>
          <template v-slot:action="{ attrs }">
            <v-btn color="white" text @click="alerta.activo = false" v-bind="attrs"> Cerrar </v-btn>
          </template>
        </v-snackbar>

        <v-card outlined class="pa-3">
          <v-row class="pa-1 py-0">
						<v-col cols="12"  md="6" >
							<v-card-actions class="font-weight-black headline  py-0 mt-1 " > DIGITAL  </v-card-actions>
						</v-col>

						<v-col cols="12" sm="4" md="2">
							<v-select
                v-model="estatus" :items="Estatus" item-text="nombre" item-value="id"  dense
                 hide-details  placeholder="Estatus " return-object outlined append-icon="mdi-circle-slice-5"
              ></v-select> 
						</v-col>


						<v-col cols="6" sm="4" md="2" > <!-- FECHA DE COMPROMISO -->
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

						<v-col cols="6" sm="4" md="2"  > <!-- FECHA DE COMPROMISO -->
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

          <v-card-actions class="">
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Buscar"
              hide-details
            ></v-text-field>
            <v-spacer></v-spacer>
            <!-- <v-btn  dark color="rosa" @click="validaInformacion()" v-if="estatus.id === 1"> PROCESAR INFORMACIÓN </v-btn> -->
            <!-- <v-btn  dark color="green" @click="ImprimirExcel()"> <v-icon >mdi-microsoft-excel </v-icon> </v-btn> -->
            <v-btn  class="gris" icon dark @click="init()" ><v-icon>refresh</v-icon> </v-btn>
          </v-card-actions>

          <v-data-table
            :headers="headers"
            :items="Digital"
            item-key="id"
            class="font-weight-black "
            fixed-header
            hide-default-footer
            :height="tamanioPantalla"
            :loading ="Loading"
            :page.sync="page"
            :items-per-page="itemsPerPage"
            @page-count="pageCount = $event"
          >
            <template v-slot:item.id_det_ot="{ item }">
              <span v-if="item.urgencia === 1"  class="black--text"> {{ item.id_det_ot }} </span>
              <span v-if="item.urgencia === 2" class="orange--text"> {{ item.id_det_ot}} </span>
              <span v-if="item.urgencia === 3" class="error--text"> {{ item.id_det_ot}} </span>
            </template>
            <template v-slot:item.codigo="{ item }">
              <span v-if="item.urgencia === 1"  class="black--text"> {{ item.codigo }} </span>
              <span v-if="item.urgencia === 2" class="orange--text"> {{ item.codigo}} </span>
              <span v-if="item.urgencia === 3" class="error--text"> {{ item.codigo}} </span>
            </template>
            <template v-slot:item.cantidad="{ item }">
              <span v-if="item.urgencia === 1"  class="black--text"> {{ item.cantidad }} </span>
              <span v-if="item.urgencia === 2" class="orange--text"> {{ item.cantidad}} </span>
              <span v-if="item.urgencia === 3" class="error--text"> {{ item.cantidad}} </span>
            </template>
            <template v-slot:item.nomcli="{ item }">
              <span v-if="item.urgencia === 1"  class="black--text"> {{ item.nomcli }} </span>
              <span v-if="item.urgencia === 2" class="orange--text"> {{ item.nomcli}} </span>
              <span v-if="item.urgencia === 3" class="error--text"> {{ item.nomcli}} </span>
            </template>
            <template v-slot:item.solicitante="{ item }">
              <span v-if="item.urgencia === 1"  class="black--text"> {{ item.solicitante }} </span>
              <span v-if="item.urgencia === 2" class="orange--text"> {{ item.solicitante}} </span>
              <span v-if="item.urgencia === 3" class="error--text"> {{ item.solicitante}} </span>
            </template>

            <template v-slot:item.urgencia="{ item }">
              <v-btn text v-if="item.urgencia === 1" class="black--text" align="lef"> NORMAL </v-btn>
              <v-btn text v-if="item.urgencia === 2" color="orange"> URGENTE </v-btn>
              <v-btn text v-if="item.urgencia === 3" color="error"> PRIORIDAD </v-btn>
            </template>

            <template v-slot:item.creacion="{ item }">
              <span v-if="item.urgencia === 1"  class="black--text">  {{  moment(item.creacion).format('LL') }} </span>
              <span v-if="item.urgencia === 2" class="orange--text"> {{  moment(item.creacion).format('LL') }} </span>
              <span v-if="item.urgencia === 3" class="error--text">  {{  moment(item.creacion).format('LL') }} </span>
            </template>

            <template v-slot:item.maquina="props" >
              <v-edit-dialog :return-value.sync="props.item.id_maquina" @save="guardarMaquina(props.item)" large>
                  {{ props.item.maquina }}
                <template v-slot:input >
                  <v-card-text class="pa-0 mt-5" >
                    <v-select
                      :items="maquinas"
                      item-text="nombre"
                      item-value="id"
                      label="Maquinas"
                      hide-details
                      v-model="props.item.id_maquina"
                    ></v-select>
                  </v-card-text >
                </template>
              </v-edit-dialog>
            </template>
            <template v-slot:item.finalizacion="{ item }" v-if="estatus.id === 1">
              <v-btn color="rosa" dark small @click="alertaFinalizacion =true; productoAFinalizar = item "> FINALIZAR </v-btn>
            </template>

            <template v-slot:item.finalizacion="{ item }" v-else>
              <span v-if="item.urgencia === 1"  class="black--text"> {{  moment(item.finalizacion).format('LL') }} </span>
              <span v-if="item.urgencia === 2" class="orange--text"> {{  moment(item.finalizacion).format('LL') }} </span>
              <span v-if="item.urgencia === 3" class="error--text">  {{  moment(item.finalizacion).format('LL') }} </span>
            </template>
          </v-data-table>
        </v-card>
        	<!-- PAGINACION -->
				<div class="text-center pt-2">
					<v-pagination v-model="page" :length="pageCount"></v-pagination>
				</div>
      </v-col>

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

    </v-row>
  </v-main>
</template>

<script>
  var moment = require('moment'); moment.locale('es') /// inciar Moment 
	import  metodos from '@/mixins/metodos.js';
  import {mapGetters, mapActions} from 'vuex';
  import overlay     from '@/components/overlay.vue';


  export default {
		mixins:[metodos],
    components: {
      overlay,
		},
    data:() =>({
      page: 1,
      pageCount: 0,
      itemsPerPage: 20,
      search: '',
      singleSelect: false,
      selected: [],

      estatus: {  id: 1, nombre:'Pendiente'},
      Estatus:[ { id: 1, nombre:'Pendiente'},
                { id: 3, nombre:'Terminado'},
              ],
      maquina: { id: null, nombre:''},
      maquinas: [],

      sucursal:{ id:null, nombre:''},
      // sucursales:[],	
      // urgencias:[{id:1, nombre:'NORMAL'},{id:2, nombre:'URGENTE'},{ id:3, nombre:'PRIORIDAD'}],
      fecha1:moment().subtract(1, 'months').startOf('month').format("YYYY-MM-DD"), 
      fechamodal1:false,
      fecha2: moment().subtract('months').endOf('months').format("YYYY-MM-DD"),
      fechamodal2:false,

      productoAFinalizar: {},
      alertaFinalizacion: false,

      overlay: false,
      alerta: { 
        activo: false,
        text: '',
        color: 'error',
      },


      headers: [
          { text: '#Partida'    , align: 'start' , value: 'id_det_ot'   },
          { text: 'Producto'    , align: 'start' , value: 'codigo'      },
          { text: 'Cantidad'    , align: 'left'  , value: 'cantidad'    },
          { text: 'Cliente'     , align: 'left'  , value: 'nomcli'      },
          { text: 'Urgencia'    , align: 'left'  , value: 'urgencia'    },
          { text: 'Fecha'       , align: 'left'  , value: 'creacion'    },
          { text: 'Estación'    , align: 'left'  , value: 'maquina'  },
          { text: 'Finalización', align: 'left'  , value: 'finalizacion'  },
        ],
    }),

    created(){
      // this.consultaDepartamentos();
			this.consultarSucursales(); //MANDO A CONSULTAR SUCURSALES A MIXINS
      this.consultar_Maqinas_Depto(3);
      this.sucursal = { id: this.getdatosUsuario.id_sucursal }

      if(this.Parametros_Digital.length){
				this.estatus  = { id: this.Parametros_Digital.estatus };
				this.fecha1   = this.Parametros_Digital.fecha1;
				this.fecha2   = this.Parametros_Digital.fecha2;
			}
      this.init();
    },

    watch:{
			fecha1(){
				this.init();
			},

			fecha2(){
				this.init();
			},

			depto(){
				this.init()
			},
			estatus(){
				this.init()
			},

		},

    computed:{
			...mapGetters('PrograDepto' ,['Loading','Parametros_Digital','Digital']), // IMPORTANDO USO DE VUEX - (GETTERS)
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
      ...mapActions('PrograDepto' ,['obtener_Programaciones_Digital','finalizar_Producto_Digital']), 

      init(){
        const payload = new Object();
							payload.estatus     = this.estatus.id;
							payload.id_sucursal = this.sucursal.id;
							payload.fecha1      = this.fecha1;
							payload.fecha2      = this.fecha2;
        
        this.obtener_Programaciones_Digital(payload)
      },

      finalizarOT(){
        this.alertaFinalizacion = false; this.overlay = true

        const payload = new Object({
          finalizacion : this.traerFechaActual() + ' ' + this.traerHoraActual(),   
          estatus      : 3,
          id           : this.productoAFinalizar.id,
          id_ot        : this.productoAFinalizar.id_ot,
					id_det_ot		 : this.productoAFinalizar.id_det_ot

        })

        this.finalizar_Producto_Digital(payload).then(response =>{
          this.alerta = { activo: true, text:response.bodyText, color:'green'};
          this.init();
        }).catch(error =>{
          this.alerta = { activo: true, text:error.bodyText, color:'error'};
        }).finally(()=>{
          this.overlay = false
        })

      },

      guardarMaquina(item){
        this.$http.put('actualiza.maquina.digital/'+ item.id, item);
        this.init();
      }
    }




  }
</script>