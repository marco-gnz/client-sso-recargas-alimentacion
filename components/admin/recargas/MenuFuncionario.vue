<template>
  <div>
    <div class="columns">
      <div class="column is-one-fifth">
        <nuxt-link class="button is-danger is-rounded" :to="`/admin/recargas/${$route.params.id}/resumen`"><span class="icon is-small"><i class="el-icon-arrow-left"></i></span> <span>Tabla resumen</span></nuxt-link>
      </div>
      <div class="column">
        <div class="tabs">
          <ul>
            <li :class="currentRouteName === `/admin/recargas/${$route.params.id}/resumen/${$route.params.funcionario}/turnos` ?  'is-active'  : '' ">
              <nuxt-link :to="`/admin/recargas/${$route.params.id}/resumen/${$route.params.funcionario}/turnos`"><span class="icon is-small"><i class="el-icon-s-operation"></i></span>Asignaciones ({{funcionario.turnos_count}})</nuxt-link>
            </li>
            <li :class="currentRouteName === `/admin/recargas/${$route.params.id}/resumen/${$route.params.funcionario}/contratos` ?  'is-active'  : '' ">
              <nuxt-link :to="`/admin/recargas/${$route.params.id}/resumen/${$route.params.funcionario}/contratos`"><span class="icon is-small"><i class="el-icon-s-order"></i></span>Contratos ({{ funcionario.contratos_count }})</nuxt-link>
            </li>
            <li :class="currentRouteName === `/admin/recargas/${$route.params.id}/resumen/${$route.params.funcionario}/asistencia` ?  'is-active'  : '' ">
              <nuxt-link :to="`/admin/recargas/${$route.params.id}/resumen/${$route.params.funcionario}/asistencia`"><span class="icon is-small"><i class="el-icon-s-claim"></i></span>Turnos ({{funcionario.dias_libres > 0 ? 'Si' : 'No'}})</nuxt-link>
            </li>
            <li :class="currentRouteName === `/admin/recargas/${$route.params.id}/resumen/${$route.params.funcionario}/ausentismos` ?  'is-active'  : '' ">
              <nuxt-link :to="`/admin/recargas/${$route.params.id}/resumen/${$route.params.funcionario}/ausentismos?grupo=${1}` "><span class="icon is-small"><i class="el-icon-close"></i></span>Ausentismos ({{funcionario.ausentismos_count}})</nuxt-link>
            </li>
            <li :class="currentRouteName === `/admin/recargas/${$route.params.id}/resumen/${$route.params.funcionario}/viaticos` ?  'is-active'  : '' ">
              <nuxt-link :to="`/admin/recargas/${$route.params.id}/resumen/${$route.params.funcionario}/viaticos` "><span class="icon is-small"><i class="el-icon-shopping-cart-full"></i></span>Viáticos ({{funcionario.viaticos_count}})</nuxt-link>
            </li>
            <li :class="currentRouteName === `/admin/recargas/${$route.params.id}/resumen/${$route.params.funcionario}/reajustes` ?  'is-active'  : '' ">
              <nuxt-link :to="`/admin/recargas/${$route.params.id}/resumen/${$route.params.funcionario}/reajustes`"><span class="icon is-small"><i class="el-icon-setting"></i></span>Ajustes ({{ funcionario.reajustes_count }})</nuxt-link>
            </li>
            <li>
              <el-button icon="el-icon-s-check has-background-white has-text-danger" @click.prevent="openCartola"><span>Cartola</span></el-button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
export default {
  computed: {
    ...mapGetters({
      funcionario:'recargas/funcionario/funcionario',
    }),
    currentRouteName() {
      return this.$nuxt.$route.path;
    },
  },
  methods:{
    ...mapActions({
      openCartolaAction:'funcionario/pdf/openCartola'
    }),
    openCartola:function(){
      const data = {
        codigo_recarga:this.$route.params.id,
        uuid_funcionario:this.$route.params.funcionario
      };
      this.openCartolaAction(data);
      /* const url = `${this.url}/api/funcionario/cartola/${this.$route.params.id}/${this.$route.params.funcionario}`; */
      /* const url = `${this.url}`;
      console.log(process.env.BASE_URL); */
      /* window.open(url, '_blank'); */
    }
  }
}
</script>

<style>

</style>
