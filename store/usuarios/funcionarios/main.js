import { Notification } from 'element-ui';
export const state = () => ({
  full_screen_loading:false,
  funcionarios:[],
  filtro:{
    input:''
  },
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
  loading_funcionario:false,
  loading_edit_funcionario:false,
  loading_add_funcionario:false,
  funcionario:null,
  new_funcionario:{
    rut:'',
    dv:'',
    nombres:'',
    apellidos:'',
    email:''
  },
  errors:{},
  new_errors:{}
});

export const mutations = {
  SET_LOADING(state, value){
    state.full_screen_loading = value;
  },
  SET_FUNCIONARIOS(state, value){
    state.funcionarios = value;
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
      for(let key in state.new_funcionario){
          state.new_funcionario[key] = '';
      }
    }
  },
  SET_MODAL_EDITAR(state, value){
    state.show_modal_editar = value;
  },
  SET_LOADING_FUNCIONARIO(state, value){
    state.loading_funcionario = value;
  },
  SET_LOADING_EDIT_FUNCIONARIO(state, value){
    state.loading_edit_funcionario = value;
  },
  SET_LOADING_ADD_FUNCIONARIO(state, value){
    state.loading_add_funcionario = value;
  },
  SET_FUNCIONARIO(state, value){
    state.funcionario = value;
  },

  SET_FUNCIONARIO_RUT(state, value){
    state.funcionario.rut = value;
  },
  SET_FUNCIONARIO_DV(state, value){
    state.funcionario.dv = value;
  },
  SET_FUNCIONARIO_NOMBRES(state, value){
    state.funcionario.nombres = value;
  },
  SET_FUNCIONARIO_APELLIDOS(state, value){
    state.funcionario.apellidos = value;
  },
  SET_FUNCIONARIO_EMAIL(state, value){
    state.funcionario.email = value;
  },
  SET_FUNCIONARIO_ERRORS(state, value){
    state.errors = value;
  },
  SET_UPDATE_FUNCIONARIO(state, value){
    const indice = state.funcionarios.findIndex(f => f.uuid === value.uuid);
    state.funcionarios.splice(indice, 1, value);
  },

  SET_NEW_FUNCIONARIO_RUT(state, value){
    state.new_funcionario.rut = value;
  },
  SET_NEW_FUNCIONARIO_DV(state, value){
    state.new_funcionario.dv = value;
  },
  SET_NEW_FUNCIONARIO_NOMBRES(state, value){
    state.new_funcionario.nombres = value;
  },
  SET_NEW_FUNCIONARIO_APELLIDOS(state, value){
    state.new_funcionario.apellidos = value;
  },
  SET_NEW_FUNCIONARIO_EMAIL(state, value){
    state.new_funcionario.email = value;
  },
  SET_NEW_FUNCIONARIO_ERRORS(state, value){
    state.new_errors = value;
  },
  SET_ADD_NEW_FUNCIONARIO(state, value){
    state.funcionarios.unshift(value);
  },
};

export const getters = {
  fullScreenLoading(state){
    return state.full_screen_loading;
  },
  funcionarios(state){
    return state.funcionarios;
  },
  pagination(state){
    return state.pagination;
  },
  offset(state){
    return state.offset;
  },
  funcionario(state){
    return state.funcionario;
  },
  loadinFuncionario(state){
    return state.loading_funcionario;
  },
  errors(state){
    return state.errors;
  },
  newsErrors(state){
    return state.new_errors;
  },
  loadingEditFuncionario(state){
    return state.loading_edit_funcionario;
  },
  loadingAddFuncionario(state){
    return state.loading_add_funcionario;
  },
};

export const actions = {
  async getFuncionarios({ commit, state }, data){
    commit('SET_LOADING', true);
    const url = `/api/admin/usuarios/funcionarios?page=${state.pagination.current_page}`;
    await this.$axios.$get(url, {params:state.filtro}).then(response => {
      commit('SET_LOADING', false);
      console.log(response);
      if(response.status === 'Success'){
        commit('SET_PAGINATION', response.pagination);
        commit('SET_FUNCIONARIOS', response.funcionarios);
      }
    }).catch(error => {
      commit('SET_LOADING', false);
      console.log(error);
    });
  },
  async getFuncionario({ commit, state }, data){
    commit('SET_LOADING_FUNCIONARIO', true);
    const url = `/api/admin/usuarios/funcionario/${data}`;
    await this.$axios.$get(url).then(response => {
      commit('SET_LOADING_FUNCIONARIO', false);
      console.log(response);
      if(response.status === 'Success'){
        commit('SET_FUNCIONARIO', response.funcionario);
      }
    }).catch(error => {
      commit('SET_LOADING_FUNCIONARIO', false);
      console.log(error);
    });
  },
  async addFuncionario({ commit, state }){
    commit('SET_LOADING_ADD_FUNCIONARIO', true);
    const url = `/api/admin/usuarios/funcionario`;
    const data_get = {
      rut:state.new_funcionario.rut,
      dv:state.new_funcionario.dv,
      nombres:state.new_funcionario.nombres,
      apellidos:state.new_funcionario.apellidos,
      email:state.new_funcionario.email,
    };
    await this.$axios.$post(url, data_get).then(response => {
      commit('SET_LOADING_ADD_FUNCIONARIO', false);
      console.log(response);
      if(response.status === 'Success'){
        commit('SET_ADD_NEW_FUNCIONARIO', response.funcionario);
        commit('SET_MODAL_ADD', false);
        commit('SET_NEW_FUNCIONARIO_ERRORS', {});
        Notification.success(
          {type: "success", title: response.title}
        );
      }
    }).catch(error => {
      commit('SET_NEW_FUNCIONARIO_ERRORS', error.response.data.errors);
      commit('SET_LOADING_ADD_FUNCIONARIO', false);
      console.log(error);
    });
  },
  async editFuncionario({ commit, state }, data){
    commit('SET_LOADING_EDIT_FUNCIONARIO', true);
    const url = `/api/admin/usuarios/funcionario/${data}`;
    const data_get = {
      id:state.funcionario.id,
      rut:state.funcionario.rut,
      dv:state.funcionario.dv,
      nombres:state.funcionario.nombres,
      apellidos:state.funcionario.apellidos,
      email:state.funcionario.email,
    };
    await this.$axios.$put(url, data_get).then(response => {
      commit('SET_LOADING_EDIT_FUNCIONARIO', false);
      console.log(response);
      if(response.status === 'Success'){
        commit('SET_UPDATE_FUNCIONARIO', response.funcionario);
        commit('SET_MODAL_EDITAR', false);
        commit('SET_FUNCIONARIO_ERRORS', {});
        Notification.success(
          {type: "success", title: response.title}
        );
        this.$router.back();
      }
    }).catch(error => {
      commit('SET_FUNCIONARIO_ERRORS', error.response.data.errors);
      commit('SET_LOADING_EDIT_FUNCIONARIO', false);
      console.log(error);
    });
  }
};
