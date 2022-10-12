export const state = () => ({
  establecimientos: []
});

export const mutations = {
  SET_ESTABLECIMIENTOS(state, establecimientos){
    state.establecimientos = establecimientos;
  }
};

export const getters = {
  establecimientos(state){
    return state.establecimientos;
  }
};

export const actions = {
  async getEstablecimientos({ commit }){
    const response = await this.$axios.$get('/api/admin/modulos/establecimientos/response');
    commit('SET_ESTABLECIMIENTOS', response);
  }
};


