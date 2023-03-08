import { Notification } from 'element-ui';
export const state = () => ({
  modal_feriados:false,
  loading_store:false,
  feriados:[],
  loading_table:false,
  feriados_selected:[],
  errors:{},
});

export const mutations = {
  SET_MODAL(state, value){
    state.modal_feriados = value;
  },
  SET_FERIADOS(state, value){
    state.feriados = value;
  },
  SET_LOADING(state, value){
    state.loading_table = value;
  },
  SET_FERIADOS_SELECTED(state, value){
    state.feriados_selected = value;
  },
  SET_LOADING_STORE(state, value){
    state.loading_store = value;
  }
};

export const getters = {
  loadingTable(state){
    return state.loading_table;
  },
  modal(state){
    return state.modal_feriados;
  },
  errors(state){
    return state.errors;
  },
  feriados(state){
    return state.feriados;
  },
  loadingStore(state){
    return state.loading_store;
  }
};

export const actions = {
  async getFeriados({ commit }, data){
    commit('SET_LOADING', true);
    const url = `/api/admin/feriados/${data}`;

    await this.$axios.$get(url).then(response => {
      commit('SET_LOADING', false);
      console.log(response);
      if(response.data){
        commit('SET_FERIADOS', response.data);
      }
    }).catch(error => {
      commit('SET_LOADING', false);
      console.log(error);
    });
  },
  async storeFeriados({ commit }, data){
    commit('SET_LOADING_STORE', true);
    const url = '/api/admin/recargas/feriados';

    await this.$axios.$post(url, data).then(response => {
      commit('SET_LOADING_STORE', false);
      console.log(response);
      if(response.status === 'Success'){
        Notification.success(
            {type: "success", title: response.title, message: response.message}
        );
        commit('SET_FERIADOS', []);
        commit('SET_FERIADOS_SELECTED', []);
        commit('SET_MODAL', false);
      }
    }).catch(error => {
      commit('SET_LOADING_STORE', false);
      console.log(error);
    });
  }

};
