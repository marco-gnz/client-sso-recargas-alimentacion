<template>
  <div>
    <div class="modal is-large" :class="modal_generar_planilla ? 'is-active' : '' ">
      <div class="modal-background" @click.prevent="hideModal"></div>
      <div class="modal-card" style="width: 90%;">
        <header class="modal-card-head">
            <p class="modal-card-title">Generar planilla recarga {{$route.params.id}}</p>
            <button class="delete" aria-label="close" @click.prevent="hideModal"></button>
        </header>
        <section class="modal-card-body">
          <div class="field">
            <h4 class="title is-4">Seleccione los campos que se requieren en la planilla excel</h4>
            <div class="columns is-multiline is-mobile">
              <div class="column is-one-quarter" v-for="(campo, index) in campos" :key="index">
                <el-checkbox v-model="campos_selected" :label="campo">{{campo.nombre}} <!-- {{campos_selected.includes(campo.slug) ? `(${campos_selected.indexOf(campo.slug) +1})` : ''}} --></el-checkbox>
              </div>
              <p v-if="erroresCamposPlanilla && erroresCamposPlanilla.campos" class="help is-danger">{{erroresCamposPlanilla.campos[0]}}</p>
            </div>
          </div>
          <div class="field">
            <div class="columns">
              <div class="column">
                <button :disabled="(campos_selected) && (!campos_selected.length)" :class="(loadingGenerarPlanilla ? 'is-loading' : '')" class="button is-success is-rounded" @click.prevent="generarPlanillaActionModal">Generar planilla</button>
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
  created(){
    this.getGenerarPlanilla(this.$route.params.id);
  },
  computed:{
    ...mapGetters({
      campos:'recarga/resumen/resumen/camposPlanilla',
      erroresCamposPlanilla:'recarga/resumen/resumen/erroresCamposPlanilla',
      loadingGenerarPlanilla:'recarga/resumen/resumen/loadingGenerarPlanilla'
    }),
    modal_generar_planilla:{
      get(){
        return this.$store.state.recarga.resumen.resumen.modal_generar_planilla;
      },
      set(newValue){
        this.$store.commit('recarga/resumen/resumen/SET_MODAL_GENERAR_PLANILLA', newValue);
      }
    },
    campos_selected:{
      get(){
        return this.$store.state.recarga.resumen.resumen.campos_selected;
      },
      set(newValue){
        this.$store.commit('recarga/resumen/resumen/SET_CAMPOS_PLANILLA_SELECTED', newValue);
      }
    }
  },
  methods:{
    ...mapActions({
      getGenerarPlanilla:'recarga/resumen/resumen/getGenerarPlanilla',
      generarPlanillaAction:'recarga/resumen/resumen/generarPlanillaAction',
    }),
    generarPlanillaActionModal:function(){
      const data = {
        codigo:this.$route.params.id
      };
      this.generarPlanillaAction(data);
    },
    hideModal:function(){
      this.modal_generar_planilla = false;
    }
  }
}
</script>

<style>

</style>
