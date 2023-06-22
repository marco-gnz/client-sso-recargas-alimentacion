<template>
  <div>
    <div class="modal-background" @click.prevent="hideModalAdd"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Ingresar usuario administrador</p>
        <button class="delete" aria-label="close" @click.prevent="hideModalAdd"></button>
      </header>
      <section class="modal-card-body">
        <div class="columns">
          <div class="column">
            <template v-if="paso === 0">
              <div class="field">
                <div class="columns">
                  <div class="column is-two-thirds">
                    <div class="field">
                      <label class="label">Rut</label>
                      <div class="control">
                        <input @keyup.prevent="verifyUsuarioIn" class="input" type="number" placeholder="Ingrese rut" v-model="rut">
                        <p v-if="errors && errors.rut" class="help is-danger">{{errors.rut != null ? errors.rut[0] : ''}}</p>
                      </div>
                    </div>
                  </div>
                  <div class="column">
                    <div class="field">
                      <label class="label">DV</label>
                      <div class="control">
                        <input @keyup.prevent="verifyUsuarioIn" class="input" type="text" placeholder="Ingrese DV" v-model="dv">
                        <p v-if="errors && errors.dv" class="help is-danger">{{errors.dv != null ? errors.dv[0] : ''}}</p>
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
                      <label class="label required">Nombre</label>
                      <div class="control">
                        <input class="input" type="text" placeholder="Ingrese nombre" v-model="nombres">
                        <p v-if="errors && errors.nombres" class="help is-danger">{{errors.nombres != null ? errors.nombres[0] : ''}}</p>
                        <p v-if="errorsUpdate && errorsUpdate.nombres" class="help is-danger">{{errorsUpdate.nombres != null ? errorsUpdate.nombres[0] : ''}}</p>
                      </div>
                    </div>
                  </div>
                  <div class="column">
                    <div class="field">
                      <label class="label required">Apellidos</label>
                      <div class="control">
                        <input class="input" type="text" placeholder="Ingrese apellidos" v-model="apellidos">
                        <p v-if="errors && errors.apellidos" class="help is-danger">{{errors.apellidos != null ? errors.apellidos[0] : ''}}</p>
                        <p v-if="errorsUpdate && errorsUpdate.apellidos" class="help is-danger">{{errorsUpdate.apellidos != null ? errorsUpdate.apellidos[0] : ''}}</p>
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
                         <p v-if="errorsUpdate && errorsUpdate.email" class="help is-danger">{{errorsUpdate.email != null ? errorsUpdate.email[0] : ''}}</p>
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
                      <label class="label required">Seleccione perfiles</label>
                      <div class="control">
                        <el-select v-model="roles" multiple collapse-tags clearable placeholder="Seleccione rol" class="element-select">
                          <el-option
                            v-for="rol in rolesList"
                            :key="rol.id"
                            :label="rol.name"
                            :value="rol.id">
                          </el-option>
                        </el-select>
                        <p v-if="errors && errors.roles_id" class="help is-danger">{{errors.roles_id != null ? errors.roles_id[0] : ''}}</p>
                        <p v-if="errorsUpdate && errorsUpdate.roles_id" class="help is-danger">{{errorsUpdate.roles_id != null ? errorsUpdate.roles_id[0] : ''}}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <template v-if="paso === 3">
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
                          <p v-if="errorsUpdate && errorsUpdate.establecimientos_id" class="help is-danger">{{errorsUpdate.establecimientos_id != null ? errorsUpdate.establecimientos_id[0] : ''}}</p>
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
                  <button v-if="paso != 3" class="button is-link is-light" :class="(loadingVerifyUsuario ? 'is-loading' : '')" :disabled="(!rut || !dv) || (isAdmin)"  @click.prevent="siguientePaso">Siguiente</button>
                  <button v-if="paso === 3" class="button is-link is-light" :class="(loadingAddUsuario ? 'is-loading' : '')" @click.prevent="addUsuario">Ingresar</button>
                </div>
              </div>
            </div>
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
  created(){
    this.getRoles();
    this.getEstablecimientos();
  },
  computed:{
    ...mapGetters({
      errors:'usuarios/administradores/main/newsErrors',
      errorsUpdate:'usuarios/administradores/main/errors',
      loadingAddUsuario:'usuarios/administradores/main/loadingAddUsuario',
      loadingVerifyUsuario:'usuarios/administradores/main/loadingVerifyUsuario',
      isAdmin:'usuarios/administradores/main/isAdmin',
      rolesList:'modulos/modulos/roles',
      new_usuario:'usuarios/administradores/main/newUsuario',
      establecimientosList:'modulos/modulos/establecimientos',
    }),
    show_modal_add:{
      get() {
        return this.$store.state.usuarios.administradores.main.show_modal_add;
      },
      set(newValue) {
        this.$store.commit('usuarios/administradores/main/SET_MODAL_ADD', newValue);
      }
    },
    rut:{
      get() {
        return this.$store.state.usuarios.administradores.main.new_usuario.rut;
      },
      set(newValue) {
        this.$store.commit('usuarios/administradores/main/SET_NEW_USUARIO_RUT', newValue);
      }
    },
    dv:{
      get() {
        return this.$store.state.usuarios.administradores.main.new_usuario.dv;
      },
      set(newValue) {
        this.$store.commit('usuarios/administradores/main/SET_NEW_USUARIO_DV', newValue);
      }
    },
    nombres:{
      get() {
        return this.$store.state.usuarios.administradores.main.new_usuario.nombres;
      },
      set(newValue) {
        this.$store.commit('usuarios/administradores/main/SET_NEW_USUARIO_NOMBRES', newValue);
      }
    },
    apellidos:{
      get() {
        return this.$store.state.usuarios.administradores.main.new_usuario.apellidos;
      },
      set(newValue) {
        this.$store.commit('usuarios/administradores/main/SET_NEW_USUARIO_APELLIDOS', newValue);
      }
    },
    email:{
      get() {
        return this.$store.state.usuarios.administradores.main.new_usuario.email;
      },
      set(newValue) {
        this.$store.commit('usuarios/administradores/main/SET_NEW_USUARIO_EMAIL', newValue);
      }
    },
    roles:{
      get() {
        return this.$store.state.usuarios.administradores.main.new_usuario.roles_id;
      },
      set(newValue) {
        this.$store.commit('usuarios/administradores/main/SET_NEW_USUARIO_ROLES', newValue);
      }
    },
    establecimientos:{
      get() {
        return this.$store.state.usuarios.administradores.main.new_usuario.establecimientos_id;
      },
      set(newValue) {
        this.$store.commit('usuarios/administradores/main/SET_NEW_USUARIO_ESTABLECIMIENTOS', newValue);
      }
    },
    paso:{
      get() {
        return this.$store.state.usuarios.administradores.main.paso;
      },
      set(newValue) {
        this.$store.commit('usuarios/administradores/main/SET_PASO', newValue);
      }
    },
  },
  methods:{
    ...mapActions({
      addUsuarioAction:'usuarios/administradores/main/addUsuario',
      editUsuarioAction:'usuarios/administradores/main/editUsuario',
      verifyUsuarioAction:'usuarios/administradores/main/verifyUsuario',
      getRoles:'modulos/modulos/getRoles',
      getEstablecimientos:'modulos/modulos/getEstablecimientos',
    }),
    verifyUsuarioIn:function(){
      if(this.rut && this.dv){
        clearTimeout(this.setTimeoutBuscador);
        this.setTimeoutBuscador = setTimeout(this.verifyUsuarioAction, 500);
      }
    },
     hideModalAdd:function(){
      this.show_modal_add = false;
    },
    addUsuario:function(){
      if(this.isAdmin === null){
        this.addUsuarioAction();
      }else if(this.isAdmin === false){
        if(this.new_usuario){
          this.editUsuarioAction(this.new_usuario.uuid);
        }
      }
    },
    volverPaso:function(){
      this.paso--;
    },
    siguientePaso:function(){
      this.paso++;
    }
  }
}
</script>

<style>

</style>
