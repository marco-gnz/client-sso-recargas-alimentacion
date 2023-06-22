<template>
  <div>
    <div class="columns">
      <div class="column is-one-fifth">
        <nuxt-link class="button is-danger is-rounded" :to="`/admin/recargas/${esquema.recarga_codigo}/resumen`"><span class="icon is-small"><i class="el-icon-arrow-left"></i></span> <span>Tabla resumen</span></nuxt-link>
      </div>
      <div class="column">
        <div class="tabs">

          <ul>
            <li :class="currentRouteName === `/admin/esquemas/${$route.params.id}/detalle` ?  'is-active'  : '' ">
              <nuxt-link :to="`/admin/esquemas/${$route.params.id}/detalle`"><span class="icon is-small"><i class="el-icon-info"></i></span>Detalle</nuxt-link>
            </li>
            <li :class="currentRouteName === `/admin/esquemas/${$route.params.id}/asignaciones` ?  'is-active'  : '' ">
              <nuxt-link :to="`/admin/esquemas/${$route.params.id}/asignaciones`"><span class="icon is-small"><i class="el-icon-s-operation"></i></span>Asignaciones ({{esquema.turnos_count}})</nuxt-link>
            </li>
            <li :class="currentRouteName === `/admin/esquemas/${$route.params.id}/contratos` ?  'is-active'  : '' ">
              <nuxt-link :to="`/admin/esquemas/${$route.params.id}/contratos`"><span class="icon is-small"><i class="el-icon-s-order"></i></span>Contratos ({{esquema.contratos_count}})</nuxt-link>
            </li>
            <li :class="currentRouteName === `/admin/esquemas/${$route.params.id}/turnos` ?  'is-active'  : '' ">
              <nuxt-link :to="`/admin/esquemas/${$route.params.id}/turnos`"><span class="icon is-small"><i class="el-icon-s-claim"></i></span>Turnos ({{esquema.asistencias_count > 0 ? 'Si' : 'No'}})</nuxt-link>
            </li>
            <li :class="currentRouteName === `/admin/esquemas/${$route.params.id}/ausentismos` ?  'is-active'  : '' ">
              <nuxt-link :to="`/admin/esquemas/${$route.params.id}/ausentismos?grupo=${1}`"><span class="icon is-small"><i class="el-icon-close"></i></span>Ausentismos ({{esquema.ausentismos_count}})</nuxt-link>
            </li>
            <li :class="currentRouteName === `/admin/esquemas/${$route.params.id}/viaticos` ?  'is-active'  : '' ">
              <nuxt-link :to="`/admin/esquemas/${$route.params.id}/viaticos`"><span class="icon is-small"><i class="el-icon-shopping-cart-full"></i></span>Viaticos ({{esquema.viaticos_count}})</nuxt-link>
            </li>
            <li :class="currentRouteName === `/admin/esquemas/${$route.params.id}/ajustes` ?  'is-active'  : '' ">
              <nuxt-link :to="`/admin/esquemas/${$route.params.id}/ajustes`"><span class="icon is-small"><i class="el-icon-setting"></i></span>Ajustes ({{esquema.reajustes_count}})</nuxt-link>
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
  computed:{
    ...mapGetters({
          esquema: "esquemas/esquemaFuncionario/esquema"
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
          uuid_esquema:this.$route.params.id
        };
        this.openCartolaAction(data);
      }
    }
}
</script>

<style>

</style>
