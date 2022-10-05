<template>
  <div class="tabs is-centered">
    <ul>
      <li :class="currentRouteName === '/acceso/administrador' ?  'is-active'  : '' "><a href="/acceso/administrador">Acceso administrador</a></li>
      <li :class="currentRouteName === '/acceso/mis-datos' ?  'is-active'  : '' "><a href="/acceso/mis-datos">Acceso a consulta de mis recargas</a></li>
      <li :class="currentRouteName === '/acceso/recuperar-contrasena' ?  'is-active'  : '' "><a href="/acceso/recuperar-contrasena">Recuperar mi contraseña</a></li>
    </ul>
</div>
</template>

<script>
export default {
  computed: {
    currentRouteName() {
        return this.$nuxt.$route.path;
      }
  },
}
</script>

<style>

</style>
