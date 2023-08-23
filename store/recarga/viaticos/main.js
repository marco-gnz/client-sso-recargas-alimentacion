export const state = () => ({
  full_screen_loading:false,
  recarga:{},
  viaticos:[],
  loading_table:false,
  filtro:{
    input:'',
    descuento_turno_libre:[],
    descuento:[]
  },
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
  SET_VIATICOS(state, value){
    state.viaticos = value;
  },
  SET_LOADING_TABLE(state, value){
    state.loading_table = value;
  },
  SET_FILTRO_INPUT(state, value){
    state.filtro.input = value;
  },
  SET_FILTRO_DESCUENTO_TURNO_LIBRE(state, value){
    state.filtro.descuento_turno_libre = value;
  },
  SET_FILTRO_DESCUENTO(state, value){
    state.filtro.descuento = value;
  },
  SET_CURRENT_PAGE(state, value){
    state.pagination.current_page = value;
  },
  SET_PAGINATION(state, value){
    state.pagination = value;
  },
  SET_RECARGA(state, value){
    state.recarga = value;
  }
};

export const getters = {
  fullScreenLoading(state){
    return state.full_screen_loading;
  },
  viaticos(state){
    return state.viaticos;
  },
  loadingTable(state){
    return state.loading_table;
  },
  pagination(state){
    return state.pagination;
  },
  offset(state){
    return state.offset;
  },
  recarga(state){
    return state.recarga;
  }
};

export const actions = {
  async getViaticos({ commit, state}, data){
    commit('SET_LOADING_TABLE', true);
    const url = `/api/admin/recargas/recarga/${data}/viaticos?page=${state.pagination.current_page}`;

    await this.$axios.$get(url, {params:state.filtro}).then(response => {
      commit('SET_LOADING_TABLE', false);
      console.log(response);
      if(response.status === 'Success'){
        commit('SET_RECARGA', response.recarga);
        commit('SET_VIATICOS', response.viaticos);
        commit('SET_PAGINATION', response.pagination);
      }
    }).catch(error => {
      commit('SET_LOADING_TABLE', false);
      console.log(error);
    });
  }
};
