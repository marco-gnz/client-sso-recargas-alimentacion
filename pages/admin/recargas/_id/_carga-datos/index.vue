<template>
  <div v-loading.fullscreen.lock="loadingSpinner" element-loading-text="Cargando datos..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.9)">
    <Hero :title="`Recarga #${$route.params.id} - Carga masiva de datos`" :subtitle="`${recarga.establecimiento != null ? recarga.establecimiento.nombre : ''} para el mes de ${recarga.mes} año ${recarga.anio}.`"  />
    <div class="container.is-fullhd">
      <MenuTotales  :recarga="recarga"/>
      <Funcionarios v-if="openModalFuncionarios" />
      <Validaciones v-if="openModalGrupos" :codigo="$route.params.id" />
      <Ausentismos v-if="openModalAusentismos" :codigo="$route.params.id" />
      <turnos :codigo="$route.params.id" />
      <div class="card p-6 m-6">
        <MenuRecarga :codigo="$route.params.id" />
        <div class="columns">
          <div class="column is-one-quarter">
            <h5 class="title is-5">1. Reglas de validación y grupos</h5>
            <div class="field">
              <button :disabled="recarga.disabled_reglas" @click.prevent="clickOpenModalGrupos" class="button is-link is-rounded">Definir reglas</button>
            </div>
          </div>
          <div class="column is-one-quarter">
            <h5 class="title is-5">2. Carga de funcionarios</h5>
            <div class="field">
              <button @click.prevent="clickOpenModalFuncionarios" class="button is-link is-rounded">Cargar/actualizar funcionarios</button>
            </div>
          </div>
          <div class="column is-one-quarter">
            <h5 class="title is-5">3. Definir turno de funcionarios</h5>
            <div class="field">
              <button @click.prevent="clickOpenModalTurnos" class="button is-link is-rounded">Definir turnos</button>
            </div>
          </div>
          <div class="column is-one-quarter">
            <h5 class="title is-5">4. Carga de ausentismos</h5>
            <div class="field">
              <button :disabled="!recarga.disabled_reglas" @click.prevent="clickOpenModalAusentismos" class="button is-link is-rounded">Cargar ausentismos</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import MenuRecarga from '../../../../../components/admin/recargas/MenuRecarga.vue';
import MenuTotales from '../../../../../components/admin/recargas/MenuTotales.vue';
import Funcionarios from '../../../../../components/admin/recargas/files/funcionarios.vue';
import Validaciones from '../../../../../components/admin/recargas/grupos/validaciones.vue';
import Ausentismos from '../../../../../components/admin/recargas/files/ausentismos.vue';
import Turnos from '../../../../../components/admin/recargas/files/turnos.vue';
export default {
    middleware: 'auth',
    components: { MenuRecarga, MenuTotales, Funcionarios, Validaciones, Ausentismos, Turnos },
    head() {
        return {
            title: `Carga de datos #${this.$route.params.id}`
        };
    },
    data(){
      return{

      };
    },
    created() {
        this.getRecarga(this.$route.params.id);
        this.getGruposAusentismos();
    },
    computed:{
      ...mapGetters({
          openModalFuncionarios: "recargas/datos/modalFuncionarios",
          loadingSpinner: "recargas/recargas/fullScreenLoading",
          recarga: "recargas/recargas/recarga",
          openModalGrupos: "recargas/grupos/modalGrupos",
          openModalAusentismos: "recargas/ausentismos/modal",
        }),
        file_funcionarios:{
          get() {
            return this.$store.state.recargas.datos.files.funcionarios;
          },
          set(newValue) {
            this.$store.commit('recargas/datos/SET_FILE_FUNCIONARIOS', newValue);
          }
        },
    },
    methods:{
      ...mapActions({
            getRecarga: "recargas/recargas/returnRecarga",
            getGruposAusentismos: 'modulos/modulos/getGruposAusentismos',
        }),
        clickOpenModalFuncionarios:function(){
          this.$store.commit('recargas/datos/SET_MODAL_FUNCIONARIOS', true);
        },
        clickOpenModalGrupos:function(){
          this.$store.commit('recargas/grupos/SET_MODAL_GRUPOS', true);
        },
        clickOpenModalAusentismos:function(){
          this.$store.commit('recargas/ausentismos/SET_MODAL', true);
        },
        clickOpenModalTurnos:function(){
          console.log('clic!');
          this.$store.commit('recargas/turnos/SET_MODAL', true);
        }
    }
}
</script>

<style>

</style>
