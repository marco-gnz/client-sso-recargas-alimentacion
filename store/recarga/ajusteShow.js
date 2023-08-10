export const state = () => ({
  full_screen_loading:false,
  ajuste:'',
  contratos:[],
  periodos:[],
  filtro:{
    periodo:''
  },
  loading_contratos:false
});

export const mutations = {
  SET_FULL_SCREEN_LOADING(state, value){
    state.full_screen_loading = value;
  },
  SET_AJUSTE(state, value){
    state.ajuste = value;
  },
  SET_CONTRATOS(state, value){
    state.contratos = value;
  },
  SET_PERIODOS(state, value){
    state.periodos = value;
  },
  SET_FILTRO_PERIODO(state, value){
    state.filtro.periodo = value;
  },
  SET_LOADING_CONTRATOS(state, value){
    state.loading_contratos = value;
  }
};

export const getters = {
  fullScreenLoading(state){
    return state.full_screen_loading;
  },
  ajuste(state){
    return state.ajuste;
  },
  contratos(state){
    return state.contratos;
  },
  periodos(state){
    return state.periodos;
  },
  loadingContratos(state){
    return state.loading_contratos;
  }
};

export const actions = {
  async getAjuste({ commit, state }, data){
    commit('SET_FULL_SCREEN_LOADING', true);
    const url = `/api/admin/recargas/reajuste/${data}`;
    await this.$axios.$get(url).then(response => {
      commit('SET_FULL_SCREEN_LOADING', false);
      if(response.status === 'Success'){
        commit('SET_AJUSTE', response.reajuste);
        commit('SET_CONTRATOS', response.contratos);
        commit('SET_PERIODOS', response.filtros);
      }
    }).catch(error => {
      commit('SET_FULL_SCREEN_LOADING', false);
      console.log(error);
    });
  },
  async getContratos({ commit, state }, data){
    commit('SET_LOADING_CONTRATOS', true);
    const url = `/api/admin/recargas/reajuste/${data.ajuste_uuid}/contratos/${data.periodo}`;
    await this.$axios.$get(url).then(response => {
      commit('SET_LOADING_CONTRATOS', false);
      if(response.status === 'Success'){
        commit('SET_CONTRATOS', response.contratos);
      }
    }).catch(error => {
      commit('SET_LOADING_CONTRATOS', false);
      console.log(error);
    });
  },
};
