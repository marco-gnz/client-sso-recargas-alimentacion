<template>
  <div>
    <nav class="navbar is-white is-fixed-top" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a class="navbar-item" href="/">
          <img src="~/assets/img/sso-logo.png" width="30" height="28"> <strong>NOM SISTEMA</strong>
        </a>

        <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbarBasicExample" class="navbar-menu">
        <template v-if="$auth.loggedIn">
          <div class="navbar-start">
            <a class="navbar-item" href="/admin/recargas">
              Recargas
            </a>
            <div class="navbar-item has-dropdown is-hoverable">
              <a class="navbar-link">
                Usuarios
              </a>

              <div class="navbar-dropdown">
                <a class="navbar-item" href="/admin/usuarios/funcionarios">
                  Funcionarios
                </a>
                <a class="navbar-item">
                  Administradores
                </a>
              </div>
            </div>
          </div>
        </template>

        <div class="navbar-end">
          <template v-if="!$auth.loggedIn">
            <div class="navbar-item">
              <div class="buttons">
                <a class="button is-light" href="/acceso/administrador">
                  Ingresar
                </a>
              </div>
          </div>
          </template>
          <template v-else>
            <div class="navbar-item has-dropdown is-hoverable">
              <a class="navbar-link">
                {{$auth.user.name}}
              </a>
              <div class="navbar-dropdown is-right">
                <a class="navbar-item">
                  Mi perfil
                </a>
                <hr class="navbar-divider">
                <div class="navbar-item">
                  <a href="#" @click.prevent="logout" v-loading.fullscreen.lock="fullscreenLoading">Cerrar sesión</a>
                </div>
              </div>
            </div>
          </template>
        </div>
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
