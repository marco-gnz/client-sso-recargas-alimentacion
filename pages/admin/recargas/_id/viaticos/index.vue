<template>
  <div>
    <div v-loading.fullscreen.lock="loadingSpinner" element-loading-text="Cargando datos..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.9)">
      <template v-if="recarga">
        <Hero namepage="Viáticos" :recarga="recarga" />
      </template>
      <div class="container.is-fullhd">
        <MenuTotales  :recarga="recarga" />
        <div class="card p-2 m-2">
          <MenuRecarga :codigo="$route.params.id" :recarga="recarga" />
          <div class="columns">
            <div class="column">
              <div class="field">
                <div class="control is-medium">
                  <el-input
                      autofocus
                      placeholder="Buscar viáticos por rut, nombre o apellidos de funcionario"
                      v-model="input_query"
                      @keyup.native="keySearchInput"
                      >
                  </el-input>
                </div>
              </div>
              <div class="field">
                <div class="tabs is-toggle is-toggle-rounded is-small is-centered">
                  <div class="columns">
                    <div class="column">
                      <label class="label">Descuento turno libre</label>
                      <el-checkbox-group @change="actionGetViaticos" v-model="descuento_turno_libre_selected">
                        <el-checkbox :label="1">Si</el-checkbox>
                        <el-checkbox :label="0">No</el-checkbox>
                      </el-checkbox-group>
                    </div>
                    <div class="column">
                      <label class="label">Descuento</label>
                      <el-checkbox-group @change="actionGetViaticos" v-model="descuento">
                        <el-checkbox :label="1">Si</el-checkbox>
                        <el-checkbox :label="0">No</el-checkbox>
                      </el-checkbox-group>
                    </div>
                  </div>
                </div>
              </div>
              <div class="table-container pt-2">
                <span v-if="(pagination)" class="tag is-info is-light">{{ `${pagination.total} ${pagination.total > 1 ? `resultados` : `resultado`}` }}</span>
                <table class="table  is-narrow is-hoverable is-fullwidth" v-loading="loadingTable">
                  <thead>
                    <tr>
                      <th>Nombres</th>
                      <th>Turno</th>
                      <th>Vigente</th>
                      <th>Fechas</th>
                      <th>Fechas periodo</th>
                      <th>Días turnante</th>
                      <th>Días no turnante</th>
                      <th>Jornada</th>
                      <th>Tipo Comisión</th>
                      <th>Motivo</th>
                      <th>Valor</th>
                      <th>Descuento L y N</th>
                      <th></th>
                    </tr>
                  </thead>
                    <template v-if="(viaticos) && (viaticos.length)">
                      <tbody>
                        <tr v-for="(viatico, index) in viaticos" :key="index">
                          <td>{{ viatico.funcionario_nombres ? viatico.funcionario_nombres : '--'}}</td>
                          <el-tag effect="dark" size="mini" :type="(viatico.existe_funcionario ? viatico.es_turnante_type : 'info')" disable-transitions>{{viatico.existe_funcionario ? viatico.es_turnante : '--'}}</el-tag>
                          <td><span class="tag" :class="(viatico.existe_funcionario ? 'is-success' : 'is-danger')">{{ viatico.existe_funcionario ? 'Si' : 'No' }}</span></td>
                          <td>{{ viatico.fecha_inicio ? viatico.fecha_inicio : '--'}} / {{ viatico.fecha_termino ? viatico.fecha_termino : '--'}} (<strong>{{ viatico.total_dias }}</strong>d)</td>
                          <td>{{ viatico.fecha_inicio_periodo ? viatico.fecha_inicio_periodo : '--'}} / {{ viatico.fecha_termino_periodo ? viatico.fecha_termino_periodo : '--'}}</td>
                          <td>{{viatico.total_dias_periodo_turno}} / {{viatico.total_dias_habiles_periodo_turno}}</td>
                          <td>{{viatico.total_dias}} / {{viatico.total_dias_habiles_periodo}}</td>
                          <td>{{ viatico.jornada ? viatico.jornada : '--'}}</td>
                          <td>{{ viatico.tipo_comision ? viatico.tipo_comision : '--'}}</td>
                          <td>{{ viatico.motivo_viatico ? viatico.motivo_viatico : '--'}}</td>
                          <td :class="(viatico.valor_viatico <= 0 ? 'has-text-danger-dark' : 'has-text-success-dark')">{{ viatico.valor_viatico ? viatico.valor_viatico : '--'}}</td>
                          <td>{{viatico.descuento_turno_libre ? 'Si' : 'No'}}</td>
                          <td>
                              <nuxt-link v-if="viatico.existe_funcionario" :to="`/admin/esquemas/${viatico.esquema_uuid}/viaticos`"><el-button size="mini" type="primary" icon="el-icon-view" circle></el-button></nuxt-link>
                          </td>
                        </tr>
                      </tbody>
                    </template>
                    <template v-else>
                      <div class="columns">
                        <div class="column is-full">
                          <div class="tabs is-toggle is-toggle-rounded is-small is-centered">
                            <el-empty class="is-centered" description="Sin resultados" :image-size="100"></el-empty>
                          </div>
                        </div>
                      </div>
                    </template>
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
          title: `Viaticos #${this.$route.params.id}`
      };
  },
  data(){
    return{
      setTimeoutBuscador:''
    };
  },
  created() {
      this.getViaticos(this.$route.params.id);
  },
  computed: {
    ...mapGetters({
        loadingSpinner: "recarga/viaticos/main/fullScreenLoading",
        recarga: "recarga/viaticos/main/recarga",
        viaticos:'recarga/viaticos/main/viaticos',
        loadingTable:'recarga/viaticos/main/loadingTable',
        pagination:'recarga/viaticos/main/pagination',
        offset:'recarga/viaticos/main/offset'
    }),
    input_query:{
      get() {
        return this.$store.state.recarga.viaticos.main.filtro.input;
      },
      set(newValue) {
        this.$store.commit('recarga/viaticos/main/SET_FILTRO_INPUT', newValue);
      }
    },
    descuento_turno_libre_selected:{
      get() {
        return this.$store.state.recarga.viaticos.main.filtro.descuento_turno_libre;
      },
      set(newValue) {
        this.$store.commit('recarga/viaticos/main/SET_FILTRO_DESCUENTO_TURNO_LIBRE', newValue);
      }
    },
    descuento:{
      get() {
        return this.$store.state.recarga.viaticos.main.filtro.descuento;
      },
      set(newValue) {
        this.$store.commit('recarga/viaticos/main/SET_FILTRO_DESCUENTO', newValue);
      }
    },
    current_page:{
      get() {
        return this.$store.state.recarga.viaticos.main.pagination.current_page;
      },
      set(newValue) {
        this.$store.commit('recarga/viaticos/main/SET_CURRENT_PAGE', newValue);
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
        getViaticos:'recarga/viaticos/main/getViaticos'
    }),
    keySearchInput:function(){
      if(this.input_query.length > 1){
          this.current_page = 1;
          clearTimeout(this.setTimeoutBuscador);
          this.setTimeoutBuscador = setTimeout(this.actionGetViaticos, 500);
      }
    },
    actionGetViaticos:function(){
      this.getViaticos(this.$route.params.id);
    },
    changePage(page) {
      this.current_page = page;
      this.actionGetViaticos();
    },
  }
}
</script>

<style>

</style>
