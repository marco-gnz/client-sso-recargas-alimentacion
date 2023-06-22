export const state = () => ({
  full_screen_loading:false,
  loading_reglas:false,
  open_modal:false,
  paso:0,
  carga:{
    grupo_id:'',
    file:''
  },
  errors_file:null,
  reglas:[],
  ausentismos:[],
  ausentismos_sobrante:[],
  filas:[],
  success_import:false,
  message_success:'',
  errors_column:'',
  cookie_grupo:1
});

export const mutations = {
  SET_MODAL(state, value){
    state.open_modal = value;
  },
  SET_LOADING(state, value){
    state.full_screen_loading = value;
  },
  SET_NEGATIVE_PASO_MODAL(state){
    state.paso--;
  },
  SET_POSITIVE_PASO_MODAL(state){
    state.paso++;
  },
  SET_POSITION_PASO_MODAL(state, value){
    state.paso = value;
  },
  SET_REGLAS(state, value){
    state.reglas = value;
  },
  SET_GRUPO(state, value){
    state.carga.grupo_id = value;
  },
  SET_FILE(state, value){
    state.carga.file = value;
  },
  SET_LOADING_REGLAS(state, value){
    state.loading_reglas = value;
  },
  SET_ERRORS_FILE(state, value){
    state.errors_file = value;
  },
  SET_AUSENTISMOS(state, value){
    state.ausentismos = value;
  },
  SET_AUSENTISMOS_SOBRANTE(state, value){
    state.ausentismos_sobrante = value;
  },
  SET_FILAS(state, value){
    state.filas = value;
  },
  SET_SUCCESS_IMPORT(state, value){
    state.success_import = value;
  },
  SET_SUCCESS_MESSAGE_IMPORT(state, value){
    state.message_success = value;
  },
  SET_ERROR_COLUMN(state, value){
    state.errors_column = value;
  }
};

export const getters = {
  modal(state){
    return state.open_modal;
  },
  paso(state){
    return state.paso;
  },
  fullScreenLoading(state){
    return state.full_screen_loading;
  },
  reglas(state){
    return state.reglas;
  },
  loadingReglas(state){
    return state.loading_reglas;
  },
  ausentismos(state){
    return state.ausentismos;
  },
  filas(state){
    return state.filas;
  },
  successImport(state){
    return state.success_import;
  },
  successMessagge(state){
    return state.message_success;
  },
  errorsColumn(state){
    return state.errors_column;
  },
  ausentismosSobrante(state){
    return state.ausentismos_sobrante;
  }
};

export const actions = {
  successLoadFile({ commit }){
    commit('SET_AUSENTISMOS', []);
    commit('SET_ERRORS_FILE', null);
    commit('SET_ERROR_COLUMN', '');
    commit('SET_SUCCESS_IMPORT', true);
    commit('SET_AUSENTISMOS_SOBRANTE', []);
  },
  errorsLoadFile({ commit }){
    commit('SET_FILE', '');
    /* commit('SET_GRUPO', ''); */
    commit('SET_AUSENTISMOS', []);
    commit('SET_FILAS', []);
  },
  successStoreFile({ commit }){
    commit('SET_FILE', '');
    commit('SET_GRUPO', '');
    commit('SET_REGLAS', []);
    commit('SET_GRUPO', '');
    commit('SET_AUSENTISMOS', []);
    commit('SET_AUSENTISMOS_SOBRANTE', []);
  },
  closeModal({ commit }){
    commit('SET_MODAL', false);
    commit('SET_POSITION_PASO_MODAL', 0);
    commit('SET_FILE', '');
    commit('SET_GRUPO', '');
    commit('SET_REGLAS', []);
    commit('SET_ERRORS_FILE', null);
    commit('SET_ERROR_COLUMN', '');
    commit('SET_AUSENTISMOS_SOBRANTE', []);
  },
  async getReglas({ commit }, data){
    commit('SET_LOADING_REGLAS', true);
    const url = `/api/admin/recargas/grupo/reglas`;

    await this.$axios.$get(url, {params:data}).then(response => {
      commit('SET_LOADING_REGLAS', false);
      console.log(response.reglas);
      if(response.status === 'Success'){
        commit('SET_REGLAS', response.reglas)
      }
    }).catch(error => {
      commit('SET_LOADING_REGLAS', false);
      console.log(error);
    });
  },
  async uploadFileAusentismo({ commit, dispatch }, data){
    console.log(data);
    commit('SET_LOADING', true);
    let formData = new FormData();
    formData.append('codigo_recarga', data.recarga_codigo);
    formData.append('grupo_id', data.grupo_id);
    formData.append('file', data.file);
    formData.append('columnas', JSON.stringify(data.columnas));
    formData.append('row_columnas', data.row_columnas);

    let grupo_selected = null;
    let id_carga       = null;
    if(data.grupo_id === 1){
      grupo_selected = 'uno';
      id_carga       = 'ausentismos_grupo_uno';
    }else if(data.grupo_id === 2){
      grupo_selected = 'dos';
      id_carga       = 'ausentismos_grupo_dos';
    }else if(data.grupo_id === 3){
      grupo_selected = 'tres';
      id_carga       = 'ausentismos_grupo_tres';
    }
    formData.append('id_carga', id_carga);

    const url = `/api/admin/recargas/recarga/masivo/grupo/${grupo_selected}`;
    await this.$axios.$post(url, formData, {
      headers:{
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
      commit('SET_LOADING', false);
      console.log(response);
      if(response.status === 'Success'){
        dispatch('successLoadFile');
        commit('SET_FILAS', response.ausentismos[0]);
        commit('SET_AUSENTISMOS', response.ausentismos);
        commit('SET_AUSENTISMOS_SOBRANTE', response.ausentismos_sobrante);
      }else{
        dispatch('errorsLoadFile');
        commit('SET_ERRORS_FILE', response[1]);
      }
    }).catch(error => {
      dispatch('errorsLoadFile');
      commit('SET_LOADING', false);
      commit('SET_ERRORS_FILE', error[1]);
      commit('SET_ERROR_COLUMN', error.response.data);
      console.log(error);
    });
  },
  async storeFileGrupoUno({ commit, dispatch }, data){
    let grupo_selected = null;
    let id_carga       = null;
    if(data.grupo_id === 1){
      grupo_selected = 'uno';
      id_carga       = 'ausentismos_grupo_uno';
    }else if(data.grupo_id === 2){
      grupo_selected = 'dos';
      id_carga       = 'ausentismos_grupo_dos';
    }else if(data.grupo_id === 3){
      grupo_selected = 'tres';
      id_carga       = 'ausentismos_grupo_tres';
    }

    commit('SET_LOADING', true);
    const url = `/api/admin/recargas/recarga/masivo/grupo/${grupo_selected}/import`;

    let formData = new FormData();
    formData.append('codigo_recarga', data.recarga_codigo);
    formData.append('grupo_id', data.grupo_id);
    formData.append('file', data.file);
    formData.append('columnas', JSON.stringify(data.columnas));
    formData.append('row_columnas', data.row_columnas);
    formData.append('id_carga', id_carga);
    await this.$axios.$post(url, formData, {
      headers:{
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
      commit('SET_LOADING', false);
      if(response.status === 'Success'){
        dispatch('successStoreFile');
        commit('SET_POSITION_PASO_MODAL', 4);
        commit('SET_SUCCESS_MESSAGE_IMPORT', response.message);
      }else{
        dispatch('errorsLoadFile');
        commit('SET_ERRORS_FILE', response[1]);
        commit('SET_SUCCESS_IMPORT', false);
      }
    }).catch(error => {
      console.log(error);
      dispatch('errorsLoadFile');
      commit('SET_LOADING', false);
      commit('SET_ERRORS_FILE', error[1]);
      commit('SET_SUCCESS_IMPORT', false);
    });
  }
};
