<template>
  <div>
    <nav class="navbar is-white is-fixed-top" role="navigation" aria-label="main navigation">
      <template v-if="$auth.loggedIn">
        <div class="navbar-brand">
          <a class="navbar-item">
            <img src="~/assets/img/sso-logo.png" width="30" height="28"> <strong>SBA</strong>
          </a>
        </div>
      </template>
      <div class="navbar-menu">
        <no-ssr>
          <div class="navbar-start" v-show="$auth.loggedIn">
            <a class="navbar-item" v-if="hasPermission('recarga.read')">
                <nuxt-link to="/admin/recargas">Recargas</nuxt-link>
            </a>
            <a class="navbar-item">
              <nuxt-link to="/admin/recargas/enviar" v-if="hasPermission('recarga.send')">Enviar cartola</nuxt-link>
            </a>
            <div class="navbar-item has-dropdown is-hoverable">
              <a class="navbar-link">
                Usuarios
              </a>
              <div class="navbar-dropdown">
                <a class="navbar-item" v-if="hasPermission('funcionario.read')">
                  <nuxt-link to="/admin/usuarios/funcionarios">Funcionarios</nuxt-link>
                </a>
                <a class="navbar-item" v-if="hasPermission('user.read')">
                  <nuxt-link to="/admin/usuarios/administradores">Administradores</nuxt-link>
                </a>
              </div>
            </div>
            <div class="navbar-item has-dropdown is-hoverable" v-if="hasPermission('mantenedor.read')">
              <a class="navbar-link">
                Mantenedores
              </a>
              <div class="navbar-dropdown">
                <div class="nested dropdown">
                  <a class="navbar-item">
                    <span class="icon-text">
                      <span>Datos contractuales</span>
                      <span class="icon">
                        <i class="el-icon-arrow-right"></i>
                      </span>
                    </span>
                  </a>
                  <div class="dropdown-menu" id="dropdown-menu" role="menu">
                    <div class="dropdown-content">
                      <nuxt-link :class="(currentRouteFullName === `${currentRouteName}?tipo=${url.query}` ? 'is-active' : '')" class="dropdown-item" v-for="(url, index) in urls" :key="index" @click.native="actionGetDatosContractuales(url.query)" :to="{path:'/admin/mantenedores/contractuales', query:{tipo:url.query}}">{{url.name}}</nuxt-link>
                    </div>
                  </div>
                </div>
                <div class="nested dropdown">
                  <a class="navbar-item">
                    <span class="icon-text">
                      <span>Variaciones</span>
                      <span class="icon">
                        <i class="el-icon-arrow-right"></i>
                      </span>
                    </span>
                  </a>
                  <div class="dropdown-menu" id="dropdown-menu" role="menu">
                    <div class="dropdown-content">
                      <nuxt-link :class="(currentRouteFullName === `${currentRouteName}?tipo=${url.query}` ? 'is-active' : '')" class="dropdown-item" v-for="(url, index) in urlsVariaciones" :key="index" @click.native="actionGetVariaciones(url.query)" :to="{path:'/admin/mantenedores/variaciones', query:{tipo:url.query}}">{{url.name}}</nuxt-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- <a class="navbar-item" v-if="hasPermission('tarjeta.read')">
                <nuxt-link to="#">Tarjetas</nuxt-link>
            </a> -->
          </div>
        </no-ssr>
        <client-only>
          <div class="navbar-end" v-if="$auth.loggedIn">
            <div class="navbar-item has-dropdown is-hoverable">
              <a class="navbar-link is-arrowless">
                {{$auth.user.nombres}}
              </a>
              <div class="navbar-dropdown">
                <a class="navbar-item">
                  <nuxt-link to="/admin/mi-perfil">Mi perfil</nuxt-link>
                </a>
                <hr class="navbar-divider">
                <div class="navbar-item">
                  <a href="#" @click.prevent="logout" v-loading.fullscreen.lock="fullscreenLoading">Cerrar sesión</a>
                </div>
              </div>
            </div>
          </div>
        </client-only>
      </div>
    </nav>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
export default {
  data(){
    return{
      fullscreenLoading:false
    };
  },
  created(){
    this.getRolesPermissions();
  },
  computed: {
    ...mapGetters({
      urls:'mantenedores/main/urls',
      urlsVariaciones:'mantenedores/main/urlsVariaciones'
    }),
    filtroInput:{
      get() {
        return this.$store.state.mantenedores.main.filtro.input;
      },
      set(newValue) {
        this.$store.commit('mantenedores/main/SET_FILTRO_INPUT', newValue);
      }
    },
    currentRouteFullName(){
      return this.$nuxt.$route.fullPath;
    },
    currentRouteName(){
      return this.$nuxt.$route.path;
    },
    permissions() {
      return this.$store.state.usuarios.administradores.main.permissions;
    },
  },
  methods:{
    ...mapActions({
      getRolesPermissions:'usuarios/administradores/main/getRolesPermissions',
      getDatosContractuales:'mantenedores/main/getDatosContractuales',
      getVariaciones:'mantenedores/main/getVariaciones'
    }),
    async logout(){
      this.fullscreenLoading = !this.fullscreenLoading;
      await this.$auth.logout();
      this.$router.push("/acceso/administrador");
      this.fullscreenLoading = !this.fullscreenLoading;
    },
    hasPermission:function(permission){
      return this.permissions.includes(permission);
    },
    actionGetDatosContractuales:function(tipo){
      this.filtroInput = '';
      const data = {
        tipo:tipo
      };
      this.getDatosContractuales(data);
    },
    actionGetVariaciones:function(tipo){
      this.filtroInput = '';
      const data = {
        tipo:tipo
      };
      this.getVariaciones(data);
    }
  }
}
</script>

<style>
.nested.dropdown:hover > .dropdown-menu {
  display: block;
}
.nested.dropdown .dropdown-menu {
  top: -12px;
  margin-left: 100%;
}

.nested.dropdown .dropdown-trigger button {
  padding: 0px 0px;
  border: 0px;
  font-size: 14px;
  font-weight: 400;
}
</style>
