<template>
  <div v-loading.fullscreen.lock="loadingSpinner" element-loading-text="Cargando datos..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.9)">
    <Hero :title="`Recarga #${$route.params.id} - Tabla resumen de datos`" :subtitle="`${recarga.establecimiento != null ? recarga.establecimiento.nombre : ''} para el mes de ${recarga.mes} año ${recarga.anio}.`"  />
    <div class="container.is-fullhd">
      <MenuTotales :recarga="recarga" />
      <div class="card p-6 m-6">
        <MenuRecarga :codigo="$route.params.id" />
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import MenuRecarga from '../../../../../components/admin/recargas/MenuRecarga.vue';
import MenuTotales from '../../../../../components/admin/recargas/MenuTotales.vue';

export default {
    middleware: "auth",
    head() {
        return {
            title: `Resumen #${this.$route.params.id}`
        };
    },
    created() {
        this.getRecarga(this.$route.params.id);
    },
    computed: {
        ...mapGetters({
            loadingSpinner: "recargas/recargas/fullScreenLoading",
            recarga: "recargas/recargas/recarga",
        }),
    },
    methods: {
        ...mapActions({
            getRecarga: "recargas/recargas/returnRecarga"
        })
    },
    components: { MenuRecarga, MenuTotales }
}
</script>

<style>

</style>
