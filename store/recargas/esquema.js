export const state = () => ({
  full_screen_loading:false,
  esquema:{},
});

export const mutations = {
  SET_LOADING(state, value){
    state.full_screen_loading = value;
  },
  SET_ESQUEMA(state, value){
    state.esquema = value;
  }
};

export const getters = {
  fullScreenLoading(state){
    return state.full_screen_loading;
  },
  esquema(state){
    return state.esquema;
  }
};

export const actions = {
  async getEsquema({ commit }, data){
    commit('SET_LOADING', true);
    const url = `/api/admin/recargas/recarga/${data.id}/funcionario/${data.funcionario}/esquema`;
    await this.$axios.$get(url).then(response => {
      commit('SET_LOADING', false);
      console.log(response);
      if(response.status === 'Success'){
        commit('SET_ESQUEMA', response.esquema);
      }
    }).catch(error => {
      commit('SET_LOADING', false);
      console.log(error);
    });
  }
};
