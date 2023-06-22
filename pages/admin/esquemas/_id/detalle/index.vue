<template>
  <div>
    <div v-loading.fullscreen.lock="fullScreenLoading" element-loading-text="Cargando datos..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.9)">
      <template v-if="(esquema)">
        <HeroEsquema namepage="Detalle"/>
      </template>
      <div class="container.is-fullhd">
        <EsquemaHeader />
        <div class="card p-6 m-6">
          <EsquemaNav />
          <div class="card p-6 m-6">
            <div class="columns">
              <div class="column">
                  <div class="table-container pt-2">
                    <h4 class="title is-4"><span class="tag is-warning">Advertencias</span></h4>
                    <template v-if="(esquema.advertencias) && (esquema.advertencias.length)">
                        <table class="table is-striped is-narrow is-hoverable is-fullwidth">
                          <thead>
                            <tr>
                              <th>Código</th>
                              <th>Descripción</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(advertencia, index) in esquema.advertencias" :key="index">
                              <td>{{advertencia.code}}</td>
                              <td>{{advertencia.message}}</td>
                            </tr>
                          </tbody>
                        </table>
                    </template>
                    <template v-else>
                      <div class="notification is-success is-light">
                        Sin advertencias <i class="el-icon-success"></i>
                      </div>
                    </template>
                  </div>
              </div>
              <div class="column">
                  <div class="table-container pt-2">
                    <h4 class="title is-4"><span class="tag is-danger">Errores</span></h4>
                    <template v-if="(esquema.errores) && (esquema.errores.length)">
                        <table class="table is-striped is-narrow is-hoverable is-fullwidth">
                          <thead>
                            <tr>
                              <th>Código</th>
                              <th>Descripción</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(error, index) in esquema.errores" :key="index">
                              <td>{{error.code}}</td>
                              <td>{{error.message}}</td>
                            </tr>
                          </tbody>
                        </table>
                    </template>
                    <template v-else>
                      <div class="notification is-success is-light">
                        Sin errores <i class="el-icon-success"></i>
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
          title: `Detalle`
      };
    },
    created(){
      const data = {
            uuid:this.$route.params.id,
        };
        this.getEsquemaDetalle(data);
    },
    computed:{
      ...mapGetters({
            fullScreenLoading: "esquemas/esquemaFuncionario/fullScreenLoading",
            esquema: "esquemas/esquemaFuncionario/esquema",
        }),
    },
    methods:{
      ...mapActions({
        getEsquemaDetalle:'esquemas/esquemaFuncionario/getEsquemaDetalle',
      })
    }
}
</script>

<style>

</style>
