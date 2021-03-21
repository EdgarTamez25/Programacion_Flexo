<template>
  <v-main  class="pa-0 ma-2">
  <!-- <v-container> -->

    <v-row  justify="center">
      
      <v-col class="text-right">
        <v-btn dark color="pink" right small @click="expand = !expand" > 
          {{ !expand?'Mostrar menú' : 'Ocultar menú' }}
          <v-icon> {{ !expand?'expand_more': 'expand_less' }} </v-icon>
        </v-btn>
      </v-col>

      <v-col cols="12">
        <v-expand-transition>
          <v-card v-show="expand" class="pa-2"  >
            <v-row>
              <v-col  v-for="(item, i) in admin" :key="i" cols="12" sm="6" md="4" class="my-2">
                <v-hover>
                  <template v-slot="{ hover }">
                    <v-card 
                      class="mx-auto text-center padre  pa-1" :to="{name:'catalogo/scrap'}" 
                      :color="item.color" dark :elevation="hover ? 20 : 6" 
                    >
                    <v-card-text class="headline font-weight-bold hijo  " align="center"  >
                      {{ item.nombre }}
                    </v-card-text> <br>
                  </v-card>
                  </template>
                </v-hover>
              </v-col>
            </v-row>
          </v-card>
        </v-expand-transition>
      </v-col>


    </v-row>
  <!-- </v-container> -->
  </v-main>
</template>

<script>
// @ is an alias to /src

export default {
    name: 'menu_desplegable',
  data:()=>({
    expand: true,
    admin: [
              { id:1, nombre:'CATÁLOGO DE SCRAP', path:'catalogo/scrap', color:'green'},
              // { id:1, nombre:'CREAR SCRAP', path:'', color:'red'},
              { id:1, nombre:'MAQUINAS', path:'', color:'purple'},
              { id:1, nombre:'REPORTES', path:'', color:'blue'},
    ]

  })
}
</script>


<style >
  .padre {
    width: 100%;
    height: 2 00px;
  }

  .hijo {
    display: table-cell;
    vertical-align: middle;
  }
</style>
