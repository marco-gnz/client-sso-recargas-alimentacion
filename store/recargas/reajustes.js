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
  recarga:'',
  modal_carga:false,
  carga:{
    file:''
  },
  errors_column:'',
  paso:0,
  full_screen_loading:false,
  success_import:false,
  filas:[],
  message_success:'',
  reajustes_load:[],
  reajustes_load_sobrante:[],
});

export const mutations = {
  SET_POSITION_PASO_MODAL(state, value){
      state.paso = value;
  },
  SET_MODAL_SHOW(state, value){
    state.modal_show = value;
  },
  SET_MODAL_CARGA(state, value){
    state.modal_carga = value;
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
  },
  SET_FILE(state, value){
    state.carga.file = value;
  },
  SET_ERRORS_FILE(state, value){
    state.errors_file = value;
  },
  SET_ERROR_COLUMN(state, value){
    state.errors_column = value;
  },
  SET_NEGATIVE_PASO_MODAL_FUNCIONARIO(state, value){
    state.paso--;
  },
  SET_POSITIVE_PASO_MODAL_FUNCIONARIO(state, value){
    state.paso++;
  },
  SET_LOADING(state, value){
    state.full_screen_loading = value;
  },
  SET_SUCCESS_IMPORT(state, value){
    state.success_import = value;
  },
  SET_FILAS(state, value){
    state.filas = value;
  },
  SET_SUCCESS_MESSAGE_IMPORT(state, value){
    state.message_success = value;
  },
  SET_AJUSTES_LOAD(state, value){
    return state.reajustes_load = value;
  },
  SET_AJUSTES_LOAD_SOBRANTE(state, value){
    return state.reajustes_load_sobrante = value;
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
  },
  carga(state){
    return state.modal_carga;
  },
  errorsColumn(state){
    return state.errors_column;
  },
  paso(state){
    return state.paso;
  },
  fullScreenLoading(state){
    return state.full_screen_loading;
  },
  successImport(state){
    return state.success_import;
  },
  filas(state){
    return state.filas;
  },
  successMessagge(state){
    return state.message_success;
  },
  reajustesLoad(state){
    return state.reajustes_load;
  },
  reajustesLoadSobrante(state){
    return state.reajustes_load_sobrante;
  }
};

export const actions = {
  async getReajustes({ commit }, data){
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
  },
  successLoadFile({ commit }){
    commit('SET_AJUSTES_LOAD', []);
    commit('SET_AJUSTES_LOAD_SOBRANTE', []);
    commit('SET_ERRORS_FILE', null);
    commit('SET_ERROR_COLUMN', '');
    commit('SET_SUCCESS_IMPORT', true);
  },
  errorsLoadFile({ commit }){
    commit('SET_FILE', '');
    commit('SET_AJUSTES_LOAD', []);
    commit('SET_AJUSTES_LOAD_SOBRANTE', []);
    commit('SET_FILAS', []);
  },
  successStoreFile({ commit }){
    commit('SET_FILE', '');
    commit('SET_AJUSTES_LOAD', []);
    commit('SET_AJUSTES_LOAD_SOBRANTE', []);
  },
  closeModal:function({ commit }){
    commit('SET_MODAL_CARGA', false);
    commit('SET_POSITION_PASO_MODAL', 0);
    commit('SET_FILE', '');
    commit('SET_ERRORS_FILE', null);
    commit('SET_ERROR_COLUMN', '');
  },
  async uploadFileAjustes({ commit, dispatch }, data){
    console.log(data);
    commit('SET_LOADING', true);
    console.log(data);
    let formData = new FormData();
    formData.append('codigo_recarga', data.recarga_codigo);
    formData.append('file', data.file);
    formData.append('columnas', JSON.stringify(data.columnas));
    formData.append('row_columnas', data.row_columnas);
    formData.append('id_carga', 'ajustes');

    const url = '/api/admin/recargas/recarga/masivo/ajustes';

    await this.$axios.$post(url, formData, {
      headers:{
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
      console.log(response);
      commit('SET_LOADING', false);
      if(response.status === 'Success'){
        dispatch('successLoadFile');
        commit('SET_FILAS', response.ajustes[0]);
        commit('SET_AJUSTES_LOAD', response.ajustes);
        commit('SET_AJUSTES_LOAD_SOBRANTE', response.ajustes_sobrante);
      }else{
        dispatch('errorsLoadFile');
        commit('SET_ERRORS_FILE', response[1]);
      }
    }).catch(error => {
      commit('SET_LOADING', false);
      dispatch('errorsLoadFile');
      commit('SET_ERRORS_FILE', error[1]);
      commit('SET_ERROR_COLUMN', error.response.data);
    });
  },
  async storeFileAjustes({ commit, dispatch }, data){
    commit('SET_LOADING', true);
    console.log(data);
    let formData = new FormData();
    formData.append('codigo_recarga', data.recarga_codigo);
    formData.append('file', data.file);
    formData.append('columnas', JSON.stringify(data.columnas));
    formData.append('row_columnas', data.row_columnas);
    formData.append('id_carga', 'ajustes');

    const url = '/api/admin/recargas/recarga/masivo/ajustes/import';

    await this.$axios.$post(url, formData, {
      headers:{
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
      commit('SET_LOADING', false);
      if(response.status === 'Success'){
        dispatch('successStoreFile');
        commit('SET_POSITION_PASO_MODAL', 3);
        commit('SET_SUCCESS_MESSAGE_IMPORT', response.message);
      }else{
        dispatch('errorsLoadFile');
        commit('SET_ERRORS_FILE', response[1]);
        commit('SET_SUCCESS_IMPORT', false);
      }
    }).catch(error => {
      dispatch('errorsLoadFile');
      commit('SET_LOADING', false);
      commit('SET_ERRORS_FILE', error[1]);
      commit('SET_SUCCESS_IMPORT', false);
    });
  }
};
