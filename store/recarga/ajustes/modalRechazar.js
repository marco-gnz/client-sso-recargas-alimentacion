import { Notification } from 'element-ui';
export const state = () => ({
  full_screen_loading:false,
  ajuste:''
});

export const mutations = {
  SET_FULL_SCREEN_LOADING(state, value){
    state.full_screen_loading = value;
  },
  SET_AJUSTE(state, value){
    state.ajuste = value;
  },
};

export const getters = {
  fullScreenLoading(state){
    return state.full_screen_loading;
  },
  ajuste(state){
    return state.ajuste;
  }
};

export const actions = {
  async rechazarAjuste({ commit, state }, data){
    commit('SET_FULL_SCREEN_LOADING', true);
    const url = `/api/admin/recargas/reajuste/${data}`;
    await this.$axios.$get(url).then(response => {
      commit('SET_FULL_SCREEN_LOADING', false);
      if(response.status === 'Success'){
        commit('SET_AJUSTE', response.data);
      }
    }).catch(error => {
      commit('SET_FULL_SCREEN_LOADING', false);
      console.log(error);
    });
  }
};
