<template>
    <div v-loading.fullscreen.lock="loadingSpinner" element-loading-text="Cargando datos..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.9)">
      <Hero :title="`Recarga #${$route.params.id} - Asistencia`" :subtitle="`${recarga.establecimiento != null ? recarga.establecimiento.nombre : ''} para el mes de ${recarga.mes} año ${recarga.anio}.`"  />
      <div class="container.is-fullhd">
          <MenuTotales  :recarga="recarga" />
          <ModalEditTurnoAsistencia :asistencia="asistenciaSelected" />
          <div class="card p-6 m-6">
            <MenuRecarga :codigo="$route.params.id" />
            <div class="columns">
                <div class="column">
                    <div class="table-container pt-2">
                        <template v-if="asistencias.length">
                            <table class="table is-striped is-narrow is-hoverable is-fullwidth" v-loading="loading" element-loading-text="Cargando asistencia...">
                                <thead>
                                    <tr>
                                        <th>Nombres</th>
                                        <td v-for="(columna, index) in columnas_asistencia" :key="index"><i>{{columna.nombre_columna}}</i></td>
                                        <th>TL</th>
                                        <th>TN</th>
                                        <th>DL</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(asistencia, index) in asistencias" :key="index">
                                        <td>{{asistencia.nombres}}</td>
                                        <td class="is-clickable" v-for="(tipo, index_2) in asistencia.asistencias_list" :key="index_2" :class="(indexClickedUsuario === index && indexClickedAsistencia === index_2 ? 'is-selected' : '')" @click.prevent="editAsistencia(index, index_2, tipo)"><span :class="(tipo.tipo_asistencia_turno.id === 3 ? 'has-text-danger has-text-weight-bold' : (tipo.tipo_asistencia_turno.id === 1 ? 'has-text-link' : 'has-text-primary') )">{{tipo.tipo_asistencia_turno.nombre}}</span></td>
                                        <td><strong>{{asistencia.total_turno_largo}}</strong></td>
                                        <td><strong>{{asistencia.total_turno_nocturno}}</strong></td>
                                        <td><span class="has-text-weight-bold" :class="(asistencia.total_dias_libres <= 0 || asistencia.total_dias_libres >= recarga.total_dias_mes ? 'has-text-white has-background-danger-dark' : '')">{{asistencia.total_dias_libres}}</span></td>
                                        <td><nuxt-link  :to="`/admin/recargas/${$route.params.id}/resumen/${asistencia.uuid}/asistencia`"><el-button size="mini" type="primary" icon="el-icon-view" circle></el-button></nuxt-link></td>
                                    </tr>
                                </tbody>
                            </table>
                        </template>
                        <template v-else>
                            <el-empty :image-size="90">
                                <div class="row" slot="description">
                                <div class="col-md-12"><span>Sin resultados...</span></div>
                                </div>
                            </el-empty>
                        </template>
                    </div>
                    <div class="columns is-centered">
                        <div class="column is-one-fifth" v-for="(tipo, index) in tiposAsistenciaTurnos" :key="index">
                            <span :class="(tipo.id === 3 ? 'has-text-danger' : (tipo.id === 1 ? 'has-text-link' : 'has-text-primary'))"><i class="el-icon-s-open"></i> {{tipo.descripcion}} ({{tipo.nombre}})</span>
                        </div>
                    </div>
                </div>
            </div>
          </div>
      </div>
    </div>
  </template>

  <script>
import {mapActions, mapGetters} from 'vuex';
import MenuRecarga from '../../../../../components/admin/recargas/MenuRecarga.vue';
import MenuTotales from '../../../../../components/admin/recargas/MenuTotales.vue';
import ModalEditTurnoAsistencia from '../../../../../components/admin/recargas/resumen/ModalEditTurnoAsistencia.vue';
  export default {
    components: { MenuTotales, MenuRecarga, ModalEditTurnoAsistencia },
      middleware: 'auth',
      head() {
          return {
              title: `Asistencia #${this.$route.params.id}`
          };
      },
      data(){
        return{
            columnas_asistencia:[],
            asistenciaSelected:'',
            indexClickedUsuario:undefined,
            indexClickedAsistencia:undefined,
        };
      },
      created() {
          this.getRecarga(this.$route.params.id);
          this.getAsistenciasRecarga(this.$route.params.id);
          this.getColumnsAsistencia();
          this.getTiposAsistenciaTurnos();
      },
      computed:{
        ...mapGetters({
            loadingSpinner: "recargas/recargas/fullScreenLoading",
            loading:'recargas/asistenciaResumen/loading',
            recarga: "recargas/recargas/recarga",
            turno:'recargas/asistencia/turno',
            asistencias:'recargas/asistenciaResumen/asistencias',
            tiposAsistenciaTurnos:'modulos/modulos/tiposAsistenciaTurnos'
          }),
      },
      methods:{
          ...mapActions({
              getTiposAsistenciaTurnos:'modulos/modulos/getTiposAsistenciaTurnos',
              getRecarga: "recargas/recargas/returnRecarga",
              getAsistenciasRecarga:'recargas/asistenciaResumen/getAsistenciasRecarga'
          }),
          async getColumnsAsistencia(){
            const url       = `/api/admin/modulos/columnas/asistencia/${this.$route.params.id}/resumen`;
            const response  = await this.$axios.$get(url);
            this.columnas_asistencia   = response;
        },
        changeColorSelected(index, index_2){
            if(this.indexClickedUsuario === undefined){
                this.indexClickedUsuario = index;
            }else if(this.indexClickedUsuario != index){
                this.indexClickedUsuario = index;
            }

            if(this.indexClickedAsistencia === undefined){
                this.indexClickedAsistencia = index_2;
            }else if(this.indexClickedAsistencia != index_2){
                this.indexClickedAsistencia = index_2;
            }


        },
        editAsistencia:function(index, index_2, asistencia){
            this.changeColorSelected(index, index_2);
            this.asistenciaSelected = asistencia;
            this.$store.commit('recargas/asistenciaResumen/SET_MODAL_EDIT', true);
            this.$store.commit('recargas/asistenciaResumen/SET_TIPO_ASISTENCIA_TURNO', this.asistenciaSelected.tipo_asistencia_turno.id);
        }
      }
  }
  </script>

  <style>

  </style>
