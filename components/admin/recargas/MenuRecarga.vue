<template>
  <div class="tabs is-centered">
    <ul>
      <li :class="currentRouteName === `/admin/recargas/${codigo}` ?  'is-active'  : '' ">
        <nuxt-link :to="`/admin/recargas/${codigo}`"><span class="icon is-small"><i class="el-icon-info"></i></span>Información</nuxt-link>
      </li>
      <li :class="currentRouteName === `/admin/recargas/${codigo}/carga-datos` ?  'is-active'  : '' ">
        <nuxt-link :to="`/admin/recargas/${codigo}/carga-datos`"><span class="icon is-small"><i class="el-icon-upload"></i></span>Carga masiva</nuxt-link>
      </li>
      <li :class="currentRouteName === `/admin/recargas/${codigo}/contratos` ?  'is-active'  : '' ">
        <nuxt-link :to="`/admin/recargas/${codigo}/contratos`"><span class="icon is-small"><i class="el-icon-s-order"></i></span>Contratos ({{ recarga.contratos_count }})</nuxt-link>
      </li>
      <li :class="currentRouteName === `/admin/recargas/${codigo}/asignaciones` ?  'is-active'  : '' ">
        <nuxt-link :to="`/admin/recargas/${codigo}/asignaciones`"><span class="icon is-small"><i class="el-icon-s-operation"></i></span>Asignaciones ({{ recarga.asignaciones_count }})</nuxt-link>
      </li>
      <li :class="currentRouteName === `/admin/recargas/${codigo}/asistencia` ?  'is-active'  : '' ">
        <nuxt-link :to="`/admin/recargas/${codigo}/asistencia`"><span class="icon is-small"><i class="el-icon-s-claim"></i></span>Asistencia</nuxt-link>
      </li>
      <li :class="currentRouteName === `/admin/recargas/${codigo}/ausentismos` ?  'is-active'  : '' ">
        <nuxt-link :to="`/admin/recargas/${codigo}/ausentismos?grupo=${1}`"><span class="icon is-small"><i class="el-icon-close"></i></span>Ausentismos ({{ recarga.ausentismos_count }})</nuxt-link>
      </li>
      <li :class="currentRouteName === `/admin/recargas/${codigo}/viaticos` ?  'is-active'  : '' ">
        <nuxt-link :to="`/admin/recargas/${codigo}/viaticos`"><span class="icon is-small"><i class="el-icon-shopping-cart-full"></i></span>Viáticos ({{ recarga.viaticos_count }})</nuxt-link>
      </li>
      <li :class="currentRouteName === `/admin/recargas/${codigo}/resumen` ?  'is-active'  : '' ">
        <nuxt-link :to="`/admin/recargas/${codigo}/resumen`"><span class="icon is-small"><i class="el-icon-star-on has-background-warning has-text-info"></i></span>Tabla resumen</nuxt-link>
      </li>
      <li :class="currentRouteName === `/admin/recargas/${codigo}/reajustes` ?  'is-active'  : '' ">
        <nuxt-link :to="`/admin/recargas/${codigo}/reajustes`"><span class="icon is-small"><i class="el-icon-s-tools"></i></span>Ajustes ({{ recarga.reajustes_count }})</nuxt-link>
      </li>
      <li :class="currentRouteName === `/admin/recargas/${codigo}/advertencias` ?  'is-active'  : '' ">
        <nuxt-link :to="`/admin/recargas/${codigo}/advertencias`"><span class="icon is-small"><i class="el-icon-bell"></i></span>Advertencias</nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
  props:['codigo'],
  computed: {
    ...mapGetters({
        recarga: "recargas/recargas/recarga",
      }),
    currentRouteName() {
      return this.$nuxt.$route.path;
    }
  },
}
</script>

<style>

</style>
