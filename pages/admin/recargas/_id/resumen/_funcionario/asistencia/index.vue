<template>
  <div>
    <div v-loading.fullscreen.lock="loadingSpinner" element-loading-text="Cargando datos..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.9)">
      <template v-if="(funcionario)">
        <HeroUser namepage="Planificación de turnos (Días libres)" :funcionario="funcionario" :recarga="recarga" />
      </template>
      <div class="container.is-fullhd">
          <MenuTotalesFuncionario :funcionario="funcionario" />
          <ModalEditTurnoAsistencia v-if="modalEditAsistencia" />
          <div class="card p-6 m-6">
              <MenuFuncionario />
                  <div class="columns">
                      <div class="column">
                          <div class="table-container pt-2">

                              <template v-if="(asistencias) && (asistencias.length) && (asistencias[0].asistencias_list) && (asistencias[0].asistencias_list.length)">
                                  <table class="table is-striped is-narrow is-hoverable is-fullwidth" v-loading="loadingTableAsistencia" element-loading-text="Cargando asistencia...">
                                      <thead>
                                          <tr>
                                              <td v-for="(columna, index) in columnas_asistencia" :key="index">
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
                                              <nuxt-link tag="td" v-for="(tipo, index) in asistencia.asistencias_list" :key="index" :class="(indexClickedAsistencia === index ? 'is-selected' : (tipo.exist_contrato ? 'has-background-danger-light is-clickable' : ''))" :event="(tipo.exist_contrato ? 'click' : '')" @click.native="editAsistencia(index, tipo)" :to="{path: `/admin/recargas/${$route.params.id}/resumen/${$route.params.funcionario}/asistencia`, query: { id: tipo.uuid }}">
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
                          <div class="notification is-black is-light">
                            <div class="columns">
                              <div class="column">
                                Días destacados en color <span class="has-text-danger has-text-weight-semibold">rojo</span>, representan contrato(s) en el periodo.
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
import MenuFuncionario from '../../../../../../../components/admin/recargas/MenuFuncionario.vue';
import MenuTotalesFuncionario from '../../../../../../../components/admin/recargas/MenuTotalesFuncionario.vue';
import ModalEditTurnoAsistencia from '../../../../../../../components/admin/recargas/resumen/ModalEditTurnoAsistencia.vue';
export default {
  components: { MenuTotalesFuncionario, MenuFuncionario, ModalEditTurnoAsistencia },
    middleware: "auth",
    head() {
      return {
          title: `#${this.$route.params.id} - ${this.funcionario.apellidos}`
      };
    },
    data(){
        return{
            indexClickedAsistencia:undefined,
            columnas_asistencia:[]
        };
    },
    created(){
        const data = {
            id:this.$route.params.id,
            funcionario:this.$route.params.funcionario,
            grupo:this.$route.query.grupo
        };
        this.getFuncionario(this.$route.params, this.$route.params.funcionario);
        this.getTiposAsistenciaTurnos();
        this.getAsistencia(data);
        if(this.$route.query.id){
            this.modalEdit = true;
          }
    },
    mounted(){
        this.getColumnsAsistencia();
    },
    computed:{
        ...mapGetters({
            modalEditAsistencia: "recargas/asistenciaResumen/modalEditAsistencia",
            loadingSpinner: "recargas/funcionario/fullScreenLoading",
            loadingTableAsistencia:'recargas/asistenciaResumen/loadingTable',
            funcionario:'recargas/funcionario/funcionario',
            tiposAsistenciaTurnos:'modulos/modulos/tiposAsistenciaTurnos',
            asistencias:'recargas/asistenciaResumen/asistencias',
            recarga:'recargas/asistenciaResumen/recarga'
        }),
        modalEdit:{
          get() {
            return this.$store.state.recargas.asistenciaResumen.modal_edit_asistencia;
          },
          set(newValue) {
            this.$store.commit('recargas/asistenciaResumen/SET_MODAL_EDIT', newValue);
          }
        },
    },
    methods:{
        ...mapActions({
            getFuncionario:'recargas/funcionario/getFuncionario',
            getTiposAsistenciaTurnos:'modulos/modulos/getTiposAsistenciaTurnos',
            getAsistencia:'recargas/asistenciaResumen/getAsistenciaFuncionario',
        }),
        async getColumnsAsistencia(){
            const url                   = `/api/admin/modulos/columnas/asistencia/${this.$route.params.id}/resumen`;
            const response              = await this.$axios.$get(url);
            this.columnas_asistencia    = response;
        },
        changeColorSelected(index){
            if(this.indexClickedAsistencia === undefined){
                this.indexClickedAsistencia = index;
            }else if(this.indexClickedAsistencia != index){
                this.indexClickedAsistencia = index;
            }else if(this.indexClickedAsistencia === index){
                this.indexClickedAsistencia = undefined;
            }
        },
        editAsistencia:function(index, asistencia){
          if(asistencia.exist_contrato){
            this.changeColorSelected(index);
            this.$store.commit('recargas/asistenciaResumen/SET_MODAL_EDIT', true);
          }
        }
    }
}
</script>

<style>

</style>
