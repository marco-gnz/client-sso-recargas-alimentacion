<template>
  <div v-loading.fullscreen.lock="loadingSpinner" element-loading-text="Cargando datos..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.9)">
    <template v-if="recarga">
      <Hero  :title="`Recarga #${$route.params.id} - Información general`" :subtitle="`${recarga.establecimiento != null ? recarga.establecimiento.nombre : ''} para el mes de ${recarga.mes} año ${recarga.anio}.`" />
    </template>
    <div class="container.is-fullhd">
      <MenuTotales />
      <template v-if="recarga">
        <div class="card p-6 m-6">
          <MenuRecarga :codigo="$route.params.id" />
          <div class="columns">
            <div class="column is-one-quarter">
              <h5 class="title is-5">Datos principales de recarga</h5>
              <div class="field">
                <label class="label">Cantidad de días habiles en el mes</label>
                <input v-model="form_total_dias_habiles" class="input" type="email" placeholder="Ingrese cantidad de días habiles">
                <p v-if="errors.total_dias_habiles" class="help is-danger">{{errors.total_dias_habiles[0]}}</p>
              </div>
              <div class="field">
                <label class="label">Monto a cancelar por día</label>
                <input v-model="form_monto_dia" class="input" type="email" placeholder="Ingrese cantidad de días habiles">
                <p v-if="errors.monto_dia" class="help is-danger">{{errors.monto_dia[0]}}</p>
              </div>
              <div class="field">
                <div class="buttons is-right">
                  <button :disabled="disabledButtonEdit" class="button is-link is-light" v-loading.fullscreen.lock="loadingSpinner" @click.prevent="editarGeneral">Editar y sincronizar</button>
                </div>
              </div>
            </div>
          </div>
          <div class="column">

          </div>
      </div>
    </template>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import MenuRecarga from '../../../../components/admin/recargas/MenuRecarga.vue';
import MenuTotales from '../../../../components/admin/recargas/MenuTotales.vue';
export default {
    middleware: 'auth',
    head() {
        return {
            title: `Información #${this.$route.params.id}`
        };
    },
    data(){
      return{
        disabledButtonEdit:true
      };
    },
    created() {
        this.getRecarga(this.$route.params.id);
    },
    computed: {
        ...mapGetters({
            loadingSpinner: "recargas/recargas/fullScreenLoading",
            recarga: "recargas/recargas/recarga",
            errors:'recargas/recargas/errors',
        }),
        form_total_dias_habiles:{
          get() {
            return this.recarga.total_dias_habiles;
          },
          set(newValue) {
            this.disabledButtonEdit = false;
            this.$store.commit('recargas/recargas/SET_TOTAL_DIAS_HABILES', newValue);
          }
        },
        form_monto_dia:{
          get() {
            return this.recarga.monto_dia;
          },
          set(newValue) {
            this.disabledButtonEdit = false;
            this.$store.commit('recargas/recargas/SET_MONTO_DIA', newValue);
          }
        },
    },
    methods: {
        ...mapActions({
            getRecarga: "recargas/recargas/returnRecarga",
            updateDatosPrincipales: "recargas/recargas/updateDatosPrincipales",
        }),
        editarGeneral:function(){
          this.$confirm(`Al editar los días habiles y el monto a cancelar por día, se realizará un proceso para recalcular masivamente la Tabla Resumen con los nuevos datos editados. ¿Desea editar y sincronizar los datos?`, 'Advertencia', {
            confirmButtonText: 'Si, editar y sincronizar',
            cancelButtonText: 'Cancelar',
            type: 'warning'
          }).then(() => {
            this.updateDatosPrincipales(this.recarga.id);
          });

        }
    },
    components: { MenuRecarga, MenuTotales }
}
</script>

<style>

</style>
