<template>
  <div class="tabs is-centered">
    <ul>
      <li :class="currentRouteName === `/admin/recargas/${codigo}` ?  'is-active'  : '' ">
        <nuxt-link :to="`/admin/recargas/${codigo}`"><span class="icon is-small"><i class="el-icon-info"></i></span>Información general</nuxt-link>
      </li>
      <li :class="currentRouteName === `/admin/recargas/${codigo}/carga-datos` ?  'is-active'  : '' ">
        <nuxt-link :to="`/admin/recargas/${codigo}/carga-datos`"><span class="icon is-small"><i class="el-icon-upload"></i></span>Carga masiva de datos</nuxt-link>
      </li>
      <li :class="currentRouteName === `/admin/recargas/${codigo}/asistencia` ?  'is-active'  : '' ">
        <nuxt-link :to="`/admin/recargas/${codigo}/asistencia`"><span class="icon is-small"><i class="el-icon-s-claim"></i></span>Planilla asistencia</nuxt-link>
      </li>
      <li :class="currentRouteName === `/admin/recargas/${codigo}/resumen` ?  'is-active'  : '' ">
        <nuxt-link :to="`/admin/recargas/${codigo}/resumen`"><span class="icon is-small"><i class="el-icon-date"></i></span>Tabla resumen</nuxt-link>
      </li>
      <li :class="currentRouteName === `/admin/recargas/${codigo}/extras` ?  'is-active'  : '' ">
        <nuxt-link :to="`/admin/recargas/${codigo}/resumen`"><span class="icon is-small"><i class="el-icon-warning-outline"></i></span>Retroactivos (9)</nuxt-link>
      </li>
      <li :class="currentRouteName === `/admin/recargas/${codigo}/reajustes` ?  'is-active'  : '' ">
        <nuxt-link :to="`/admin/recargas/${codigo}/resumen`"><span class="icon is-small"><i class="el-icon-setting"></i></span>Reajuste de remuneración (17)</nuxt-link>
      </li>
      <li :class="currentRouteName === `/admin/recargas/${codigo}/reajustes` ?  'is-active'  : '' ">
        <nuxt-link :to="`/admin/recargas/${codigo}/resumen`"><span class="icon is-small"><i class="el-icon-bell"></i></span>Panel de advertencia</nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props:['codigo'],
  computed: {
    currentRouteName() {
      return this.$nuxt.$route.path;
    }
  },
}
</script>

<style>

</style>
