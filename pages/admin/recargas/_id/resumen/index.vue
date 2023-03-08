<template>
  <div v-loading.fullscreen.lock="loadingSpinner" element-loading-text="Cargando datos..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.9)">
    <template v-if="recarga">
      <Hero namepage="Tabla general de resumen de datos" :recarga="recarga" />
    </template>
    <div class="container.is-fullhd">
      <MenuTotales :recarga="recarga" />
      <ModalAddReajusteResumen :funcionario="funcionario_selected" :tipo_reajuste="tipo_reajuste" />
      <div class="card p-2 m-2">
        <MenuRecargaTablaResumen />
        <div class="columns">
          <div class="column">
            <div class="field">
              <div class="control is-medium is-loading">
                <el-input
                    autofocus
                    placeholder="Buscar funcionarios por rut, nombre o apellidos"
                    v-model="input_query"
                    @keyup.native="keySearchInput"
                    clearable>
                </el-input>
              </div>
            </div>
            <div class="table-container pt-2" v-loading.fullscreen.lock="loadingTablaResumen && pagination.total <= 0" element-loading-text="Cargando resultados...">
              <span v-if="(pagination)" class="tag is-info is-light">{{ `${pagination.total} ${pagination.total > 1 ? `resultados` : `resultado`}` }}</span>
              <template v-if="(pagination.total > 0)">
                <table class="table is-striped is-narrow is-hoverable is-fullwidth" v-loading="loadingTablaResumen" element-loading-text="Cargando resultados...">
                  <thead>
                    <tr>
                      <th>Beneficio</th>
                      <template v-if="!loadGrupoUno">
                        <th>Nombres</th>
                      </template>
                      <template v-else>
                        <th>Apellidos</th>
                      </template>
                      <th>Turno</th>
                      <th>Contrato</th>
                      <th>Turno L&N</th>
                      <template v-if="recarga.total_grupos">
                        <th>
                          <el-link :underline="false" :disabled="(recarga.total_grupos.grupo_uno.total_ausentismos > 0 ? false : true)" @click.prevent="openGrupo(1)" :type="loadGrupoUno ? 'warning' : 'info' ">{{recarga.total_grupos.grupo_uno.nombre}} <i :class="loadGrupoUno ? 'el-icon-minus' : 'el-icon-plus' "></i></el-link>
                        </th>
                        <template v-if="loadGrupoUno">
                          <td v-for="(tipo, index) in recarga.total_grupos.grupo_uno.data" :key="index">
                            <el-tooltip :content="tipo.nombre" placement="top">
                              <i>{{tipo.sigla}}</i>
                            </el-tooltip>
                          </td>
                        </template>
                        <th>
                          <el-link :underline="false" :disabled="(recarga.total_grupos.grupo_dos.total_ausentismos > 0 ? false : true)" @click.prevent="openGrupo(2)" :type="loadGrupoDos ? 'warning' : 'info' ">{{recarga.total_grupos.grupo_dos.nombre}} <i :class="loadGrupoDos ? 'el-icon-minus' : 'el-icon-plus' "></i></el-link>
                        </th>
                        <template v-if="loadGrupoDos">
                          <td v-for="(tipo, index) in recarga.total_grupos.grupo_dos.data" :key="index">
                            <el-tooltip :content="tipo.nombre" placement="top">
                              <i>{{tipo.sigla}}</i>
                            </el-tooltip>
                          </td>
                        </template>
                        <th>
                          <el-link :underline="false" :disabled="(recarga.total_grupos.grupo_tres.total_ausentismos > 0 ? false : true)" @click.prevent="openGrupo(3)" :type="loadGrupoTres ? 'warning' : 'info' ">{{recarga.total_grupos.grupo_tres.nombre}} <i :class="loadGrupoTres ? 'el-icon-minus' : 'el-icon-plus' "></i></el-link>
                        </th>
                        <template v-if="loadGrupoTres">
                          <td v-for="(tipo, index) in recarga.total_grupos.grupo_tres.data" :key="index">
                            <el-tooltip :content="tipo.nombre" placement="top">
                              <i>{{tipo.sigla}}</i>
                            </el-tooltip>
                          </td>
                        </template>
                      </template>
                      <th>Viá</th>
                      <th>Ajuste días</th>
                      <th>DC <i class="el-icon-star-on"></i></th>
                      <th>Ajuste montos</th>
                      <th>MC <i class="el-icon-star-on"></i></th>
                      <th>Opciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(funcionario, index) in funcionarios" :key="index">
                      <td>
                        <el-tooltip :content="`${!funcionario.beneficio ? `No` : `Si`}`" placement="top">
                            <el-switch v-loading.lock="loadingIndex && indexClickFuncionario === index" :disabled="loadingIndex" @change="editBeneficio(index, funcionario.id)" :active-value="!funcionario.beneficio" :inactive-value="funcionario.beneficio" inactive-color="#F1948A" active-color="#13ce66"></el-switch>
                        </el-tooltip>
                      </td>
                      <template v-if="!loadGrupoUno">
                        <td><span class="is-size-7">{{funcionario.nombre_completo}}</span></td>
                      </template>
                      <template v-else>
                        <td><span class="is-size-7">{{funcionario.apellidos}}</span></td>
                      </template>
                      <td>
                        <nuxt-link :to="`/admin/recargas/${funcionario.recarga_codigo}/resumen/${funcionario.uuid}/asistencia`">
                          <el-tag effect="dark" size="mini" :type="funcionario.es_turnante != null ? (funcionario.es_turnante ? 'warning' : 'primary') : 'danger' " disable-transitions>{{`${funcionario.es_turnante != null ? `${funcionario.es_turnante ? 'Si' : 'No'}` : `Error`}`}}</el-tag>
                        </nuxt-link>
                        </td>
                      <td>
                        <nuxt-link :to="`/admin/recargas/${funcionario.recarga_codigo}/resumen/${funcionario.uuid}/contratos`">
                            <p :class="(funcionario.contratos.total_dias_habiles_contrato === 0 || funcionario.contratos.total_dias_habiles_contrato  < recarga.total_dias_habiles_beneficio ? 'has-text-danger has-text-weight-semibold' : '')">{{ funcionario.contratos.total_dias_habiles_contrato }}</p>
                        </nuxt-link>
                      </td>
                      <td>
                      <nuxt-link :to="`/admin/recargas/${funcionario.recarga_codigo}/resumen/${funcionario.uuid}/asistencia`"><span :class="(funcionario.es_turnante && funcionario.dias_asistencia.total_turno > 0 ? 'has-text-success' : (funcionario.es_turnante && funcionario.dias_asistencia.total_turno <= 0 ? 'has-text-danger' : 'has-text-black'))">{{funcionario.dias_asistencia.total_turno}}</span></nuxt-link></td>
                      <td>
                        <el-tooltip :disabled="(funcionario.total_ausentismos.total_dias_grupo_uno.total_dias <= 0 ? true : false)" class="item" effect="dark" :content="`${funcionario.total_ausentismos.total_dias_grupo_uno.n_registros} ${funcionario.total_ausentismos.total_dias_grupo_uno.n_registros > 1 ? 'registros' : 'registro'}`" placement="top-start">
                          <nuxt-link :to="`/admin/recargas/${funcionario.recarga_codigo}/resumen/${funcionario.uuid}/ausentismos?grupo=1`">
                            <strong :class="funcionario.total_ausentismos.total_dias_grupo_uno.total_dias > recarga.total_dias_mes_calculo || funcionario.total_ausentismos.total_dias_grupo_uno.total_dias <= 0  ? 'has-text-danger' : 'has-text-success' ">{{funcionario.total_ausentismos.total_dias_grupo_uno.total_dias}}</strong>
                          </nuxt-link>
                        </el-tooltip>
                      </td>
                      <template v-if="loadGrupoUno">
                        <td v-for="(tipo, index) in funcionario.grupos_de_ausentismos.grupo_uno.tipos_ausentismos" :key="index"><span :class="(tipo.total_dias <= 0 ? 'has-text-danger' : 'has-text-success-dark has-text-weight-semibold')">{{tipo.total_dias}}</span></td>
                      </template>
                      <td>
                        <el-tooltip :disabled="(funcionario.total_ausentismos.total_dias_grupo_dos.total_dias <= 0 ? true : false)" class="item" effect="dark" :content="`${funcionario.total_ausentismos.total_dias_grupo_dos.n_registros} ${funcionario.total_ausentismos.total_dias_grupo_dos.n_registros > 1 ? 'registros' : 'registro'}`" placement="top-start">
                          <nuxt-link :to="`/admin/recargas/${funcionario.recarga_codigo}/resumen/${funcionario.uuid}/ausentismos?grupo=2`">
                            <strong :class="funcionario.total_ausentismos.total_dias_grupo_dos.total_dias > recarga.total_dias_mes_calculo || funcionario.total_ausentismos.total_dias_grupo_dos.total_dias <= 0  ? 'has-text-danger' : 'has-text-success' ">{{funcionario.total_ausentismos.total_dias_grupo_dos.total_dias}}</strong>
                          </nuxt-link>
                        </el-tooltip>
                      </td>
                      <template v-if="loadGrupoDos">
                        <td v-for="(tipo, index) in funcionario.grupos_de_ausentismos.grupo_dos.tipos_ausentismos" :key="index"><span :class="(tipo.total_dias <= 0 ? 'has-text-danger' : 'has-text-success-dark has-text-weight-semibold')">{{tipo.total_dias}}</span></td>
                      </template>
                      <td>
                        <el-tooltip :disabled="(funcionario.total_ausentismos.total_dias_grupo_tres.total_dias <= 0 ? true : false)" class="item" effect="dark" :content="`${funcionario.total_ausentismos.total_dias_grupo_tres.n_registros} ${funcionario.total_ausentismos.total_dias_grupo_tres.n_registros > 1 ? 'registros' : 'registro'}`" placement="top-start">
                          <nuxt-link :to="`/admin/recargas/${funcionario.recarga_codigo}/resumen/${funcionario.uuid}/ausentismos?grupo=3`">
                            <strong :class="funcionario.total_ausentismos.total_dias_grupo_tres.total_dias > recarga.total_dias_mes_calculo || funcionario.total_ausentismos.total_dias_grupo_tres.total_dias <= 0  ? 'has-text-danger' : 'has-text-success' ">{{funcionario.total_ausentismos.total_dias_grupo_tres.total_dias}}</strong>
                          </nuxt-link>
                        </el-tooltip>
                      </td>
                      <template v-if="loadGrupoTres">
                        <td v-for="(tipo, index) in funcionario.grupos_de_ausentismos.grupo_tres.tipos_ausentismos" :key="index"><span :class="(tipo.total_dias <= 0 ? 'has-text-danger' : 'has-text-success-dark has-text-weight-semibold')">{{tipo.total_dias}}</span></td>
                      </template>
                      <td>
                        <nuxt-link :to="`/admin/recargas/${funcionario.recarga_codigo}/resumen/${funcionario.uuid}/viaticos`">
                            <span :class="(funcionario.total_viaticos.total_dias > 0 ? 'has-text-danger-dark has-text-weight-semibold' : '')">{{ funcionario.total_viaticos.total_dias }}</span>
                        </nuxt-link>
                      </td>
                      <td style="border-bottom: 1px solid; border-color: rgb(14,109,184, 0.5);">
                        <div class="columns">
                          <div class="column is-one-quarter">
                            <el-badge :value="funcionario.total_ajuste_de_dias.n_registros" :max="10" class="item" type="warning" :hidden="(funcionario.total_ajuste_de_dias.n_registros > 0  ? false : true)">
                              <nuxt-link :to="`/admin/recargas/${funcionario.recarga_codigo}/resumen/${funcionario.uuid}/reajustes`"><span :class="(funcionario.total_ajuste_de_dias.n_registros  <= 0 ? 'has-text-dark' : 'has-text-danger has-text-weight-semibold')">{{funcionario.total_ajuste_de_dias.total_dias}}</span></nuxt-link>
                            </el-badge>
                          </div>
                          <div class="column">
                            <button  class="button is-small" @click.prevent="openModalAddReajuste(index, funcionario, 0)">
                              <span class="icon is-small">
                                <i class="el-icon-plus"></i>
                              </span>
                            </button>
                          </div>
                        </div>
                      </td>
                      <td><span :class="(funcionario.total.total_dias_cancelar <= 0 ||  funcionario.total.total_dias_cancelar < recarga.total_dias_habiles_beneficio ? 'has-text-danger' : (funcionario.total.total_dias_cancelar > recarga.total_dias_habiles_beneficio ? 'has-background-danger-dark has-text-weight-semibold has-text-white' : '') )">{{funcionario.total.total_dias_cancelar}}</span></td>
                      <td style="border-bottom: 1px solid; border-color: rgb(14,109,184, 0.5);">
                        <div class="columns">
                          <div class="column">
                            <el-badge :value="funcionario.total_ajustes_de_montos.n_registros" :max="10" class="item" type="warning" :hidden="(funcionario.total_ajustes_de_montos.n_registros > 0  ? false : true)">
                              <nuxt-link :to="`/admin/recargas/${funcionario.recarga_codigo}/resumen/${funcionario.uuid}/reajustes`"><span :class="(funcionario.total_ajustes_de_montos.n_registros <= 0 ? 'has-text-dark' : 'has-text-danger has-text-weight-semibold')">{{funcionario.total_ajustes_de_montos.total_monto_format}}</span></nuxt-link>
                            </el-badge>
                          </div>
                          <div class="column">
                            <button  class="button is-small" @click.prevent="openModalAddReajuste(index, funcionario, 1)">
                              <span class="icon is-small">
                                <i class="el-icon-plus"></i>
                              </span>
                            </button>
                          </div>
                        </div>
                      </td>
                      <td><strong :class="(funcionario.total.monto_total_cancelar <= 0 ? 'has-text-danger' : (funcionario.total.monto_total_cancelar > recarga.monto_estimado_no_turnante ? 'has-background-danger-dark has-text-weight-semibold has-text-white' : 'has-text-success'))">{{ funcionario.total.monto_total_cancelar_format }}</strong></td>
                      <td>
                        <nuxt-link  :to="`/admin/recargas/${funcionario.recarga_codigo}/resumen/${funcionario.uuid}/turnos`"><el-button size="mini" type="primary" icon="el-icon-view" circle></el-button></nuxt-link>
                        <el-tooltip class="item" effect="dark" content="Reajustes ingresados" placement="top-start">
                          <span><i class="el-icon-warning-outline has-text-danger"></i></span>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="Retroactivo" placement="top-start">
                          <strong class="has-text-danger">R</strong>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="Fechas entrelazadas" placement="top-start">
                          <strong class="has-text-danger">F</strong>
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
                      <a class="pagination-link" :class="(page === isActived ? 'is-current' : '')" @click.prevent="changePage(page)" >{{page}}</a>
                    </li>
                  </ul>
                </nav>
              </template>
            </div>
            <div class="buttons">
              <button class="button is-info is-light"><span>Descargar planilla</span><span><i class="el-icon-download"></i></span></button>
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
import MenuRecargaTablaResumen from '../../../../../components/admin/recargas/MenuRecargaTablaResumen.vue';
import MenuTotales from '../../../../../components/admin/recargas/MenuTotales.vue';
import ModalAddReajusteResumen from '../../../../../components/admin/recargas/reajustes/ModalAddReajusteResumen.vue';
import TheadResumen from '../../../../../components/admin/recargas/resumen/theadResumen.vue';

export default {
    middleware: "auth",
    head() {
        return {
            title: `Tabla resumen #${this.$route.params.id}`
        };
    },
    data(){
      return{
        beneficio:true,
        grupo_dos_open:false,
        grupo_tres_open:false,
        funcionario_selected:'',
        tipo_reajuste:null,
        setTimeoutBuscador:''
      };
    },
    created() {
        /* this.getRecarga(this.$route.params.id); */
        this.getFuncionarios(this.$route.params.id);
        /* this.getGruposAusentismos(); */

    },
    mounted(){
      this.createdValueGrupoUno();
      this.createdValueGrupoDos();
      this.createdValueGrupoTres();
    },
    computed: {
        ...mapGetters({
            loadingSpinner: "recargas/resumen/fullScreenLoading",
            loadingIndex:'recargas/resumen/loadingIndex',
            recarga: "recargas/resumen/recarga",
            grupos:'modulos/modulos/gruposAusentismos',
            funcionarios:'recargas/resumen/funcionarios',
            indexClickFuncionario:'recargas/resumen/indexClickFuncionario',
            loadGrupoUno:'recargas/cookies/loadGrupoUno',
            loadGrupoDos:'recargas/cookies/loadGrupoDos',
            loadGrupoTres:'recargas/cookies/loadGrupoTres',
            pagination:'recargas/resumen/pagination',
            offset:'recargas/resumen/offset',
            loadingTablaResumen:'recargas/resumen/loadingTablaResumen',
        }),
        input_query:{
          get() {
            return this.$store.state.recargas.resumen.filtro.input;
          },
          set(newValue) {
            this.$store.commit('recargas/resumen/SET_FILTRO_INPUT', newValue);
          }
        },
        index_click_funcionario:{
          get() {
            return this.$store.state.recargas.resumen.index_click_funcionario;
          },
          set(newValue) {
            this.$store.commit('recargas/resumen/SET_INDEX_CLICK_FUNCTIONARIO', newValue);
          }
        },
        current_page:{
          get() {
            return this.$store.state.recargas.resumen.pagination.current_page;
          },
          set(newValue) {
            this.$store.commit('recargas/resumen/SET_CURRENT_PAGE', newValue);
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
            getRecarga: "recargas/resumen/returnRecarga",
            getFuncionarios: "recargas/resumen/getFuncionarios",
            getGruposAusentismos: "modulos/modulos/getGruposAusentismos",
            changeBeneficioFuncionario:'recargas/resumen/changeBeneficioFuncionario',
            changeValueGrupoUno:'recargas/cookies/changeValueGrupoUno',
            createdValueGrupoUno:'recargas/cookies/createdValueGrupoUno',
            changeValueGrupoDos:'recargas/cookies/changeValueGrupoDos',
            createdValueGrupoDos:'recargas/cookies/createdValueGrupoDos',
            changeValueGrupoTres:'recargas/cookies/changeValueGrupoTres',
            createdValueGrupoTres:'recargas/cookies/createdValueGrupoTres',
        }),
        keySearchInput:function(){
            if(this.input_query.length > 1){
              this.current_page = 1;
              clearTimeout(this.setTimeoutBuscador);
              this.setTimeoutBuscador = setTimeout(this.actionGetFuncionarios, 800);
            }else if(this.input_query.length === 0){
              this.current_page = 1;
              clearTimeout(this.setTimeoutBuscador);
              this.setTimeoutBuscador = setTimeout(this.actionGetFuncionarios, 800);
            }
          },
        editBeneficio:function(index, funcionario_id){
          this.index_click_funcionario = index;
          let data = {
            user_id:funcionario_id,
            codigo_recarga:this.$route.params.id
          };
          this.changeBeneficioFuncionario(data);
        },
        openGrupo:function(value){
          if(value === 1){
            this.changeValueGrupoUno(!this.loadGrupoUno);
          }else if (value === 2){
            this.changeValueGrupoDos(!this.loadGrupoDos);
          }else if (value === 3){
            this.changeValueGrupoTres(!this.loadGrupoTres);
          }
        },
        openModalAddReajuste:function(index, funcionario, tipo_reajuste){
          this.funcionario_selected = funcionario;
          this.tipo_reajuste        = tipo_reajuste;
          this.$store.commit('recargas/resumen/SET_MODAL_REAJUSTE', true);
        },
        actionGetFuncionarios:function(){
          this.getFuncionarios(this.$route.params.id);
        },
        changePage(page) {
          this.current_page = page;
          this.actionGetFuncionarios();
        },
    },
    components: { MenuRecarga, MenuTotales, ModalAddReajusteResumen, TheadResumen, MenuRecargaTablaResumen }
}
</script>

<style>
  .reajuste {
    border-bottom: 1px solid;
  }
</style>
