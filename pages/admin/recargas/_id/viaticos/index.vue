<template>
  <div>
    <div v-loading.fullscreen.lock="loadingSpinner" element-loading-text="Cargando datos..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.9)">
      <template v-if="recarga">
        <Hero namepage="Viáticos" :recarga="recarga" />
      </template>
      <div class="container.is-fullhd">
        <MenuTotales  :recarga="recarga" />
        <div class="card p-2 m-2">
          <MenuRecarga :codigo="$route.params.id" />
          <div class="columns">
            <div class="column">
              <div class="field">
                <div class="control is-medium is-loading">
                  <el-input
                      autofocus
                      placeholder="Buscar viáticos por rut, nombre o apellidos de funcionario"
                      v-model="input_query"
                      @keyup.native="keySearchInput"
                      clearable>
                  </el-input>
                </div>
              </div>
              <div class="table-container pt-2">
                <span v-if="(pagination)" class="tag is-info is-light">{{ `${pagination.total} ${pagination.total > 1 ? `resultados` : `resultado`}` }}</span>
                <table class="table  is-narrow is-hoverable is-fullwidth" v-loading="loadingTable">
                  <thead>
                    <tr>
                      <th>Nombres</th>
                      <th>Fechas</th>
                      <th>Fechas periodo</th>
                      <th>Días habiles</th>
                      <th>Jornada</th>
                      <th>Tipo Comisión</th>
                      <th>Motivo</th>
                      <th>Valor</th>
                      <th></th>
                    </tr>
                  </thead>
                    <template v-if="(viaticos) && (viaticos.length)">
                      <tbody>
                        <tr v-for="(viatico, index) in viaticos" :key="index">
                          <td>{{ viatico.funcionario_nombres ? viatico.funcionario_nombres : '--'}}</td>
                          <td>{{ viatico.fecha_inicio ? viatico.fecha_inicio : '--'}} / {{ viatico.fecha_termino ? viatico.fecha_termino : '--'}} (<strong>{{ viatico.total_dias }}</strong>d)</td>
                          <td>{{ viatico.fecha_inicio_periodo ? viatico.fecha_inicio_periodo : '--'}} / {{ viatico.fecha_termino_periodo ? viatico.fecha_termino_periodo : '--'}}</td>
                          <td class="has-text-weight-semibold" :class="(viatico.total_dias_habiles_periodo <= 0 ? 'has-text-danger-dark' : '')">{{ viatico.total_dias_habiles_periodo }}</td>
                          <td>{{ viatico.jornada ? viatico.jornada : '--'}}</td>
                          <td>{{ viatico.tipo_comision ? viatico.tipo_comision : '--'}}</td>
                          <td>{{ viatico.motivo_viatico ? viatico.motivo_viatico : '--'}}</td>
                          <td :class="(viatico.valor_viatico <= 0 ? 'has-text-danger-dark' : 'has-text-success-dark')">{{ viatico.valor_viatico ? viatico.valor_viatico : '--'}}</td>
                          <td>
                            <nuxt-link  :to="`/admin/recargas/${$route.params.id}/resumen/${viatico.funcionario_uuid}/viaticos`"><el-button size="mini" type="primary" icon="el-icon-view" circle></el-button></nuxt-link>
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
      this.getRecarga(this.$route.params.id);
      this.getViaticos(this.$route.params.id);
  },
  computed: {
    ...mapGetters({
        loadingSpinner: "recargas/recargas/fullScreenLoading",
        recarga: "recargas/recargas/recarga",
        viaticos:'recargas/viaticos/viaticos',
        loadingTable:'recargas/viaticos/loadingTable',
        pagination:'recargas/viaticos/pagination',
        offset:'recargas/viaticos/offset'
    }),
    input_query:{
      get() {
        return this.$store.state.recargas.viaticos.filtro.input;
      },
      set(newValue) {
        this.$store.commit('recargas/viaticos/SET_FILTRO_INPUT', newValue);
      }
    },
    current_page:{
      get() {
        return this.$store.state.recargas.viaticos.pagination.current_page;
      },
      set(newValue) {
        this.$store.commit('recargas/viaticos/SET_CURRENT_PAGE', newValue);
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
        getViaticos:'recargas/viaticos/getViaticos'
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
