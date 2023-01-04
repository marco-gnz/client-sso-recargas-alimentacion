<template>
  <div>
    <div v-loading.fullscreen.lock="loadingSpinner" element-loading-text="Cargando datos..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.9)">
        <Hero :title="`Recarga #${$route.params.id} - Asistencia`" :subtitle="`${funcionario != null ? `${funcionario.nombre_completo} (${funcionario.rut_completo})` : ''}`" />
        <div class="container.is-fullhd">
            <MenuTotalesFuncionario />
            <ModalEditTurnoAsistencia :asistencia="asistenciaSelected" />
            <div class="card p-6 m-6">
                <MenuFuncionario />
                    <div class="columns">
                        <div class="column">
                            <div class="table-container pt-2">
                                <template v-if="(asistencias) && (asistencias.length)">
                                    <table class="table is-striped is-narrow is-hoverable is-fullwidth" v-loading="loadingTableAsistencia" element-loading-text="Cargando asistencia...">
                                        <thead>
                                            <tr>
                                                <td v-for="(columna, index) in columnas_asistencia" :key="index"><i>{{columna.nombre_columna}}</i></td>
                                                <th>TL</th>
                                                <th>TN</th>
                                                <th>DL</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(asistencia, index) in asistencias" :key="index">
                                                <td class="is-clickable" :class="(indexClickedAsistencia === index ? 'is-selected' : '')" v-for="(turno, index) in asistencia.asistencias_list" :key="index" @click.prevent="editAsistencia(index, turno)"><span :class="(turno.tipo_asistencia_turno.id === 3 ? 'has-text-danger has-text-weight-bold' : (turno.tipo_asistencia_turno.id === 1 ? 'has-text-link' : 'has-text-primary') )">{{turno.tipo_asistencia_turno.nombre}}</span></td>
                                                <td><strong>{{asistencia.total_turno_largo}}</strong></td>
                                                <td><strong>{{asistencia.total_turno_nocturno}}</strong></td>
                                                <td><span class="has-text-weight-bold" :class="(asistencia.total_dias_libres <= 0 || asistencia.total_dias_libres >= 31 ? 'has-text-white has-background-danger-dark' : '')">{{asistencia.total_dias_libres}}</span></td>
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
            columnas_asistencia:[],
            asistenciaSelected:''
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
    },
    mounted(){
        this.getColumnsAsistencia();
    },
    computed:{
        ...mapGetters({
            loadingSpinner: "recargas/funcionario/fullScreenLoading",
            loadingTableAsistencia:'recargas/asistenciaResumen/loadingTable',
            funcionario:'recargas/funcionario/funcionario',
            tiposAsistenciaTurnos:'modulos/modulos/tiposAsistenciaTurnos',
            asistencias:'recargas/asistenciaResumen/asistencias',
        })
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
            this.changeColorSelected(index);
            this.asistenciaSelected = asistencia;
            this.$store.commit('recargas/asistenciaResumen/SET_MODAL_EDIT', true);
            this.$store.commit('recargas/asistenciaResumen/SET_TIPO_ASISTENCIA_TURNO', this.asistenciaSelected.tipo_asistencia_turno.id);
        }
    }
}
</script>

<style>

</style>
