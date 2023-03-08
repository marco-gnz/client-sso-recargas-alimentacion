<template>
  <div v-loading.fullscreen.lock="loadingSpinner" element-loading-text="Cargando datos..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.9)">
    <template v-if="(funcionario)">
      <HeroUser namepage="Ausentismos" :funcionario="funcionario" :recarga="recarga" />
    </template>
    <div class="container.is-fullhd">
      <MenuTotalesFuncionario :funcionario="funcionario" />
      <div class="card p-6 m-6">
        <MenuFuncionario />
        <div class="card p-6 m-6">
          <div class="columns">
            <div class="column is-full">
              <div class="tabs is-toggle is-toggle-rounded is-small is-centered">
                <ul>
                  <li v-for="(grupo, index) in funcionario.grupos_ausentismo" :key="index" :class="(parseInt($route.query.grupo) === grupo.id ? 'is-active' : '')" @click.prevent="changeGrupoAusentismo">
                    <el-tooltip :hide-after="0" class="item" effect="dark" :content="grupo.descripcion" placement="top-start">
                      <nuxt-link :disabled="parseInt($route.query.grupo) === grupo.id" :to="`/admin/recargas/${$route.params.id}/resumen/${$route.params.funcionario}/ausentismos?grupo=${grupo.id}`">
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
                  <table class="table is-striped is-narrow is-hoverable is-fullwidth" v-loading="loadingTableAusentismos" element-loading-text="Cargando resultados...">
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
                        <template v-if="(grupo_selected === 3)">
                          <th>Descuento</th>
                        </template>
                        <template v-if="(grupo_selected === 2)">
                          <th>Meridiano</th>
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
                          <el-tooltip class="item" effect="dark" :content="`${ausentismo.hora_inicio_regla != null ? `No corresponde beneficio entre ${ausentismo.hora_inicio_regla} y ${ausentismo.hora_termino_regla} hrs.` : ``}`" placement="top-start">
                            <span>{{ausentismo.nombre_tipo_ausentismo}}</span>
                          </el-tooltip>
                        </td>
                        <template v-if="(grupo_selected === 3)">
                          <td><el-tag effect="dark" size="mini" :type="(ausentismo.tiene_descuento ? 'danger' : 'success')">{{ ausentismo.tiene_descuento ? 'Si' : 'No' }}</el-tag></td>
                        </template>
                        <template v-if="(grupo_selected === 2)">
                          <td>{{ ausentismo.nombre_meridiano != null ? ausentismo.nombre_meridiano : '--' }}</td>
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
    const data = {
      id:this.$route.params.id,
      funcionario:this.$route.params.funcionario,
      grupo:this.$route.query.grupo
    };
    this.grupo_selected = parseInt(data.grupo);
    this.getFuncionario(this.$route.params, this.$route.params.funcionario);
    this.getAusentismos(data);
  },
  computed:{
    ...mapGetters({
      loadingSpinner: "recargas/funcionario/fullScreenLoading",
      funcionario:'recargas/funcionario/funcionario',
      loadingTableAusentismos:'recargas/funcionario/loadingTableAusentismos',
      ausentismos:'recargas/funcionario/ausentismos',
      recarga:'recargas/funcionario/recarga'
    }),
    grupo_selected:{
      get() {
        return parseInt(this.$route.query.grupo);
      },
      set(newValue) {
        this.$store.commit('recargas/funcionario/SET_GRUPO_SELECTED_AUSENTISMO', newValue);
      }
    },
  },
  methods:{
    ...mapActions({
      getFuncionario:'recargas/funcionario/getFuncionario',
      getAusentismos:'recargas/funcionario/getAusentismos'
    }),
    changeGrupoAusentismo:function(){
      const data = {
        id:this.$route.params.id,
        funcionario:this.$route.params.funcionario,
        grupo:parseInt(this.$route.query.grupo)
      };
      this.getAusentismos(data);
    }
  }
}
</script>

<style>

</style>
