<template>
  <div>
    <div class="tabs">
      <ul>
        <li :class="currentRouteName === `/admin/mi-perfil` ?  'is-active'  : '' ">
          <nuxt-link :to="`/admin/mi-perfil`"><span class="icon is-small"><i class="el-icon-user"></i></span>Mi perfil</nuxt-link>
        </li>
        <li :class="currentRouteName === `/admin/cambiar-contrasena` ?  'is-active'  : '' ">
          <nuxt-link :to="`/admin/cambiar-contrasena`"><span class="icon is-small"><i class="el-icon-lock"></i></span>Cambiar contraseña</nuxt-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    currentRouteName() {
      return this.$nuxt.$route.path;
    },
  },
}
</script>

<style>

</style>
