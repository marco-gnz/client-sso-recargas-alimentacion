import { Notification } from 'element-ui';
export const state = () => ({
  full_screen_loading:false,
  open_modal:false,
  modal_show:false,
  modal_rechazar:false,
  loading_show_reajuste:false,
  errors_file:null,
  reajustes:[],
  reajuste:'',
  observacion_rechazo:'',
  errors:{},
  loading_rechazar_reajuste:false,
  loading_table_asistencia:false,
  index_reajuste:undefined,
  recarga:''
});

export const mutations = {
  SET_MODAL_SHOW(state, value){
    state.modal_show = value;
  },
  SET_REAJUSTES(state, value){
    state.reajustes = value;
  },
  SET_REAJUSTE(state, value){
    state.reajuste = value;
  },
  SET_UPDATE_REAJUSTE(state, value){
    const indice = state.reajustes.findIndex(r => r.uuid === value.uuid);
    state.reajustes.splice(indice, 1, value);
  },
  SET_ADD_REAJUSTE(state, value){
    state.reajustes.unshift(value);
  },
  SET_LOADING_REAJUSTE(state, value){
    state.loading_show_reajuste = value;
  },
  SET_MODAL_RECHAZAR(state, value){
    state.modal_rechazar = value;
  },
  SET_OBSERVACION_RECHAZAR(state, value){
    state.observacion_rechazo = value;
  },
  SET_LOADING_RECHAZAR(state, value){
    state.loading_rechazar_reajuste = value;
  },
  SET_ERRORS(state, value){
    state.errors = value;
  },
  SET_LOADING_REAJUSTES(state, value){
    state.loading_table_asistencia = value;
  },
  SET_INDEX_REAJUSTES(state, value){
    state.index_reajuste = value;
  },
  SET_RECARGA(state, value){
    state.recarga = value;
  }
};

export const getters = {
  modalShow(state){
    return state.modal_show;
  },
  reajustes(state){
    return state.reajustes;
  },
  reajuste(state){
    return state.reajuste;
  },
  modalShowReajuste(state){
    return state.loading_show_reajuste;
  },
  modalRechazarReajuste(state){
    return state.modal_rechazar;
  },
  errors(state){
    return state.errors;
  },
  loadingRechazarReajuste(state){
    return state.loading_rechazar_reajuste;
  },
  loadingTableAsistencia(state){
    return state.loading_table_asistencias;
  },
  indexReajustes(state){
    return state.index_reajuste;
  },
  recarga(state){
    return state.recarga;
  }
};

export const actions = {
  async getReajustes({ commit }, data){
    console.log(data);
    commit('SET_LOADING_REAJUSTES', true);
    const url = `/api/admin/recargas/recarga/${data.id}/funcionario/${data.funcionario}/reajustes`;
    await this.$axios.$get(url).then(response => {
      console.log(response);
      commit('SET_LOADING_REAJUSTES', false);
      if(response.status === 'Success'){
        commit('SET_REAJUSTES', response.reajustes);
        commit('SET_RECARGA', response.recarga);
      }
    }).catch(error => {
      console.log(error);
      commit('SET_LOADING_REAJUSTES', false);
      if(error.response.status === 400){
        Notification.error(
          {type: "error", message: error.response.data.message}
        );
      }
    });
  },
  async getReajuste({commit}, data){
    commit('SET_LOADING_REAJUSTE', true);
    const url = `/api/admin/recargas/reajuste/${data}`;
    await this.$axios.$get(url).then(response => {
      commit('SET_LOADING_REAJUSTE', false);
      if(response.status === 'Success'){
        commit('SET_REAJUSTE', response.data);
      }
    }).catch(error => {
      commit('SET_LOADING_REAJUSTE', false);
      console.log(error);
    });
  },
  async validateReajuste({ commit }, data){
    const url = `/api/admin/recargas/reajuste/${data.uuid}`;
    commit('SET_INDEX_REAJUSTES', data.index_reajuste);
    commit('SET_LOADING_RECHAZAR', true);
    await this.$axios.$put(url, data).then(response => {
      commit('SET_INDEX_REAJUSTES', undefined);
      commit('SET_LOADING_RECHAZAR', false);
      console.log(response);
      if(response.status === 'Success'){
        commit('SET_MODAL_RECHAZAR', false);
        commit('SET_OBSERVACION_RECHAZAR', '');
        commit('SET_UPDATE_REAJUSTE', response.data);
        commit('SET_ERRORS', '');
        Notification.success(
          {type: "success", title: response.title}
        );
      }
    }).catch(error => {
      commit('SET_LOADING_RECHAZAR', false);
      commit('SET_INDEX_REAJUSTES', undefined);
      console.log(error);
      commit('SET_ERRORS', error.response.data.errors);
    });
  },
  async storeReajuste({ commit}, data){
    commit('recargas/resumen/SET_LOADING_REAJUSTE', true, {root: true});
    console.log(data);
    const url = '/api/admin/recargas/reajuste';
    await this.$axios.$post(url, data).then(response => {
      commit('recargas/resumen/SET_LOADING_REAJUSTE', false, {root: true});
      console.log(response);
      if(response.status === 'Success'){
        Notification.success(
          {type: "success", title: response.title, message: response.message}
        );
        commit('SET_ADD_REAJUSTE', response.data);
        commit('recargas/resumen/REFRESH_CAMPOS_REAJUSTE', null, {root: true});
        commit('recargas/resumen/SET_MODAL_REAJUSTE', false, {root: true});
        commit('recargas/resumen/SET_REAJUSTE_ERRORS', {}, {root: true});
      }
    }).catch(error => {
      commit('recargas/resumen/SET_REAJUSTE_ERRORS', error.response.data.errors, {root: true});
      commit('recargas/resumen/SET_LOADING_REAJUSTE', false, {root: true});
      console.log(error);
    });
  }
};
