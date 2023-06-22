<template>
  <div>
    <div v-loading.fullscreen.lock="loadingSpinner" element-loading-text="Cargando datos..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.9)">
      <template v-if="recarga">
        <Hero namepage="Asignaciones" :recarga="recarga" />
      </template>
      <div class="container.is-fullhd">
        <MenuTotales  :recarga="recarga" />
        <div class="card p-2 m-2">
          <MenuRecarga :codigo="$route.params.id" :recarga="recarga" />
          <div class="columns">
            <div class="column">
              <div class="field">
                <div class="control is-medium is-loading">
                  <el-input
                      autofocus
                      placeholder="Buscar asignaciones por rut, nombre o apellidos de funcionario"
                      v-model="input_query"
                      @keyup.native="keySearchInput"
                      clearable>
                  </el-input>
                </div>
              </div>
              <div class="field">
                <div class="columns">
                    <div class="column">
                      <label class="label">Asignaciones</label>
                      <el-checkbox-group v-model="is_asignaciones" @change="actionGetAsignacionesQuery">
                        <el-checkbox label="3_turno">A. 3° turno</el-checkbox>
                        <el-checkbox label="b_turno">B. asignación turno</el-checkbox>
                        <el-checkbox label="4_turno">A. 4° turno</el-checkbox>
                      </el-checkbox-group>
                    </div>
                </div>
              </div>
              <div class="table-container pt-2" v-loading.fullscreen.lock="loadingTable && !asignaciones.length">
                <span v-if="(pagination)" class="tag is-info is-light">{{ `${pagination.total} ${pagination.total > 1 ? `resultados` : `resultado`}` }}</span>
                <template v-if="asignaciones.length">
                  <table class="table is-striped is-narrow is-hoverable is-fullwidth" v-loading="loadingTable" element-loading-text="Cargando resultados...">
                    <thead>
                      <tr>
                        <th>Nombres</th>
                        <th>Turno</th>
                        <th>Vigente</th>
                        <th>Proceso</th>
                        <th>Año/Mes</th>
                        <th>A. 3° turno</th>
                        <th>B. asignación turno</th>
                        <th>A. 4° turno</th>
                        <th>A. Turno</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(turno, index) in asignaciones" :key="index">
                        <td>{{turno.nombres}}</td>
                        <td>
                          <el-tag effect="dark" size="mini" :type="(turno.existe_funcionario ? turno.es_turnante_type : 'info')" disable-transitions>{{turno.existe_funcionario ? turno.es_turnante : '--'}}</el-tag>
                        </td>
                        <td><span class="tag" :class="(turno.existe_funcionario ? 'is-success' : 'is-danger')">{{ turno.existe_funcionario ? 'Si' : 'No' }}</span></td>
                        <td>{{turno.nombre_proceso}}</td>
                        <td>{{turno.anio}}/{{turno.mes}}</td>
                        <td><span :class="turno.asignacion_tercer_turno > 0 ? 'has-text-danger' : '' ">{{turno.asignacion_tercer_turno}}</span></td>
                        <td><span :class="turno.bonificacion_asignacion_turno > 0 ? 'has-text-danger' : '' ">{{turno.bonificacion_asignacion_turno}}</span></td>
                        <td><span :class="turno.asignacion_cuarto_turno > 0 ? 'has-text-danger' : '' ">{{turno.asignacion_cuarto_turno}}</span></td>
                        <td><el-tag effect="dark" size="mini" :type="turno.asignacion_turno ? 'warning' : 'success'" disable-transitions>{{`${turno.asignacion_turno ? 'Si' : 'No'}`}}</el-tag></td>
                        <td>
                          <nuxt-link v-if="turno.existe_funcionario" :to="`/admin/esquemas/${turno.esquema_uuid}/asignaciones`"><el-button size="mini" type="primary" icon="el-icon-view" circle></el-button></nuxt-link>
                        </td>
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
                <nav class="pagination is-rounded" role="navigation" aria-label="pagination">
                  <a class="pagination-previous" v-if="pagination.current_page > 1" @click.prevent="changePage(pagination.current_page - 1)">Volver</a>
                  <a class="pagination-next" v-if="pagination.current_page < pagination.last_page" @click.prevent="changePage(pagination.current_page + 1)">Siguiente pagina</a>
                  <ul class="pagination-list">
                    <li v-for="page in pagesNumber" :key="page" class="active">
                      <a class="pagination-link" :class="(page === isActived ? 'is-current' : '')" @click.prevent="changePage(page)" >{{page}}</a>
                    </li>
                  </ul>
                </nav>
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
export default {
  components: { MenuTotales, MenuRecarga },
  middleware: "auth",
  head() {
      return {
          title: `Asignaciones #${this.$route.params.id}`
      };
  },
  data(){
    return{
      setTimeoutBuscador:''
    };
  },
  created() {
    this.getRecarga(this.$route.params.id);
    this.getAsignaciones(this.$route.params.id);
  },
  computed: {
    ...mapGetters({
        loadingSpinner: "recargas/recargas/fullScreenLoading",
        recarga: "recargas/recargas/recarga",
        loadingTable:'recargas/asignacionesResumen/loadingTable',
        asignaciones:'recargas/asignacionesResumen/asignaciones',
        pagination:'recargas/asignacionesResumen/pagination',
        offset:'recargas/asignacionesResumen/offset'
    }),
    input_query:{
      get() {
        return this.$store.state.recargas.asignacionesResumen.filtro.input;
      },
      set(newValue) {
        this.$store.commit('recargas/asignacionesResumen/SET_FILTRO_INPUT', newValue);
      }
    },
    is_asignaciones:{
      get() {
        return this.$store.state.recargas.asignacionesResumen.filtro.is_asignaciones;
      },
      set(newValue) {
        this.$store.commit('recargas/asignacionesResumen/SET_FILTRO_IS_ASIGNACIONES', newValue);
      }
    },
    current_page:{
      get() {
        return this.$store.state.recargas.asignacionesResumen.pagination.current_page;
      },
      set(newValue) {
        this.$store.commit('recargas/asignacionesResumen/SET_CURRENT_PAGE', newValue);
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
    }
  },
  methods: {
    ...mapActions({
        getRecarga: "recargas/recargas/returnRecarga",
        getAsignaciones:'recargas/asignacionesResumen/getAsignaciones'
    }),
    keySearchInput:function(){
      if(this.input_query.length > 1){
          this.current_page = 1;
          clearTimeout(this.setTimeoutBuscador);
          this.setTimeoutBuscador = setTimeout(this.actionGetAsignaciones, 500);
      }
    },
    actionGetAsignacionesQuery:function(){
      this.current_page = 1;
      this.getAsignaciones(this.$route.params.id);
    },
    actionGetAsignaciones:function(){
      this.getAsignaciones(this.$route.params.id);
    },
    changePage(page) {
      this.current_page = page;
      this.actionGetAsignaciones();
    },
  }
}
</script>

<style>

</style>
