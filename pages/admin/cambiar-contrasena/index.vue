<template>
  <div>
    <HeroPage namepage="Mi perfil" />
    <div class="container is-fullhd">
      <div class="card p-6 m-6">
        <menu-auth />
        <div class="columns">
          <div class="column is-full">
            <div class="section">
              <h3 class="title is-4">Cambiar mi contraseña</h3>
              <div class="field">
                <label class="label">Ingrese contraseña actual</label>
                <input v-model="password" class="input is-rounded" type="password" placeholder="Ingrese contraseña actual">
                <p v-if="errors && errors.password" class="help is-danger">{{errors.password != null ? errors.password[0] : ''}}</p>
              </div>
              <div class="field">
                <label class="label">Ingrese nueva contraseña</label>
                <input :disabled="(!password)" v-model="new_password" class="input is-rounded" type="password" placeholder="Ingrese nueva contraseña">
                <p v-if="errors && errors.new_password" class="help is-danger">{{errors.new_password != null ? errors.new_password[0] : ''}}</p>
              </div>
              <div class="field">
                <label class="label">Confirme nueva contraseña</label>
                <input :disabled="(!password || !new_password)" v-model="confirm_new_password" class="input is-rounded" type="password" placeholder="Confirme nueva contraseña">
                <p v-if="errors && errors.confirm_new_password" class="help is-danger">{{errors.confirm_new_password != null ? errors.confirm_new_password[0] : ''}}</p>
              </div>
              <div class="field">
                <button :disabled="(!password || !new_password || !confirm_new_password)" :class="(loadingChangePassword ? 'is-loading' : '')" class="button is-success is-rounded" @click.prevent="changePassword">Cambiar contraseña</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import HeroPage from '../../../components/admin/usuarios/HeroPage.vue'
import MenuAuth from '../../../components/mi-perfil/Menu-auth.vue';

export default {
  components: { HeroPage, MenuAuth },
  middleware: 'auth',
  head() {
      return {
          title: "Cambiar contraseña"
      };
  },
  computed:{
    ...mapGetters({
      loadingChangePassword:'usuarios/administradores/main/loadingChangePassword',
      errors:'usuarios/administradores/main/errorsPassword',
    }),
    password:{
      get() {
        return this.$store.state.usuarios.administradores.main.change_password.password;
      },
      set(newValue) {
        this.$store.commit('usuarios/administradores/main/SET_CHANGE_PASSWORD', newValue);
      }
    },
    new_password:{
      get() {
        return this.$store.state.usuarios.administradores.main.change_password.new_password;
      },
      set(newValue) {
        this.$store.commit('usuarios/administradores/main/SET_CHANGE_NEW_PASSWORD', newValue);
      }
    },
    confirm_new_password:{
      get() {
        return this.$store.state.usuarios.administradores.main.change_password.confirm_new_password;
      },
      set(newValue) {
        this.$store.commit('usuarios/administradores/main/SET_CHANGE_CONFIRM_NEW_PASSWORD', newValue);
      }
    },
  },
  methods:{
    ...mapActions({
      changePasswordAction:'usuarios/administradores/main/changePasswordUser'
    }),
    changePassword:function(){
      this.changePasswordAction(this.$auth.user.uuid);
    }
  }
};
</script>

<style scoped>
.permissions-list .column {
  margin-bottom: 3px; /* Ajusta el margen entre las filas */
  margin-left: 2px;
}

.permission-item {
  margin-bottom: 5px; /* Elimina el margen inferior de cada permiso */

}
</style>
