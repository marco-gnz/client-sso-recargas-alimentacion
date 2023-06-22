<template>
  <div>
    <div class="modal is-large" :class="modal_publicar_planilla ? 'is-active' : '' ">
      <div class="modal-background" @click.prevent="hideModal"></div>
      <div class="modal-card" style="width: 80%;">
        <header class="modal-card-head">
            <p class="modal-card-title">Publicar recarga {{$route.params.id}}</p>
            <button class="delete" aria-label="close" @click.prevent="hideModal"></button>
        </header>
        <section class="modal-card-body">
          <div class="field">
            <template v-if="loadingPublicarPlanilla">
              <div class="columns">
                <div class="column">
                  <el-skeleton style="width: 100%" animated>
                    <template slot="template">
                      <div style="padding: 14px;">
                        <div class="field">
                          <div class="columns">
                            <div class="column">
                              <el-skeleton-item variant="p" style="width: 100%" />
                            </div>
                            <div class="column">
                              <el-skeleton-item variant="p" style="width: 100%" />
                            </div>
                          </div>
                        </div>
                        <div class="field">
                          <div class="columns">
                            <div class="column">
                              <el-skeleton-item variant="p" style="width: 100%" />
                            </div>
                            <div class="column">
                              <el-skeleton-item variant="p" style="width: 100%" />
                            </div>
                          </div>
                        </div>
                        <div class="field">
                          <div class="columns">
                            <div class="column">
                              <el-skeleton-item variant="p" style="width: 100%" />
                            </div>
                            <div class="column">
                              <el-skeleton-item variant="p" style="width: 100%" />
                            </div>
                          </div>
                        </div>
                        <div class="field">
                          <div class="columns">
                            <div class="column">
                              <el-skeleton-item variant="p" style="width: 100%" />
                            </div>
                            <div class="column">
                              <el-skeleton-item variant="p" style="width: 100%" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                  </el-skeleton>
                </div>
              </div>
            </template>
            <template v-else>
              <h3 class="title is-3">Alertas detectadas en los esquemas de la recarga</h3>
              <div class="columns">
                <div class="column box">
                    <h5 class="title is-5">Alertas</h5>
                    <template v-if="(othersAlertas) && (othersAlertas.length)">
                      <table class="table  is-narrow is-hoverable is-fullwidth">
                        <thead>
                          <tr>
                            <th>Descripción</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(alerta, index) in othersAlertas" :key="index">
                            <td><p class="has-text-danger">{{alerta.message}}</p></td>
                          </tr>
                        </tbody>
                      </table>
                    </template>
                    <template v-else>
                      <div class="notification is-success is-light">
                        Sin alertas <i class="el-icon-success"></i>
                      </div>
                    </template>
                </div>
                <div class="column">
                    <h5 class="title is-5">Errores</h5>
                    <template v-if="(errores) && (errores.length)">
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
                <div class="column">
                    <h5 class="title is-5">Advertencias</h5>
                    <template v-if="(advertencias) && (advertencias.length)">
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
            </template>
          </div>
          <div class="field">
            <div class="columns">
              <div class="column">
                <button v-if="recarga.active_publicar" :disabled="loadingPublicarPlanilla" @click.prevent="publicarPlanillaAction" :class="(loadingPublicar ? 'is-loading' : '')" class="button is-success is-rounded">Publicar recarga</button>
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
    this.getPublicarPlanilla(this.$route.params.id);
  },
  computed:{
    ...mapGetters({
      recarga:'recarga/resumen/resumen/recarga',
      errores:'recarga/resumen/resumen/erroresRecarga',
      advertencias:'recarga/resumen/resumen/advertenciasRecarga',
      othersAlertas:'recarga/resumen/resumen/othersAlertas',
      loadingPublicarPlanilla:'recarga/resumen/resumen/loadingPublicarPlanilla',
      loadingPublicar:'recarga/resumen/resumen/loadingPublicar'
    }),
    modal_publicar_planilla:{
      get(){
        return this.$store.state.recarga.resumen.resumen.modal_publicar_planilla;
      },
      set(newValue){
        this.$store.commit('recarga/resumen/resumen/SET_MODAL_PUBLICAR_PLANILLA', newValue);
      }
    }
  },
  methods:{
    ...mapActions({
      getPublicarPlanilla:'recarga/resumen/resumen/getPublicarPlanilla',
      publicarPlanilla:'recarga/resumen/resumen/publicarPlanilla'
    }),
    hideModal:function(){
      this.modal_publicar_planilla = false;
    },
    publicarPlanillaAction:function(){
        this.publicarPlanilla(this.$route.params.id);
    }
  }
}
</script>

<style>

</style>
