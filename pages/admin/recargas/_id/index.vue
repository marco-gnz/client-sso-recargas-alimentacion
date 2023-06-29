<template>
  <div v-loading.fullscreen.lock="loadingSpinner" element-loading-text="Cargando datos..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.9)">
    <template v-if="recarga">
      <Hero namepage="Información general" :recarga="recarga" />
    </template>
    <div class="container.is-fullhd">
      <MenuTotales :recarga="recarga" />
      <template v-if="recarga">
        <div class="card p-2 m-2">
          <MenuRecarga :codigo="$route.params.id" :recarga="recarga" />
          <div class="columns">
            <div class="column is-one-fifth box">
              <h5 class="title is-5">Datos principales de recarga</h5>
              <div class="field">
                <label class="label">Monto a cancelar por día</label>
                <template v-if="recarga.last_status_value === 0 && hasPermission('recarga.update')">
                  <input v-model="form_monto_dia" class="input" type="email" placeholder="Ingrese cantidad de días habiles">
                  <p v-if="errors.monto_dia" class="help is-danger">{{errors.monto_dia[0]}}</p>
                </template>
                <template v-else>
                  <p>{{`$${form_monto_dia}`}}</p>
                </template>
              </div>
              <div class="field">
                <div class="buttons is-right">
                  <button :disabled="disabledButtonEdit" class="button is-link is-light" :class="(loadingEditDatosPersonales ? 'is-loading' : '')" @click.prevent="editarGeneral">Editar y sincronizar</button>
                </div>
              </div>
            </div>
            <div class="column is-half box">
              <h5 class="title is-5">Reglas de ausentismos</h5>
              <template v-if="(reglas) && (reglas.length)">
                <div class="table-container">
                  <table class="table is-striped is-narrow is-hoverable is-fullwidth">
                  <thead>
                    <tr>
                      <th>Ausentismo</th>
                      <th>Grupo</th>
                      <th>Turnante</th>
                      <th>Regla</th>
                      <th>N° </th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(regla, index) in reglas" :key="index">
                      <td>{{`${regla.nombre_tipo_ausentismo != null ? regla.nombre_tipo_ausentismo : '--'}`}}</td>
                      <td>
                        <span class="tag is-light" :class="regla.numero_grupo === 1 ? 'is-link' : (regla.numero_grupo === 2 ? 'is-warning' : 'is-danger') ">{{`${regla.nombre_grupo != null ? regla.nombre_grupo : '--'}`}}</span>
                      </td>
                      <td>
                        <span class="tag" :class="(regla.value_turno_funcionario != null ? `${regla.value_turno_funcionario ? 'is-warning' : 'is-info'}` : 'is-light')">{{ (regla.value_turno_funcionario != null ? `${regla.value_turno_funcionario ? 'Si' : 'No'}` : 'N/A') }}</span>
                      </td>
                      <td>
                        <template v-if="regla.numero_grupo === 1">
                          <template v-if="regla.active_tipo_dias">
                            <p>{{regla.tipo_dias}}</p>
                          </template>
                          <template v-else>
                            <p>FuncionarioTurno</p>
                          </template>
                        </template>
                        <template v-if="regla.numero_grupo === 2">
                          <template v-if="(regla.meridianos) && (regla.meridianos.length)">
                            <div class="columns">
                              <div class="column" v-for="(meridiano, index) in regla.meridianos" :key="index">
                                <p :class="(meridiano.pivot.active ? 'has-text-success-dark' : 'has-text-danger-dark')">{{ meridiano.nombre }}</p>
                              </div>
                            </div>
                          </template>
                          <template v-else>
                            <span>Sin resultados</span>
                          </template>
                        </template>
                        <template v-if="regla.numero_grupo === 3">
                          <template v-if="regla.horarios">
                            <p v-for="(horario, index) in regla.horarios" :key="index">{{ horario.hora_inicio }} a {{ horario.hora_termino }} hrs.</p>
                          </template>
                          <template v-else>
                            --
                          </template>
                        </template>
                      </td>
                      <td>
                       <p :class="(regla.count_ausentismos <= 0 ? 'has-text-danger-dark' : 'has-text-weight-semibold')">{{ regla.count_ausentismos }}</p>
                      </td>
                      <td>
                        <nuxt-link v-if="(recarga.last_status_value === 0 && hasPermission('regla.update')) && (regla.count_ausentismos <= 0)" @click.native="editRegla(index)" :to="{path: `/admin/recargas/${$route.params.id}`, query: { id: regla.id }}"><el-button size="mini" type="primary" icon="el-icon-edit" circle></el-button></nuxt-link>
                        <template v-if="(recarga.last_status_value === 0 && hasPermission('regla.delete')) && (regla.count_ausentismos <= 0)">
                          <el-popconfirm
                              @confirm="deleteReglaAction(regla.id)"
                              confirm-button-text='Si, eliminar'
                              cancel-button-text='No'
                              icon="el-icon-info"
                              icon-color="red"
                              title="¿Eliminar regla?"
                              >
                              <el-button :class="(loadingDeleteRegla ? 'is-loading' : '')" type="danger" slot="reference" icon="el-icon-delete" size="mini" circle></el-button>
                          </el-popconfirm>
                        </template>
                      </td>
                    </tr>
                  </tbody>
                </table>
                </div>
              </template>
              <template v-else>
                <el-empty :image-size="50">
                    <div class="row" slot="description">
                    <div class="col-md-12"><span>Sin reglas de ausentismos...</span></div>
                    </div>
                </el-empty>
              </template>
            </div>
            <div class="column box">
              <h5 class="title is-5">Feriados asociados</h5>
              <template v-if="(feriados) && (feriados.length)">
                <table class="table is-striped is-narrow is-hoverable is-fullwidth">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Nombre</th>
                      <th>Irrenunciable</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(feriado, index) in feriados" :key="index">
                      <td>
                        <el-tooltip class="item" effect="dark" :content="feriado.fecha_larga" placement="top-start">
                          <p>{{ feriado.fecha_corta }}</p>
                        </el-tooltip>
                      </td>
                      <td>{{ feriado.nombre }}</td>
                      <td>{{ feriado.irrenunciable }}</td>
                      <td>
                        <template v-if="recarga.last_status_value === 0">
                          <el-popconfirm
                            @confirm="deleteFeriadoAction(index, feriado.id)"
                            confirm-button-text='Si, eliminar'
                            cancel-button-text='No'
                            icon="el-icon-info"
                            icon-color="red"
                            title="¿Eliminar feriado?"
                            >
                            <el-button type="danger" slot="reference" icon="el-icon-delete" size="mini" circle></el-button>
                          </el-popconfirm>
                        </template>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </template>
              <template v-else>
                <el-empty :image-size="50">
                    <div class="row" slot="description">
                    <div class="col-md-12"><span>Sin feriados asociados...</span></div>
                    </div>
                </el-empty>
              </template>
            </div>
          </div>
      </div>
    </template>
    </div>
    <Transition name="slide-fade">
      <div v-if="open_modal_edit_regla" class="modal is-large" :class="open_modal_edit_regla ? 'is-active' : '' ">
        <ModalEditRegla />
      </div>
    </Transition>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import ModalEditRegla from '../../../../components/admin/recargas/informacion/ModalEditRegla.vue';
import MenuRecarga from '../../../../components/admin/recargas/MenuRecarga.vue';
import MenuTotales from '../../../../components/admin/recargas/MenuTotales.vue';
export default {
    middleware: 'auth',
    head() {
        return {
            title: `Información #${this.$route.params.id}`
        };
    },
    data(){
      return{
        disabledButtonEdit:true
      };
    },
    created() {
      this.getRolesPermissions();
      this.getRecarga(this.$route.params.id);
    },
    computed: {
        ...mapGetters({
            loadingSpinner: "recargas/recargas/fullScreenLoading",
            recarga: "recargas/recargas/recarga",
            errors:'recargas/recargas/errors',
            feriados:'recargas/recargas/feriados',
            reglas:'recargas/recargas/reglas',
            loadingEditDatosPersonales:'recargas/recargas/loadingEditDatosPersonales',
            loadingDeleteRegla:'recargas/recargas/loadingDeleteRegla'
        }),
        form_total_dias_habiles:{
          get() {
            return this.recarga.total_dias_habiles;
          },
          set(newValue) {
            this.disabledButtonEdit = false;
            this.$store.commit('recargas/recargas/SET_TOTAL_DIAS_HABILES', newValue);
          }
        },
        form_monto_dia:{
          get() {
            return this.recarga.value_monto_dia;
          },
          set(newValue) {
            this.disabledButtonEdit = false;
            this.$store.commit('recargas/recargas/SET_MONTO_DIA', newValue);
          }
        },
        open_modal_edit_regla:{
          get() {
            return this.$store.state.recargas.recargas.modal_edit_regla;
          },
          set(newValue) {
            this.$store.commit('recargas/recargas/SET_MODAL_EDIT_REGLA', newValue);
          }
        },
        permissions() {
          return this.$store.state.usuarios.administradores.main.permissions;
        },
    },
    methods: {
        ...mapActions({
            getRecarga: "recargas/recargas/returnRecarga",
            updateDatosPrincipales: "recargas/recargas/updateDatosPrincipales",
            deleteFeriadoInRecarga:'recargas/recargas/deleteFeriadoInRecarga',
            deleteRegla:'recargas/recargas/deleteReglaInRecarga',
            getRolesPermissions:'usuarios/administradores/main/getRolesPermissions'
        }),
        editarGeneral:function(){
          this.$confirm(`Al editar los días habiles y el monto a cancelar por día, se realizará un proceso para recalcular masivamente la Tabla Resumen con los nuevos datos editados. ¿Desea editar y sincronizar los datos?`, 'Advertencia', {
            confirmButtonText: 'Si, editar y sincronizar',
            cancelButtonText: 'Cancelar',
            type: 'warning'
          }).then(() => {
            this.updateDatosPrincipales(this.recarga.id);
          });
        },
        deleteReglaAction:function(id_regla){
          this.deleteRegla(id_regla);
        },
        deleteFeriadoAction:function(index, id_recarga){
          const data = {
            id_recarga:id_recarga,
            codigo_recarga:this.$route.params.id
          };
          this.deleteFeriadoInRecarga(data);
        },
        editRegla:function(regla_id){
          this.open_modal_edit_regla = true;
        },
        hasPermission:function(permission){
          return this.permissions.includes(permission);
        }
    },
    components: { MenuRecarga, MenuTotales, ModalEditRegla }
}
</script>

<style>

</style>
