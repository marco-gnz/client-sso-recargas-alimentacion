<template>
  <div>
    <div class="modal is-large" :class="openModalReajuste ? 'is-active' : '' ">
      <div class="modal-background" @click.prevent="hideModalReajuste"></div>
      <div class="modal-card" style="width: 50%;">
        <header class="modal-card-head">
          <p class="modal-card-title">Ingresar nuevo ajuste de {{ tipo_reajuste === 1 ? 'montos' : 'días' }}</p>
          <button class="delete" aria-label="close" @click.prevent="hideModalReajuste"></button>
        </header>
        <section class="modal-card-body">
          <div class="columns">
            <div class="column">
              <p class="subtitle">{{ `${esquema != null ? `${esquema.nombre_completo}` : ``}` }}</p>
              <div class="field">
                <div class="columns">
                  <div class="column">
                    <div class="field">
                      <label class="label required">Fecha de inicio</label>
                      <el-date-picker
                        @change="getDaysInDateAction"
                        v-model="fecha_inicio"
                        format="dd-MM-yyyy"
                        value-format="yyyy-MM-dd"
                        class="element-select is-rounded"
                        type="date"
                        size="small"
                        placeholder="Seleccione fecha de inicio">
                      </el-date-picker>
                      <p v-if="errors && errors.fecha_inicio" class="help is-danger">{{errors.fecha_inicio[0]}}</p>
                    </div>
                  </div>
                  <div class="column">
                    <div class="field">
                      <label class="label required">Fecha de término</label>
                      <el-date-picker
                        @change="getDaysInDateAction"
                        v-model="fecha_termino"
                        format="dd-MM-yyyy"
                        value-format="yyyy-MM-dd"
                        class="element-select is-rounded"
                        type="date"
                        size="small"
                        placeholder="Seleccione fecha de término">
                      </el-date-picker>
                      <p v-if="errors && errors.fecha_termino" class="help is-danger">{{errors.fecha_termino[0]}}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="field">
                <div class="columns">
                  <div class="column">
                    <div class="field">
                      <label class="label required">Tipo de reajuste</label>
                      <el-radio-group v-model="rebaja_dias" @change="getDaysInDateAction">
                        <el-radio :label="0">Rebaja de días</el-radio>
                        <el-radio :label="1">Incremento de días</el-radio>
                      </el-radio-group>
                      <p v-if="errors && errors.tipo_reajuste" class="help is-danger">{{errors.tipo_reajuste[0]}}</p>
                    </div>
                  </div>
                  <div class="column">
                    <template>
                      <div class="field">
                        <template v-if="(rebaja_dias === 0)">
                          <label class="label required">Causal rebaja de días</label>
                            <el-select v-model="tipo_ausentismo" size="small" class="element-style" placeholder="Seleccione causal">
                              <el-option
                                v-for="tipo in tiposDeAusentismo"
                                :key="tipo.id"
                                :label="tipo.nombre"
                                :value="tipo.id">
                              </el-option>
                            </el-select>
                            <p v-if="errors && errors.tipo_ausentismo_id" class="help is-danger">{{errors.tipo_ausentismo_id[0]}}</p>
                        </template>
                        <template v-if="(rebaja_dias === 1)">
                          <label class="label required">Causal incremento de días</label>
                            <el-select v-model="tipo_incremento" size="small" class="element-style" placeholder="Seleccione causal">
                              <el-option
                                v-for="tipo in tiposIncrementos"
                                :key="tipo.id"
                                :label="tipo.nombre"
                                :value="tipo.id">
                              </el-option>
                            </el-select>
                            <p v-if="errors && errors.tipo_incremento_id" class="help is-danger">{{errors.tipo_incremento_id[0]}}</p>
                        </template>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
              <div class="field">
                  <div class="columns">
                    <div class="column">
                      <div class="field">
                        <label class="label required">Cálculo de días</label>
                        <el-radio-group v-model="calculo_dias" @change="getDaysInDateAction">
                          <el-radio :label="true">Días de corrido</el-radio>
                          <el-radio :label="false">Días hábiles</el-radio>
                        </el-radio-group>
                        <p v-if="errors && errors.calculo_dias" class="help is-danger">{{errors.calculo_dias[0]}}</p>
                      </div>
                    </div>
                    <template v-if="(tipo_reajuste === 1)">
                      <div class="column">
                        <div class="field">
                          <label class="label required">Valor día ($)</label>
                          <el-input-number v-model="valor_dia" size="small" class="element-style" :min="0" @change="getDaysInDateAction"></el-input-number>
                          <p v-if="errors && errors.valor_dia" class="help is-danger">{{errors.valor_dia[0]}}</p>
                        </div>
                      </div>
                    </template>
                    <div class="column">
                      <div class="field">
                        <label class="label">Días</label>
                        <p>{{ajuste.total_dias}}</p>
                      </div>
                    </div>
                    <template v-if="(tipo_reajuste === 1)">
                      <div class="column">
                        <div class="field">
                          <label class="label">Monto de ajuste ($)</label>
                          <p>${{ajuste.monto_ajuste_format}}</p>
                        </div>
                      </div>
                    </template>
                  </div>
              </div>
                <div class="field">
                  <div class="columns">
                    <div class="column">
                      <template v-if="(esquema.advertencias) && (esquema.advertencias.length)">
                        <label class="label">Asocie advertencias</label>
                          <el-select v-model="advertencias" multiple collapse-tags size="small" class="element-style" placeholder="Seleccione advertencia">
                            <el-option
                              v-for="advertencia in esquema.advertencias"
                              :key="advertencia.code"
                              :label="advertencia.message"
                              :value="advertencia.code">
                            </el-option>
                          </el-select>
                      </template>
                    </div>
                    <div class="column">
                      <template v-if="(esquema.errores) && (esquema.errores.length)">
                        <label class="label">Asocie errores</label>
                          <el-select v-model="errores" multiple collapse-tags size="small" class="element-style" placeholder="Seleccione errores">
                            <el-option
                              v-for="error in esquema.errores"
                              :key="error.code"
                              :label="error.message"
                              :value="error.code">
                            </el-option>
                          </el-select>
                      </template>
                    </div>
                  </div>
                </div>
              <div class="field">
                <label class="label required">Observación</label>
                <textarea v-model="observacion" class="textarea has-fixed-size" placeholder="Ingrese motivo, causa u otra observación..."></textarea>
                <p v-if="errors && errors.observacion" class="help is-danger">{{errors.observacion[0]}}</p>
              </div>
              <p v-if="errors && errors.data" class="help is-danger">{{errors.data[0]}}</p>
              <div class="field">
                <div class="notification is-info is-light">
                  Una vez ingresado el reajuste, será calculado en el total siempre y cuando este sea <strong>aprobado por un Administrador autorizado</strong>.
                </div>
              </div>
              <div class="field">
                  <div class="buttons is-right">
                      <button class="button is-link is-light" :class="(loadingReajuste ? 'is-loading' : '')" @click.prevent="storeReajuste">Ingresar reajuste</button>
                  </div>
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
  props:['esquema', 'tipo_reajuste'],
  data(){
    return{

    };
  },
  mounted(){
    this.getTiposAusentismos();
    this.getTiposIncrementos();
  },
  computed:{
    ...mapGetters({
      openModalReajuste: "recarga/resumen/resumen/modalReajuste",
      tiposDeAusentismo: "modulos/modulos/tiposAusentismos",
      tiposIncrementos: "modulos/modulos/tiposIncrementos",
      errors:"recarga/resumen/resumen/reajusteErrors",
      loadingReajuste:"recarga/resumen/resumen/loadingReajuste",
      loadingDaysInDate:"recarga/resumen/resumen/loadingDaysInDate",
      ajuste:'recarga/resumen/resumen/reajuste',
    }),
    currentRouteName() {
      return this.$nuxt.$route.path;
    },
    calculateMontoAjuste(){
      let value = 0;
      if((this.tipo_reajuste === 1) && (this.valor_dia || this.dias)){
        value = this.valor_dia * this.dias;
      }
      return value;
    },
    fecha_inicio:{
      get() {
        return this.$store.state.recarga.resumen.resumen.reajuste.fecha_inicio;
      },
      set(newValue) {
        this.$store.commit('recarga/resumen/resumen/SET_REAJUSTE_FECHA_INICIO', newValue);
      }
    },
    fecha_termino:{
      get() {
        return this.$store.state.recarga.resumen.resumen.reajuste.fecha_termino;
      },
      set(newValue) {
        this.$store.commit('recarga/resumen/resumen/SET_REAJUSTE_FECHA_TERMINO', newValue);
      }
    },
    calculo_dias:{
      get() {
        return this.$store.state.recarga.resumen.resumen.reajuste.calculo_dias;
      },
      set(newValue) {
        this.$store.commit('recarga/resumen/resumen/SET_REAJUSTE_CALCULO_DIAS', newValue);
      }
    },
    rebaja_dias:{
      get() {
        return this.$store.state.recarga.resumen.resumen.reajuste.rebaja_dias;
      },
      set(newValue) {
        this.$store.commit('recarga/resumen/resumen/SET_REAJUSTE_REBAJA_DIAS', newValue);
      }
    },
    tipo_ausentismo:{
      get() {
        return this.$store.state.recarga.resumen.resumen.reajuste.tipo_ausentismo_id;
      },
      set(newValue) {
        this.$store.commit('recarga/resumen/resumen/SET_REAJUSTE_TIPO_AUSENTISMO', newValue);
      }
    },
    tipo_incremento:{
      get() {
        return this.$store.state.recarga.resumen.resumen.reajuste.tipo_incremento_id;
      },
      set(newValue) {
        this.$store.commit('recarga/resumen/resumen/SET_REAJUSTE_TIPO_INCREMENTO', newValue);
      }
    },
    advertencias:{
      get() {
        return this.$store.state.recarga.resumen.resumen.reajuste.advertencias;
      },
      set(newValue) {
        this.$store.commit('recarga/resumen/resumen/SET_ADVERTENCIAS', newValue);
      }
    },
    errores:{
      get() {
        return this.$store.state.recarga.resumen.resumen.reajuste.errores;
      },
      set(newValue) {
        this.$store.commit('recarga/resumen/resumen/SET_ERRORES', newValue);
      }
    },
    valor_dia:{
      get() {
        return this.$store.state.recarga.resumen.resumen.reajuste.valor_dia;
      },
      set(newValue) {
        this.$store.commit('recarga/resumen/resumen/SET_REAJUSTE_VALOR_DIA', newValue);
      }
    },
    observacion:{
      get() {
        return this.$store.state.recarga.resumen.resumen.reajuste.observacion;
      },
      set(newValue) {
        this.$store.commit('recarga/resumen/resumen/SET_REAJUSTE_OBSERVACION', newValue);
      }
    },
  },
  methods:{
    ...mapActions({
      closeModal:'recargas/reajustesResumen/closeModal',
      getTiposAusentismos:'modulos/modulos/getTiposAusentismos',
      getTiposIncrementos:'modulos/modulos/getTiposIncrementos',
      storeReajusteResumen:'recarga/resumen/resumen/storeReajusteResumen',
      storeReajusteNotResumen:'recargas/reajustes/storeReajuste',
      getDaysInDate:'recarga/resumen/resumen/getDaysInDate',
    }),
    getDaysInDateAction:function(){
      const data = {
        rebaja_dias:this.rebaja_dias,
        calculo_dias:this.calculo_dias,
        fecha_inicio:this.fecha_inicio,
        fecha_termino:this.fecha_termino,
        valor_dia:this.valor_dia
      };
      if((this.fecha_inicio && this.fecha_termino) && (this.fecha_inicio <= this.fecha_termino)){
        this.getDaysInDate(data);
      }
    },
    hideModalReajuste:function(){
      this.$store.commit('recarga/resumen/resumen/SET_MODAL_REAJUSTE', false);
    },
    storeReajuste:function(){
      const data = {
          esquema_id: this.esquema.id,
          fecha_inicio:this.fecha_inicio,
          fecha_termino:this.fecha_termino,
          calculo_dias:this.calculo_dias,
          incremento:this.rebaja_dias,
          tipo_ausentismo_id:this.tipo_ausentismo,
          tipo_incremento_id:this.tipo_incremento,
          valor_dia:this.valor_dia,
          monto_ajuste:this.ajuste.monto_ajuste,
          observacion:this.observacion,
          tipo_reajuste:this.tipo_reajuste,
          advertencias:this.advertencias,
          errores:this.errores
        };
        this.storeReajusteResumen(data);
    },
  }
}
</script>

<style>

</style>
