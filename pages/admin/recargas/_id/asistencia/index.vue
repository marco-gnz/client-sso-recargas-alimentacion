<template>
  <div>
    <div v-loading.fullscreen.lock="loadingSpinner" element-loading-text="Cargando datos..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.9)">
      <template v-if="recarga">
        <Hero namepage="Planificación de turnos (Días libres)" :recarga="recarga" />
      </template>
      <AsistenciaSearch v-if="openAsistenciaSearch" />
      <div class="container.is-fullhd">
          <MenuTotales  :recarga="recarga" />
          <ModalEditTurnoAsistencia v-if="modalEditAsistencia" />
          <div class="card p-2 m-2">
            <MenuRecarga :codigo="$route.params.id" :recarga="recarga" />
            <div class="columns">
                <div class="column">
                  <div class="field">
                      <div class="control is-medium" :class="(loading ? 'is-loading' : '')">
                        <el-input
                          autofocus
                          placeholder="Buscar asistencia por rut, nombre o apellidos de funcionario"
                          v-model="input_query"
                          @keyup.native="keySearchInput"
                        >
                        </el-input>
                      </div>
                    </div>
                    <div class="field">
                      <div class="control">
                        <el-select v-model="input_recarga" size="small" class="element-style" placeholder="Seleccione periodo de beneficio" @change="getAsistenciaQuery">
                          <el-option
                            v-for="recarga in recargas"
                            :key="recarga.id"
                            :label="`${recarga.codigo} - ${recarga.mes_beneficio} ${recarga.anio_beneficio} - ${recarga.establecimiento ? recarga.establecimiento.sigla : '--'}`"
                            :value="recarga.codigo">
                          </el-option>
                        </el-select>
                      </div>
                    </div>
                    <div class="table-container pt-2" v-loading.fullscreen.lock="loading && !asistencias.length">
                      <span v-if="(pagination)" class="tag is-info is-light">{{ `${pagination.total} ${pagination.total > 1 ? `resultados` : `resultado`}` }}</span>
                        <template v-if="asistencias.length">
                            <table class="table is-striped is-narrow is-hoverable is-fullwidth" v-loading="loading" element-loading-text="Cargando asistencia...">
                                <thead>
                                    <tr>
                                        <th>Nombres</th>
                                        <td v-for="(columna, index) in columnasMes" :key="index">
                                          <el-tooltip :content="columna.descripcion" placement="top">
                                            <i :class="(columna.is_week_day ? 'has-text-danger' : '')">{{columna.nombre_columna}}</i>
                                          </el-tooltip>
                                        </td>
                                        <th>L</th>
                                        <th>N</th>
                                        <th>X</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(asistencia, index) in asistencias" :key="index">
                                        <td><span class="is-size-7">{{asistencia.nombres}}</span></td>
                                        <nuxt-link  tag="td" v-for="(tipo, index_2) in asistencia.asistencias_list" :key="index_2" :class="(tipo.exist_contrato && tipo.exist_ausentismo ? 'has-background-danger-light is-clickable' : (tipo.exist_contrato ? 'has-background-primary-light is-clickable' : (tipo.exist_ausentismo ? 'has-background-warning is-clickable' :  '')))" :event="(tipo.exist_contrato ? 'click' : '')"  :to="{path: `/admin/esquemas/${tipo.esquema_uuid}/turnos`}">
                                          <el-badge type="warning" :hidden="tipo.observaciones_count <= 0" :value="tipo.observaciones_count" class="item">
                                            <span :class="(tipo.tipo_asistencia_turno.id === 3 ? 'has-text-danger has-text-weight-bold' : (tipo.tipo_asistencia_turno.id === 1 ? 'has-text-link' : 'has-text-primary') )">
                                              <span :class="(tipo.exist_asistencia && tipo.tipo_asistencia_turno.nombre != 'X'  ? 'tag is-black' : (tipo.exist_asistencia && tipo.tipo_asistencia_turno.nombre === 'X' ? 'tag is-light' : ''))">{{tipo.tipo_asistencia_turno.nombre}}</span>
                                            </span>
                                          </el-badge>
                                        </nuxt-link>
                                        <td>
                                          <el-tooltip class="item" effect="dark" :content="`Total: ${asistencia.total_asistencia.largo.total_general}`" placement="right-start">
                                            <span class="has-text-weight-bold" >{{asistencia.total_asistencia.largo.total_en_contrato}}</span>
                                          </el-tooltip>
                                        </td>
                                        <td>
                                          <el-tooltip class="item" effect="dark" :content="`Total: ${asistencia.total_asistencia.nocturno.total_general}`" placement="right-start">
                                            <span class="has-text-weight-bold" >{{asistencia.total_asistencia.nocturno.total_en_contrato}}</span>
                                          </el-tooltip>
                                          </td>
                                        <td :class="(asistencia.total_asistencia.libre.total_en_contrato <= 0 || asistencia.total_asistencia.libre.total_en_contrato >= recarga.total_dias_mes_calculo ? 'has-text-white has-background-danger-dark' : '')">
                                          <el-tooltip class="item" effect="dark" :content="`Total: ${asistencia.total_asistencia.libre.total_general}`" placement="right-start">
                                            <span class="has-text-weight-bold" >{{asistencia.total_asistencia.libre.total_en_contrato}}</span>
                                          </el-tooltip>
                                        </td>
                                        <td>
                                          <el-button type="warning" size="mini" icon="el-icon-date" @click.native="openModalSearchAsistencia(index, asistencia)" circle></el-button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <nav class="pagination is-rounded" role="navigation" aria-label="pagination">
                              <a class="pagination-previous" v-if="pagination.current_page > 1" @click.prevent="changePage(pagination.current_page - 1)">Volver</a>
                              <a class="pagination-next" v-if="pagination.current_page < pagination.last_page" @click.prevent="changePage(pagination.current_page + 1)">Siguiente pagina</a>
                              <ul class="pagination-list">
                                <li v-for="page in pagesNumber" :key="page" class="active">
                                  <a class="pagination-link" :class="(page === isActived ? 'is-current' : '')" @click.prevent="changePage(page)" >{{page}}</a>
                                </li>
                              </ul>
                            </nav>
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
                    <div class="notification is-black is-light">
                      <div class="columns">
                        <div class="column">
                          <span class="has-text-primary has-text-weight-semibold">Contrato(s) en el periodo</span>.
                        </div>
                         <div class="column">
                          <span class="has-text-warning has-text-weight-semibold">Ausentismos(s) sin contrato en el periodo</span>.
                        </div>
                        <div class="column">
                          <span class="has-text-danger has-text-weight-semibold">Ausentismos(s) con contrato en el periodo</span>.
                        </div>
                      </div>
                      <div class="columns">
                        <div class="column">
                          <div class="notification is-warning is-light">
                            Ausentismos visualizados pertenecen al mismo año y mes de periodo de turnos filtrado. <br>
                            <strong>Ausentismos exclusivamente con descuento.</strong>
                          </div>
                        </div>
                      </div>
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
import AsistenciaSearch from '../../../../../components/admin/recargas/asistencia/asistenciaSearch.vue';
import MenuRecarga from '../../../../../components/admin/recargas/MenuRecarga.vue';
import MenuTotales from '../../../../../components/admin/recargas/MenuTotales.vue';
import ModalEditTurnoAsistencia from '../../../../../components/admin/recargas/resumen/ModalEditTurnoAsistencia.vue';
export default {
  components: { MenuTotales, MenuRecarga, ModalEditTurnoAsistencia, AsistenciaSearch },
  middleware: 'auth',
  head() {
      return {
          title: `Asistencia #${this.$route.params.id}`
      };
  },
  data(){
    return{
        indexClickedUsuario:undefined,
        indexClickedAsistencia:undefined,
        setTimeoutBuscador:'',
    };
  },
  created() {
      this.getRecargas();
      this.getRecarga(this.$route.params.id);
      this.getColumnsAsistenciaAction(this.input_recarga);
      this.getAsistenciasRecarga(this.input_recarga);
      this.getTiposAsistenciaTurnos();
      if(this.$route.query.id){
        this.modalEdit = true;
      }
  },
  computed:{
    ...mapGetters({
        modalEditAsistencia: "recargas/asistenciaResumen/modalEditAsistencia",
        loadingSpinner: "recargas/recargas/fullScreenLoading",
        loading:'recargas/asistenciaResumen/loading',
        recarga: "recargas/recargas/recarga",
        turno:'recargas/asistencia/turno',
        asistencias:'recargas/asistenciaResumen/asistencias',
        tiposAsistenciaTurnos:'modulos/modulos/tiposAsistenciaTurnos',
        pagination:'recargas/asistenciaResumen/pagination',
        offset:'recargas/asistenciaResumen/offset',
        columnasMes:'recargas/asistenciaResumen/columnasMes',
        recargas:'recargas/recargas/recargas',
      }),
      openAsistenciaSearch:{
        get() {
          return this.$store.state.recargas.asistenciaSearch.open_modal;
        },
        set(newValue) {
          this.$store.commit('recargas/asistenciaSearch/SET_MODAL', newValue);
        }
      },
      funcionarioSelected:{
        get() {
          return this.$store.state.recargas.asistenciaSearch.funcionario;
        },
        set(newValue) {
          this.$store.commit('recargas/asistenciaSearch/SET_FUNCIONARIO', newValue);
        }
      },
      current_page:{
        get() {
          return this.$store.state.recargas.asistenciaResumen.pagination.current_page;
        },
        set(newValue) {
          this.$store.commit('recargas/asistenciaResumen/SET_CURRENT_PAGE', newValue);
        }
      },
      isActived: function () {
          return this.pagination.current_page;
      },
      pagesNumber: function () {
          if (!this.pagination.to) {
              return [];
          }
          var from = this.pagination.current_page - this.offset;
          if (from < 1) {
              from = 1;
          }
          var to = from + (this.offset * 2);
          if (to >= this.pagination.last_page) {
              to = this.pagination.last_page;
          }
          var pagesArray = [];
          while (from <= to) {
              pagesArray.push(from);
              from++;
          }
          return pagesArray;
      },
      modalEdit:{
        get() {
          return this.$store.state.recargas.asistenciaResumen.modal_edit_asistencia;
        },
        set(newValue) {
          this.$store.commit('recargas/asistenciaResumen/SET_MODAL_EDIT', newValue);
        }
      },
      input_query:{
        get() {
          return this.$store.state.recargas.asistenciaResumen.filtro.input;
        },
        set(newValue) {
          this.$store.commit('recargas/asistenciaResumen/SET_FILTRO_INPUT', newValue);
        }
      },
      input_recarga:{
        get() {
          let codigo = this.$store.state.recargas.asistenciaResumen.filtro.recarga != '' ? this.$store.state.recargas.asistenciaResumen.filtro.recarga : this.$route.params.id;
          return codigo;
        },
        set(newValue) {
          this.$store.commit('recargas/asistenciaResumen/SET_FILTRO_RECARGA', newValue);
        }
      },
      input_query_search_modal:{
        get() {
          return this.$store.state.recargas.asistenciaSearch.filtro.input;
        },
        set(newValue) {
          this.$store.commit('recargas/asistenciaSearch/SET_FILTRO_INPUT', newValue);
        }
      },
      /* recargas:{
        get() {
          return this.$store.state.recargas.asistenciaResumen.recargas;
        },
        set(newValue) {
          this.$store.commit('recargas/asistenciaSearch/SET_FILTRO_INPUT', newValue);
        }
      }, */
  },
  methods:{
      ...mapActions({
          getRecargas: 'recargas/recargas/getRecargas',
          getTiposAsistenciaTurnos:'modulos/modulos/getTiposAsistenciaTurnos',
          getRecarga: "recargas/recargas/returnRecarga",
          getAsistenciasRecarga:'recargas/asistenciaResumen/getAsistenciasRecarga',
          getColumnsAsistencia:'recargas/asistenciaResumen/getColumnsAsistencia',
      }),
      getAsistenciaQuery:function(){
        this.getColumnsAsistencia(this.input_recarga);
        this.getAsistenciasRecarga(this.input_recarga);
      },
      getColumnsAsistenciaAction:function(codigo_recarga){
        this.getColumnsAsistencia(codigo_recarga);
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
    keySearchInput:function(){
      if(this.input_query.length > 1){
          this.current_page = 1;
          clearTimeout(this.setTimeoutBuscador);
          this.setTimeoutBuscador = setTimeout(this.actionGetAsistencia, 500);
      }
    },
    actionGetAsistencia:function(){
      this.getAsistenciasRecarga(this.input_recarga);
    },
    changePage:function(page){
      this.current_page = page;
      this.getAsistenciaQuery();
    },
    openModalSearchAsistencia:function(index, funcionario){
      this.funcionarioSelected = funcionario;
      this.input_query_search_modal = funcionario.rut_completo;
      this.openAsistenciaSearch = true;
    },
    editAsistencia:function(index, index_2, asistencia){
      if(asistencia.exist_contrato){
        this.changeColorSelected(index, index_2);
        this.$store.commit('recargas/asistenciaResumen/SET_MODAL_EDIT', true);
      }
    }
  }
}
</script>

<style>

</style>
