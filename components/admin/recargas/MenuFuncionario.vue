<template>
  <div class="tabs is-centered">
    <ul>
      <li :class="currentRouteName === `/admin/recargas/${$route.params.id}/funcionario/${$route.params.funcionario}/turnos` ?  'is-active'  : '' ">
        <nuxt-link to=""><span class="icon is-small"><i class="el-icon-s-operation"></i></span>Turnos (0)</nuxt-link>
      </li>
      <li :class="currentRouteName === `/admin/recargas/${$route.params.id}/funcionario/${$route.params.funcionario}/ausentismos` ?  'is-active'  : '' ">
        <nuxt-link to=""><span class="icon is-small"><i class="el-icon-date"></i></span>Ausentismos (0)</nuxt-link>
      </li>
      <li :class="currentRouteName === `/admin/recargas/${$route.params.id}/funcionario/${$route.params.funcionario}/retroactivos` ?  'is-active'  : '' ">
        <nuxt-link to=""><span class="icon is-small"><i class="el-icon-warning-outline"></i></span>Retroactivos (0)</nuxt-link>
      </li>
      <li :class="currentRouteName === `/admin/recargas/${$route.params.id}/funcionario/${$route.params.funcionario}/reajustes` ?  'is-active'  : '' ">
        <nuxt-link to=""><span class="icon is-small"><i class="el-icon-setting"></i></span>Reajustes (0)</nuxt-link>
      </li>
      <li :class="currentRouteName === `/admin/recargas/${$route.params.id}/funcionario/${$route.params.funcionario}/observaciones` ?  'is-active'  : '' ">
        <nuxt-link to=""><span class="icon is-small"><i class="el-icon-chat-line-square"></i></span>Observaciones (0)</nuxt-link>
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
