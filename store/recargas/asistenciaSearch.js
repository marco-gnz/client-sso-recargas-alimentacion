export const state = () => ({
  open_modal:false,
  loading_recargas:false,
  loading_asistencias:false,
  columnas:[],
  filas:[],
  recargas:[],
  asistencias:[],
  funcionario:'',
  recarga_selected:'',
  turno:{
      largo:'L',
      nocturno:'N',
      libre:'L'
  },
  filtro:{
    input:''
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
  SET_MODAL(state, value){
      state.open_modal = value;
  },
  SET_LOADING_RECARGAS(state, value){
      state.loading_recargas = value;
  },
  SET_LOADING_ASISTENCIAS(state, value){
    state.loading_asistencias = value;
},
  SET_FILAS(state, value){
      state.filas = value;
  },
  SET_ASISTENCIAS(state, value){
      state.asistencias = value;
  },
  SET_FUNCIONARIO(state, value){
    state.funcionario = value;
  },
  SET_RECARGAS(state, value){
    state.recargas = value;
  },
  SET_CURRENT_PAGE(state, value){
    state.pagination.current_page = value;
  },
  SET_PAGINATION(state, value){
    state.pagination = value;
  },
  SET_COLUMNAS(state, value){
    state.columnas = value;
  },
  SET_FILTRO_INPUT(state, value){
    state.filtro.input = value;
  },
  SET_RECARGA_SELECTED(state, value){
    state.recarga_selected = value;
  },
};

export const getters = {
  modal(state){
      return state.open_modal;
  },
  loadingRecargas(state){
      return state.loading_recargas;
  },
  loadingAsistencias(state){
    return state.loading_asistencias;
},
  filas(state){
      return state.filas;
  },
  asistencias(state){
      return state.asistencias;
  },
  funcionario(state){
    return state.funcionario;
  },
  recargas(state){
    return state.recargas;
  },
  pagination(state){
    return state.pagination;
  },
  offset(state){
    return state.offset;
  },
  columnas(state){
    return state.columnas;
  },
  filtroInput(state){
    return state.filtro.input;
  }
};

export const actions = {
  async getRecargasFuncionarioTurnante({ commit, state }, data){
    commit('SET_LOADING_RECARGAS', true);
    const url = `/api/admin/recargas/funcionario/${state.funcionario.uuid}`;

    await this.$axios.$get(url, {params:{codigo_recarga:data}}).then(response => {
      commit('SET_LOADING_RECARGAS', false);
      console.log(response);
      if(response.status === 'Success'){
        commit('SET_RECARGAS', response.recargas);
      }
    }).catch(error => {
      commit('SET_LOADING_RECARGAS', false);
      console.log(error);
    });
  },
  async getAsistenciasRecarga({commit, state}, data){
    commit('SET_LOADING_ASISTENCIAS', true);
    const url = `/api/admin/recargas/recarga/${state.recarga_selected}/asistencias?page=${state.pagination.current_page}`;

    await this.$axios.$get(url, {params:state.filtro}).then(response => {
        commit('SET_LOADING_ASISTENCIAS', false);
        if(response.status === 'Success'){
            commit('SET_ASISTENCIAS', response.users);
            commit('SET_PAGINATION', response.pagination);
            commit('SET_COLUMNAS', response.columnas);
        }
    }).catch(error => {
        commit('SET_LOADING_ASISTENCIAS', false);
        console.log(error);
    });
},
};
