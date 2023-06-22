<template>
  <div>
    <div class="modal is-large" :class="modal_add_esquema ? 'is-active' : '' ">
      <div class="modal-background" @click.prevent="hideModal"></div>
      <div class="modal-card" style="width: 90%;">
        <header class="modal-card-head">
            <p class="modal-card-title">Agregar nuevo esquema</p>
            <button class="delete" aria-label="close" @click.prevent="hideModal"></button>
        </header>
        <section class="modal-card-body">
          <div class="field">
            <div class="columns">
              <div class="column">
                <label class="label">Busque funcionario <i>(Solo se filtrarán funcionarios no asociados a esta recarga)</i></label>
                <el-select
                    @change="getContractualesFuncionario"
                    no-data-text="No se encontaron resultados..."
                    size="mini"
                    class="element-style"
                    v-model="new_esquema_funcionario"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="Busque por rut, nombre o apellidos del funcionario..."
                    :remote-method="searchFuncionarios"
                    :loading="loadingSearchFuncionario">
                    <el-option
                    v-for="funcionario in funcionariosNotRecarga"
                    :key="funcionario.id"
                    :label="`${funcionario.apellidos} ${funcionario.nombres} `"
                    :value="funcionario.id">
                    <span style="float: left">{{ funcionario.apellidos }} {{ funcionario.nombres }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ funcionario.rut_completo }}</span>
                    </el-option>
                </el-select>
              </div>
              <div class="column">
                <label class="label">Seleccione recarga adicional</label>
                <el-select @change="getContractualesFuncionario" :disabled="!new_esquema_funcionario || !recargasAdicional.length" v-model="new_esquema_funcionario_recargas" multiple collapse-tags size="small" class="element-style" placeholder="Seleccione recargas">
                  <el-option
                    v-for="recarga in recargasAdicional"
                    :disabled="recarga.codigo === $route.params.id"
                    :key="recarga.id"
                    :label="recarga.codigo"
                    :value="recarga.id">
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="field">
            <div class="columns">
              <div class="column">
                <h2 class="subtitle">Contratos</h2>
                <div class="table-container pt-2">
                  <template v-if="funcionarioManualContratos.length">
                    <table class="table is-bordered  is-narrow is-hoverable is-fullwidth">
                      <thead>
                          <tr>
                          <th>Fecha contrato</th>
                          <th>Fecha en periodo</th>
                          <th>Días hábiles</th>
                          <th>Unidad</th>
                          <th>Cargo</th>
                          <th>Ley</th>
                          <th>Horas</th>
                          <th>Alejamiento</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(contratos, index) in funcionarioManualContratos" :key="index">
                          <td>{{ contrato.fecha_inicio ? contrato.fecha_inicio : '--'}} / {{ contrato.fecha_termino ? contrato.fecha_termino : '--'}}</td>
                          <td class="has-text-weight-semibold">{{ contrato.fecha_inicio_periodo ? contrato.fecha_inicio_periodo : '--'}} / {{ contrato.fecha_termino_periodo ? contrato.fecha_termino_periodo : '--'}} ({{ contrato.total_dias_contrato_periodo }})</td>
                          <td class="has-text-weight-semibold" :class="(contrato.total_dias_habiles_contrato_periodo <= 0 ? 'has-text-danger-dark' : '')">{{ contrato.total_dias_habiles_contrato_periodo }}</td>
                          <td>{{ contrato.unidad_nombre ? contrato.unidad_nombre : '--'}}</td>
                          <td>{{ contrato.cargo_nombre ? contrato.cargo_nombre : '--'}}</td>
                          <td>{{ contrato.ley_nombre ? contrato.ley_nombre : '--'}}</td>
                          <td>{{ contrato.hora_nombre ? contrato.hora_nombre : '--'}}</td>
                          <td><span :class="(contrato.alejamiento ? 'tag is-danger is-light' : '')">{{ contrato.alejamiento ? 'Si' : '--' }} </span></td>
                        </tr>
                      </tbody>
                    </table>
                  </template>
                  <template v-else>
                    <div class="notification is-link is-light">
                      <p><strong>Sin resultados</strong></p>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
          <div class="field">
            <div class="columns">
              <div class="column">
                <h2 class="subtitle">Asignaciones</h2>
                <div class="table-container pt-2">
                  <template v-if="funcionarioManualAsignaciones.length">
                    <table class="table is-bordered  is-narrow is-hoverable is-fullwidth">
                      <thead>
                          <tr>
                            <th>Proceso</th>
                            <th>Año/Mes</th>
                            <th>A. 3° turno</th>
                            <th>B. asignación turno</th>
                            <th>A. 4° turno</th>
                            <th>Turno</th>
                          </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(asignacion, index) in funcionarioManualAsignaciones" :key="index">
                          <td>{{asignacion.nombre_proceso}}</td>
                          <td>{{asignacion.anio}}/{{asignacion.mes}}</td>
                          <td><span :class="asignacion.asignacion_tercer_turno > 0 ? 'has-text-danger' : '' ">{{asignacion.asignacion_tercer_turno}}</span></td>
                          <td><span :class="asignacion.bonificacion_asignacion_turno > 0 ? 'has-text-danger' : '' ">{{asignacion.bonificacion_asignacion_turno}}</span></td>
                          <td><span :class="asignacion.asignacion_cuarto_turno > 0 ? 'has-text-danger' : '' ">{{asignacion.asignacion_cuarto_turno}}</span></td>
                          <td><el-tag effect="dark" size="mini" :type="asignacion.asignacion_turno ? 'warning' : 'success'" disable-transitions>{{`${asignacion.asignacion_turno ? 'Si' : 'No'}`}}</el-tag></td>
                        </tr>
                      </tbody>
                    </table>
                  </template>
                  <template v-else>
                    <div class="notification is-link is-light">
                      <p><strong>Sin resultados</strong></p>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
          <div class="field">
            <div class="columns">
              <div class="column">
                <h2 class="subtitle">Asistencias</h2>
                <div class="table-container pt-2">
                  <template v-if="funcionarioManualAsistencias.length">
                    Días libres: {{funcionarioManualAsistencias}}
                  </template>
                  <template v-else>
                    <div class="notification is-link is-light">
                      <p><strong>Sin resultados</strong></p>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
          <div class="field">
            <div class="columns">
              <div class="column">
                <h2 class="subtitle">Ausentismos</h2>
                <div class="table-container pt-2">
                  <template v-if="funcionarioManualAusentismos.length">
                    <table class="table is-bordered  is-narrow is-hoverable is-fullwidth">
                      <thead>
                          <tr>
                            <th>Fecha</th>
                            <th>Fecha periodo</th>
                            <th>Días habiles</th>
                            <th>Grupo ausentismo</th>
                            <th>Tipo ausentismo</th>
                            <th>Descuento</th>
                          </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(ausentismo, index) in funcionarioManualAusentismos" :key="index">
                          <td>{{ausentismo.fecha_inicio}} / {{ausentismo.fecha_termino}} ({{ausentismo.total_dias_ausentismo}}d)</td>
                          <td><strong>{{ausentismo.fecha_inicio_periodo}}</strong> / <strong>{{ausentismo.fecha_termino_periodo}} ({{ausentismo.total_dias_ausentismo_periodo}}d)</strong></td>
                          <td>{{ausentismo.total_dias_habiles_periodo}}</td>
                          <td>{{ausentismo.nombre_grupo_ausentismo}}</td>
                          <td>{{ausentismo.nombre_tipo_ausentismo}}</td>
                          <td>{{ausentismo.tiene_descuento ? 'Si' : 'No'}}</td>
                        </tr>
                      </tbody>
                    </table>
                  </template>
                  <template v-else>
                    <div class="notification is-link is-light">
                      <p><strong>Sin resultados</strong></p>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
          <div class="field">
            <div class="columns">
              <div class="column">
                <h2 class="subtitle">Viáticos</h2>
                <div class="table-container pt-2">
                  <template v-if="funcionarioManualViaticos.length">
                    <table class="table is-bordered  is-narrow is-hoverable is-fullwidth">
                      <thead>
                          <tr>
                            <th>Fechas</th>
                            <th>Fechas periodo</th>
                            <th>Días habiles</th>
                            <th>Jornada</th>
                            <th>Tipo Comisión</th>
                            <th>Motivo</th>
                            <th>Valor</th>
                          </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(viatico, index) in funcionarioManualViaticos" :key="index">
                          <td>{{ viatico.fecha_inicio ? viatico.fecha_inicio : '--'}} / {{ viatico.fecha_termino ? viatico.fecha_termino : '--'}} (<strong>{{ viatico.total_dias }}</strong>d)</td>
                          <td>{{ viatico.fecha_inicio_periodo ? viatico.fecha_inicio_periodo : '--'}} / {{ viatico.fecha_termino_periodo ? viatico.fecha_termino_periodo : '--'}}</td>
                          <td class="has-text-weight-semibold" :class="(viatico.total_dias_habiles_periodo <= 0 ? 'has-text-danger-dark' : '')">{{ viatico.total_dias_habiles_periodo }}</td>
                          <td>{{ viatico.jornada ? viatico.jornada : '--'}}</td>
                          <td>{{ viatico.tipo_comision ? viatico.tipo_comision : '--'}}</td>
                          <td>{{ viatico.motivo_viatico ? viatico.motivo_viatico : '--'}}</td>
                          <td :class="(viatico.valor_viatico <= 0 ? 'has-text-danger-dark' : 'has-text-success-dark')">{{ viatico.valor_viatico ? viatico.valor_viatico : '--'}}</td>
                        </tr>
                      </tbody>
                    </table>
                  </template>
                  <template v-else>
                    <div class="notification is-link is-light">
                      <p><strong>Sin resultados</strong></p>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
          <div class="field">
            <div class="columns">
              <div class="column">
                <button class="button is-success is-rounded" :class="(loadingStoreEsquema ? 'is-loading' : '')" @click.prevent="storeEsquemaManualAction">Ingresar esquema</button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
export default {
  computed:{
    ...mapGetters({
      loadingSearchFuncionario:'recarga/resumen/resumen/loadingSearchFuncionario',
      funcionariosNotRecarga:'recarga/resumen/resumen/funcionariosNotRecarga',
      funcionarioRecargas:'recarga/resumen/resumen/funcionarioRecargas',
      loadingStoreEsquema:'recarga/resumen/resumen/loadingStoreEsquema',
      funcionarioManualAusentismos:'recarga/resumen/resumen/funcionarioManualAusentismos',
      funcionarioManualViaticos:'recarga/resumen/resumen/funcionarioManualViaticos',
      funcionarioManualAsistencias:'recarga/resumen/resumen/funcionarioManualAsistencias',
      funcionarioManualAsignaciones:'recarga/resumen/resumen/funcionarioManualAsignaciones',
      funcionarioManualContratos:'recarga/resumen/resumen/funcionarioManualContratos',
      recargasAdicional:'recarga/resumen/resumen/recargasAdicional',
    }),
    modal_add_esquema:{
       get(){
        return this.$store.state.recarga.resumen.resumen.modal_add_esquema;
      },
      set(newValue){
        this.$store.commit('recarga/resumen/resumen/SET_MODAL_ADD_ESQUEMA', newValue);
      }
    },
    new_esquema_funcionario:{
      get(){
        return this.$store.state.recarga.resumen.resumen.new_esquema.funcionario_id;
      },
      set(newValue){
        this.$store.commit('recarga/resumen/resumen/NEW_ESQUEMA_FUNCIONARIO', newValue);
      }
    },
    new_esquema_funcionario_recargas:{
      get(){
        return this.$store.state.recarga.resumen.resumen.new_esquema.recargas_id;
      },
      set(newValue){
        this.$store.commit('recarga/resumen/resumen/NEW_ESQUEMA_FUNCIONARIO_RECARGAS', newValue);
      }
    }
  },
  methods:{
    ...mapActions({
      closeModal:'recarga/resumen/resumen/closeModalAddEsquema',
      getFuncionariosNotRecarga:'recarga/resumen/resumen/getFuncionariosNotRecarga',
      storeEsquemaManual:'recarga/resumen/resumen/storeEsquemaManual',
      getDatosContractualesFuncionarioAction:'recarga/resumen/resumen/getDatosContractualesFuncionario',
      getRecargasAdicionalesAction:'recarga/resumen/resumen/getRecargasAdicionales'
    }),
    hideModal:function(){
      this.closeModal();
    },
    searchFuncionarios:function(query){
      this.new_esquema_funcionario_recargas = [];
      const data = {
        codigo:this.$route.params.id,
        input:query
      };
      this.getFuncionariosNotRecarga(data);
    },
    getContractualesFuncionario:function(){
      this.new_esquema_funcionario_recargas = [this.$route.params.id];
      const data = {
        codigos_recarga:this.new_esquema_funcionario_recargas,
        funcionario_id:this.new_esquema_funcionario
      };
      const data_2 = {
        codigo_recarga:this.$route.params.id,
        funcionario_id:this.new_esquema_funcionario
      };
      this.getRecargasAdicionalesAction(data_2);
      this.getDatosContractualesFuncionarioAction(data);
    },
    storeEsquemaManualAction:function(){
      const data = {
        codigo:this.$route.params.id,
        funcionario_id:this.new_esquema_funcionario,
        codigos_recarga:this.new_esquema_funcionario_recargas
      };
      this.storeEsquemaManual(data);
    },
  }
}
</script>

<style>

</style>
