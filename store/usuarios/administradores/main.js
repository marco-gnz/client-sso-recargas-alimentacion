import { Notification } from 'element-ui';
export const state = () => ({
  roles: [],
  permissions:[],
  permissions_aditional:[],
  full_screen_loading:false,
  usuarios:[],
  filtro:{
    input:''
  },
  paso:0,
  pagination: {
    total: 0,
    current_page: 0,
    per_page: 0,
    last_page: 0,
    from: 0,
    to: 0
  },
  offset: 3,
  show_modal_add:false,
  show_modal_editar:false,
  loading_usuario:false,
  loading_edit_usuario:false,
  loading_add_usuario:false,
  loading_status_usuario:false,
  loading_verify_usuario:false,
  usuario:null,
  new_usuario:{
    uuid:'',
    rut:'',
    dv:'',
    nombres:'',
    apellidos:'',
    email:'',
    roles_id:[],
    permissions_extras:[],
    establecimientos_id:[]
  },
  errors:{},
  new_errors:{},
  is_admin:false,
  change_password:{
    password:'',
    new_password:'',
    confirm_new_password:''
  },
  loading_change_password:false,
  errors_password:{}
});

export const mutations = {
  SET_ROLES(state, value){
    state.roles = value;
  },
  SET_PERMISSIONS(state, value){
    state.permissions = value;
  },
  SET_LOADING(state, value){
    state.full_screen_loading = value;
  },
  SET_USUARIOS(state, value){
    state.usuarios = value;
  },
  SET_CURRENT_PAGE(state, value){
    state.pagination.current_page = value;
  },
  SET_PAGINATION(state, value){
    state.pagination = value;
  },
  SET_FILTRO_INPUT(state, value){
    state.filtro.input = value;
  },
  SET_MODAL_ADD(state, value){
    state.show_modal_add = value;
    if(!value){
      for(let key in state.new_usuario){
          state.new_usuario[key] = '';
      }
      state.new_usuario.roles = [];
      state.new_usuario.permissions_extras = [];
      state.paso = 0;
      state.is_admin = false;
      state.new_errors = {};
      state.errors = {};
    }
  },
  SET_MODAL_EDITAR(state, value){
    state.show_modal_editar = value;
    if(!value){
      for(let key in state.new_usuario){
          state.new_usuario[key] = '';
      }
      state.new_usuario.roles_id = [];
      state.new_usuario.permissions_extras = [];
      state.new_usuario.establecimientos = [];
      state.paso = 0;
      state.is_admin = false;
      state.new_errors = {};
      state.errors = {};
    }
  },
  SET_LOADING_USUARIO(state, value){
    state.loading_usuario = value;
  },
  SET_LOADING_EDIT_USUARIO(state, value){
    state.loading_edit_usuario = value;
  },
  SET_LOADING_ADD_USUARIO(state, value){
    state.loading_add_usuario = value;
  },
  SET_USUARIO(state, value){
    state.usuario = value;
  },
  SET_NEW_USUARIO(state, value){
    state.new_usuario = value;
  },

  SET_USUARIO_RUT(state, value){
    state.usuario.rut = value;
  },
  SET_USUARIO_DV(state, value){
    state.usuario.dv = value;
  },
  SET_USUARIO_NOMBRES(state, value){
    state.usuario.nombres = value;
  },
  SET_USUARIO_APELLIDOS(state, value){
    state.usuario.apellidos = value;
  },
  SET_USUARIO_EMAIL(state, value){
    state.usuario.email = value;
  },
  SET_USUARIO_ROLES(state, value){
    state.usuario.roles_id = value;
  },
  SET_USUARIO_PERMISOS(state, value){
    state.usuario.permisos_id = value;
  },
  SET_USUARIO_ESTABLECIMIENTOS(state, value){
    state.usuario.establecimientos_id = value;
  },
  SET_USUARIO_ERRORS(state, value){
    state.errors = value;
  },
  SET_UPDATE_USUARIO(state, value){
    const indice = state.usuarios.findIndex(u => u.uuid === value.uuid);
    state.usuarios.splice(indice, 1, value);
  },

  SET_NEW_USUARIO_RUT(state, value){
    state.new_usuario.rut = value;
  },
  SET_NEW_USUARIO_DV(state, value){
    state.new_usuario.dv = value;
  },
  SET_NEW_USUARIO_NOMBRES(state, value){
    state.new_usuario.nombres = value;
  },
  SET_NEW_USUARIO_APELLIDOS(state, value){
    state.new_usuario.apellidos = value;
  },
  SET_NEW_USUARIO_EMAIL(state, value){
    state.new_usuario.email = value;
  },
  SET_NEW_USUARIO_ROLES(state, value){
    state.new_usuario.roles_id = value;
  },
  SET_NEW_USUARIO_ESTABLECIMIENTOS(state, value){
    state.new_usuario.establecimientos_id = value;
  },
  SET_NEW_USUARIO_ERRORS(state, value){
    state.new_errors = value;
  },
  SET_ADD_NEW_USUARIO(state, value){
    state.usuarios.unshift(value);
  },
  SET_PASO(state, value){
    state.paso = value;
  },
  SET_LOADING_VERIFY_USUARIO(state, value){
    state.loading_verify_usuario = value;
  },
  SET_IS_ADMIN(state, value){
    state.is_admin = value;
  },
  SET_LOADING_STATUS_USUARIO(state, value){
    state.loading_status_usuario = value;
  },

  SET_CHANGE_PASSWORD(state, value){
    state.change_password.password = value;
  },
  SET_CHANGE_NEW_PASSWORD(state, value){
    state.change_password.new_password = value;
  },
  SET_CHANGE_CONFIRM_NEW_PASSWORD(state, value){
    state.change_password.confirm_new_password = value;
  },
  SET_LOADING_CHANGE_PASSWORD(state, value){
    state.loading_change_password = value;
  },
  SET_CHANGE_PASSWORD_ERRORS(state, value){
    state.errors_password = value;
  },
  SET_PERMISSIONS_ADITIONAL(state, value){
    state.permissions_aditional = value;
  }
};

export const getters = {
  roles(state){
    return state.roles;
  },
  permissions(state){
    return state.permissions;
  },
  fullScreenLoading(state){
    return state.full_screen_loading;
  },
  usuarios(state){
    return state.usuarios;
  },
  pagination(state){
    return state.pagination;
  },
  offset(state){
    return state.offset;
  },
  usuario(state){
    return state.usuario;
  },
  loadinUsuario(state){
    return state.loading_usuario;
  },
  errors(state){
    return state.errors;
  },
  newsErrors(state){
    return state.new_errors;
  },
  loadingEditUsuario(state){
    return state.loading_edit_usuario;
  },
  loadingAddUsuario(state){
    return state.loading_add_usuario;
  },
  loadingVerifyUsuario(state){
    return state.loading_verify_usuario;
  },
  isAdmin(state){
    return state.is_admin;
  },
  loadingStatus(state){
    return state.loading_status_usuario;
  },
  newUsuario(state){
    return state.new_usuario;
  },
  loadingChangePassword(state){
    return state.loading_change_password;
  },
  errorsPassword(state){
    return state.errors_password;
  },
  permissionsAditiontal(state){
    return state.permissions_aditional;
  }
};

export const actions = {
  getRolesPermissions({ commit, state }){
    if(this.$auth.loggedIn){
      commit('SET_ROLES', this.$auth.user.roles);
      commit('SET_PERMISSIONS', this.$auth.user.permissions);
    }
  },
  async getUsuarios({ commit, state }, data){
    commit('SET_LOADING', true);
    const url = `/api/admin/usuarios/administradores?page=${state.pagination.current_page}`;
    await this.$axios.$get(url, {params:state.filtro}).then(response => {
      commit('SET_LOADING', false);
      console.log(response);
      if(response.status === 'Success'){
        commit('SET_PAGINATION', response.pagination);
        commit('SET_USUARIOS', response.usuarios);
      }
    }).catch(error => {
      commit('SET_LOADING', false);
      console.log(error);
    });
  },
  async getUsuario({ commit, state }, data){
    commit('SET_LOADING_USUARIO', true);
    const url = `/api/admin/usuarios/administradores/${data}`;
    await this.$axios.$get(url).then(response => {
      commit('SET_LOADING_USUARIO', false);
      console.log(response);
      if(response.status === 'Success'){
        commit('SET_USUARIO', response.usuario);
      }
    }).catch(error => {
      commit('SET_LOADING_USUARIO', false);
      console.log(error);
    });
  },
  async verifyUsuario({ commit, state }){
    commit('SET_LOADING_VERIFY_USUARIO', true);
    const url = `/api/admin/usuarios/administradores/verify`;
    const data = {
      rut:state.new_usuario.rut,
      dv:state.new_usuario.dv
    };
    await this.$axios.$get(url, {params:data}).then(response => {
      commit('SET_LOADING_VERIFY_USUARIO', false);
      console.log(response);
      if(response.status === 'Success'){
        commit('SET_IS_ADMIN', response.is_admin);
        if(response.is_admin === false){
          commit('SET_NEW_USUARIO', response.usuario);
          commit('SET_USUARIO', response.usuario);
        }
      }
    }).catch(error => {
      commit('SET_LOADING_VERIFY_USUARIO', false);
      console.log(error);
    });
  },
  async addUsuario({ commit, state }){
    commit('SET_LOADING_ADD_USUARIO', true);
    const url = `/api/admin/usuarios/administrador/${data}`;
    const data_get = {
      rut:state.new_usuario.rut,
      dv:state.new_usuario.dv,
      nombres:state.new_usuario.nombres,
      apellidos:state.new_usuario.apellidos,
      email:state.new_usuario.email,
      roles_id:state.new_usuario.roles_id,
      establecimientos_id:state.new_usuario.establecimientos_id
    };
    await this.$axios.$post(url, data_get).then(response => {
      commit('SET_LOADING_ADD_USUARIO', false);
      console.log(response);
      if(response.status === 'Success'){
        commit('SET_ADD_NEW_USUARIO', response.usuario);
        commit('SET_MODAL_ADD', false);
        commit('SET_USUARIO_ERRORS', {});
        commit('SET_NEW_USUARIO_ERRORS', {});
        Notification.success(
          {type: "success", title: response.title}
        );
      }
    }).catch(error => {
      commit('SET_NEW_USUARIO_ERRORS', error.response.data.errors);
      commit('SET_LOADING_ADD_USUARIO', false);
      console.log(error.response.data.errors);
    });
  },
  async editUsuario({ commit, state }, data){
    commit('SET_LOADING_EDIT_USUARIO', true);
    const url = `/api/admin/usuarios/administrador/${data}`;
    const data_get = {
      id:state.usuario.id,
      rut:state.usuario.rut,
      dv:state.usuario.dv,
      nombres:state.usuario.nombres,
      apellidos:state.usuario.apellidos,
      email:state.usuario.email,
      roles_id:state.usuario.roles_id,
      permisos_id:state.usuario.permisos_id,
      establecimientos_id:state.usuario.establecimientos_id
    };
    await this.$axios.$put(url, data_get).then(response => {
      commit('SET_LOADING_EDIT_USUARIO', false);
      console.log(response);
      if(response.status === 'Success'){
        commit('SET_UPDATE_USUARIO', response.usuario);
        commit('SET_MODAL_EDITAR', false);
        commit('SET_USUARIO_ERRORS', {});
        commit('SET_NEW_USUARIO_ERRORS', {});
        Notification.success(
          {type: "success", title: response.title}
        );
        this.$router.back();
      }
    }).catch(error => {
      commit('SET_USUARIO_ERRORS', error.response.data.errors);
      commit('SET_LOADING_EDIT_USUARIO', false);
      console.log(error);
    });
  },
  async editUsuarioStatus({ commit, state }, data){
    commit('SET_LOADING_STATUS_USUARIO', true);
    const url = `/api/admin/usuarios/administrador/${data}/status`;
    await this.$axios.$put(url).then(response => {
      commit('SET_LOADING_STATUS_USUARIO', false);
      console.log(response);
      if(response.status === 'Success'){
        commit('SET_UPDATE_USUARIO', response.usuario);
        Notification.success(
          {type: "success", title: response.title}
        );
      }
    }).catch(error => {
      commit('SET_LOADING_STATUS_USUARIO', false);
      console.log(error);
    });
  },
  async refreshPasswordUsuario({ commit, state }, data){
    commit('SET_LOADING_STATUS_USUARIO', true);
    const url = `/api/admin/usuarios/administrador/${data}/refresh-password`;
    await this.$axios.$put(url).then(response => {
      commit('SET_LOADING_STATUS_USUARIO', false);
      console.log(response);
      if(response.status === 'Success'){
        commit('SET_UPDATE_USUARIO', response.usuario);
        Notification.success(
          {type: "success", title: response.title}
        );
      }
    }).catch(error => {
      commit('SET_LOADING_STATUS_USUARIO', false);
      console.log(error);
    });
  },
  async changePasswordUser({ commit, state }, data){
    commit('SET_LOADING_CHANGE_PASSWORD', true);
    const url = `/api/admin/usuarios/administrador/${data}/change-password`;
    await this.$axios.$put(url, state.change_password).then(response => {
      commit('SET_LOADING_CHANGE_PASSWORD', false);
      console.log(response);
      if(response.status === 'Success'){
        commit('SET_CHANGE_PASSWORD_ERRORS', {});
        commit('SET_CHANGE_PASSWORD', '');
        commit('SET_CHANGE_NEW_PASSWORD', '');
        commit('SET_CHANGE_CONFIRM_NEW_PASSWORD', '');

        Notification.success(
          {type: "success", title: response.title}
        );
      }else{
        Notification.error(
          {type: "error", message: 'Error de servidor.'}
        );
      }
    }).catch(error => {
      commit('SET_CHANGE_PASSWORD_ERRORS', error.response.data.errors);
      commit('SET_LOADING_CHANGE_PASSWORD', false);
      console.log(error);
    });
  },
  async getPermissionsAditional({ commit, state}, data){
    const url = `/api/admin/usuarios/administradores/permissions/${data}`;
    const data_get = {
      roles_id:state.usuario?.roles_id
    };
    await this.$axios.$get(url, {params:data_get}).then(response => {
      console.log(response);
      if(response.status === 'Success'){
        commit('SET_PERMISSIONS_ADITIONAL', response.permissions_aditional);
      }
    }).catch(error => {
      console.log(error);
    });
  }
};
