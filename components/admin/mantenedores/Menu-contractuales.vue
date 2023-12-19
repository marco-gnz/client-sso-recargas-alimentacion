<template>
  <div>
    <div class="columns">
      <div class="column">
        <div class="tabs">
          <ul>
            <li @click.prevent="actionGetDatosContractuales" v-for="(url, index) in urls" :key="index" :class="currentRouteFullName === `/admin/mantenedores/contractuales?tipo=${url.query}` ?  'is-active'  : '' ">
              <nuxt-link :to="{path: currentRouteName, query:{tipo:url.query}}"><span class="icon is-small"><i :class="url.icon"></i></span>{{url.name}}</nuxt-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
export default {
  computed: {
    ...mapGetters({
      urls:'mantenedores/main/urls'
    }),
    currentRouteQuery(){
      return this.$nuxt.$route.query.tipo;
    },
    currentRouteFullName(){
      return this.$nuxt.$route.fullPath;
    },
    currentRouteName(){
      return this.$nuxt.$route.path;
    },
    current_page:{
      get() {
        return this.$store.state.mantenedores.main.pagination.current_page;
      },
      set(newValue) {
        this.$store.commit('mantenedores/main/SET_CURRENT_PAGE', newValue);
      }
    },
    filtroInput:{
      get() {
        return this.$store.state.mantenedores.main.filtro.input;
      },
      set(newValue) {
        this.$store.commit('mantenedores/main/SET_FILTRO_INPUT', newValue);
      }
    },
  },
  methods:{
    ...mapActions({
      getDatosContractuales:'mantenedores/main/getDatosContractuales'
    }),
   actionGetDatosContractuales:function(){
    this.current_page = 1;
    this.filtroInput = '';
    const data = {
      tipo:this.currentRouteQuery
    };
    this.getDatosContractuales(data);
   }
  }
}
</script>

<style>

</style>
