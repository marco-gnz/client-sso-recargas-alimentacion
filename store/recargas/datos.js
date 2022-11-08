export const state = () => ({
  full_screen_loading:false,
  open_funcionarios:false,
  paso_modal_funcionario:0,
  files:{
    funcionarios:''
  },
  errors_file:null,
  filas:[],
  funcionarios:[],
  success_import:false,
  message_success:''
});

export const mutations = {
  SET_FILE_FUNCIONARIOS(state, value){
    state.files.funcionarios = value;
  },
  SET_MODAL_FUNCIONARIOS(state, value){
    state.open_funcionarios = value;
  },
  SET_NEGATIVE_PASO_MODAL_FUNCIONARIO(state){
    state.paso_modal_funcionario--;
  },
  SET_POSITIVE_PASO_MODAL_FUNCIONARIO(state){
    state.paso_modal_funcionario++;
  },
  SET_POSITION_PASO_MODAL_FUNCIONARIO(state, value){
    state.paso_modal_funcionario = value;
  },
  SET_ERRORS_FILE(state, value){
    state.errors_file = value;
  },
  SET_LOADING(state, value){
    state.full_screen_loading = value;
  },
  SET_FUNCIONARIOS(state, value){
    state.funcionarios = value;
  },
  SET_FILAS(state, value){
    state.filas = value;
  },
  SET_SUCCESS_IMPORT(state, value){
    state.success_import = value;
  },
  SET_SUCCESS_MESSAGE_IMPORT(state, value){
    state.message_success = value;
  }
};

export const getters = {
  pasoModalFuncionario(state){
    return state.paso_modal_funcionario;
  },
  modalFuncionarios(state){
    return state.open_funcionarios;
  },
  formFiles(state){
    return state.fyles;
  },
  errorsFile(state){
    return state.errors_file;
  },
  fullScreenLoading(state){
    return state.full_screen_loading;
  },
  funcionarios(state){
    return state.funcionarios;
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
};

export const actions = {
  closeModal({ commit }){
    commit('SET_MODAL_FUNCIONARIOS', false);
    commit('SET_FUNCIONARIOS', []);
    commit('SET_ERRORS_FILE', null);
    commit('SET_POSITION_PASO_MODAL_FUNCIONARIO', 0);
  },
  async uploadFileFuncionarios({ commit }, data){
    commit('SET_LOADING', true);
    let formData = new FormData();
    formData.append('file', data.file);
    formData.append('codigo_recarga', data.codigo_recarga);
    formData.append('columnas', JSON.stringify(data.columnas));
    formData.append('row_columnas', data.row_columnas);
    const url = `/api/admin/recargas/recarga/masivo/funcionarios`;

    this.$axios.$post(url, formData, {
      headers:{
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
      commit('SET_LOADING', false);
      if(response.status === 'Success'){
        commit('SET_ERRORS_FILE', null);
        commit('SET_FILAS', response.data[0]);
        commit('SET_SUCCESS_IMPORT', true);
        commit('SET_FUNCIONARIOS', response.data);
      }else{
        commit('SET_FUNCIONARIOS', []);
        commit('SET_ERRORS_FILE', response[1]);
      }
    }).catch(error => {
      commit('SET_FUNCIONARIOS', []);
      commit('SET_LOADING', false);
      commit('SET_ERRORS_FILE', error[1]);
      console.log(error);
    });
  },

  async uploadFuncionariosStore({ commit }, data){
    commit('SET_LOADING', true);

    let formData = new FormData();
    formData.append('file', data.file);
    formData.append('codigo_recarga', data.codigo_recarga);
    formData.append('columnas', JSON.stringify(data.columnas));
    formData.append('row_columnas', data.row_columnas);
    const url = `/api/admin/recargas/recarga/masivo/funcionarios/import`;

    await this.$axios.$post(url, formData, {
      headers:{
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
      console.log(response.data);
      commit('SET_LOADING', false);
      if(response.status === 'Success'){
        commit('SET_ERRORS_FILE', null);
        commit('SET_SUCCESS_IMPORT', true);
        commit('SET_FILE_FUNCIONARIOS', '');
        commit('SET_POSITIVE_PASO_MODAL_FUNCIONARIO');
        commit('SET_FUNCIONARIOS', []);
        commit('SET_POSITION_PASO_MODAL_FUNCIONARIO', 3);
        commit('SET_SUCCESS_MESSAGE_IMPORT', response.message);
      }else{
        commit('SET_ERRORS_FILE', response[1]);
        commit('SET_SUCCESS_IMPORT', false);
        commit('SET_FUNCIONARIOS', []);
      }

    }).catch(error => {
      commit('SET_FUNCIONARIOS', []);
      commit('SET_LOADING', false);
      commit('SET_ERRORS_FILE', error[1]);
      commit('SET_SUCCESS_IMPORT', false);
      console.log(error);
    });
  }
};
