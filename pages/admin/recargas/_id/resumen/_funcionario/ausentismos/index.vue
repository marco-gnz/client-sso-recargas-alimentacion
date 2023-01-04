<template>
  <div v-loading.fullscreen.lock="loadingSpinner" element-loading-text="Cargando datos..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.9)">
    <Hero :title="`Recarga #${$route.params.id} - Ausentismos`" :subtitle="`${funcionario != null ? `${funcionario.nombre_completo} (${funcionario.rut_completo})` : ''}`" />
    <div class="container.is-fullhd">
      <MenuTotalesFuncionario />
      <div class="card p-6 m-6">
        <MenuFuncionario />
        <div class="card p-6 m-6">
          <div class="columns">
            <div class="column is-two-fifths">
              <div class="buttons">
                <button class="button is-info is-inverted">Ingresar nuevo registro</button>
              </div>
            </div>
            <div class="column">
              <div class="tabs is-toggle is-toggle-rounded is-small">
                <ul>
                  <li v-for="(grupo, index) in grupos" :key="index" :class="(parseInt($route.query.grupo) === grupo.id ? 'is-active' : '')" @click.prevent="changeGrupoAusentismo">
                    <el-tooltip :hide-after="0" class="item" effect="dark" :content="grupo.descripcion" placement="top-start">
                      <nuxt-link :disabled="parseInt($route.query.grupo) === grupo.id" :to="`/admin/recargas/${$route.params.id}/resumen/${$route.params.funcionario}/ausentismos?grupo=${grupo.id}`">
                      <span>{{ grupo.nombre }}</span>
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
                        <th>Fechas ausentismo</th>
                        <th>Total días</th>
                        <th>Fechas en periodo</th>
                        <th>Total días</th>
                        <th>Grupo ausentismo</th>
                        <th>Tipo de ausentismo</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(ausentismo, index) in ausentismos" :key="index">
                        <td><strong>{{ausentismo.fecha_inicio}}</strong> / <strong>{{ausentismo.fecha_termino}}</strong></td>
                        <td>{{ausentismo.total_dias_ausentismo}}</td>
                        <td>{{ausentismo.fecha_inicio_periodo}} / {{ausentismo.fecha_termino_periodo}}</td>
                        <td>{{ausentismo.total_dias_ausentismo_periodo}}</td>
                        <td>{{ausentismo.nombre_grupo_ausentismo}}</td>
                        <td>{{ausentismo.nombre_tipo_ausentismo}}</td>
                        <td>
                          <el-dropdown>
                              <span class="el-dropdown-link">Acción<i class="el-icon-arrow-down el-icon--right"></i></span>
                              <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item icon="el-icon-edit">Editar</el-dropdown-item>
                                <el-dropdown-item icon="el-icon-delete">Eliminar</el-dropdown-item>
                              </el-dropdown-menu>
                          </el-dropdown>
                        </td>
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
  mounted(){
    this.getGruposAusentismos()
  },
  computed:{
    ...mapGetters({
      loadingSpinner: "recargas/funcionario/fullScreenLoading",
      funcionario:'recargas/funcionario/funcionario',
      loadingTableAusentismos:'recargas/funcionario/loadingTableAusentismos',
      ausentismos:'recargas/funcionario/ausentismos',
      grupos:'modulos/modulos/gruposAusentismos',
    }),
    grupo_selected:{
      get() {
        return this.$store.state.recargas.funcionario.grupo_selected_ausentismo;
      },
      set(newValue) {
        this.$store.commit('recargas/funcionario/SET_GRUPO_SELECTED_AUSENTISMO', newValue);
      }
    },
  },
  methods:{
    ...mapActions({
      getFuncionario:'recargas/funcionario/getFuncionario',
      getAusentismos:'recargas/funcionario/getAusentismos',
      getGruposAusentismos: 'modulos/modulos/getGruposAusentismos',
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
