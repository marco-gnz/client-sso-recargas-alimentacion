<template>
  <div>
    <div v-loading.fullscreen.lock="fullScreenLoading" element-loading-text="Cargando datos..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.9)">
      <template v-if="(esquema)">
        <HeroEsquema namepage="Viáticos"/>
      </template>
      <div class="container.is-fullhd">
        <EsquemaHeader />
        <div class="card p-6 m-6">
          <EsquemaNav />
          <div class="card p-6 m-6">
            <div class="columns">
              <div class="column">
                <div class="table-container pt-2">
                  <template v-if="viaticos.length">
                    <table class="table  is-narrow is-hoverable is-fullwidth">
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
                  </template>
                  <template v-else>
                    <el-empty :image-size="90">
                        <div class="row" slot="description">
                        <div class="col-md-12"><span>Sin resultados ...</span></div>
                        </div>
                    </el-empty>
                  </template>
                </div>
              </div>
            </div>
            <template v-if="esquema.user_created_by">
              <FooterEsquema />
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import EsquemaHeader from '../../../../../components/admin/esquema/EsquemaHeader.vue';
import EsquemaNav from '../../../../../components/admin/esquema/EsquemaNav.vue';
import FooterEsquema from '../../../../../components/admin/esquema/FooterEsquema.vue';
import HeroEsquema from '../../../../../components/admin/esquema/HeroEsquema.vue';
export default {
  components: { EsquemaHeader, HeroEsquema, EsquemaNav, FooterEsquema },
  middleware: "auth",
    head() {
      return {
          title: `Viáticos`
      };
    },
    created(){
      const data = {
            uuid:this.$route.params.id,
        };
        this.getEsquemaViaticos(data);
    },
    computed:{
      ...mapGetters({
            fullScreenLoading: "esquemas/esquemaFuncionario/fullScreenLoading",
            esquema: "esquemas/esquemaFuncionario/esquema",
            viaticos: "esquemas/esquemaFuncionario/viaticos",
        }),
    },
    methods:{
      ...mapActions({
        getEsquemaViaticos:'esquemas/esquemaFuncionario/getEsquemaViaticos',
      })
    }
}
</script>

<style>

</style>
