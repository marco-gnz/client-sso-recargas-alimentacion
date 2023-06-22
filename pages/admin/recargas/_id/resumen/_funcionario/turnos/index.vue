<template>
  <div v-loading.fullscreen.lock="loadingSpinner" element-loading-text="Cargando datos..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.9)">
    <template v-if="(esquema)">
      <HeroUser namepage="Asignaciones" :esquema="esquema" :recarga="recarga" />
    </template>
    <div class="container.is-fullhd">
      <MenuTotalesFuncionario :esquema="esquema" />
      <div class="card p-6 m-6">
        <MenuFuncionario/>
        <div class="card p-6 m-6">
          <div class="columns">
            <div class="column">
              <div class="table-container pt-2">
                <template v-if="turnos.length">
                  <table class="table is-striped is-narrow is-hoverable is-fullwidth" v-loading="loadingTableTurnos" element-loading-text="Cargando resultados...">
                    <thead>
                      <tr>
                        <th>Proceso</th>
                        <th>Año/Mes</th>
                        <th>A. 3° turno</th>
                        <th>B. asignación turno</th>
                        <th>A. 4° turno</th>
                        <th>Turno</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(turno, index) in turnos" :key="index">
                        <td>{{turno.nombre_proceso}}</td>
                        <td>{{turno.anio}}/{{turno.mes}}</td>
                        <td><span :class="turno.asignacion_tercer_turno > 0 ? 'has-text-danger' : '' ">{{turno.asignacion_tercer_turno}}</span></td>
                        <td><span :class="turno.bonificacion_asignacion_turno > 0 ? 'has-text-danger' : '' ">{{turno.bonificacion_asignacion_turno}}</span></td>
                        <td><span :class="turno.asignacion_cuarto_turno > 0 ? 'has-text-danger' : '' ">{{turno.asignacion_cuarto_turno}}</span></td>
                        <td><el-tag effect="dark" size="mini" :type="turno.asignacion_turno ? 'warning' : 'success'" disable-transitions>{{`${turno.asignacion_turno ? 'Si' : 'No'}`}}</el-tag></td>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import MenuFuncionario from '../../../../../../../components/admin/recargas/MenuFuncionario.vue'
import MenuTotalesFuncionario from '../../../../../../../components/admin/recargas/MenuTotalesFuncionario.vue';
export default {
  components: { MenuFuncionario, MenuTotalesFuncionario },
  middleware: "auth",
  head() {
      return {
          title: `#${this.$route.params.id} - ${this.esquema.funcionario_apellidos}`
      };
  },
  created(){
    this.getEsquema(this.$route.params, this.$route.params.funcionario);
    this.getFuncionarioTurnos(this.$route.params, this.$route.params.funcionario);
  },
  computed:{
    ...mapGetters({
      loadingSpinner: "recargas/funcionario/fullScreenLoading",
      esquema:'recargas/esquema/esquema',
      turnos:'recargas/funcionario/turnos',
      loadingTableTurnos:'recargas/funcionario/loadingTableTurnos',
      recarga:'recargas/funcionario/recarga'
    })
  },
  methods:{
    ...mapActions({
      getEsquema:'recargas/esquema/getEsquema',
      getFuncionario:'recargas/funcionario/getFuncionario',
      getFuncionarioTurnos:'recargas/funcionario/getTurnos'
    })
  }
}
</script>

<style>

</style>
