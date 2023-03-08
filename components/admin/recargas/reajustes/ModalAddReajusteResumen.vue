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
              <p class="subtitle">{{ `${funcionario != null ? `${funcionario.nombre_completo}` : ``}` }}</p>
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
                      <el-radio-group v-model="rebaja_dias" @change="changeOperator">
                        <el-radio :label="0">Rebaja de días</el-radio>
                        <el-radio :label="1">Incremento de días</el-radio>
                      </el-radio-group>
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
                <template v-if="(tipo_reajuste === 1)">
                  <div class="columns">
                    <div class="column">
                      <div class="field">
                        <label class="label required">Valor día ($)</label>
                        <el-input-number v-model="valor_dia" size="small" class="element-style" :min="0"></el-input-number>
                        <p v-if="errors && errors.valor_dia" class="help is-danger">{{errors.valor_dia[0]}}</p>
                      </div>
                    </div>
                    <div class="column">
                      <div class="field">
                        <label class="label required">Días</label>
                        <el-input-number :disabled="((loadingDaysInDate) || (!fecha_inicio || !fecha_termino) || (tipo_reajuste === 1 && !valor_dia))" onKeyDown="return false" v-model="dias" size="small" class="element-style" :precision="1" :step="0.5"></el-input-number>
                        <p v-if="errors && errors.dias" class="help is-danger">{{errors.dias[0]}}</p>
                      </div>
                    </div>
                    <div class="column">
                      <div class="field">
                        <label class="label">Monto de ajuste ($)</label>
                        <p>{{ calculateMontoAjuste != null ? `$${Intl.NumberFormat('de-DE').format(Math.round(calculateMontoAjuste))}` : '--'  }}</p>
                        <p v-if="errors && errors.monto_ajuste" class="help is-danger">{{errors.monto_ajuste[0]}}</p>
                      </div>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="column">
                    <div class="field">
                      <label class="label required">Días</label>
                      <el-input-number :disabled="((loadingDaysInDate) || (!fecha_inicio || !fecha_termino))" onKeyDown="return false" v-model="dias" size="small" class="element-style" :precision="1" :step="0.5"></el-input-number>
                      <p v-if="errors && errors.dias" class="help is-danger">{{errors.dias[0]}}</p>
                    </div>
                  </div>
                </template>
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
  props:['funcionario', 'tipo_reajuste'],
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
      openModalReajuste: "recargas/resumen/modalReajuste",
      tiposDeAusentismo: "modulos/modulos/tiposAusentismos",
      tiposIncrementos: "modulos/modulos/tiposIncrementos",
      errors:"recargas/resumen/reajusteErrors",
      loadingReajuste:"recargas/resumen/loadingReajuste",
      loadingDaysInDate:"recargas/resumen/loadingDaysInDate"
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
        return this.$store.state.recargas.resumen.reajuste.fecha_inicio;
      },
      set(newValue) {
        this.$store.commit('recargas/resumen/SET_REAJUSTE_FECHA_INICIO', newValue);
      }
    },
    fecha_termino:{
      get() {
        return this.$store.state.recargas.resumen.reajuste.fecha_termino;
      },
      set(newValue) {
        this.$store.commit('recargas/resumen/SET_REAJUSTE_FECHA_TERMINO', newValue);
      }
    },
    rebaja_dias:{
      get() {
        return this.$store.state.recargas.resumen.reajuste.rebaja_dias;
      },
      set(newValue) {
        this.$store.commit('recargas/resumen/SET_REAJUSTE_REBAJA_DIAS', newValue);
      }
    },
    tipo_ausentismo:{
      get() {
        return this.$store.state.recargas.resumen.reajuste.tipo_ausentismo_id;
      },
      set(newValue) {
        this.$store.commit('recargas/resumen/SET_REAJUSTE_TIPO_AUSENTISMO', newValue);
      }
    },
    tipo_incremento:{
      get() {
        return this.$store.state.recargas.resumen.reajuste.tipo_incremento_id;
      },
      set(newValue) {
        this.$store.commit('recargas/resumen/SET_REAJUSTE_TIPO_INCREMENTO', newValue);
      }
    },
    dias:{
      get() {
        return this.$store.state.recargas.resumen.reajuste.dias;
      },
      set(newValue) {
        this.$store.commit('recargas/resumen/SET_REAJUSTE_DIAS', newValue);
      }
    },
    valor_dia:{
      get() {
        return this.$store.state.recargas.resumen.reajuste.valor_dia;
      },
      set(newValue) {
        this.$store.commit('recargas/resumen/SET_REAJUSTE_VALOR_DIA', newValue);
      }
    },
    observacion:{
      get() {
        return this.$store.state.recargas.resumen.reajuste.observacion;
      },
      set(newValue) {
        this.$store.commit('recargas/resumen/SET_REAJUSTE_OBSERVACION', newValue);
      }
    },
  },
  methods:{
    ...mapActions({
      closeModal:'recargas/reajustesResumen/closeModal',
      getTiposAusentismos:'modulos/modulos/getTiposAusentismos',
      getTiposIncrementos:'modulos/modulos/getTiposIncrementos',
      storeReajusteFuncionario:'recargas/resumen/storeReajusteFuncionario',
      storeReajusteNotResumen:'recargas/reajustes/storeReajuste',
      getDaysInDate:'recargas/resumen/getDaysInDate',
    }),
    changeOperator:function(){
      if(!this.rebaja_dias){
        this.dias = -Math.abs(this.dias);
      }else{
        this.dias = Math.abs(this.dias);
      }
    },
    getDaysInDateAction:function(){
      const data = {
        incremento:this.rebaja_dias,
        fecha_inicio:this.fecha_inicio,
        fecha_termino:this.fecha_termino
      };
      if((this.fecha_inicio && this.fecha_termino) && (this.fecha_inicio <= this.fecha_termino)){
        this.getDaysInDate(data);
      }
    },
    hideModalReajuste:function(){
      this.$store.commit('recargas/resumen/SET_MODAL_REAJUSTE', false);
    },
    storeReajuste:function(){
      const data = {
        recarga_codigo: this.$route.params.id,
        user_id:this.funcionario.id,
        fecha_inicio:this.fecha_inicio,
        fecha_termino:this.fecha_termino,
        incremento:this.rebaja_dias,
        tipo_ausentismo_id:this.tipo_ausentismo,
        tipo_incremento_id:this.tipo_incremento,
        dias:this.dias,
        observacion:this.observacion,
        tipo_reajuste:this.tipo_reajuste,
      };

      if(this.tipo_reajuste === 1){
        /* valor_dia:this.valor_dia,
        monto_ajuste:this.calculateMontoAjuste */
        data['valor_dia'] = this.valor_dia;
        data['monto_ajuste'] = this.calculateMontoAjuste;
      }
      if(this.currentRouteName != `/admin/recargas/${this.$route.params.id}/resumen`){
        this.storeReajusteNotResumen(data);
      }else{
        this.storeReajusteFuncionario(data);
      }
    },
    /* calculateMontoAjuste:function(){
      if((this.tipo_reajuste === 1) && (this.valor_dia || this.dias)){
        let value = this.valor_dia * this.dias;
        this.monto_ajuste = value;
      }
    } */
  }
}
</script>

<style>

</style>
