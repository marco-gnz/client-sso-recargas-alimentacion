<template>
  <div>
    <div class="columns">
      <div class="column is-one-fifth">
        <nuxt-link class="button is-danger is-rounded" :to="`/admin/recargas/${$route.params.id}/resumen`"><span class="icon is-small"><i class="el-icon-arrow-left"></i></span> <span>Tabla resumen</span></nuxt-link>
      </div>
      <div class="column">
        <div class="tabs ">
          <ul>
            <li :class="currentRouteName === `/admin/recargas/${$route.params.id}/resumen/${$route.params.funcionario}/turnos` ?  'is-active'  : '' ">
              <nuxt-link :to="`/admin/recargas/${$route.params.id}/resumen/${$route.params.funcionario}/turnos`"><span class="icon is-small"><i class="el-icon-s-operation"></i></span>Turnos ({{funcionario.turnos_count}})</nuxt-link>
            </li>
            <li :class="currentRouteName === `/admin/recargas/${$route.params.id}/resumen/${$route.params.funcionario}/asistencia` ?  'is-active'  : '' ">
              <nuxt-link :to="`/admin/recargas/${$route.params.id}/resumen/${$route.params.funcionario}/asistencia`"><span class="icon is-small"><i class="el-icon-s-claim"></i></span>Planilla asistencia</nuxt-link>
            </li>
            <li :class="currentRouteName === `/admin/recargas/${$route.params.id}/resumen/${$route.params.funcionario}/ausentismos` ?  'is-active'  : '' ">
              <nuxt-link :to="`/admin/recargas/${$route.params.id}/resumen/${$route.params.funcionario}/ausentismos?grupo=${1}` "><span class="icon is-small"><i class="el-icon-close"></i></span>Ausentismos ({{funcionario.ausentismos_count}})</nuxt-link>
            </li>
            <li :class="currentRouteName === `/admin/recargas/${$route.params.id}/resumen/${$route.params.funcionario}/retroactivos` ?  'is-active'  : '' ">
              <nuxt-link to=""><span class="icon is-small"><i class="el-icon-warning-outline"></i></span>Retroactivos (0)</nuxt-link>
            </li>
            <li :class="currentRouteName === `/admin/recargas/${$route.params.id}/resumen/${$route.params.funcionario}/reajustes` ?  'is-active'  : '' ">
              <nuxt-link to=""><span class="icon is-small"><i class="el-icon-setting"></i></span>Reajustes (0)</nuxt-link>
            </li>
            <li :class="currentRouteName === `/admin/recargas/${$route.params.id}/resumen/${$route.params.funcionario}/observaciones` ?  'is-active'  : '' ">
              <nuxt-link to=""><span class="icon is-small"><i class="el-icon-chat-line-square"></i></span>Observaciones (0)</nuxt-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
  computed: {
    ...mapGetters({
      funcionario:'recargas/funcionario/funcionario',
    }),
    currentRouteName() {
      return this.$nuxt.$route.path;
    }
  },
}
</script>

<style>

</style>
