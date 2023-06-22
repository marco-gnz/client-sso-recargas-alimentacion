<template>
  <div>
    <HeroPage namepage="Mi perfil" />
    <div class="container is-fullhd">
      <div class="card p-6 m-6">
        <menu-auth />
        <div class="columns">
          <div class="column is-full">
            <div class="section">
              <h3 class="title is-4">Datos personales</h3>
              <div class="content">
                <p><strong>RUT:</strong> {{ $auth.user.rut_completo }}</p>
                <p><strong>Nombres:</strong> {{ $auth.user.nombre_completo }}</p>
                <p><strong>Correo:</strong> {{ $auth.user.email }}</p>
                <p><strong>Establecimientos a gestionar:</strong> {{$auth.user.establecimientos ? $auth.user.establecimientos  : '--'}}</p>
                <p><strong>Último acceso:</strong> {{$auth.user.last_login}} </p>
              </div>
            </div>
            <div class="section">
              <h3 class="title is-4">Perfiles y permisos</h3>
              <div class="content">
                <p><strong>Perfiles:</strong> {{ $auth.user.roles_name }}</p>
                <p><strong>Permisos:</strong></p>
                <template v-if="$auth.user.permissions">
                  <div class="permissions-list">
                    <div class="columns is-multiline">
                      <div class="column" v-for="permiso in $auth.user.permissions" :key="permiso">
                        <p class="permission-item">{{ permiso }}</p>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeroPage from '../../../components/admin/usuarios/HeroPage.vue'
import MenuAuth from '../../../components/mi-perfil/Menu-auth.vue';

export default {
  components: { HeroPage, MenuAuth },
  middleware: 'auth',
  head() {
      return {
          title: "Mi perfil"
      };
  },
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
