<template>
  <div>
    <div class="modal is-large" :class="modalRechazarReajuste ? 'is-active' : '' ">
      <div class="modal-background" @click.prevent="hideRechazarReajusteModal"></div>
      <div class="modal-card" style="width: 40%;">
        <header class="modal-card-head">
            <p class="modal-card-title">Rechazar reajuste</p>
            <button class="delete" aria-label="close" @click.prevent="hideRechazarReajusteModal"></button>
        </header>
        <section class="modal-card-body">
          <div class="columns">
            <div class="column">
              <div class="field">
                <div class="notification is-warning is-light">
                  Una vez rechazado el reajuste, este <strong>no será calculado</strong> en los valores totales correspondientes y no se podrá revocar esta opción.
                </div>
              </div>
              <div class="field">
                <label class="label required">Observación</label>
                <textarea v-model="observacion" class="textarea has-fixed-size" placeholder="Ingrese motivo, causa u otra observación..."></textarea>
                <p v-if="errors && errors.observacion" class="help is-danger">{{errors.observacion[0]}}</p>
              </div>
              <div class="field">
                  <div class="buttons is-right">
                    <button class="button is-danger is-light" :class="(loadingRechazarReajuste ? 'is-loading' : '')" @click.prevent="rechazarReajuste">Rechazar reajuste</button>
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
  props:['uuid'],
  computed:{
    ...mapGetters({
      modalRechazarReajuste: "recargas/reajustes/modalRechazarReajuste",
      errors:'recargas/reajustes/errors',
      loadingRechazarReajuste:'recargas/reajustes/loadingRechazarReajuste',
    }),
    observacion:{
      get() {
        return this.$store.state.recargas.reajustes.observacion_rechazo;
      },
      set(newValue) {
        this.$store.commit('recargas/reajustes/SET_OBSERVACION_RECHAZAR', newValue);
      }
    },
    currentRouteName() {
      return this.$nuxt.$route.path;
    },
  },
  methods:{
    ...mapActions({
      validateReajuste:'recargas/reajustes/validateReajuste',
      validateReajusteResumen:'recargas/reajustesResumen/validateReajuste'
    }),
    rechazarReajuste:function(){
      const data = {
        uuid:this.uuid,
        aprobar:false,
        observacion:this.observacion
      };
      if(this.currentRouteName != `/admin/recargas/${this.$route.params.id}/resumen/${this.$route.params.funcionario}/reajustes`){
        this.validateReajusteResumen(data);
      }else{
        this.validateReajuste(data);
      }
    },
    hideRechazarReajusteModal:function(){
      this.$store.commit('recargas/reajustes/SET_MODAL_RECHAZAR', false);
    }
  }
}
</script>

<style>

</style>
