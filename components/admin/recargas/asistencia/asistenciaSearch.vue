<template>
  <div>
    <el-drawer
      :before-close="closeModal"
      direction="ltr"
      :append-to-body="true"
      size="80%"
      :visible.sync="openAsistenciaSearch"
      :with-header="false"
      :show-close="true"
      :wrapperClosable="true"

      >
      <div class="container.is-fullhd">
        <div class="card p-2 m-2">
          <div class="columns">
            <div class="column">
              <div class="field">
                <label class="">Seleccione periodo de beneficio ({{recargas.length}})</label><br>
                <div class="select" :class="(loadingRecargas ? 'is-loading' : '')">
                  <select @change="selectRecarga" v-model="recarga_selected">
                    <option value="" selected disabled>-- Seleccione periodo --</option>
                    <option v-for="(recarga, index) in recargas" :key="index" :value="recarga.codigo">{{recarga ? `${recarga.codigo} - ${recarga.establecimiento.sigla} - Beneficio del ${recarga.mes_beneficio}/${recarga.anio_beneficio}` : `--`}}</option>
                  </select>
                </div>
              </div>
              <div class="field">
                <div class="control is-medium" :class="(loadingAsistencias ? 'is-loading' : '')">
                  <el-input
                    autofocus
                    placeholder="Buscar asistencia por rut, nombre o apellidos de funcionario"
                    v-model="input_query"
                    @keyup.native="keySearchInput"
                  >
                  </el-input>
                </div>
              </div>
              <div class="field" v-loading.fullscreen.lock="loadingAsistencias && !asistencias.length">
                <div class="table-container pt-2">
                  <span v-if="(pagination)" class="tag is-info is-light">{{ `${pagination.total} ${pagination.total > 1 ? `resultados` : `resultado`}` }}</span>
                  <template v-if="asistencias.length">
                    <table class="table is-striped is-narrow is-hoverable is-fullwidth" v-loading="loadingAsistencias" element-loading-text="Cargando asistencia...">
                      <thead>
                        <tr>
                          <th>Nombres</th>
                          <td v-for="(columna, index) in columnas" :key="index">
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
                          <td v-for="(tipo, index_2) in asistencia.asistencias_list" :key="index_2" :class="(tipo.exist_contrato ? 'has-background-danger-light' : '')">
                            <el-badge type="warning" :hidden="tipo.observaciones_count <= 0" :value="tipo.observaciones_count" class="item">
                              <span :class="(tipo.tipo_asistencia_turno.id === 3 ? 'has-text-danger has-text-weight-bold' : (tipo.tipo_asistencia_turno.id === 1 ? 'has-text-link' : 'has-text-primary') )">
                                <span :class="(tipo.exist_asistencia && tipo.tipo_asistencia_turno.nombre != 'X'  ? 'tag is-black' : (tipo.exist_asistencia && tipo.tipo_asistencia_turno.nombre === 'X' ? 'tag is-light' : ''))">{{tipo.tipo_asistencia_turno.nombre}}</span>
                              </span>
                            </el-badge>
                          </td>
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
                        <td>
                          <el-tooltip class="item" effect="dark" :content="`Total: ${asistencia.total_asistencia.libre.total_general}`" placement="right-start">
                            <span class="has-text-weight-bold" >{{asistencia.total_asistencia.libre.total_en_contrato}}</span>
                          </el-tooltip>
                        </td>
                        </tr>
                      </tbody>
                    </table>
                    <nav class="pagination is-rounded" role="navigation" aria-label="pagination">
                      <a class="pagination-previous" v-if="pagination.current_page > 1" @click.prevent="changePage(pagination.current_page - 1)">Volver</a>
                      <a class="pagination-next" v-if="pagination.current_page < pagination.last_page" @click.prevent="changePage(pagination.current_page + 1)">Siguiente pagina</a>
                      <ul class="pagination-list">
                        <li v-for="page in pagesNumber" :key="page" class="active">
                          <a class="pagination-link" :class="(page === isActived ? 'is-current-search' : '')" @click.prevent="changePage(page)" >{{page}}</a>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
export default {
  created(){
    this.getRecargasFuncionarioTurnante(this.$route.params.id);
    if(this.input_query.length > 0 && this.recarga_selected){
      this.current_page = 1;
      this.getAsistenciasRecarga();
    }
  },
  data(){
    return{
      setTimeoutBuscador:''
    };
  },
  computed:{
    ...mapGetters({
      funcionario:'recargas/asistenciaSearch/funcionario',
      recargas:'recargas/asistenciaSearch/recargas',
      filtroInput:'recargas/asistenciaSearch/filtroInput',
      loadingRecargas:'recargas/asistenciaSearch/loadingRecargas',
      loadingAsistencias:'recargas/asistenciaSearch/loadingAsistencias',
      pagination:'recargas/asistenciaSearch/pagination',
      offset:'recargas/asistenciaSearch/offset',
      columnas:'recargas/asistenciaSearch/columnas',
    }),
    recarga_selected:{
      get() {
        return this.$store.state.recargas.asistenciaSearch.recarga_selected;
      },
      set(newValue) {
        this.$store.commit('recargas/asistenciaSearch/SET_RECARGA_SELECTED', newValue);
      }
    },
    openAsistenciaSearch:{
      get() {
        return this.$store.state.recargas.asistenciaSearch.open_modal;
      },
      set(newValue) {
        this.$store.commit('recargas/asistenciaSearch/SET_MODAL', newValue);
      }
    },
    asistencias:{
      get() {
        return this.$store.state.recargas.asistenciaSearch.asistencias;
      },
      set(newValue) {
        this.$store.commit('recargas/asistenciaSearch/SET_ASISTENCIAS', newValue);
      }
    },
    input_query:{
      get() {
        return this.$store.state.recargas.asistenciaSearch.filtro.input;
      },
      set(newValue) {
        this.$store.commit('recargas/asistenciaSearch/SET_FILTRO_INPUT', newValue);
      }
    },
    current_page:{
      get() {
        return this.$store.state.recargas.asistenciaSearch.pagination.current_page;
      },
      set(newValue) {
        this.$store.commit('recargas/asistenciaSearch/SET_CURRENT_PAGE', newValue);
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
    openAsistenciaSearch:{
      get() {
        return this.$store.state.recargas.asistenciaSearch.open_modal;
      },
      set(newValue) {
        this.$store.commit('recargas/asistenciaSearch/SET_MODAL', newValue);
      }
    },
  },
  methods:{
    ...mapActions({
      getRecargasFuncionarioTurnante:'recargas/asistenciaSearch/getRecargasFuncionarioTurnante',
      getAsistenciasRecarga:'recargas/asistenciaSearch/getAsistenciasRecarga'
    }),
    selectRecarga:function(){
      this.getAsistenciasRecarga();
    },
    changePage:function(page){
      this.current_page = page;
      this.selectRecarga();
    },
    keySearchInput:function(){
      if(this.input_query.length > 1){
          this.current_page = 1;
          clearTimeout(this.setTimeoutBuscador);
          this.setTimeoutBuscador = setTimeout(this.selectRecarga, 500);
      }
    },
    closeModal:function(){
      this.openAsistenciaSearch = false;
    }
  },
}
</script>

<style>
  .pagination-link.is-current-search {
    background-color: hsl(0, 76%, 39%);
    color: #fff;
  }
</style>
