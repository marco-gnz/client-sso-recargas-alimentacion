export const state = () => ({
  full_screen_loading:false,
  loading_table_turnos:false,
  funcionario:'',
  turnos:[]
});

export const mutations = {
  SET_LOADING(state, value){
    state.full_screen_loading = value;
  },
  SET_FUNCIONARIO(state, value){
    state.funcionario = value;
  },
  SET_TURNOS(state, value){
    state.turnos = value;
  },
  SET_LOADING_TURNOS_TABLE(state, value){
    state.loading_table_turnos = value;
  }
};

export const getters = {
  fullScreenLoading(state){
    return state.full_screen_loading;
  },
  funcionario(state){
    return state.funcionario;
  },
  turnos(state){
    return state.turnos;
  },
  loadingTableTurnos(state){
    return state.loading_table_turnos;
  }
};

export const actions = {
  async getFuncionario({ commit }, data){
    commit('SET_LOADING', true);
    const url = `/api/admin/recargas/recarga/${data.id}/funcionario/${data.funcionario}`;
    await this.$axios.$get(url).then(response => {
      commit('SET_LOADING', false);
      if(response.status === 'Success'){
        commit('SET_FUNCIONARIO', response.data);
      }
    }).catch(error => {
      commit('SET_LOADING', false);
      console.log(error);
    });
  },
  async getTurnos({ commit }, data){
    commit('SET_LOADING_TURNOS_TABLE', true);
    const url = `/api/admin/recargas/recarga/${data.id}/funcionario/${data.funcionario}/turnos`;
    await this.$axios.$get(url).then(response => {
      commit('SET_LOADING_TURNOS_TABLE', false);
      if(response.status === 'Success'){
        commit('SET_TURNOS', response.data);
      }
    }).catch(error => {
      commit('SET_LOADING_TURNOS_TABLE', false);
      console.log(error);
    });
  }
};
