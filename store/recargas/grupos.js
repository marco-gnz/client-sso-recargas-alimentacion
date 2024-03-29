import { Notification } from 'element-ui';
export const state = () => ({
  open_grupos:false,
  errors:{},
  full_screen_loading:false,
  loading_store_reglas:false,
  checked_all:true
});

export const mutations = {
  SET_MODAL_GRUPOS(state, value){
    state.open_grupos = value;
  },
  SET_ERRORS(state, value){
    state.errors = value;
  },
  SET_LOADING(state, value){
    state.full_screen_loading = value;
  },
  SET_STORE_REGLAS(state, value){
    state.loading_store_reglas = value;
  },
  SET_CHECKED_ALL(state, value){
    state.checked_all = value;
  }
};

export const getters = {
  modalGrupos(state){
    return state.open_grupos;
  },
  errors(state){
    return state.errors;
  },
  fullScreenLoading(state){
    return state.full_screen_loading;
  },
  loadingStoreReglas(state){
    return state.loading_store_reglas;
  }
};

export const actions = {
  async storeReglas({ commit }, data){
    try {
      commit('SET_STORE_REGLAS', true);
      const url = '/api/admin/recargas/recarga/masivo/reglas/store';

      this.$axios.$post(url, {reglas:data}).then(response => {
        commit('SET_STORE_REGLAS', false);
        if(response.status = 'success'){
          commit('SET_ERRORS', {});
          commit('SET_MODAL_GRUPOS', false);
          Notification.success(
            {type: "success", title: response.title}
          );
        }else if(response.status = 'error'){
          Notification.success(
            {type: "success", title: response.message}
          );
        }
      }).catch(error => {
        commit('SET_STORE_REGLAS', false);
        commit('SET_ERRORS', error.response.data.errors);
      });
    } catch (error) {
      console.log(error);
    }
  }
};
