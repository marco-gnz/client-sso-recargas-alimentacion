<template>
  <div>
    <div v-loading.fullscreen.lock="fullScreenLoading" element-loading-text="Cargando datos..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.9)">
      <template v-if="(esquema)">
        <HeroEsquema namepage="Turnos"/>
      </template>
      <div class="container.is-fullhd">
        <EsquemaHeader />
        <div class="card p-6 m-6">
          <EsquemaNav />
          <div class="card p-6 m-6">
            <div class="columns">
              <div class="column">
                <div class="table-container pt-2">
                  <template v-if="turnos.length">
                      <table class="table is-striped is-narrow is-hoverable is-fullwidth">
                        <thead>
                          <tr>
                              <td v-for="(c, index) in calendario" :key="index">
                                <el-tooltip :content="c.descripcion" placement="top">
                                <i :class="(c.is_week_day ? 'has-text-danger' : '')">{{c.nombre_columna}}</i>
                              </el-tooltip>
                              </td>
                              <th>L</th>
                              <th>N</th>
                              <th>X</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td v-for="(tipo, index) in turnos" :key="index" :class="(tipo.exist_contrato ? 'has-background-danger-light' : '')">
                              <el-badge type="warning" :hidden="tipo.observaciones_count <= 0" :value="tipo.observaciones_count" class="item">
                                <span :class="(tipo.tipo_asistencia_turno.id === 3 ? 'has-text-danger has-text-weight-bold' : (tipo.tipo_asistencia_turno.id === 1 ? 'has-text-link' : 'has-text-primary') )">
                                  <span :class="(tipo.exist_asistencia && tipo.tipo_asistencia_turno.nombre != 'X'  ? 'tag is-black' : (tipo.exist_asistencia && tipo.tipo_asistencia_turno.nombre === 'X' ? 'tag is-light' : ''))">{{tipo.tipo_asistencia_turno.nombre}}</span>
                                </span>
                              </el-badge>
                            </td>
                            <td>
                              <el-tooltip class="item" effect="dark" :content="`Total: ${esquema.total_dias_turno_largo}`" placement="right-start">
                                  <span class="has-text-weight-bold" >{{esquema.total_dias_turno_largo_en_periodo_contrato}}</span>
                              </el-tooltip>
                            </td>
                            <td>
                              <el-tooltip class="item" effect="dark" :content="`Total: ${esquema.total_dias_turno_nocturno}`" placement="right-start">
                                  <span class="has-text-weight-bold" >{{esquema.total_dias_turno_nocturno_en_periodo_contrato}}</span>
                              </el-tooltip>
                            </td>
                            <td>
                              <el-tooltip class="item" effect="dark" :content="`Total: ${esquema.total_dias_libres}`" placement="right-start">
                                  <span class="has-text-weight-bold" >{{esquema.total_dias_libres_en_periodo_contrato}}</span>
                              </el-tooltip>
                            </td>
                          </tr>
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
                <div class="columns is-centered">
                  <div class="column is-one-fifth" v-for="(tipo, index) in tiposTurnos" :key="index">
                    <span :class="(tipo.id === 3 ? 'has-text-danger' : (tipo.id === 1 ? 'has-text-link' : 'has-text-primary'))"><i class="el-icon-s-open"></i> {{tipo.descripcion}} ({{tipo.nombre}})</span>
                  </div>
                </div>
                <div class="notification is-black is-light">
                <div class="columns">
                  <div class="column">
                    Días destacados de color <span class="has-text-danger has-text-weight-semibold">rojo</span>, representan contrato(s) en el periodo de beneficio.
                  </div>
                </div>
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
          title: `Turnos`
      };
    },
    created(){
      const data = {
            uuid:this.$route.params.id,
        };
        this.getEsquemaTurnos(data);
    },
    computed:{
      ...mapGetters({
            fullScreenLoading: "esquemas/esquemaFuncionario/fullScreenLoading",
            esquema: "esquemas/esquemaFuncionario/esquema",
            calendario: "esquemas/esquemaFuncionario/calendario",
            turnos: "esquemas/esquemaFuncionario/turnos",
            tiposTurnos:'esquemas/esquemaFuncionario/tiposTurnos'
        }),
    },
    methods:{
      ...mapActions({
        getEsquemaTurnos:'esquemas/esquemaFuncionario/getEsquemaTurnos',
      })
    }
}
</script>

<style>

</style>
