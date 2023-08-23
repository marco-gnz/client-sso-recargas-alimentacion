import { Notification } from 'element-ui';
export const state = () => ({
    full_screen_loading:false,
    loading_actions:false,
    loading_table:false,
    asistencias:[],
    modal_edit_asistencia:false,
    asistenciaSelected:{
        tipo_asistencia_turno_id:'',
        observacion:''
    },
    asistenciaModal:'',
    errors:{},
    loading_asistencia:false,
    recarga:'',
    filtro:{
      input:'',
      recarga:''
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
    recargas:[],
    columnas_mes:[]
});

export const mutations = {
    SET_LOADING(state, value){
        state.full_screen_loading = value;
    },
    SET_LOADING_TABLE(state, value){
        state.loading_table = value;
    },
    SET_LOADING_ACTIONS(state, value){
        state.loading_actions = value;
    },
    SET_ASISTENCIAS(state, value){
        state.asistencias = value;
    },
    SET_MODAL_EDIT(state, value){
        state.modal_edit_asistencia = value;
    },
    SET_TIPO_ASISTENCIA_TURNO(state, value){
        state.asistenciaSelected.tipo_asistencia_turno_id = value;
    },
    SET_TIPO_OBSERVACION_TURNO(state, value){
      state.asistenciaSelected.observacion = value;
    },
    SET_ASISTENCIA(state, value){
        const indice = state.asistencias.findIndex(a => a.id === value.id);
        state.asistencias.splice(indice, 1, value);
    },
    SET_ASISTENCIA_FUNCIONARIO(state, value){
      const indice = state.asistencias.findIndex(a => a.id === value.id);
      state.asistencias.splice(indice, 1, value);
    },
    SET_ERRORS(state, value){
        state.errors = value;
    },
    SET_ASISTENCIA_MODAL(state, value){
      state.asistenciaModal = value;
    },
    SET_LOADING_ASISTENCIA(state, value){
      state.loading_asistencia = value;
    },
    SET_RECARGA(state, value){
      state.recarga = value;
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
    SET_RECARGAS(state, value){
      state.recargas = value;
    },
    SET_COLUMNAS_MES(state, value){
      state.columnas_mes = value;
    },
    SET_FILTRO_RECARGA(state, value){
      state.filtro.recarga = value;
    },
};


export const getters = {
    loading(state){
        return state.full_screen_loading;
    },
    loadingTable(state){
        return state.loading_table;
    },
    asistencias(state){
        return state.asistencias;
    },
    modalEditAsistencia(state){
        return state.modal_edit_asistencia;
    },
    setLoadingAction(state){
        return state.loading_actions;
    },
    errors(state){
        return state.errors;
    },
    asistencia(state){
      return state.asistenciaModal;
    },
    loadingAsistencia(state){
      return state.loading_asistencia;
    },
    recarga(state){
      return state.recarga;
    },
    pagination(state){
      return state.pagination;
    },
    offset(state){
      return state.offset;
    },
    columnasMes(state){
      return state.columnas_mes;
    }
};

export const actions = {
    successUpdate({ commit }){
        commit('SET_MODAL_EDIT', false);
    },
    async getColumnsAsistencia({ commit}, data){
      const url = `/api/admin/modulos/columnas/asistencia/${data}/resumen`;
      await this.$axios.$get(url).then(response => {
        console.log(response);
        if(response.status === 'Success'){
          commit('SET_COLUMNAS_MES', response.columnas);
        }
      }).catch(error => {
        console.log(error);
      });
    },
    async getAsistenciaFuncionario({ commit}, data){
      commit('SET_LOADING_TABLE', true);
      const url = `/api/admin/recargas/recarga/${data.id}/funcionario/${data.funcionario}/asistencias`;
      await this.$axios.$get(url).then(response => {
        commit('SET_LOADING_TABLE', false);
        if(response.status === 'Success'){
          commit('SET_ASISTENCIAS', response.asistencias);
          commit('SET_RECARGA', response.recarga);
        }
      }).catch(error => {
        commit('SET_LOADING_TABLE', false);
        console.log(error);
      });
    },
    async getAsistenciasRecarga({commit, state}, data){
        commit('SET_LOADING', true);
        const url = `/api/admin/recargas/recarga/${data}/asistencias?page=${state.pagination.current_page}`;

        await this.$axios.$get(url, {params:state.filtro}).then(response => {
            commit('SET_LOADING', false);
            if(response.status === 'Success'){
                commit('SET_ASISTENCIAS', response.users);
                commit('SET_PAGINATION', response.pagination);
            }
        }).catch(error => {
            commit('SET_LOADING', false);
            console.log(error);
        });
    },
    async findAsistencia({ commit }, data){
      commit('SET_LOADING_ASISTENCIA', true);
      const url = `/api/admin/asistencias/${data}`;

      await this.$axios.$get(url).then(response => {
        commit('SET_LOADING_ASISTENCIA', false);
        console.log(response);
        if(response.status === 'Success'){
          commit('SET_TIPO_ASISTENCIA_TURNO', response.data.tipo_asistencia_turno_id);
          commit('SET_ASISTENCIA_MODAL', response.data);
        }
      }).catch(error => {
        commit('SET_LOADING_ASISTENCIA', false);
        console.log(error);
      });
    },
    async updateAsistencia({commit, dispatch}, data){
        commit('SET_LOADING_ACTIONS', true);
        const url = `/api/admin/asistencias/${data.id}`;

        await this.$axios.$put(url, data).then(response => {
            commit('SET_LOADING_ACTIONS', false);
            if(response.status === 'Success'){
                commit('SET_ASISTENCIA', response.data);
                dispatch('successUpdate');
                commit('SET_TIPO_OBSERVACION_TURNO', '');
                commit('SET_ERRORS', {});
                Notification.success(
                    {type: "success", title: response.title, message: response.message}
                );
            }
        }).catch(error => {
            commit('SET_LOADING_ACTIONS', false);
            commit('SET_ERRORS', error.response.data.errors);
            console.log(error);
        });
    }
};
