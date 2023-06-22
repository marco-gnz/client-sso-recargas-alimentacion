<template>
  <div>
    <div class="modal is-large" :class="modalShowErrores ? 'is-active' : '' ">
        <div class="modal-background" @click.prevent="hideModalErrores"></div>
        <div class="modal-card" style="width: 50%;">
          <header class="modal-card-head">
            <p class="modal-card-title">Listado de errores y advertencias</p>
            <button class="delete" aria-label="close" @click.prevent="hideModalErrores"></button>
          </header>
          <section class="modal-card-body">
            <div class="columns">
              <div class="column">
                <div class="field">
                  <h5 class="title is-5">Errores</h5>
                  <template v-if="(errores)">
                    <table class="table  is-narrow is-hoverable is-fullwidth">
                      <thead>
                        <tr>
                          <th>Código</th>
                          <th>Descripción</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(error, index) in errores" :key="index">
                          <td>{{error.code}}</td>
                          <td>{{error.message}}</td>
                        </tr>
                      </tbody>
                    </table>
                  </template>
                  <template v-else>
                    <div class="notification is-success is-light">
                      Sin errores <i class="el-icon-success"></i>
                    </div>
                  </template>
                </div>
                <div class="field">
                  <h5 class="title is-5">Advertencias</h5>
                  <template v-if="(advertencias)">
                    <table class="table  is-narrow is-hoverable is-fullwidth">
                      <thead>
                        <tr>
                          <th>Código</th>
                          <th>Descripción</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(advertencia, index) in advertencias" :key="index">
                          <td>{{advertencia.code}}</td>
                          <td>{{advertencia.message}}</td>
                        </tr>
                      </tbody>
                    </table>
                  </template>
                  <template v-else>
                    <div class="notification is-success is-light">
                      Sin advertencias <i class="el-icon-success"></i>
                    </div>
                  </template>
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
  props:['errores', 'advertencias'],
  computed:{
    modalShowErrores:{
      get() {
        return this.$store.state.recarga.resumen.resumen.modal_show_errores;
      },
      set(newValue) {
        this.$store.commit('recarga/resumen/resumen/SET_MODAL_ERRORES', newValue);
      }
    },
  },
  methods:{
    hideModalErrores:function(){
      this.modalShowErrores = false;
    }
  }
}
</script>

<style>

</style>
