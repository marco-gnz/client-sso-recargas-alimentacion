import { Notification } from 'element-ui';
export const state = () => ({
  full_screen_loading:false,
  loading_table:false,
  index_ajuste:undefined,
  recarga:{},
  ajustes:[],
  filtro:{
    input:'',
    rebaja_incremento:[],
    estados:[],
    tipos:[]
  },
  modal_show:false,
  modal_rechazar:false,
  loading_rechazar_reajuste:false,
  estados:[],
  tipo_ajustes:[],
  observacion_rechazo:'',
  errors_modal_rechazo:{},
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
  SET_FULL_SCREEN_LOADING(state, value){
    state.fullscreenloading = value;
  },
  SET_LOADING_TABLE(state, value){
    state.loading_table = value;
  },
  SET_RECARGA(state, value){
    state.recarga = value;
  },
  SET_AJUSTES(state, value){
    state.ajustes = value;
  },
  SET_CURRENT_PAGE(state, value){
    state.pagination.current_page = value;
  },
  SET_PAGINATION(state, value){
    state.pagination = value;
  },
  SET_MODAL_SHOW(state, value){
    state.modal_show = value;
  },
  SET_MODAL_RECHAZAR(state, value){
    state.modal_rechazar = value;
  },
  SET_INDEX_AJUSTE(state, value){
    state.index_ajuste = value;
  },
  SET_FILTRO_INPUT(state, value){
    state.filtro.input = value;
  },
  SET_FILTRO_ESTADO(state, value){
    state.filtro.estados = value;
  },
  SET_FILTRO_TIPO(state, value){
    state.filtro.tipos = value;
  },
  SET_FILTRO_REBAJA_INCREMENTO(state, value){
    state.filtro.rebaja_incremento = value;
  },
  SET_ESTADOS(state, value){
    state.estados = value;
  },
  SET_TIPO_AJUSTES(state, value){
    state.tipo_ajustes = value;
  },
  SET_UPDATE_AJUSTE(state, value){
    const indice = state.ajustes.findIndex(a => a.uuid === value.uuid);
    state.ajustes.splice(indice, 1, value);
  },
  SET_OBSERVACION_RECHAZAR(state, value){
    state.observacion_rechazo = value;
  },
  SET_ERRORS_RECHAZO(state, value){
    state.errors_modal_rechazo = value;
  },
  SET_LOADING_RECHAZAR(state, value){
    state.loading_rechazar_reajuste = value;
  },
};

export const getters = {
  fullScreenLoading(state){
    return state.full_screen_loading;
  },
  loadingTable(state){
    return state.loading_table;
  },
  recarga(state){
    return state.recarga;
  },
  ajustes(state){
    return state.ajustes;
  },
  pagination(state){
    return state.pagination;
  },
  offset(state){
    return state.offset;
  },
  indexAjuste(state){
    return state.index_ajuste;
  },
  modalShow(state){
    return state.modal_show;
  },
  estados(state){
    return state.estados;
  },
  tipoAjustes(state){
    return state.tipo_ajustes;
  },
  loadingRechazarReajuste(state){
    return state.loading_rechazar_reajuste;
  },
  errorsRechazo(state){
    return state.errors_modal_rechazo;
  },
};

export const actions = {
  async getAjustes({ commit, state }, data){
    commit('SET_LOADING_TABLE', true);
    const url = `/api/admin/recargas/recarga/${data}/reajustes`;

    const params = {
      input:state.filtro.input,
      estados:state.filtro.estados,
      tipos:state.filtro.tipos,
      rebaja_incremento:state.filtro.rebaja_incremento,
      page:state.pagination.current_page
    };

    await this.$axios.$get(url, {params:params}).then(response => {
      commit('SET_LOADING_TABLE', false);
      if(response){
        commit('SET_PAGINATION', response.pagination);
          commit('SET_AJUSTES', response.ajustes);
          commit('SET_RECARGA', response.recarga);
          commit('SET_ESTADOS', response.estados);
          commit('SET_TIPO_AJUSTES', response.tipo_ajustes);
      }
  }).catch(error => {
      commit('SET_LOADING_TABLE', false);
      console.log(error);
  });
  },
  async validateAjuste({ commit }, data){
    commit('SET_LOADING_RECHAZAR', true);
    const url = `/api/admin/recargas/reajuste/${data.uuid}/resumen`;
    await this.$axios.$put(url, data).then(response => {
      commit('SET_LOADING_RECHAZAR', false);
      console.log(response);
      if(response.status === 'Success'){
        commit('SET_RECARGA', response.recarga);
        commit('SET_UPDATE_AJUSTE', response.ajuste);
        commit('SET_MODAL_RECHAZAR', false);
        commit('SET_OBSERVACION_RECHAZAR', '');
        commit('SET_ERRORS_RECHAZO', '');
        Notification.success(
          {type: "success", title: response.title}
        );
      }
    }).catch(error => {
      commit('SET_LOADING_RECHAZAR', false);
      commit('SET_ERRORS_RECHAZO', error.response.data.errors);
    });
  }
};
