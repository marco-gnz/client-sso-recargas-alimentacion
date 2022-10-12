<template>
  <div class="tabs is-centered">
    <ul>
      <li :class="currentRouteName === `/admin/recargas/${codigo}` ?  'is-active'  : '' ">
        <nuxt-link :to="`/admin/recargas/${codigo}`"><span class="icon is-small"><i class="el-icon-info"></i></span>Información general</nuxt-link>
      </li>
      <li :class="currentRouteName === `/admin/recargas/${codigo}/carga-datos` ?  'is-active'  : '' ">
        <nuxt-link :to="`/admin/recargas/${codigo}/carga-datos`"><span class="icon is-small"><i class="el-icon-upload"></i></span>Carga de datos</nuxt-link>
      </li>
      <li :class="currentRouteName === `/admin/recargas/${codigo}/archivos` ?  'is-active'  : '' ">
        <nuxt-link :to="`/admin/recargas/${codigo}`"><span class="icon is-small"><i class="el-icon-date"></i></span>Tabla resumen</nuxt-link>
      </li>

      <!-- <li>
        <nuxt-link><span class="icon is-small"><i class="el-icon-info"></i></span>Información general</nuxt-link>
      </li> -->
     <!--  <li :class="currentRouteName === `/admin/recargas/${codigo}` ?  'is-active'  : '' "><nuxt-link :to="`/admin/recargas/${codigo}`">Información general</nuxt-link></li>
      <li :class="currentRouteName === '/acceso/mis-datos' ?  'is-active'  : '' "><nuxt-link to="/acceso/mis-datos">Carga de archivos</nuxt-link></li>
      <li :class="currentRouteName === '/acceso/recuperar-contrasena' ?  'is-active'  : '' "><nuxt-link to="/acceso/recuperar-contrasena">Resumen</nuxt-link></li>
      <li :class="currentRouteName === '/acceso/recuperar-contrasena' ?  'is-active'  : '' "><nuxt-link to="/acceso/recuperar-contrasena">Notificaciones</nuxt-link></li> -->
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
