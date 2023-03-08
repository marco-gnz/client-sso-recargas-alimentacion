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
                <table class="table  is-narrow is-hoverable is-fullwidth" v-loading="loadingTableViaticos">
                  <thead>
                    <tr>
                      <th>Fechas</th>
                      <th>Fechas periodo</th>
                      <th>Días habiles</th>
                      <th>Jornada</th>
                      <th>Tipo Comisión</th>
                      <th>Motivo</th>
                      <th>Valor</th>
                    </tr>
                  </thead>
                    <template v-if="(viaticos) && (viaticos.length)">
                      <tbody>
                        <tr v-for="(viatico, index) in viaticos" :key="index">
                          <td>{{ viatico.fecha_inicio ? viatico.fecha_inicio : '--'}} / {{ viatico.fecha_termino ? viatico.fecha_termino : '--'}} (<strong>{{ viatico.total_dias }}</strong>d)</td>
                          <td>{{ viatico.fecha_inicio_periodo ? viatico.fecha_inicio_periodo : '--'}} / {{ viatico.fecha_termino_periodo ? viatico.fecha_termino_periodo : '--'}}</td>
                          <td class="has-text-weight-semibold" :class="(viatico.total_dias_habiles_periodo <= 0 ? 'has-text-danger-dark' : '')">{{ viatico.total_dias_habiles_periodo }}</td>
                          <td>{{ viatico.jornada ? viatico.jornada : '--'}}</td>
                          <td>{{ viatico.tipo_comision ? viatico.tipo_comision : '--'}}</td>
                          <td>{{ viatico.motivo_viatico ? viatico.motivo_viatico : '--'}}</td>
                          <td :class="(viatico.valor_viatico <= 0 ? 'has-text-danger-dark' : 'has-text-success-dark')">{{ viatico.valor_viatico ? viatico.valor_viatico : '--'}}</td>
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
    this.getFuncionarioViaticos(this.$route.params, this.$route.params.funcionario);
  },
  computed:{
    ...mapGetters({
      loadingSpinner: "recargas/funcionario/fullScreenLoading",
      funcionario:'recargas/funcionario/funcionario',
      viaticos:'recargas/funcionario/viaticos',
      loadingTableViaticos:'recargas/funcionario/loadingTableViaticos',
      recarga:'recargas/funcionario/recarga'
    })
  },
  methods:{
    ...mapActions({
      getFuncionario:'recargas/funcionario/getFuncionario',
      getFuncionarioViaticos:'recargas/funcionario/getViaticos'
    })
  }
}
</script>

<style>

</style>
