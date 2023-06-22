<template>
  <div>
    <div v-loading.fullscreen.lock="fullScreenLoading" element-loading-text="Cargando datos..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.9)">
      <template v-if="(esquema)">
        <HeroEsquema namepage="Ausentismos"/>
      </template>
      <div class="container.is-fullhd">
        <EsquemaHeader />
        <div class="card p-6 m-6">
          <EsquemaNav />
          <div class="card p-6 m-6">
            <div class="columns">
              <div class="column is-full">
                <div class="tabs is-toggle is-toggle-rounded is-small is-centered">
                  <ul>
                    <li v-for="(grupo, index) in gruposAusentismos" :key="index" :class="(parseInt($route.query.grupo) === grupo.id ? 'is-active' : '')" @click.prevent="changeGrupoAusentismo">
                      <el-tooltip :hide-after="0" class="item" effect="dark" :content="grupo.descripcion" placement="top-start">
                        <nuxt-link :disabled="parseInt($route.query.grupo) === grupo.id" :to="`/admin/esquemas/${$route.params.id}/ausentismos?grupo=${grupo.id}`">
                          <span class="icon is-small">
                            <i class="el-icon-link"></i>
                          </span>
                          <span>{{ grupo.nombre }} <strong>({{ grupo.ausentismos_count }})</strong></span>
                        </nuxt-link>
                      </el-tooltip>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="columns">
              <div class="column">
                <div class="table-container pt-2">
                  <template v-if="ausentismos.length">
                    <table class="table is-striped is-narrow is-hoverable is-fullwidth" >
                      <thead>
                        <tr>
                          <template v-if="(grupo_selected != 3)">
                            <th>Fechas ausentismo</th>
                          </template>
                          <th>Fechas en periodo</th>
                          <template v-if="(grupo_selected === 3)">
                            <th>Hora ausentismo</th>
                            <th>Total horas</th>
                          </template>
                            <th>Días habiles</th>
                          <th>Grupo ausentismo</th>
                          <th>Tipo de ausentismo</th>
                          <template v-if="(grupo_selected === 2)">
                            <th>Meridiano</th>
                          </template>
                          <template v-if="(grupo_selected != 1)">
                            <th>Descuento</th>
                          </template>
                          <template v-if="(grupo_selected === 1)">
                            <th>Tipo días</th>
                          </template>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(ausentismo, index) in ausentismos" :key="index">
                          <template v-if="(grupo_selected != 3)">
                            <td>{{ausentismo.fecha_inicio}} / {{ausentismo.fecha_termino}} ({{ausentismo.total_dias_ausentismo}}d)</td>
                          </template>
                          <td><strong>{{ausentismo.fecha_inicio_periodo}}</strong> / <strong>{{ausentismo.fecha_termino_periodo}} ({{ausentismo.total_dias_ausentismo_periodo}}d)</strong></td>
                          <template v-if="(grupo_selected === 3)">
                            <td>{{ ausentismo.hora_inicio }} / {{ ausentismo.hora_termino }}</td>
                            <td>{{ ausentismo.total_horas }}</td>
                          </template>
                          <td>{{ausentismo.total_dias_habiles_periodo}}</td>
                          <td>{{ausentismo.nombre_grupo_ausentismo}}</td>
                          <td class="click">
                            <span>{{ausentismo.nombre_tipo_ausentismo}}</span>
                          </td>
                          <template v-if="(grupo_selected === 2)">
                            <td>{{ ausentismo.nombre_meridiano != null ? ausentismo.nombre_meridiano : '--' }}</td>
                          </template>
                          <template v-if="(grupo_selected != 1)">
                              <td><span class="tag" :class="(ausentismo.tiene_descuento ? 'is-warning' : 'is-success')">{{ ausentismo.tiene_descuento ? 'Descuento' : 'Sin descuento' }}</span></td>
                          </template>
                          <template v-if="(grupo_selected === 1)">
                            <td>{{ausentismo.regla_tipo_dias ? ausentismo.regla_tipo_dias : '--'}}</td>
                          </template>
                        </tr>
                      </tbody>
                    </table>
                  </template>
                  <template v-else>
                    <el-empty :image-size="90">
                        <div class="row" slot="description">
                        <div class="col-md-12"><span>Grupo {{ $route.query.grupo }} sin resultados ...</span></div>
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
          title: `Ausentismos`
      };
    },
    created(){
      const data = {
            uuid:this.$route.params.id,
            grupo:parseInt(this.$route.query.grupo)
        };
        this.grupo_selected = parseInt(data.grupo);
        this.getEsquemaAusentismos(data);
    },
    computed:{
      ...mapGetters({
            fullScreenLoading: "esquemas/esquemaFuncionario/fullScreenLoading",
            esquema: "esquemas/esquemaFuncionario/esquema",
            gruposAusentismos:'esquemas/esquemaFuncionario/gruposAusentismos',
            ausentismos:'esquemas/esquemaFuncionario/ausentismos'
        }),
        grupo_selected:{
          get() {
            return parseInt(this.$route.query.grupo);
          },
          set(newValue) {
            this.$store.commit('esquemas/esquemaFuncionario/SET_N_GRUPO', newValue);
          }
        },
    },
    methods:{
      ...mapActions({
        getEsquemaAusentismos:'esquemas/esquemaFuncionario/getEsquemaAusentismos',
      }),
      changeGrupoAusentismo:function(){
        const data = {
          uuid:this.$route.params.id,
          grupo:parseInt(this.$route.query.grupo)
        };
        this.getEsquemaAusentismos(data);
      }
    }
}
</script>

<style>

</style>
