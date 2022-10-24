<template>
  <div>
    <nav class="navbar is-white is-fixed-top" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a class="navbar-item">
          <img src="~/assets/img/sso-logo.png" width="30" height="28"> <strong>NOM SISTEMA</strong>
        </a>
      </div>
      <div class="navbar-menu">
        <no-ssr>
          <div class="navbar-start" v-show="$auth.loggedIn">
            <a class="navbar-item">
                <nuxt-link to="/admin/recargas">Recargas</nuxt-link>
            </a>

            <div class="navbar-item has-dropdown is-hoverable">
              <a class="navbar-link">
                Usuarios
              </a>
              <div class="navbar-dropdown">
                <a class="navbar-item">
                    Funcionarios
                </a>
                <a class="navbar-item">
                    Administradores
                </a>
              </div>
            </div>

            <a class="navbar-item">
              <nuxt-link to="/admin/recargas/enviar">Enviar recarga</nuxt-link>
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
                  Mi perfil
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
export default {
  data(){
    return{
      fullscreenLoading:false
    };
  },
  methods:{
    async logout(){
      this.fullscreenLoading = !this.fullscreenLoading;
      await this.$auth.logout();
      this.$router.push("/acceso/administrador");
      this.fullscreenLoading = !this.fullscreenLoading;
    }
  }
}
</script>

<style>

</style>
