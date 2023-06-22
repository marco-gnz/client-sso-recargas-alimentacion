import { Notification } from 'element-ui';
export const state = () => ({
  open_grupos:false,
  errors:{},
  full_screen_loading:false,
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
};

export const actions = {
  async storeReglas({ commit }, data){
    try {
      commit('SET_LOADING', true);
      const url = '/api/admin/recargas/recarga/masivo/reglas/store';

      this.$axios.$post(url, {reglas:data}).then(response => {
        commit('SET_LOADING', false);
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
        commit('SET_LOADING', false);
        commit('SET_ERRORS', error.response.data.errors);
      });
    } catch (error) {
      console.log(error);
    }
  }
};
