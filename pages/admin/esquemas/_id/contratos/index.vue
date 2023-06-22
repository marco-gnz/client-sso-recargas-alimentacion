<template>
  <div>
    <div v-loading.fullscreen.lock="fullScreenLoading" element-loading-text="Cargando datos..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.9)">
      <template v-if="(esquema)">
        <HeroEsquema namepage="Contratos"/>
      </template>
      <div class="container.is-fullhd">
        <EsquemaHeader />
        <div class="card p-6 m-6">
          <EsquemaNav />
          <div class="card p-6 m-6">
           <div class="columns">
            <div class="column">
              <div class="table-container pt-2">
                <template v-if="contratos.length">
                  <table class="table is-striped is-narrow is-hoverable is-fullwidth">
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
                <template v-else>
                  <div class="columns">
                    <div class="column is-full">
                      <div class="tabs is-toggle is-toggle-rounded is-small is-centered">
                        <el-empty class="is-centered" description="Sin resultados" :image-size="100"></el-empty>
                      </div>
                    </div>
                  </div>
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
          title: `Contratos`
      };
    },
    created(){
      const data = {
            uuid:this.$route.params.id,
        };
        this.getEsquemaContratos(data);
    },
    computed:{
      ...mapGetters({
            fullScreenLoading: "esquemas/esquemaFuncionario/fullScreenLoading",
            esquema: "esquemas/esquemaFuncionario/esquema",
            contratos: "esquemas/esquemaFuncionario/contratos",
        }),
    },
    methods:{
      ...mapActions({
        getEsquemaContratos:'esquemas/esquemaFuncionario/getEsquemaContratos',
      })
    }
}
</script>

<style>

</style>
