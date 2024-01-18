<template>
  <div>
    <div class="modal-background" @click.prevent="hideModalEditar"></div>
    <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Editar usuario administrador</p>
          <button class="delete" aria-label="close" @click.prevent="hideModalEditar"></button>
        </header>
        <section class="modal-card-body">
          <div class="columns">
            <div class="column">
              <template v-if="loadingEditUsuario">
                <el-skeleton style="width: 100%" animated>
                  <template slot="template">
                    <div style="padding: 14px;">
                      <div class="field">
                        <div class="columns">
                          <div class="column">
                            <el-skeleton-item variant="p" style="width: 100%" />
                          </div>
                          <div class="column">
                            <el-skeleton-item variant="p" style="width: 100%" />
                          </div>
                        </div>
                      </div>
                      <div class="field">
                        <div class="columns">
                          <div class="column">
                            <el-skeleton-item variant="p" style="width: 100%" />
                          </div>
                          <div class="column">
                            <el-skeleton-item variant="p" style="width: 100%" />
                          </div>
                        </div>
                      </div>
                      <div class="field">
                        <div class="columns">
                          <div class="column">
                            <el-skeleton-item variant="p" style="width: 100%" />
                          </div>
                          <div class="column">
                            <el-skeleton-item variant="p" style="width: 100%" />
                          </div>
                        </div>
                      </div>
                      <div class="field">
                        <div class="columns">
                          <div class="column">
                            <el-skeleton-item variant="p" style="width: 100%" />
                          </div>
                          <div class="column">
                            <el-skeleton-item variant="p" style="width: 100%" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </el-skeleton>
              </template>
              <template v-else>
                <template v-if="paso === 0">
                  <div class="field">
                    <div class="columns">
                      <div class="column is-two-thirds">
                        <div class="field">
                          <label class="label required">Rut</label>
                          <div class="control">
                            <input @keyup.prevent="verifyUsuarioIn" class="input" type="number" placeholder="Ingrese rut" v-model="rut">
                            <p v-if="errors && errors.rut" class="help is-danger">{{errors.rut != null ? errors.rut[0] : ''}}</p>
                          </div>
                        </div>
                      </div>
                      <div class="column">
                        <div class="field">
                          <label class="label required">DV</label>
                          <div class="control">
                            <input @keyup.prevent="verifyUsuarioIn" class="input" type="text" placeholder="Ingrese DV" v-model="dv">
                            <p v-if="errors && errors.dv" class="help is-danger">{{errors.dv != null ? errors.dv[0] : ''}}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="field">
                    <div class="columns">
                      <div class="column">
                        <div class="field">
                          <label class="label required">Nombre</label>
                          <div class="control">
                            <input class="input" type="text" placeholder="Ingrese nombre" v-model="nombres">
                            <p v-if="errors && errors.nombres" class="help is-danger">{{errors.nombres != null ? errors.nombres[0] : ''}}</p>
                          </div>
                        </div>
                      </div>
                      <div class="column">
                        <div class="field">
                          <label class="label required">Apellidos</label>
                          <div class="control">
                            <input class="input" type="text" placeholder="Ingrese apellidos" v-model="apellidos">
                            <p v-if="errors && errors.apellidos" class="help is-danger">{{errors.apellidos != null ? errors.apellidos[0] : ''}}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="field">
                    <div class="columns">
                      <div class="column">
                        <div class="field">
                          <label class="label required">Correo electrónico</label>
                          <div class="control">
                            <input class="input" type="email" placeholder="Ingrese correo electrónico" v-model="email">
                            <p v-if="errors && errors.email" class="help is-danger">{{errors.email != null ? errors.email[0] : ''}}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
              </template>
              <template v-if="paso === 1">
                <div class="field">
                  <div class="columns">
                    <div class="column">
                      <div class="field">
                        <label class="label required">Seleccione perfiles</label>
                        <div class="control">
                          <el-select v-model="roles" multiple collapse-tags clearable placeholder="Seleccione perfiles" class="element-select" @change="getPermissions">
                            <el-option
                              v-for="rol in rolesList"
                              :key="rol.id"
                              :label="rol.name"
                              :value="rol.id">
                            </el-option>
                          </el-select>
                          <p v-if="errors && errors.roles_id" class="help is-danger">{{errors.roles_id != null ? errors.roles_id[0] : ''}}</p>
                        </div>
                      </div>
                      <div class="field">
                        <label class="label">Seleccione permisos adicionales a los perfiles seleccionados (opcional)</label>
                        <div class="control">
                          <div class="columns">
                            <div class="column">
                              <template v-if="permissionsAditional.length && roles.length">
                                <el-checkbox-group v-model="permisos" size="mini">
                                  <el-checkbox class="element-style-checkbox-group" v-for="(permiso, index) in permissionsAditional" :key="index" :label="permiso.id" border>{{permiso.name}}</el-checkbox>
                              </el-checkbox-group>
                              </template>
                              <template v-else>
                                <el-empty class="is-centered" description="Sin permisos para asociar" :image-size="50"></el-empty>
                              </template>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <template v-if="paso === 2">
                <div class="field">
                  <div class="columns">
                    <div class="column">
                      <div class="field">
                        <label class="label required">Seleccione establecimientos a gestionar</label>
                        <div class="control">
                          <el-select v-model="establecimientos" multiple collapse-tags clearable placeholder="Seleccione establecimientos" class="element-select">
                            <el-option
                              v-for="establecimiento in establecimientosList"
                              :key="establecimiento.id"
                              :label="establecimiento.nombre"
                              :value="establecimiento.id">
                            </el-option>
                          </el-select>
                          <p v-if="errors && errors.establecimientos_id" class="help is-danger">{{errors.establecimientos_id != null ? errors.establecimientos_id[0] : ''}}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <template v-if="isAdmin">
                <div class="notification is-danger is-light">
                  Usuario ya es administrador en el sistema.
                </div>
              </template>
              <div class="field">
                <div class="columns">
                  <div class="column">
                      <button :disabled="paso === 0" class="button is-link is-light" @click.prevent="volverPaso">Volver</button>
                  </div>
                  <div class="column">
                    <button v-if="paso != 2" class="button is-link is-light" :class="(loadingVerifyUsuario ? 'is-loading' : '')" :disabled="(!rut || !dv) || (isAdmin)"  @click.prevent="siguientePaso">Siguiente</button>
                    <button v-if="paso === 2" class="button is-link is-light" :class="(loadingEditUsuario ? 'is-loading' : '')" @click.prevent="editUsuario">Editar</button>
                  </div>
                </div>
              </div>
              </template>
            </div>
          </div>
        </section>
    </div>

  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
export default {
  data(){
    return{
      setTimeoutBuscador:''
    };
  },
   async created(){
    this.getRoles();
    this.getEstablecimientos();
    if(this.$route.query.id){
      this.show_modal_editar = true;
      await this.getUsuario(this.$route.query.id);
    }
  },
  computed:{
    ...mapGetters({
      errors:'usuarios/administradores/main/errors',
      loadingEditUsuario:'usuarios/administradores/main/loadinUsuario',
      rolesList:'modulos/modulos/roles',
      establecimientosList:'modulos/modulos/establecimientos',
      loadingVerifyUsuario:'usuarios/administradores/main/loadingVerifyUsuario',
      isAdmin:'usuarios/administradores/main/isAdmin',
      permissionsAditional:'usuarios/administradores/main/permissionsAditiontal'
    }),
    show_modal_editar:{
      get() {
        return this.$store.state.usuarios.administradores.main.show_modal_editar;
      },
      set(newValue) {
        this.$store.commit('usuarios/administradores/main/SET_MODAL_EDITAR', newValue);
      }
    },
    rut:{
      get() {
        return this.$store.state.usuarios.administradores.main.usuario.rut;
      },
      set(newValue) {
        this.$store.commit('usuarios/administradores/main/SET_USUARIO_RUT', newValue);
      }
    },
    dv:{
      get() {
        return this.$store.state.usuarios.administradores.main.usuario.dv;
      },
      set(newValue) {
        this.$store.commit('usuarios/administradores/main/SET_USUARIO_DV', newValue);
      }
    },
    nombres:{
      get() {
        return this.$store.state.usuarios.administradores.main.usuario.nombres;
      },
      set(newValue) {
        this.$store.commit('usuarios/administradores/main/SET_USUARIO_NOMBRES', newValue);
      }
    },
    apellidos:{
      get() {
        return this.$store.state.usuarios.administradores.main.usuario.apellidos;
      },
      set(newValue) {
        this.$store.commit('usuarios/administradores/main/SET_USUARIO_APELLIDOS', newValue);
      }
    },
    email:{
      get() {
        return this.$store.state.usuarios.administradores.main.usuario.email;
      },
      set(newValue) {
        this.$store.commit('usuarios/administradores/main/SET_USUARIO_EMAIL', newValue);
      }
    },
    roles:{
      get() {
        return this.$store.state.usuarios.administradores.main.usuario?.roles_id;
      },
      set(newValue) {
        this.$store.commit('usuarios/administradores/main/SET_USUARIO_ROLES', newValue);
      }
    },
    permisos:{
      get() {
        return this.$store.state.usuarios.administradores.main.usuario?.permisos_id;
      },
      set(newValue) {
        this.$store.commit('usuarios/administradores/main/SET_USUARIO_PERMISOS', newValue);
      }
    },
    establecimientos:{
      get() {
        return this.$store.state.usuarios.administradores.main.usuario.establecimientos_id;
      },
      set(newValue) {
        this.$store.commit('usuarios/administradores/main/SET_USUARIO_ESTABLECIMIENTOS', newValue);
      }
    },
    paso:{
      get() {
        return this.$store.state.usuarios.administradores.main.paso;
      },
      set(newValue) {
        this.$store.commit('usuarios/administradores/main/SET_PASO', newValue);
      }
    }
  },
  methods:{
    ...mapActions({
      getUsuario: 'usuarios/administradores/main/getUsuario',
      getRoles:'modulos/modulos/getRoles',
      getEstablecimientos:'modulos/modulos/getEstablecimientos',
      verifyUsuarioAction:'usuarios/administradores/main/verifyUsuario',
      editUsuarioAction:'usuarios/administradores/main/editUsuario',
      getPermissionsAditionalAction:'usuarios/administradores/main/getPermissionsAditional'
    }),
    verifyUsuarioIn:function(){
      if(this.rut && this.dv){
        clearTimeout(this.setTimeoutBuscador);
        this.setTimeoutBuscador = setTimeout(this.verifyUsuarioAction, 500);
      }
    },
    hideModalEditar:function(){
      this.show_modal_editar = false;
      this.$router.back();
      this.paso = 0;
    },
    volverPaso:function(){
      this.paso--;
    },
    siguientePaso:function(){
      this.paso++;
      if(this.paso === 1){
        this.getPermissions();
      }
    },
    editUsuario:function(){
      this.editUsuarioAction(this.$route.query.id);
    },
    getPermissions:function(){
      this.getPermissionsAditionalAction(this.$route.query.id);
    }
  }
}
</script>

<style>

</style>
