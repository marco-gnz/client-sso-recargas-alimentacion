export const state = () => ({
  loading_table:false,
  ausentismos:[],
  filtro:{
    input:'',
    grupo_id:''
  },
  grupos_ausentismo:[],
  pagination: {
    total: 0,
    current_page: 0,
    per_page: 0,
    last_page: 0,
    from: 0,
    to: 0
  },
  offset: 3,
});

export const mutations = {
  SET_LOADING_TABLE(state, value){
    state.loading_table = value;
  },
  SET_AUSENTISMOS(state, value){
    state.ausentismos = value;
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
  SET_GRUPO_SELECTED_AUSENTISMO(state, value){
    state.filtro.grupo_id = value;
  },
  SET_GRUPOS_AUSENTISMO(state, value){
    state.grupos_ausentismo = value;
  }
};

export const getters = {
  loadingTable(state){
    return state.loading_table;
  },
  ausentismos(state){
    return state.ausentismos;
  },
  pagination(state){
    return state.pagination;
  },
  offset(state){
    return state.offset;
  },
  gruposAusentismo(state){
    return state.grupos_ausentismo;
  }
};

export const actions = {
  async getAusentismos({ commit, state }, data){
    commit('SET_LOADING_TABLE', true);
    const url = `/api/admin/recargas/recarga/${data}/ausentismos`;

    const params = {
      grupo:state.filtro.grupo_id,
      page:state.pagination.current_page,
      input:state.filtro.input
    };
    await this.$axios.$get(url, {params:params}).then(response => {
      commit('SET_LOADING_TABLE', false);
      console.log(response);
      if(response.status === 'Success'){
        commit('SET_AUSENTISMOS', response.ausentismos);
        commit('SET_PAGINATION', response.pagination);
        commit('SET_GRUPOS_AUSENTISMO', response.grupos);
      }
    }).catch(error => {
      commit('SET_LOADING_TABLE', false);
      console.log(error);
    });
  }
};
