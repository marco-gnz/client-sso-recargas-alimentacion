<template>
  <div>
    <div v-loading.fullscreen.lock="fullScreenLoading" element-loading-text="Cargando datos..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.9)">
      <template v-if="(esquema)">
        <HeroEsquema namepage="Asignaciones"/>
      </template>
      <div class="container.is-fullhd">
        <EsquemaHeader />
        <div class="card p-6 m-6">
          <EsquemaNav />
          <div class="card p-6 m-6">
            <div class="columns">
              <div class="column">
                <div class="table-container pt-2">
                  <template v-if="asignaciones.length">
                    <table class="table is-striped is-narrow is-hoverable is-fullwidth">
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
                        <tr v-for="(asignacion, index) in asignaciones" :key="index">
                          <td>{{asignacion.nombre_proceso}}</td>
                          <td>{{asignacion.anio}}/{{asignacion.mes}}</td>
                          <td><span :class="asignacion.asignacion_tercer_turno > 0 ? 'has-text-danger' : '' ">{{asignacion.asignacion_tercer_turno}}</span></td>
                          <td><span :class="asignacion.bonificacion_asignacion_turno > 0 ? 'has-text-danger' : '' ">{{asignacion.bonificacion_asignacion_turno}}</span></td>
                          <td><span :class="asignacion.asignacion_cuarto_turno > 0 ? 'has-text-danger' : '' ">{{asignacion.asignacion_cuarto_turno}}</span></td>
                          <td><el-tag effect="dark" size="mini" :type="asignacion.asignacion_turno ? 'warning' : 'success'" disable-transitions>{{`${asignacion.asignacion_turno ? 'Si' : 'No'}`}}</el-tag></td>
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
          title: `Asignaciones`
      };
    },
    created(){
      const data = {
            uuid:this.$route.params.id,
        };
        this.getEsquemaAsignaciones(data);
    },
    computed:{
      ...mapGetters({
            fullScreenLoading: "esquemas/esquemaFuncionario/fullScreenLoading",
            esquema: "esquemas/esquemaFuncionario/esquema",
            asignaciones: "esquemas/esquemaFuncionario/asignaciones",
        }),
    },
    methods:{
      ...mapActions({
        getEsquemaAsignaciones:'esquemas/esquemaFuncionario/getEsquemaAsignaciones',
      })
    }
}
</script>

<style>

</style>
