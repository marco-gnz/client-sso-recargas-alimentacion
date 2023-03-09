export const state = () => ({
  loading_table:false,
  asignaciones:[],
  filtro:{
    input:'',
    is_asignaciones:[]
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
  SET_LOADING_TABLE(state, value){
    state.loading_table = value;
  },
  SET_ASIGNACIONES(state, value){
    state.asignaciones = value;
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
  SET_FILTRO_IS_ASIGNACIONES(state, value){
    state.filtro.is_asignaciones = value;
  },
};


export const getters = {
  loadingTable(state){
    return state.loading_table;
  },
  asignaciones(state){
    return state.asignaciones;
  },
  pagination(state){
    return state.pagination;
  },
  offset(state){
    return state.offset;
  }
};

export const actions = {
  async getAsignaciones({ commit, state }, data){
    commit('SET_LOADING_TABLE', true);
    const url = `/api/admin/recargas/recarga/${data}/asignaciones`;

    const params = {
      page:state.pagination.current_page,
      input:state.filtro.input,
      is_asignaciones:state.filtro.is_asignaciones
    };
    await this.$axios.$get(url, {params:params}).then(response => {
      commit('SET_LOADING_TABLE', false);
      console.log(response);
      if(response.status === 'Success'){
        commit('SET_ASIGNACIONES', response.asignaciones);
        commit('SET_PAGINATION', response.pagination);
      }
    }).catch(error => {
      commit('SET_LOADING_TABLE', false);
      console.log(error);
    });
  }
};
