<template>
  <div>
    <HeroPage namepage="Usuarios administradores" />
    <div class="container.is-fullhd">
      <div class="card p-6 m-6">
        <div class="columns">
          <div class="column is-full">
            <div class="field">
              <div class="control is-medium" :class="(fullScreenLoading ? 'is-loading': '')">
                <el-input
                    autofocus
                    placeholder="Buscar administradores por rut, nombre, apellidos o email..."
                    v-model="input_query"
                    @keyup.native="keySearchInput"
                    >
                </el-input>
              </div>
            </div>
            <div class="table-container pt-2">
              <div class="field">
                <div class="columns">
                  <div class="column is-11">
                    <span v-if="(pagination)" class="tag is-info is-light">{{ `${pagination.total} ${pagination.total > 1 ? `resultados` : `resultado`}` }}</span>
                  </div>
                  <div class="column is-1">
                    <el-button v-if="hasPermission('user.create')" @click.prevent="modalAddUsuario" size="mini" type="warning" icon="el-icon-plus" class="is-right" circle></el-button>
                  </div>
                </div>
              </div>
              <table class="table  is-narrow is-hoverable is-fullwidth" v-loading="fullScreenLoading">
                <thead>
                  <tr>
                    <th>Rut</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Establecimiento</th>
                    <th>Perfil</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <template v-if="(usuarios) && (usuarios.length)">
                    <tr v-for="(usuario, index) in usuarios" :key="index" :class="(index_color === index ? 'row-selected' : '')">
                      <td>{{usuario.rut_completo}}</td>
                      <td>{{usuario.apellidos}} {{usuario.nombres}}</td>
                      <td>{{usuario.email ? usuario.email : '--'}}</td>
                      <td>{{usuario.establecimientos_nom ? usuario.establecimientos_nom : '--'}}</td>
                      <td>{{usuario.roles ? usuario.roles : '--'}}</td>
                      <td>
                        <template v-if="hasPermission('user.status')">
                          <el-tooltip :content="`${!usuario.active ? `No` : `Si`}`" placement="top">
                              <el-switch v-loading.lock="loadingStatus && index_click_usuario === index"  :disabled="loadingStatus" @change="editStatus(index, usuario.uuid)" :active-value="!usuario.active" :inactive-value="usuario.actuve" inactive-color="#F1948A" active-color="#13ce66"></el-switch>
                          </el-tooltip>
                        </template>
                      </td>
                      <td>
                        <nuxt-link v-if="hasPermission('user.update')" @click.native="editUsuario(index)" :to="{path: `/admin/usuarios/administradores`, query: { id: usuario.uuid }}"><el-button size="mini" type="primary" icon="el-icon-edit" circle></el-button></nuxt-link>
                        <el-tooltip class="item" effect="dark" content="Restablecer contraseña" placement="left-start">
                          <el-button v-if="hasPermission('user.update')" v-loading.lock="loadingStatus && index_click_usuario === index" :disabled="loadingStatus" size="mini" icon="el-icon-refresh" type="danger" circle @click.native="refreshPassword(index, usuario.uuid)"></el-button>
                        </el-tooltip>
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Transition name="slide-fade">
      <div v-if="show_modal_add" class="modal is-large" :class="show_modal_add ? 'is-active' : '' ">
        <ModalAdd />
      </div>
    </Transition>
    <Transition name="slide-fade">
      <div v-if="show_modal_editar" class="modal is-large" :class="show_modal_editar ? 'is-active' : '' ">
        <ModalEditar />
      </div>
    </Transition>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import ModalAdd from '../../../../components/admin/usuarios/Administradores/ModalAdd.vue';
import ModalEditar from '../../../../components/admin/usuarios/Administradores/ModalEditar.vue';
import HeroPage from '../../../../components/admin/usuarios/HeroPage.vue'
export default {
  components: { HeroPage, ModalAdd, ModalEditar },
  middleware: "auth",
  head() {
    return {
        title: `Administradores`
    };
  },
   created(){
    this.getUsuarios();
    this.getRolesPermissions();
  },
  data(){
    return{
      setTimeoutBuscador:'',
      index_color:undefined,
      index_click_usuario:undefined
    };
  },
  computed:{
    ...mapGetters({
      fullScreenLoading:'usuarios/administradores/main/fullScreenLoading',
      usuarios:'usuarios/administradores/main/usuarios',
      pagination:'usuarios/administradores/main/pagination',
      offset:'usuarios/administradores/main/offset',
      loadingStatus:'usuarios/administradores/main/loadingStatus',
    }),
    permissions() {
      return this.$store.state.usuarios.administradores.main.permissions;
    },
    input_query:{
      get() {
        return this.$store.state.usuarios.administradores.main.filtro.input;
      },
      set(newValue) {
        this.$store.commit('usuarios/administradores/main/SET_FILTRO_INPUT', newValue);
      }
    },
    current_page:{
      get() {
        return this.$store.state.usuarios.administradores.main.pagination.current_page;
      },
      set(newValue) {
        this.$store.commit('usuarios/administradores/main/SET_CURRENT_PAGE', newValue);
      }
    },
    show_modal_editar:{
      get() {
        return this.$store.state.usuarios.administradores.main.show_modal_editar;
      },
      set(newValue) {
        this.$store.commit('usuarios/administradores/main/SET_MODAL_EDITAR', newValue);
      }
    },
    show_modal_add:{
      get() {
        return this.$store.state.usuarios.administradores.main.show_modal_add;
      },
      set(newValue) {
        this.$store.commit('usuarios/administradores/main/SET_MODAL_ADD', newValue);
      }
    },
    isActived: function () {
        return this.pagination.current_page;
    },
    pagesNumber: function () {
        if (!this.pagination.to) {
            return [];
        }
        var from = this.pagination.current_page - this.offset;
        if (from < 1) {
            from = 1;
        }
        var to = from + (this.offset * 2);
        if (to >= this.pagination.last_page) {
            to = this.pagination.last_page;
        }
        var pagesArray = [];
        while (from <= to) {
            pagesArray.push(from);
            from++;
        }
        return pagesArray;
    }
  },
  methods:{
    ...mapActions({
      getUsuarios:'usuarios/administradores/main/getUsuarios',
      editStatusAction:'usuarios/administradores/main/editUsuarioStatus',
      getRolesPermissions:'usuarios/administradores/main/getRolesPermissions',
      refreshPasswordUsuario:'usuarios/administradores/main/refreshPasswordUsuario'
    }),
    keySearchInput:function(){
      if(this.input_query.length > 1){
          this.current_page = 1;
          clearTimeout(this.setTimeoutBuscador);
          this.setTimeoutBuscador = setTimeout(this.getUsuarios, 500);
      }
    },
    changePage(page) {
      this.current_page = page;
      this.getUsuarios();
    },
    editUsuario:function(index){
      this.show_modal_editar = true;
      this.changeColorSelected(index);
    },
    changeColorSelected:function(index){
      if(this.index_color === undefined){
          this.index_color = index;
      }else if(this.index_color != index){
          this.index_color = index;
      }
    },
    modalAddUsuario:function(){
      this.show_modal_add = true;
    },
    editStatus:function(index, uuid){
      this.index_click_usuario = index;
      this.editStatusAction(uuid);
    },
    hasPermission:function(permission){
      return this.permissions.includes(permission);
    },
    refreshPassword:function(index, uuid){
      this.index_click_usuario = index;
      this.changeColorSelected(index);
      this.refreshPasswordUsuario(uuid);
    }
  }

}
</script>

<style>

</style>
