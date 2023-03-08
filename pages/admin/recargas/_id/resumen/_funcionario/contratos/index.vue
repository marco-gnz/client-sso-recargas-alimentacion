<template>
  <div v-loading.fullscreen.lock="loadingSpinner" element-loading-text="Cargando datos..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.9)">
    <template v-if="(funcionario)">
      <HeroUser namepage="Contratos vigentes" :funcionario="funcionario" :recarga="recarga" />
    </template>
    <div class="container.is-fullhd">
      <MenuTotalesFuncionario :funcionario="funcionario" />
      <div class="card p-6 m-6">
        <menu-funcionario />
        <div class="card p-6 m-6">
           <div class="columns">
            <div class="column">
              <div class="table-container pt-2">
                <template v-if="contratos.length">
                  <table class="table is-striped is-narrow is-hoverable is-fullwidth" v-loading="loadingTableTurnos" element-loading-text="Cargando resultados...">
                    <thead>
                      <tr>
                        <th>Fecha contrato</th>
                        <th>Fecha en periodo</th>
                        <th>Días hábiles</th>
                        <th>Unidad</th>
                        <th>Cargo</th>
                        <th>Ley</th>
                        <th>Horas</th>
                        <th>Alejamiento</th>
                      </tr>
                    </thead>
                    <tbody>
                      <template v-if="(contratos) && (contratos.length)">
                        <tr v-for="(contrato, index) in contratos" :key="index">
                          <td>{{ contrato.fecha_inicio ? contrato.fecha_inicio : '--'}} / {{ contrato.fecha_termino ? contrato.fecha_termino : '--'}}</td>
                          <td class="has-text-weight-semibold">{{ contrato.fecha_inicio_periodo ? contrato.fecha_inicio_periodo : '--'}} / {{ contrato.fecha_termino_periodo ? contrato.fecha_termino_periodo : '--'}} ({{ contrato.total_dias_contrato_periodo }})</td>
                          <td class="has-text-weight-semibold" :class="(contrato.total_dias_habiles_contrato_periodo <= 0 ? 'has-text-danger-dark' : '')">{{ contrato.total_dias_habiles_contrato_periodo }}</td>
                          <td>{{ contrato.unidad_nombre ? contrato.unidad_nombre : '--'}}</td>
                          <td>{{ contrato.cargo_nombre ? contrato.cargo_nombre : '--'}}</td>
                          <td>{{ contrato.ley_nombre ? contrato.ley_nombre : '--'}}</td>
                          <td>{{ contrato.hora_nombre ? contrato.hora_nombre : '--'}}</td>
                          <td><span :class="(contrato.alejamiento ? 'tag is-danger is-light' : '')">{{ contrato.alejamiento ? 'Si' : '--' }} </span></td>
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
import MenuFuncionario from '../../../../../../../components/admin/recargas/MenuFuncionario.vue';
import MenuTotalesFuncionario from '../../../../../../../components/admin/recargas/MenuTotalesFuncionario.vue';
export default {
  components: { MenuTotalesFuncionario, MenuFuncionario },
  middleware: "auth",
  head() {
      return {
          title: `#${this.$route.params.id} - ${this.funcionario.apellidos}`
      };
  },
  created(){
    this.getFuncionario(this.$route.params, this.$route.params.funcionario);
    this.getFuncionarioContratos(this.$route.params, this.$route.params.funcionario);
  },
  computed:{
    ...mapGetters({
      loadingSpinner: "recargas/funcionario/fullScreenLoading",
      funcionario:'recargas/funcionario/funcionario',
      contratos:'recargas/funcionario/contratos',
      loadingTableTurnos:'recargas/funcionario/loadingTableContratos',
      recarga:'recargas/funcionario/recarga'
    })
  },
  methods:{
    ...mapActions({
      getFuncionario:'recargas/funcionario/getFuncionario',
      getFuncionarioContratos:'recargas/funcionario/getContratos'
    })
  }
}
</script>

<style>

</style>
