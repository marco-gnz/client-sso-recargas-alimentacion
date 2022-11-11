<template>
  <div>
      <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">Ingresar nueva recarga masiva</p>
            <button v-if="currentRouteName != '/admin/recargas/ingresar'" class="delete" aria-label="close" @click.prevent="hideProductModal"></button>
          </header>
          <section class="modal-card-body">
            <div class="columns">
              <div class="column">
                <div class="field">
                  <label class="label">Seleccione establecimiento</label>
                  <el-select v-if="establecimientos.length"  class="element-style" v-model="form_establecimiento" placeholder="Seleccione establecimiento">
                    <el-option
                      v-for="establecimiento in establecimientos"
                      :key="establecimiento.id"
                      :label="establecimiento.nombre"
                      :value="establecimiento.id">
                    </el-option>
                  </el-select>
                  <p v-if="errors && errors.establecimiento_id" class="help is-danger">{{errors.establecimiento_id != null ? errors.establecimiento_id[0] : ''}}</p>
                </div>
                <div class="field">
                  <label class="label">Seleccione año y mes de recarga</label>
                  <el-date-picker
                    v-model="form_fecha"
                    format="MM-yyyy"
                    value-format="yyyy-MM-dd"
                    class="element-select is-rounded"
                    type="month"
                    placeholder="Seleccione año y mes ">
                  </el-date-picker>
                  <p v-if="errors && errors.fecha" class="help is-danger">{{errors.fecha[0]}}</p>
                </div>
                <div class="field">
                  <label class="label">Ingrese cantidad de días hábiles en el mes</label>
                  <input v-model="form_total_dias_habiles" class="input" type="number" placeholder="Ingrese cantidad de días habiles">
                  <p v-if="errors && errors.total_dias_habiles" class="help is-danger">{{errors.total_dias_habiles[0]}}</p>
                </div>
                <div class="field">
                  <label class="label">Ingrese monto a cancelar por día</label>
                  <input v-model="form_monto_dia" class="input" type="number" placeholder="Ingrese monto a cancelar">
                  <p v-if="errors && errors.monto_dia" class="help is-danger">{{errors.monto_dia[0]}}</p>
                </div>
                <p v-if="errors && errors.data" class="help is-danger">{{errors.data[0]}}</p>
                <div class="field">
                  <div class="buttons is-right">
                    <button class="button is-link is-light" v-loading.fullscreen.lock="loadingSpinner" @click.prevent="addRecarga">Ingresar</button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

  </div>
</template>

<script>
import {mapMutations, mapGetters, mapActions} from 'vuex';
export default {
  computed: {
    ...mapGetters({
      loadingSpinner:'recargas/recargas/fullScreenLoading',
      errors:'recargas/recargas/errors',
      formRecarga:'recargas/recargas/formRecarga',
      establecimientos:'modulos/modulos/establecimientos'
    }),
    currentRouteName() {
      return this.$nuxt.$route.path;
    },
    form_establecimiento:{
      get() {
        return this.$store.state.recargas.recargas.form.establecimiento_id;
      },
      set(newValue) {
        this.$store.commit('recargas/recargas/SET_ESTABLECIMIENTO', newValue);
      }
    },
    form_fecha:{
      get() {
        return this.$store.state.recargas.recargas.form.fecha;
      },
      set(newValue) {
        this.$store.commit('recargas/recargas/SET_FECHA', newValue);
      }
    },
    form_total_dias_habiles:{
      get() {
        return this.$store.state.recargas.recargas.form.total_dias_habiles;
      },
      set(newValue) {
        this.$store.commit('recargas/recargas/SET_TOTAL_DIAS_HABILES', newValue);
      }
    },
    form_monto_dia:{
      get() {
        return this.$store.state.recargas.recargas.form.monto_dia;
      },
      set(newValue) {
        this.$store.commit('recargas/recargas/SET_MONTO_DIA', newValue);
      }
    },
  },
  methods:{
    ...mapActions({
      storeRecarha: 'recargas/recargas/storeRecarha',
    }),
    ...mapMutations({
      changeStatusModal: "recargas/recargas/SET_OPEN",
      addNewRecarga: "recargas/recargas/ADD_RECARGA",
    }),
    hideProductModal() {
      this.changeStatusModal(false);
      window.history.pushState({}, null, this.$route.path);
    },
    addRecarga:function(){
      this.storeRecarha();
    },
  }
}
</script>

<style>

</style>
