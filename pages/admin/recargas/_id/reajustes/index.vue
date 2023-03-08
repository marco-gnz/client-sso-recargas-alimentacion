<template>
  <div v-loading.fullscreen.lock="loadingSpinner" element-loading-text="Cargando datos..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.9)">
    <template v-if="recarga">
      <Hero namepage="Ajuste de días y montos" :recarga="recarga" />
    </template>
    <div class="container.is-fullhd">
      <MenuTotales  :recarga="recarga" />
      <div class="card p-2 m-2">
        <MenuRecarga :codigo="$route.params.id" />
        <modal-rechazar-reajuste :uuid="uuid" />
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
                      <el-checkbox-group  v-model="estados" size="mini" @change="actionGetReajustesRecarga">
                        <el-checkbox-button :disabled="loadingTable" v-for="(estado, index) in reajustes.estados" :key="index" :label="estado.id">{{estado.nombre}}</el-checkbox-button>
                      </el-checkbox-group>
                    </div>
                  </div>
                  <div class="column">
                    <div class="pt-2">
                      <label class="label">Filtrar por tipo</label>
                      <el-checkbox-group v-model="tipos" size="mini" @change="actionGetReajustesRecarga">
                        <el-checkbox-button :disabled="loadingTable" v-for="(tipo, index) in reajustes.tipo_ajustes" :key="index" :label="tipo.id">{{tipo.nombre}}</el-checkbox-button>
                      </el-checkbox-group>
                    </div>
                  </div>
                </div>
                <span v-if="(reajustes.data) && (reajustes.data.length)" class="tag is-info is-light">{{ `${reajustes.data.length} ${reajustes.data.length > 1 ? `resultados` : `resultado`}` }}</span>
                <table class="table  is-narrow is-hoverable is-fullwidth" v-loading="loadingTable" >
                  <thead>
                    <tr>
                      <th>Nombres</th>
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
                    <template v-if="(reajustes.data) && (reajustes.data.length)">
                      <nuxt-link @click.native="showReajuste(index)" v-for="(reajuste, index) in reajustes.data" :key="index" :class="(index_color === index ? 'row-selected' : '')" class="click" tag="tr" :to="{path: `/admin/recargas/${$route.params.id}/reajustes`, query: { id: reajuste.uuid }}">
                        <td>{{ reajuste.nombres_funcionario != null ? reajuste.nombres_funcionario : '--' }}</td>
                        <td>{{ reajuste.fecha_inicio }} / {{ reajuste.fecha_termino }}</td>
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
                        <td><span class="has-text-weight-semibold">{{ reajuste.dias }}</span></td>
                        <td><el-tag size="mini" effect="dark" :type="(reajuste.tipo_reajuste === 0 ? 'primary' : 'warning')">{{ reajuste.tipo_reajuste_nombre != null ? reajuste.tipo_reajuste_nombre : '--' }}</el-tag></td>
                        <td>
                          <el-tooltip :disabled="!reajuste.valor_dia" class="item" effect="dark" :content="reajuste.valor_dia" placement="top-start">
                            <span>{{ reajuste.monto_ajuste != null ? reajuste.monto_ajuste : '--' }}</span>
                          </el-tooltip>
                        </td>
                        <td><el-tag effect="dark" size="mini" :type="(reajuste.status === 0 ? 'info' : (reajuste.status === 1 ? 'success' : 'danger'))">{{ reajuste.status_nombre}}</el-tag></td>
                        <td @click.stop="">
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
                                <button slot="reference" class="button is-success is-inverted" :class="(indexReajustes === index ? 'is-loading' : '')" @click.prevent="changeColorSelected(index)"><span class="icon"><i class="el-icon-check"></i></span><span>Aprobar</span></button>
                            </el-popconfirm>
                          </template>
                          <template v-if="reajuste.status === 1">
                            <button @click.prevent="aprobarReajuste(index, reajuste.uuid, false)" class="button is-danger is-inverted"><span class="icon"><i class="el-icon-close"></i></span><span>Rechazar</span></button>
                          </template>
                        </td>
                        <td>
                          <nuxt-link :to="`/admin/recargas/${$route.params.id}/resumen/${reajuste.uuid_funcionario}/reajustes`"><el-button size="mini" type="primary" icon="el-icon-view" circle></el-button></nuxt-link>
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
            </div>
          </div>
        </div>
      </div>
    </div>
    <Transition name="slide-fade">
      <div v-if="modalShow" class="modal is-large" :class="modalShow ? 'is-active' : '' ">
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
export default {
  middleware: 'auth',
  components: { MenuTotales, MenuRecarga, ModalShowReajuste, ModalRechazarReajuste},
  head() {
      return{
        title: `Asistencia #${this.$route.params.id}`
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
      this.getRecarga(this.$route.params.id);
      this.getReajustesRecarga(this.$route.params.id);
  },
  computed:{
    ...mapGetters({
        modalShow:'recargas/reajustes/modalShow',
        loadingSpinner: "recargas/recargas/fullScreenLoading",
        recarga: "recargas/recargas/recarga",
        reajustes:"recargas/reajustesResumen/reajustes",
        indexReajustes:'recargas/reajustes/indexReajustes',
        loadingTable:'recargas/reajustesResumen/loadingTable'
      }),
      showModal:{
        get() {
          return this.$store.state.recargas.reajustes.modal_show;
        },
        set(newValue) {
          this.$store.commit('recargas/reajustes/SET_MODAL_SHOW', newValue);
        }
      },
      input_query:{
        get() {
          return this.$store.state.recargas.reajustesResumen.filtro.input;
        },
        set(newValue) {
          this.$store.commit('recargas/reajustesResumen/SET_FILTRO_INPUT', newValue);
        }
      },
      estados:{
        get() {
          return this.$store.state.recargas.reajustesResumen.filtro.estados;
        },
        set(newValue) {
          this.$store.commit('recargas/reajustesResumen/SET_FILTRO_ESTADO', newValue);
        }
      },
      tipos:{
        get() {
          return this.$store.state.recargas.reajustesResumen.filtro.tipos;
        },
        set(newValue) {
          this.$store.commit('recargas/reajustesResumen/SET_FILTRO_TIPO', newValue);
        }
      },
  },
  methods:{
    ...mapActions({
        getRecarga: "recargas/recargas/returnRecarga",
        getReajustesRecarga: 'recargas/reajustesResumen/getReajustesRecarga',
        validateReajuste:'recargas/reajustesResumen/validateReajuste'
    }),
    keySearchInput:function(){
      if(this.input_query.length > 1){
          clearTimeout(this.setTimeoutBuscador);
          this.setTimeoutBuscador = setTimeout(this.actionGetReajustesRecarga, 500);
      }
    },
    showReajuste:function(index){
      this.changeColorSelected(index);
      this.showModal = true;
    },
    actionGetReajustesRecarga:function(){
      this.getReajustesRecarga(this.$route.params.id);
    },
    aprobarReajuste:function(index, uuid, value){
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
        this.$store.commit('recargas/reajustes/SET_MODAL_RECHAZAR', true);
      }
    },
    changeColorSelected:function(index){
      if(this.index_color === undefined){
          this.index_color = index;
      }else if(this.index_color != index){
          this.index_color = index;
      }
    },
  }
}
</script>

<style>

</style>
