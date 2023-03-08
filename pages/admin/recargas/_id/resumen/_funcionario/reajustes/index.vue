<template>
  <div v-loading.fullscreen.lock="loadingSpinner" element-loading-text="Cargando datos..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.9)">
    <template v-if="(funcionario)">
      <HeroUser namepage="Ajustes" :funcionario="funcionario" :recarga="recarga" />
    </template>
    <div class="container.is-fullhd">
      <MenuTotalesFuncionario :funcionario="funcionario" />
      <div class="card p-6 m-6">
        <MenuFuncionario />
        <ModalRechazarReajuste :uuid="uuid" />
        <modal-add-reajuste-resumen :funcionario="funcionario" :tipo_reajuste="tipo_reajuste"  />
        <div class="card p-6 m-6">
          <div class="buttons">
            <el-dropdown>
              <el-button type="primary">Ingresar ajuste<i class="el-icon-arrow-down el-icon--right"></i></el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="openModalAddReajuste(0)">Reajuste de días</el-dropdown-item>
                <el-dropdown-item @click.native="openModalAddReajuste(1)">Reajuste de montos</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="columns">
            <div class="column is-full">
              <div class="table-container pt-2">
                <template v-if="reajustes.length">
                  <span class="tag is-info is-light">{{ `${reajustes.length} ${reajustes.length > 1 ? `resultados` : `resultado`}` }}</span>
                  <table class="table  is-narrow is-hoverable is-fullwidth" v-loading="loadingTableReajustes" element-loading-text="Cargando resultados...">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Rebaja/Incremento</th>
                        <th>Causal</th>
                        <th>Días</th>
                        <th>Tipo ajuste</th>
                        <th>Monto ajuste</th>
                        <th>Estado</th>
                        <th>Observación</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                        <nuxt-link @click.native="showReajuste(index)" v-for="(reajuste, index) in reajustes" :key="index" :class="(index_color === index ? 'row-selected' : '')" class="click" tag="tr" :to="{path: `/admin/recargas/${$route.params.id}/resumen/${$route.params.funcionario}/reajustes`, query: { id: reajuste.uuid }}" >
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
                        <td>
                          {{ reajuste.observacion != null ? `${reajuste.observacion.substring(0, 16)}...`  : '--' }}
                        </td>
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
                                <button :class="(indexReajustes === index ? 'is-loading' : '')" @click.prevent="changeColorSelected(index)" slot="reference" class="button is-success is-inverted"><span class="icon"><i class="el-icon-check"></i></span><span>Aprobar</span></button>
                            </el-popconfirm>
                          </template>
                          <template v-if="reajuste.status === 1">
                            <button @click.prevent="aprobarReajuste(index, reajuste.uuid, false)" class="button is-danger is-inverted"><span class="icon"><i class="el-icon-close"></i></span><span>Rechazar</span></button>
                          </template>
                        </td>
                      </nuxt-link>
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
import MenuFuncionario from '../../../../../../../components/admin/recargas/MenuFuncionario.vue';
import MenuTotalesFuncionario from '../../../../../../../components/admin/recargas/MenuTotalesFuncionario.vue';
import ModalAddReajusteResumen from '../../../../../../../components/admin/recargas/reajustes/ModalAddReajusteResumen.vue';
import ModalRechazarReajuste from '../../../../../../../components/admin/recargas/reajustes/ModalRechazarReajuste.vue';
import ModalShowReajuste from '../../../../../../../components/admin/recargas/reajustes/ModalShowReajuste.vue';
export default {
  components: { MenuTotalesFuncionario, MenuFuncionario, ModalShowReajuste, ModalRechazarReajuste, ModalAddReajusteResumen },
  middleware: "auth",
  head() {
      return {
          title: `#${this.$route.params.id} ${this.funcionario != '' ? `- ${this.funcionario.apellidos}` : ''}`
      };
  },
  data(){
    return{
      uuid:'',
      index_color:undefined,
      tipo_reajuste:null
    };
  },
  mounted(){
    this.openModalCheck();
  },
  created(){
    const data = {
      id:this.$route.params.id,
      funcionario:this.$route.params.funcionario,
    };
    this.getFuncionario(this.$route.params, this.$route.params.funcionario);
    this.getReajustes(data);
  },
  computed:{
    ...mapGetters({
      modalShow:'recargas/reajustes/modalShow',
      loadingSpinner: "recargas/funcionario/fullScreenLoading",
      funcionario:'recargas/funcionario/funcionario',
      loadingTableReajustes:'recargas/funcionario/loadingTableReajustes',
      reajustes:'recargas/reajustes/reajustes',
      indexReajustes:'recargas/reajustes/indexReajustes',
      totalDias:'recargas/reajustes/totalDias',
      recarga:'recargas/reajustes/recarga'
    }),
    showModal:{
      get() {
        return this.$store.state.recargas.reajustes.modal_show;
      },
      set(newValue) {
        this.$store.commit('recargas/reajustes/SET_MODAL_SHOW', newValue);
      }
    },
  },
  methods:{
    ...mapActions({
      getFuncionario:'recargas/funcionario/getFuncionario',
      getReajustes:'recargas/reajustes/getReajustes',
      getReajuste:'recargas/reajustes/getReajuste',
      validateReajuste:'recargas/reajustes/validateReajuste'
    }),
    openModalAddReajuste:function(tipo_reajuste){
      this.tipo_reajuste = tipo_reajuste;
      this.$store.commit('recargas/resumen/SET_MODAL_REAJUSTE', true);
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
    openModalCheck(){
      if(this.$nuxt.$route.fullPath === `/admin/recargas/${this.$route.params.id}/resumen/${this.$route.params.funcionario}/reajustes?id=${this.$route.query.id}`){
        this.showModal = true;
      }
    },
    changeColorSelected:function(index){
      if(this.index_color === undefined){
          this.index_color = index;
      }else if(this.index_color != index){
          this.index_color = index;
      }
    },
    showReajuste:function(index){
      this.changeColorSelected(index);
      this.showModal = true;
    }
  }
}
</script>

<style>
.slide-fade-enter-active {
  transition: all 0.9s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
