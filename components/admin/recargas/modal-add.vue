<template>
  <div>
      <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">Ingresar nueva recarga masiva</p>
            <button class="delete" aria-label="close" @click.prevent="hideProductModal"></button>
          </header>
          <section class="modal-card-body">
            <div class="columns">
              <div class="column">
                <div class="field">
                  <label class="label">Seleccione año y mes de recarga</label>
                  <el-date-picker
                    v-model="recarga.fecha"
                    format="MM-yyyy"
                    value-format="yyyy-MM-dd"
                    class="element-select is-rounded"
                    type="month"
                    placeholder="Seleccione año y mes ">
                  </el-date-picker>
                </div>
                <div class="field">
                  <label class="label">Ingrese catidad de días habiles en el mes</label>
                  <input v-model="recarga.dias_habiles" class="input" type="number" placeholder="Ingrese cantidad de días habiles">
                </div>
                <div class="field">
                  <label class="label">Ingrese monto a cancelar por día</label>
                  <input v-model="recarga.monto_dia" class="input" type="number" placeholder="Ingrese monto a cancelar">
                </div>
                <div class="field">
                  <div class="buttons is-right">
                    <button class="button is-link is-light">Ingresar</button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

  </div>
</template>

<script>
import {mapMutations} from 'vuex';
export default {
  data(){
    return{
      recarga:{
        fecha:'',
        dias_habiles:'',
        monto_dia:''
      }
    };
  },
  methods:{
    ...mapMutations({
      changeStatusModal: "recargas/modaladd/SET_OPEN",
    }),
    hideProductModal() {
      this.changeStatusModal(false);
      window.history.pushState({}, null, this.$route.path);
    },
  }
}
</script>

<style>

</style>
