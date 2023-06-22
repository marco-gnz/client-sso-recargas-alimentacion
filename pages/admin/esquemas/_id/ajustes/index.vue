<template>
  <div>
    <div v-loading.fullscreen.lock="fullScreenLoading" element-loading-text="Cargando datos..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.9)">
      <template v-if="(esquema)">
        <HeroEsquema namepage="Ajustes"/>
      </template>
      <div class="container.is-fullhd">
        <EsquemaHeader />
        <div class="card p-6 m-6">
          <EsquemaNav />
          <ModalRechazarReajuste :uuid="uuid" />
          <ModalAddReajusteEsquema :esquema="esquema" :tipo_reajuste="tipo_reajuste" />
          <div class="card p-6 m-6">
            <template v-if="esquema.last_status_value === 0 && hasPermission('ajuste.create')">
              <div class="buttons">
                <el-dropdown>
                  <el-button type="primary">Ingresar ajuste<i class="el-icon-arrow-down el-icon--right"></i></el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="openModalAddReajuste(0)">Reajuste de días</el-dropdown-item>
                    <el-dropdown-item @click.native="openModalAddReajuste(1)">Reajuste de montos</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </template>
            <div class="columns">
              <div class="column is-full">
                <div class="table-container pt-2">
                  <template v-if="ajustes.length">
                  <span class="tag is-info is-light">{{ `${ajustes.length} ${ajustes.length > 1 ? `resultados` : `resultado`}` }}</span>
                    <table class="table  is-narrow is-hoverable is-fullwidth" >
                      <thead>
                        <tr>
                          <th>Fecha</th>
                          <th>Días</th>
                          <th>Rebaja/Incremento</th>
                          <th>Causal</th>
                          <th>Tipo ajuste</th>
                          <th>Monto ajuste</th>
                          <th>Estado</th>
                          <th>Observación</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                          <nuxt-link @click.native="showReajuste(index)" v-for="(reajuste, index) in ajustes" :key="index" :class="(index_color === index ? 'row-selected' : '')" class="click" tag="tr" :to="{path: `/admin/esquemas/${$route.params.id}/ajustes`, query: { id: reajuste.uuid }}" >
                          <td>{{ reajuste.fecha_inicio }} / {{ reajuste.fecha_termino }} ({{reajuste.dias_periodo}}) </td>
                          <td>{{reajuste.total_dias}}</td>
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
                            <template v-if="esquema.last_status_value === 0 && hasPermission('ajuste.status')">
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
                                    <button :class="(index_reajuste === index ? 'is-loading' : '')" @click.prevent="changeColorSelected(index)" slot="reference" class="button is-success is-inverted"><span class="icon"><i class="el-icon-check"></i></span><span>Aprobar</span></button>
                                </el-popconfirm>
                              </template>
                              <template v-if="reajuste.status === 1">
                                <button @click.prevent="aprobarReajuste(index, reajuste.uuid, false)" class="button is-danger is-inverted"><span class="icon"><i class="el-icon-close"></i></span><span>Rechazar</span></button>
                              </template>
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
            <template v-if="esquema.user_created_by">
              <FooterEsquema/>
            </template>
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
import EsquemaHeader from '../../../../../components/admin/esquema/EsquemaHeader.vue';
import EsquemaNav from '../../../../../components/admin/esquema/EsquemaNav.vue';
import FooterEsquema from '../../../../../components/admin/esquema/FooterEsquema.vue';
import HeroEsquema from '../../../../../components/admin/esquema/HeroEsquema.vue';
import ModalAddReajusteEsquema from '../../../../../components/admin/esquema/ModalAddReajusteEsquema.vue';
import ModalAddReajusteResumen from '../../../../../components/admin/recargas/reajustes/ModalAddReajusteResumen.vue';
import ModalRechazarReajuste from '../../../../../components/admin/recargas/reajustes/ModalRechazarReajuste.vue';
import ModalShowReajuste from '../../../../../components/admin/recargas/reajustes/ModalShowReajuste.vue';
export default {
  components: { EsquemaHeader, HeroEsquema, EsquemaNav, ModalAddReajusteResumen, ModalRechazarReajuste, ModalAddReajusteEsquema, ModalShowReajuste, FooterEsquema },
  middleware: "auth",
    head() {
      return {
          title: `Ajustes`
      };
    },
    data(){
      return{
        uuid:'',
        index_color:undefined,
        tipo_reajuste:null
      };
    },
    created(){
      this.getRolesPermissions();
      const data = {
            uuid:this.$route.params.id,
        };
        this.getEsquemaAjustes(data);
    },
    computed:{
      ...mapGetters({
            fullScreenLoading: "esquemas/esquemaFuncionario/fullScreenLoading",
            esquema: "esquemas/esquemaFuncionario/esquema",
            ajustes: "esquemas/esquemaFuncionario/ajustes",
        }),
        permissions() {
          return this.$store.state.usuarios.administradores.main.permissions;
        },
        showModal:{
          get() {
            return this.$store.state.recargas.reajustes.modal_show;
          },
          set(newValue) {
            this.$store.commit('recargas/reajustes/SET_MODAL_SHOW', newValue);
          }
        },
        index_reajuste:{
          get() {
            return this.$store.state.esquemas.esquemaFuncionario.index_reajuste;
          },
          set(newValue) {
            this.$store.commit('esquema/esquemaFuncionario/SET_INDEX_REAJUSTES', newValue);
          }
        },
    },
    methods:{
      ...mapActions({
        getEsquemaAjustes:'esquemas/esquemaFuncionario/getEsquemaAjustes',
        validateReajuste:'esquemas/esquemaFuncionario/validateReajuste',
        getRolesPermissions:'usuarios/administradores/main/getRolesPermissions',
      }),
      openModalAddReajuste:function(tipo_reajuste){
        this.tipo_reajuste = tipo_reajuste;
        this.$store.commit('esquemas/esquemaFuncionario/SET_MODAL_REAJUSTE', true);
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
          this.$store.commit('esquemas/esquemaFuncionario/SET_MODAL_RECHAZAR', true);
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
      },
      hasPermission:function(permission){
        return this.permissions.includes(permission);
      },
    }
}
</script>

<style>

</style>
