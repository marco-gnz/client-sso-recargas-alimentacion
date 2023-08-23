export const state = () => ({
  full_screen_loading:false,
  loading_table:false,
  recarga:{},
  ausentismos:[],
  filtro:{
    input:'',
    grupo_id:'',
    tipo_ausentismo_id:[],
    descuento_turno_libre:[],
    descuento:[]
  },
  grupos_ausentismo:[],
  tipo_ausentismos:[],
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
  SET_TIPO_SELECTED_AUSENTISMO(state, value){
    state.filtro.tipo_ausentismo_id = value;
  },
  SET_TIPO_SELECTED_DESCUENTO_TURNO_LIBRE(state, value){
    state.filtro.descuento_turno_libre = value;
  },
  SET_TIPO_SELECTED_DESCUENTO(state, value){
    state.filtro.descuento= value;
  },
  SET_GRUPOS_AUSENTISMO(state, value){
    state.grupos_ausentismo = value;
  },
  SET_RECARGA(state, value){
    state.recarga = value;
  },
  SET_TIPO_AUSENTISMOS(state, value){
    state.tipo_ausentismos = value;
  }
};

export const getters = {
  fullScreenLoading(state){
    return state.full_screen_loading;
  },
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
  },
  recarga(state){
    return state.recarga;
  },
  tipoAusentismos(state){
    return state.tipo_ausentismos;
  }
};

export const actions = {
  async getAusentismos({ commit, state }, data){
    commit('SET_LOADING_TABLE', true);
    const url = `/api/admin/recargas/recarga/${data}/ausentismos`;

    const params = {
      grupo:state.filtro.grupo_id,
      page:state.pagination.current_page,
      input:state.filtro.input,
      tipo_ausentismo_id:state.filtro.tipo_ausentismo_id,
      descuento_turno_libre:state.filtro.descuento_turno_libre,
      descuento:state.filtro.descuento
    };
    await this.$axios.$get(url, {params:params}).then(response => {
      commit('SET_LOADING_TABLE', false);
      console.log(response);
      if(response.status === 'Success'){
        commit('SET_RECARGA', response.recarga);
        commit('SET_AUSENTISMOS', response.ausentismos);
        commit('SET_PAGINATION', response.pagination);
        commit('SET_GRUPOS_AUSENTISMO', response.grupos);
        commit('SET_TIPO_AUSENTISMOS', response.tipo_ausentismos);
      }
    }).catch(error => {
      commit('SET_LOADING_TABLE', false);
      console.log(error);
    });
  }
};
