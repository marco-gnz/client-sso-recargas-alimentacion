<template>
  <div>
    <div v-loading.fullscreen.lock="loadingSpinner" element-loading-text="Cargando datos..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.9)">
      <template v-if="recarga">
        <Hero namepage="Contratos vigentes" :recarga="recarga" />
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
                      placeholder="Buscar contratos por rut, nombre o apellidos de funcionario"
                      v-model="input_query"
                      @keyup.native="keySearchInput"
                      clearable>
                  </el-input>
                </div>
              </div>
              <div class="table-container pt-2">
                <span v-if="(pagination)" class="tag is-info is-light">{{ `${pagination.total} ${pagination.total > 1 ? `resultados` : `resultado`}` }}</span>
                <table class="table  is-narrow is-hoverable is-fullwidth" v-loading="loadingTable" >
                  <thead>
                    <tr>
                      <th>Nombres</th>
                      <th>Turno</th>
                      <th>Fecha contrato</th>
                      <th>Fecha en periodo</th>
                      <th>Días hábiles</th>
                      <th>Unidad</th>
                      <th>Cargo</th>
                      <th>Ley</th>
                      <th>Horas</th>
                      <th>Alejamiento</th>
                      <th>C. costo</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-if="(contratos) && (contratos.length)">
                      <tr v-for="(contrato, index) in contratos" :key="index">
                        <td>{{ contrato.funcionario_nombres}}</td>
                        <td>
                          <el-tag effect="dark" size="mini" :type="(contrato.existe_funcionario ? contrato.es_turnante_type : 'info')" disable-transitions>{{contrato.existe_funcionario ? contrato.es_turnante : '--'}}</el-tag>
                        </td>
                        <td>{{ contrato.fecha_inicio ? contrato.fecha_inicio : '--'}} / {{ contrato.fecha_termino ? contrato.fecha_termino : '--'}}</td>
                        <td class="has-text-weight-semibold">{{ contrato.fecha_inicio_periodo ? contrato.fecha_inicio_periodo : '--'}} / {{ contrato.fecha_termino_periodo ? contrato.fecha_termino_periodo : '--'}} ({{ contrato.total_dias_contrato_periodo }})</td>
                        <td class="has-text-weight-semibold" :class="(contrato.total_dias_habiles_contrato_periodo <= 0 ? 'has-text-danger-dark' : '')">{{ contrato.total_dias_habiles_contrato_periodo }}</td>
                        <td>{{ contrato.unidad_nombre ? contrato.unidad_nombre : '--'}}</td>
                        <td>{{ contrato.cargo_nombre ? contrato.cargo_nombre : '--'}}</td>
                        <td>{{ contrato.ley_nombre ? contrato.ley_nombre : '--'}}</td>
                        <td>{{ contrato.hora_nombre ? contrato.hora_nombre : '--'}}</td>
                        <td><span :class="(contrato.alejamiento ? 'tag is-danger is-light' : '')">{{ contrato.alejamiento ? 'Si' : '--' }} </span></td>
                        <td>{{contrato.centro_costo ? contrato.centro_costo : '--'}}</td>
                        <td>
                          <nuxt-link  :to="`/admin/esquemas/${contrato.esquema_uuid}/contratos`"><el-button size="mini" type="primary" icon="el-icon-view" circle></el-button></nuxt-link>
                        </td>
                      </tr>
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
    middleware: "auth",
    head() {
        return {
            title: `Contratos #${this.$route.params.id}`
        };
    },
    data(){
      return{
        setTimeoutBuscador:''
      };
    },
    created() {
        this.getRecarga(this.$route.params.id);
        this.getContratos(this.$route.params.id);
    },
    computed: {
        ...mapGetters({
            loadingSpinner: "recargas/recargas/fullScreenLoading",
            recarga: "recargas/recargas/recarga",
            contratos: "recargas/contratos/contratos",
            loadingTable:'recargas/contratos/loadingTable',
            pagination:'recargas/contratos/pagination',
            offset:'recargas/contratos/offset'
        }),
        input_query:{
          get() {
            return this.$store.state.recargas.contratos.filtro.input;
          },
          set(newValue) {
            this.$store.commit('recargas/contratos/SET_FILTRO_INPUT', newValue);
          }
        },
        current_page:{
          get() {
            return this.$store.state.recargas.contratos.pagination.current_page;
          },
          set(newValue) {
            this.$store.commit('recargas/contratos/SET_CURRENT_PAGE', newValue);
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
            getContratos:"recargas/contratos/getContratos"
        }),
        keySearchInput:function(){
          if(this.input_query.length > 1){
              this.current_page = 1;
              clearTimeout(this.setTimeoutBuscador);
              this.setTimeoutBuscador = setTimeout(this.actionGetContratos, 500);
          }
        },
        actionGetContratos:function(){
          this.getContratos(this.$route.params.id);
        },
        changePage(page) {
          this.current_page = page;
          this.actionGetContratos();
        },
    },
    components: { MenuTotales, MenuRecarga }
}
</script>

<style>

</style>
