<template>
  <div>
    <div v-loading.fullscreen.lock="loadingSpinner" element-loading-text="Cargando datos..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.9)">
      <template v-if="recarga">
        <Hero namepage="Ausentismos" :recarga="recarga" />
      </template>
      <div class="container.is-fullhd">
        <MenuTotales  :recarga="recarga" />
        <div class="card p-2 m-2">
          <MenuRecarga :codigo="$route.params.id" :recarga="recarga" />
          <div class="columns">
            <div class="column">
              <div class="field">
                <div class="control is-medium" :class="(loadingTable && input_query.length > 0 ? 'is-loading' : '')">
                  <el-input
                      autofocus
                      placeholder="Buscar ausentismos por rut, nombre o apellidos de funcionario"
                      v-model="input_query"
                      @keyup.native="keySearchInput"
                      >
                  </el-input>
                </div>
              </div>
              <div class="field">
                <div class="tabs is-toggle is-toggle-rounded is-small is-centered">
                  <ul>
                    <li v-for="(grupo, index) in grupos" :key="index" :class="(parseInt($route.query.grupo) === grupo.id ? 'is-active' : '')" @click.prevent="changeGrupoAusentismo">
                      <el-tooltip :hide-after="0" class="item" effect="dark" :content="grupo.descripcion" placement="top-start">
                        <nuxt-link :disabled="parseInt($route.query.grupo) === grupo.id" :to="`/admin/recargas/${$route.params.id}/ausentismos?grupo=${grupo.id}`">
                          <span class="icon is-small">
                            <i class="el-icon-link"></i>
                          </span>
                          <span>{{ grupo.nombre }} <strong>({{ grupo.total_ausentismos }})</strong></span>
                        </nuxt-link>
                      </el-tooltip>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="field">
                <div class="tabs is-toggle is-toggle-rounded is-small is-centered">
                  <div class="columns">
                    <div class="column">
                      <label class="label">Seleccione tipo de ausentismo</label>
                      <el-select @change="actionGetAusentismos" size="mini" v-model="tipo_ausentismo_selected" filterable multiple collapse-tags clearable placeholder="Seleccione tipo" class="element-select">
                        <el-option
                          v-for="tipo in tipoAusentismos"
                          :key="tipo.id"
                          :label="tipo.nombre"
                          :value="tipo.id">
                        </el-option>
                      </el-select>
                    </div>
                  </div>
                </div>
              </div>
              <div class="table-container pt-2" v-loading.fullscreen.lock="loadingTable && !ausentismos.length">
                <span v-if="(pagination)" class="tag is-info is-light">{{ `${pagination.total} ${pagination.total > 1 ? `resultados` : `resultado`}` }}</span>
                <template v-if="ausentismos.length">
                  <table class="table  is-narrow is-hoverable is-fullwidth" v-loading="loadingTable" >
                      <thead>
                        <tr>
                          <th>Nombres</th>
                          <th>Turno</th>
                          <th>Vigente</th>
                          <template v-if="(grupo_selected != 3)">
                            <th>Fechas de ausentismo</th>
                          </template>
                          <th>Fechas en periodo</th>
                          <template v-if="(grupo_selected === 3)">
                            <th>Hora ausentismo</th>
                          </template>
                            <th>Días habiles</th>
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
                            <td>{{ ausentismo.nombre_funcionario ? ausentismo.nombre_funcionario : '--' }}</td>
                            <td>
                              <el-tag effect="dark" size="mini" :type="(ausentismo.existe_funcionario ? ausentismo.es_turnante_type : 'info')" disable-transitions>{{ausentismo.existe_funcionario ? ausentismo.es_turnante : '--'}}</el-tag>
                            </td>
                            <td><span class="tag" :class="(ausentismo.existe_funcionario ? 'is-success' : 'is-danger')">{{ ausentismo.existe_funcionario ? 'Si' : 'No' }}</span></td>
                            <template v-if="(grupo_selected != 3)">
                              <td>{{ausentismo.fecha_inicio}} / {{ausentismo.fecha_termino}} ({{ausentismo.total_dias_ausentismo}}d)</td>
                            </template>
                            <td><strong>{{ausentismo.fecha_inicio_periodo}}</strong> / <strong>{{ausentismo.fecha_termino_periodo}} ({{ausentismo.total_dias_ausentismo_periodo}}d)</strong></td>
                            <template v-if="(grupo_selected === 3)">
                              <td>{{ ausentismo.hora_inicio }} / {{ ausentismo.hora_termino }} ({{ ausentismo.total_horas }})</td>
                            </template>
                            <td>{{ausentismo.total_dias_habiles_periodo}}</td>
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
                            <td>
                              <nuxt-link v-if="ausentismo.existe_funcionario" :to="`/admin/esquemas/${ausentismo.esquema_uuid}/ausentismos?grupo=${grupo_selected}`"><el-button size="mini" type="primary" icon="el-icon-view" circle></el-button></nuxt-link>
                            </td>
                          </tr>
                    </tbody>
                  </table>
                </template>
                <template v-else>
                  <el-empty :image-size="90">
                      <div class="row" slot="description">
                      <div class="col-md-12"><span>Grupo sin resultados ...</span></div>
                      </div>
                  </el-empty>
                </template>
              <nav class="pagination is-rounded" role="navigation" aria-label="pagination">
                <a class="pagination-previous" v-if="pagination.current_page > 1" @click.prevent="changePage(pagination.current_page - 1)">Volver</a>
                <a class="pagination-next" v-if="pagination.current_page < pagination.last_page" @click.prevent="changePage(pagination.current_page + 1)">Siguiente pagina</a>
                <ul class="pagination-list">
                  <li v-for="page in pagesNumber" :key="page" class="active">
                    <a class="pagination-link" :class="(page === isActived ? 'is-current' : '')" @click.prevent="changePage(page)" >{{page}}</a>
                  </li>
                </ul>
              </nav>
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
import MenuRecarga from '../../../../../components/admin/recargas/MenuRecarga.vue';
import MenuTotales from '../../../../../components/admin/recargas/MenuTotales.vue';
export default {
  components: { MenuTotales, MenuRecarga },
  middleware: "auth",
  head() {
      return {
          title: `Ausentismos #${this.$route.params.id}`
      };
  },
  created() {
      this.grupo_selected = parseInt(this.$route.query.grupo);
      this.getAusentismosRecarga(this.$route.params.id);
  },
  data(){
    return{
      setTimeoutBuscador:''
    };
  },
  computed:{
    ...mapGetters({
        loadingSpinner: "recarga/ausentismos/main/fullScreenLoading",
        recarga: "recarga/ausentismos/main/recarga",
        grupos:'recarga/ausentismos/main/gruposAusentismo',
        loadingTable: "recarga/ausentismos/main/loadingTable",
        pagination:'recarga/ausentismos/main/pagination',
        offset:'recarga/ausentismos/main/offset',
        ausentismos:'recarga/ausentismos/main/ausentismos',
        tipoAusentismos:'recarga/ausentismos/main/tipoAusentismos'
    }),
    input_query:{
      get() {
        return this.$store.state.recarga.ausentismos.main.filtro.input;
      },
      set(newValue) {
        this.$store.commit('recarga/ausentismos/main/SET_FILTRO_INPUT', newValue);
      }
    },
    grupo_selected:{
      get() {
        return parseInt(this.$route.query.grupo);
      },
      set(newValue) {
        this.$store.commit('recarga/ausentismos/main/SET_GRUPO_SELECTED_AUSENTISMO', newValue);
      }
    },
    tipo_ausentismo_selected:{
      get() {
        return this.$store.state.recarga.ausentismos.main.filtro.tipo_ausentismo_id;
      },
      set(newValue) {
        this.$store.commit('recarga/ausentismos/main/SET_TIPO_SELECTED_AUSENTISMO', newValue);
      }
    },
    current_page:{
      get() {
        return this.$store.state.recarga.ausentismos.main.pagination.current_page;
      },
      set(newValue) {
        this.$store.commit('recarga/ausentismos/main/SET_CURRENT_PAGE', newValue);
      }
    },
    isActived: function () {
        return this.pagination.current_page;
    },
    pagesNumber: function () {
        if (!this.pagination.to) {
            return [];
        }
        var from = this.pagination.current_page - this.offset;
        if (from < 1) {
            from = 1;
        }
        var to = from + (this.offset * 2);
        if (to >= this.pagination.last_page) {
            to = this.pagination.last_page;
        }
        var pagesArray = [];
        while (from <= to) {
            pagesArray.push(from);
            from++;
        }
        return pagesArray;
    }
  },
  methods:{
    ...mapActions({
        getAusentismosRecarga:'recarga/ausentismos/main/getAusentismos'
    }),
    keySearchInput:function(){
      if(this.input_query.length > 1){
          this.current_page = 1;
          clearTimeout(this.setTimeoutBuscador);
          this.setTimeoutBuscador = setTimeout(this.actionGetAusentismos, 500);
      }
    },
    changeGrupoAusentismo:function(){
      this.tipo_ausentismo_selected = [];
      this.current_page   = 1;
      this.grupo_selected = this.$route.query.grupo;
      this.getAusentismosRecarga(this.$route.params.id);
    },
    actionGetAusentismos:function(){
      this.getAusentismosRecarga(this.$route.params.id);
    },
    changePage(page) {
      this.current_page = page;
      this.actionGetAusentismos();
    },
  }
}
</script>

<style>

</style>
