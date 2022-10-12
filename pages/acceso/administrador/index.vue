<template>
  <div>
    <div class="container.is-fullhd">
      <div class="card p-6 m-6">
        <div class="columns">
          <div class="column pt-6 is-centered">
            <Menu />
            <div class="field">
                <label class="label">Ingrese correo electrónico</label>
                <input v-model="login.email" class="input is-rounded" type="email" placeholder="Ingrese correo electrónico">
              <p v-if="errors.email" class="help is-danger">{{errors.email[0]}}</p>
            </div>
            <div class="field">
              <div class="control has-icons-left has-icons-right">
                <label class="label">Ingrese contraseña</label>
                <input v-model="login.password" class="input is-rounded" type="password" placeholder="Ingrese contraseña">
              </div>
              <p v-if="errors.password" class="help is-danger">{{errors.password[0]}}</p>
            </div>
            <div class="field">
              <div class="buttons is-right">
                <button :disabled="!login.email || !login.password" @click.prevent="loginAction" v-loading.fullscreen.lock="fullscreenLoading" class="button is-link is-light is-fullwidth is-rounded">Ingresar</button>
              </div>
            </div>
            <div class="field">
              <div class="control">
                <span><a href="/acceso/recuperar-contrasena">Olvide mi contraseña</a></span>
              </div>
            </div>
          </div>
          <div class="column">
            <figure class="image is-16by9">
              <img class="is-rounded" src="https://img.freepik.com/vector-gratis/gente-negocios-trabajando-buscando-candidatos_1262-19729.jpg?w=2000">
            </figure>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Menu from '../../../components/autenticacion/Menu.vue';
export default {
    name: "IndexPage",
    middleware: 'guest',
    head() {
        return {
            title: "Administrador"
        };
    },
    data(){
      return{
        fullscreenLoading: false,
        login:{
          email:'',
          password:''
        },
        errors:{}
      };
    },
    methods:{
      async loginAction(){
        try {
          this.fullscreenLoading = !this.fullscreenLoading;
          await this.$auth.loginWith("laravelSanctum", {
            data: this.login,
          });
          console.log('log!');
          this.$router.push("/");
          this.$notify.success({
          message: `Bienvenido(a) ${
            this.$auth.user.nombre
          }!`,
          showClose: true,
        });
          this.fullscreenLoading = !this.fullscreenLoading;
        } catch (error) {
          this.fullscreenLoading = !this.fullscreenLoading;
          console.log(error);
          if (error.response.status === 422) {
            this.errors = error.response.data.errors;
          } else if (error.response.status === 401) {
            this.errors = { email: [] };
            this.errors.email[0] = "El correo o la contraseña es incorrecto";
          } else if (error.response.status === 503) {
            this.errors = { email: [] };
            this.errors.email[0] = "Usuario no autorizado para el acceso";
          }
        }
      }
    },
    components: {Menu }
}
</script>
