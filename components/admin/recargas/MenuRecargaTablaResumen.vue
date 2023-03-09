<template>
  <div class="tabs is-centered">
    <ul>
      <li :class="currentRouteName === `/admin/recargas/${$route.params.id}` ?  'is-active'  : '' ">
        <nuxt-link :to="`/admin/recargas/${$route.params.id}`"><span class="icon is-small"><i class="el-icon-info"></i></span>Información</nuxt-link>
      </li>
      <li :class="currentRouteName === `/admin/recargas/${$route.params.id}/carga-datos` ?  'is-active'  : '' ">
        <nuxt-link :to="`/admin/recargas/${$route.params.id}/carga-datos`"><span class="icon is-small"><i class="el-icon-upload"></i></span>Carga masiva</nuxt-link>
      </li>
      <li :class="currentRouteName === `/admin/recargas/${$route.params.id}/contratos` ?  'is-active'  : '' ">
        <nuxt-link :to="`/admin/recargas/${$route.params.id}/contratos`"><span class="icon is-small"><i class="el-icon-s-order"></i></span>Contratos ({{ recarga.contratos_count }})</nuxt-link>
      </li>
      <li :class="currentRouteName === `/admin/recargas/${$route.params.id}/asignaciones` ?  'is-active'  : '' ">
        <nuxt-link :to="`/admin/recargas/${$route.params.id}/asignaciones`"><span class="icon is-small"><i class="el-icon-s-operation"></i></span>Asignaciones ({{ recarga.asignaciones_count }})</nuxt-link>
      </li>
      <li :class="currentRouteName === `/admin/recargas/${$route.params.id}/asistencia` ?  'is-active'  : '' ">
        <nuxt-link :to="`/admin/recargas/${$route.params.id}/asistencia`"><span class="icon is-small"><i class="el-icon-s-claim"></i></span>Asistencia</nuxt-link>
      </li>
      <li :class="currentRouteName === `/admin/recargas/${$route.params.id}/ausentismos` ?  'is-active'  : '' ">
        <nuxt-link :to="`/admin/recargas/${$route.params.id}/ausentismos?grupo=${1}`"><span class="icon is-small"><i class="el-icon-close"></i></span>Ausentismos ({{ recarga.ausentismos_count }})</nuxt-link>
      </li>
      <li :class="currentRouteName === `/admin/recargas/${$route.params.id}/viaticos` ?  'is-active'  : '' ">
        <nuxt-link :to="`/admin/recargas/${$route.params.id}/viaticos`"><span class="icon is-small"><i class="el-icon-shopping-cart-full"></i></span>Viáticos ({{ recarga.viaticos_count }})</nuxt-link>
      </li>
      <li :class="currentRouteName === `/admin/recargas/${$route.params.id}/resumen` ?  'is-active'  : '' ">
        <nuxt-link :to="`/admin/recargas/${$route.params.id}/resumen`"><span class="icon is-small"><i class="el-icon-star-on has-background-warning has-text-info"></i></span>Tabla resumen</nuxt-link>
      </li>
      <li :class="currentRouteName === `/admin/recargas/${$route.params.id}/reajustes` ?  'is-active'  : '' ">
        <nuxt-link :to="`/admin/recargas/${$route.params.id}/reajustes`"><span class="icon is-small"><i class="el-icon-s-tools"></i></span>Ajustes ({{ recarga.reajustes_count }})</nuxt-link>
      </li>
      <li :class="currentRouteName === `/admin/recargas/${$route.params.id}/advertencias` ?  'is-active'  : '' ">
        <nuxt-link :to="`/admin/recargas/${$route.params.id}/advertencias`"><span class="icon is-small"><i class="el-icon-bell"></i></span>Advertencias</nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
  computed: {
    ...mapGetters({
        recarga: "recargas/resumen/recarga",
      }),
    currentRouteName() {
      return this.$nuxt.$route.path;
    }
  },
}
</script>

<style>

</style>
