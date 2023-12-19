<template>
  <div>
    <div class="modal is-large" :class="show_modal_add ? 'is-active' : '' ">
      <div class="modal-background" @click.prevent="closeModal"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Ingresar {{currentRouteQuery}}</p>
          <button class="delete" aria-label="close" @click.prevent="closeModal"></button>
        </header>
        <section class="modal-card-body">
          <div class="columns">
            <div class="column">
              <div class="field">
                <label class="label required">Ingrese código SIRH</label>
                <input v-model="contractual_cod_sirh" type="text" class="input" placeholder="Ingrese código SIRH">
                <p v-if="errors && errors.cod_sirh" class="help is-danger">{{errors.cod_sirh != null ? errors.cod_sirh[0] : ''}}</p>
              </div>
              <div class="field">
                <label class="label required">Ingrese nombre</label>
                <input v-model="contractual_name" type="text" class="input" placeholder="Ingrese nombre">
                <p v-if="errors && errors.nombre" class="help is-danger">{{errors.nombre != null ? errors.nombre[0] : ''}}</p>
              </div>
              <div class="field">
                <div class="columns">
                  <div class="column">
                    <button class="button is-link is-light" :class="(loadingAction ? 'is-loading' : '')" @click.prevent="ingresarContractual">Ingresar</button>
                  </div>
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
  computed:{
    ...mapGetters({
      loadingAction:'mantenedores/main/loadingAction'
    }),
    currentRouteQuery(){
      return this.$nuxt.$route.query.tipo;
    },
    show_modal_add:{
      get() {
        return this.$store.state.mantenedores.main.modal_add;
      },
      set(newValue) {
        this.$store.commit('mantenedores/main/SET_MODAL_ADD', newValue);
      }
    },
    contractual_cod_sirh:{
      get() {
        return this.$store.state.mantenedores.main.contractual.cod_sirh;
      },
      set(newValue) {
        this.$store.commit('mantenedores/main/SET_CONTRACTUAL_COD_SIRH', newValue);
      }
    },
    contractual_name:{
      get() {
        return this.$store.state.mantenedores.main.contractual.name;
      },
      set(newValue) {
        this.$store.commit('mantenedores/main/SET_CONTRACTUAL_NAME', newValue);
      }
    },
    errors:{
      get() {
        return this.$store.state.mantenedores.main.errors;
      },
      set(newValue) {
        this.$store.commit('mantenedores/main/SET_ERRORS', newValue);
      }
    },
  },
  methods:{
    ...mapActions({
      storeContractual:'mantenedores/main/storeContractual'
    }),
    closeModal:function(){
      this.errors = {};
      this.contractual_cod_sirh = '';
      this.contractual_name = '';
      this.show_modal_add = false;
    },
    ingresarContractual:function(){
      this.storeContractual(this.currentRouteQuery);
    }
  }
}
</script>

<style>

</style>
