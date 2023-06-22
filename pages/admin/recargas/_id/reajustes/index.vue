<template>
  <div v-loading.fullscreen.lock="fullScreenLoading" element-loading-text="Cargando datos..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.9)">
    <template v-if="recarga">
      <Hero namepage="Ajuste de días y montos" :recarga="recarga" />
    </template>
    <div class="container.is-fullhd">
      <MenuTotales  :recarga="recarga" />
      <div class="card p-2 m-2">
        <MenuRecarga :codigo="$route.params.id" :recarga="recarga" />
        <ModalRechazar :uuid="uuid" />
        <div class="columns">
          <div class="column">
            <div class="field">
              <div class="control is-medium is-loading">
                <el-input
                    autofocus
                    placeholder="Busque ajustes por rut, nombre o apellidos de funcionario"
                    v-model="input_query"
                    @keyup.native="keySearchInput"
                    clearable>
                </el-input>
              </div>
            </div>
            <div class="table-container pt-2">
              <div class="columns has-text-centered">
                  <div class="column">
                    <div class="pt-2">
                      <label class="label">Filtrar por estado</label>
                      <el-checkbox-group  v-model="estados_filtro" size="mini" @change="actionGetReajustesRecarga">
                        <el-checkbox-button :disabled="loadingTable" v-for="(estado, index) in estados" :key="index" :label="estado.id">{{estado.nombre}}</el-checkbox-button>
                      </el-checkbox-group>
                    </div>
                  </div>
                  <div class="column">
                    <div class="pt-2">
                      <label class="label">Rebaja / Incremento</label>
                      <el-checkbox-group v-model="rebaja_incremento" size="mini" @change="actionGetReajustesRecarga">
                        <el-checkbox :label="0">Rebaja</el-checkbox>
                        <el-checkbox :label="1">Incremento</el-checkbox>
                      </el-checkbox-group>
                    </div>
                  </div>
                  <div class="column">
                    <div class="pt-2">
                      <label class="label">Filtrar por tipo</label>
                      <el-checkbox-group v-model="tipos_filtro" size="mini" @change="actionGetReajustesRecarga">
                        <el-checkbox-button :disabled="loadingTable" v-for="(tipo, index) in tipoAjustes" :key="index" :label="tipo.id">{{tipo.nombre}}</el-checkbox-button>
                      </el-checkbox-group>
                    </div>
                  </div>
                </div>
                <span v-if="(pagination)" class="tag is-info is-light">{{ `${pagination.total} ${pagination.total > 1 ? `resultados` : `resultado`}` }}</span>
                <table class="table  is-narrow is-hoverable is-fullwidth" v-loading="loadingTable" >
                  <thead>
                    <tr>
                      <th>Nombres</th>
                      <th>Turno</th>
                      <th>Fecha</th>
                      <th>Rebaja/Incremento</th>
                      <th>Causal</th>
                      <th>Días</th>
                      <th>Tipo ajuste</th>
                      <th>Monto ajuste</th>
                      <th>Estado</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-if="(ajustes) && (ajustes.length)">
                      <nuxt-link @click.native="showReajuste(index)" v-for="(reajuste, index) in ajustes" :key="index" :class="(index_color === index ? 'row-selected' : '')" class="click" tag="tr" :to="{path: `/admin/recargas/${$route.params.id}/reajustes`, query: { id: reajuste.uuid }}">
                        <td>{{ reajuste.nombres_funcionario != null ? reajuste.nombres_funcionario : '--' }}</td>
                        <td><el-tag effect="dark" size="mini" :type="reajuste.es_turnante != null ? (reajuste.es_turnante ? 'warning' : 'primary') : 'danger' " disable-transitions>{{`${reajuste.es_turnante != null ? `${reajuste.es_turnante ? 'Si' : 'No'}` : `Error`}`}}</el-tag></td>
                        <td>{{ reajuste.fecha_inicio }} / {{ reajuste.fecha_termino }} ({{reajuste.dias_periodo}})</td>
                        <td>
                          <el-tooltip class="item" effect="dark" :content="reajuste.incremento_nombre" placement="top-start">
                            <i class="has-text-weight-semibold" :class="(reajuste.incremento ? 'el-icon-plus has-text-link-dark' : 'el-icon-minus has-text-danger-dark')"></i>
                          </el-tooltip>
                        </td>
                        <td>
                          <template v-if="reajuste.incremento">
                            {{ reajuste.tipo_incremento != null ? reajuste.tipo_incremento : '-' }}
                          </template>
                          <template v-else>
                            {{ reajuste.tipo_ausentismo != null ? reajuste.tipo_ausentismo : '' }}
                          </template>
                        </td>
                        <td><span class="has-text-weight-semibold">{{ reajuste.total_dias }}</span></td>
                        <td><el-tag size="mini" effect="dark" :type="(reajuste.tipo_reajuste === 0 ? 'primary' : 'warning')">{{ reajuste.tipo_reajuste_nombre != null ? reajuste.tipo_reajuste_nombre : '--' }}</el-tag></td>
                        <td>
                          <el-tooltip :disabled="!reajuste.valor_dia" class="item" effect="dark" :content="reajuste.valor_dia" placement="top-start">
                            <span>{{ reajuste.monto_ajuste != null ? reajuste.monto_ajuste : '--' }}</span>
                          </el-tooltip>
                        </td>
                        <td><el-tag effect="dark" size="mini" :type="(reajuste.status === 0 ? 'info' : (reajuste.status === 1 ? 'success' : 'danger'))">{{ reajuste.status_nombre}}</el-tag></td>
                        <td @click.stop="">
                          <template v-if="recarga.last_status_value === 0 && hasPermission('ajuste.status')">
                            <template v-if="reajuste.status === 0">
                              <button @click.prevent="aprobarReajuste(index, reajuste.uuid, false)" class="button is-danger is-inverted"><span class="icon"><i class="el-icon-close"></i></span><span>Rechazar</span></button>
                              <el-popconfirm
                                  @confirm="aprobarReajuste(index, reajuste.uuid, true)"
                                  confirm-button-type="success"
                                  confirm-button-text='Si, aprobar'
                                  cancel-button-text='No'
                                  icon="el-icon-info"
                                  icon-color="warning"
                                  title="¿Aprobar reajuste?"
                                  >
                                  <button slot="reference" class="button is-success is-inverted" :class="(indexAjuste === index ? 'is-loading' : '')" @click.prevent="changeColorSelected(index)"><span class="icon"><i class="el-icon-check"></i></span><span>Aprobar</span></button>
                              </el-popconfirm>
                            </template>
                            <template v-if="reajuste.status === 1">
                              <button @click.prevent="aprobarReajuste(index, reajuste.uuid, false)" class="button is-danger is-inverted"><span class="icon"><i class="el-icon-close"></i></span><span>Rechazar</span></button>
                            </template>
                          </template>
                        </td>
                        <td>
                          <nuxt-link :to="`/admin/esquemas/${reajuste.esquema_uuid}/ajustes`"><el-button size="mini" type="primary" icon="el-icon-view" circle></el-button></nuxt-link>
                        </td>
                      </nuxt-link>
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
    <Transition name="slide-fade">
      <div v-if="showModal" class="modal is-large" :class="showModal ? 'is-active' : '' ">
        <modal-show-reajuste />
      </div>
    </Transition>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import MenuRecarga from '../../../../../components/admin/recargas/MenuRecarga.vue';
import MenuTotales from '../../../../../components/admin/recargas/MenuTotales.vue';
import ModalRechazarReajuste from '../../../../../components/admin/recargas/reajustes/ModalRechazarReajuste.vue';
import ModalShowReajuste from '../../../../../components/admin/recargas/reajustes/ModalShowReajuste.vue';
import ModalRechazar from '../../../../../components/recarga/ajustes/modalRechazar.vue';
export default {
  middleware: 'auth',
  components: { MenuTotales, MenuRecarga, ModalShowReajuste, ModalRechazarReajuste, ModalRechazar},
  head() {
      return{
        title: `Ajustes #${this.$route.params.id}`
      };
  },
  data(){
    return{
      uuid:'',
      index_color:undefined,
      setTimeoutBuscador:'',
      checkboxGroup4:[]
    };
  },
  created() {
      this.getAjustes(this.$route.params.id);
      this.getRolesPermissions();
  },
  computed:{
    ...mapGetters({
        fullScreenLoading: "recarga/ajustes/fullScreenLoading",
        loadingTable:'recarga/ajustes/loadingTable',
        recarga: "recarga/ajustes/recarga",
        ajustes:"recarga/ajustes/ajustes",
        indexAjuste:'recarga/ajustes/indexAjuste',
        estados:'recarga/ajustes/estados',
        tipoAjustes:'recarga/ajustes/tipoAjustes',
        pagination:'recarga/ajustes/pagination',
        offset:'recarga/ajustes/offset'
      }),
      permissions() {
        return this.$store.state.usuarios.administradores.main.permissions;
      },
      showModal:{
        get() {
          return this.$store.state.recarga.ajustes.modal_show;
        },
        set(newValue) {
          this.$store.commit('recarga/ajustes/SET_MODAL_SHOW', newValue);
        }
      },
      input_query:{
        get() {
          return this.$store.state.recarga.ajustes.filtro.input;
        },
        set(newValue) {
          this.$store.commit('recarga/ajustes/SET_FILTRO_INPUT', newValue);
        }
      },
      estados_filtro:{
        get() {
          return this.$store.state.recarga.ajustes.filtro.estados;
        },
        set(newValue) {
          this.$store.commit('recarga/ajustes/SET_FILTRO_ESTADO', newValue);
        }
      },
      tipos_filtro:{
        get() {
          return this.$store.state.recarga.ajustes.filtro.tipos;
        },
        set(newValue) {
          this.$store.commit('recarga/ajustes/SET_FILTRO_TIPO', newValue);
        }
      },
      rebaja_incremento:{
        get() {
          return this.$store.state.recarga.ajustes.filtro.rebaja_incremento;
        },
        set(newValue) {
          this.$store.commit('recarga/ajustes/SET_FILTRO_REBAJA_INCREMENTO', newValue);
        }
      },
      showModalRechazar:{
        get() {
          return this.$store.state.recarga.ajustes.modal_rechazar;
        },
        set(newValue) {
          this.$store.commit('recarga/ajustes/SET_MODAL_RECHAZAR', newValue);
        }
      },
      current_page:{
        get() {
          return this.$store.state.recarga.ajustes.pagination.current_page;
        },
        set(newValue) {
          this.$store.commit('recarga/ajustes/SET_CURRENT_PAGE', newValue);
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
        getAjustes: 'recarga/ajustes/getAjustes',
        validateReajuste:'recarga/ajustes/validateAjuste',
        getRolesPermissions:'usuarios/administradores/main/getRolesPermissions',
    }),
    keySearchInput:function(){
      if(this.input_query.length > 1){
          this.current_page = 1;
          clearTimeout(this.setTimeoutBuscador);
          this.setTimeoutBuscador = setTimeout(this.actionGetReajustesRecarga, 500);
      }
    },
    showReajuste:function(index){
      this.changeColorSelected(index);
      this.showModal = true;
    },
    actionGetReajustesRecarga:function(){
      this.getAjustes(this.$route.params.id);
    },
    aprobarReajuste:function(index, uuid, value){
      console.log(value);
      const data = {
        uuid:uuid,
        aprobar:value,
        index_reajuste:index
      };
      if(value){
        this.validateReajuste(data);
      }else{
        this.changeColorSelected(index);
        this.uuid = uuid;
        this.showModalRechazar = true;
      }
    },
    changeColorSelected:function(index){
      if(this.index_color === undefined){
          this.index_color = index;
      }else if(this.index_color != index){
          this.index_color = index;
      }
    },
    changePage(page) {
      this.current_page = page;
      this.actionGetReajustesRecarga();
    },
    hasPermission:function(permission){
      return this.permissions.includes(permission);
    },
  }
}
</script>

<style>

</style>
