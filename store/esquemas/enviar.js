import { Notification } from 'element-ui';
export const state = () => ({
  funcionarios:[],
  form:{
    funcionario_id:'',
    esquema_id:[],
    email:''
  },
  loading_search_funcionario:false,
  esquemas:[],
  loading_search_esquemas:false,
  loading_enviar_cartola:false,
  errors:{}
});

export const getters = {
  loadingSearchFuncionario(state){
    return state.loading_search_funcionario;
  },
  loadingSearchEsquemas(state){
    return state.loading_search_esquemas;
  },
  loadingEnviarCartola(state){
    return state.loading_enviar_cartola;
  },
  funcionarios(state){
    return state.funcionarios;
  },
  esquemas(state){
    return state.esquemas;
  },
  errors(state){
    return state.errors;
  }
};

export const mutations = {
  SET_FUNCIONARIOS(state, value){
    state.funcionarios = value;
  },
  SET_FORM_FUNCIONARIO_ID(state, value){
    state.form.funcionario_id = value;
  },
  SET_FORM_ESQUEMA_ID(state, value){
    state.form.esquema_id = value;
  },
  SET_FORM_EMAIL(state, value){
    state.form.email = value;
  },
  SET_LOADING_SEARCH_FUNCIONARIO(state, value){
    state.loading_search_funcionario = value;
  },
  SET_LOADING_SEARCH_ESQUEMAS(state, value){
    state.loading_search_esquemas = value;
  },
  SET_LOADING_ENVIAR_CARTOLA(state, value){
    state.loading_enviar_cartola = value;
  },
  SET_ESQUEMAS(state, value){
    state.esquemas = value;
  },
  SET_ERRORS(state, value){
    state.errors = value;
  }
};

export const actions = {
  async getSearchFuncionario({ commit }, data){
    commit('SET_LOADING_SEARCH_FUNCIONARIO', true);
    const url = `/api/public/funcionarios`;
    await this.$axios.$get(url, {params:data}).then(response => {
      commit('SET_LOADING_SEARCH_FUNCIONARIO', false);
      if(response.status === 'Success'){
        commit('SET_FUNCIONARIOS', response.funcionarios);
      }
    }).catch(error => {
      commit('SET_LOADING_SEARCH_FUNCIONARIO', false);
      console.log(error);
    });
  },
  async getEsquemasFuncionario({ commit, state }, data){
    commit('SET_LOADING_SEARCH_ESQUEMAS', true);
    const url = `/api/public/funcionario/${state.form.funcionario_id}/esquemas`;
    await this.$axios.$get(url).then(response => {
      commit('SET_LOADING_SEARCH_ESQUEMAS', false);
      if(response.status === 'Success'){
        commit('SET_ESQUEMAS', response.esquemas);
      }
    }).catch(error => {
      commit('SET_LOADING_SEARCH_ESQUEMAS', false);
      console.log(error);
    });
  },
  async enviarCartola({ commit, state }, data){
    commit('SET_LOADING_ENVIAR_CARTOLA', true);
    const url = `/api/public/enviar/cartola`;
    await this.$axios.$post(url, state.form).then(response => {
      console.log(response);
      commit('SET_LOADING_ENVIAR_CARTOLA', false);
      if(response.status === 'Success'){
        commit('SET_ERRORS', {});
        Notification.success(
          {type: "success", message: response.message}
        );
      }else{
        Notification.error(
          {type: "error", message: response.message}
        );
      }
    }).catch(error => {
      commit('SET_LOADING_ENVIAR_CARTOLA', false);
      commit('SET_ERRORS', error.response.data.errors);
      console.log(error);
    });
  },
};
