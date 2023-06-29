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
            <a class="navbar-item" v-if="hasPermission('tarjeta.read')">
                <nuxt-link to="#">Tarjetas</nuxt-link>
            </a>
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
    permissions() {
      return this.$store.state.usuarios.administradores.main.permissions;
    },
  },
  methods:{
    ...mapActions({
      getRolesPermissions:'usuarios/administradores/main/getRolesPermissions'
    }),
    async logout(){
      this.fullscreenLoading = !this.fullscreenLoading;
      await this.$auth.logout();
      this.$router.push("/acceso/administrador");
      this.fullscreenLoading = !this.fullscreenLoading;
    },
    hasPermission:function(permission){
      return this.permissions.includes(permission);
    }
  }
}
</script>

<style>

</style>
