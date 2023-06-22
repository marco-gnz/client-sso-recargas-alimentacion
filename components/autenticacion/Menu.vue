<template>
  <div class="tabs is-centered">
    <ul>
      <li :class="currentRouteName === '/acceso/administrador' ?  'is-active'  : '' "><nuxt-link to="/acceso/administrador">Acceso administrador</nuxt-link></li>
      <li :class="currentRouteName === '/acceso/recuperar-contrasena' ?  'is-active'  : '' "><nuxt-link to="/acceso/recuperar-contrasena">Recuperar mi contraseña</nuxt-link></li>
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
