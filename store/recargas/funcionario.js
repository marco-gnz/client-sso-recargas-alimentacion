import { Notification } from 'element-ui';
export const state = () => ({
  full_screen_loading:false,
  loading_table_turnos:false,
  loading_table_ausentismos:false,
  loading_table_asistencia:false,
  loading_table_reajustes:false,
  loading_table_contratos:false,
  loading_table_viaticos:false,
  funcionario:'',
  turnos:[],
  ausentismos:[],
  reajustes:[],
  contratos:[],
  viaticos:[],
  asistencia:{},
  grupo_selected_ausentismo:"1",
  recarga:''
});

export const mutations = {
  SET_LOADING(state, value){
    state.full_screen_loading = value;
  },
  SET_FUNCIONARIO(state, value){
    state.funcionario = value;
  },
  SET_TURNOS(state, value){
    state.turnos = value;
  },
  SET_LOADING_TURNOS_TABLE(state, value){
    state.loading_table_turnos = value;
  },
  SET_LOADING_TURNOS_AUSENTISMOS(state, value){
    state.loading_table_ausentismos = value;
  },
  SET_LOADING_ASISTENCIA(state, value){
    state.loading_table_asistencia = value;
  },
  SET_AUSENTISMOS(state, value){
    state.ausentismos = value;
  },
  SET_CONTRATOS(state, value){
    state.contratos = value;
  },
  SET_LOADING_CONTRATOS(state, value){
    state.loading_table_contratos = value;
  },
  SET_ASISTENCIA(state, value){
    state.asistencia = value;
  },
  SET_GRUPO_SELECTED_AUSENTISMO(state, value){
    state.grupo_selected_ausentismo = value;
  },
  SET_REAJUSTES(state, value){
    state.reajustes = value;
  },
  SET_LOADING_REAJUSTES(state, value){
    state.loading_table_asistencia = value;
  },
  SET_VIATICOS(state, value){
    state.viaticos = value;
  },
  SET_LOADING_VIATICOS(state, value){
    state.loading_table_viaticos = value;
  },

  SET_RECARGA(state, value){
    state.recarga = value;
  }
};

export const getters = {
  fullScreenLoading(state){
    return state.full_screen_loading;
  },
  funcionario(state){
    return state.funcionario;
  },
  turnos(state){
    return state.turnos;
  },
  loadingTableTurnos(state){
    return state.loading_table_turnos;
  },
  loadingTableAusentismos(state){
    return state.loading_table_ausentismos;
  },
  loadingTableAsistencia(state){
    return state.loading_table_asistencias;
  },
  ausentismos(state){
    return state.ausentismos;
  },
  asistencia(state){
    return state.asistencia;
  },
  grupoSelectedAusentismo(state){
    return state.grupo_selected_ausentismo;
  },
  reajustes(state){
    return state.reajustes;
  },
  loadingTableReajustes(state){
    return state.loading_table_reajustes;
  },
  recarga(state){
    return state.recarga;
  },
  contratos(state){
    return state.contratos;
  },
  loadingTableContratos(state){
    return state.loading_table_contratos;
  },
  viaticos(state){
    return state.viaticos;
  },
  loadingTableViaticos(state){
    return state.loading_table_viaticos;
  },
};

export const actions = {
  async getFuncionario({ commit }, data){
    commit('SET_LOADING', true);
    const url = `/api/admin/recargas/recarga/${data.id}/funcionario/${data.funcionario}`;
    await this.$axios.$get(url).then(response => {
      commit('SET_LOADING', false);
      if(response.status === 'Success'){
        commit('SET_FUNCIONARIO', response.data);
      }
    }).catch(error => {
      commit('SET_LOADING', false);
      console.log(error);
    });
  },
  async getTurnos({ commit }, data){
    commit('SET_LOADING_TURNOS_TABLE', true);
    const url = `/api/admin/recargas/recarga/${data.id}/funcionario/${data.funcionario}/turnos`;
    await this.$axios.$get(url).then(response => {
      commit('SET_LOADING_TURNOS_TABLE', false);
      if(response.status === 'Success'){
        commit('SET_TURNOS', response.turnos);
        commit('SET_RECARGA', response.recarga);
      }
    }).catch(error => {
      commit('SET_LOADING_TURNOS_TABLE', false);
      console.log(error);
    });
  },
  async getContratos({ commit }, data){
    commit('SET_LOADING_CONTRATOS', true);
    const url = `/api/admin/recargas/recarga/${data.id}/funcionario/${data.funcionario}/contratos`;
    await this.$axios.$get(url).then(response => {
      commit('SET_LOADING_CONTRATOS', false);
      if(response.status === 'Success'){
        commit('SET_CONTRATOS', response.contratos);
        commit('SET_RECARGA', response.recarga);
      }
    }).catch(error => {
      commit('SET_LOADING_CONTRATOS', false);
      console.log(error);
    });
  },
  async getAusentismos({ commit, state }, data){
    console.log(data);
    commit('SET_LOADING_TURNOS_AUSENTISMOS', true);
    const url = `/api/admin/recargas/recarga/${data.id}/funcionario/${data.funcionario}/ausentismos/${data.grupo}`;
    await this.$axios.$get(url).then(response => {
      commit('SET_LOADING_TURNOS_AUSENTISMOS', false);
      if(response.status === 'Success'){
        commit('SET_AUSENTISMOS', response.ausentismos);
        commit('SET_RECARGA', response.recarga);
      }
    }).catch(error => {
      commit('SET_LOADING_TURNOS_AUSENTISMOS', false);
      if(error.response.status === 400){
        Notification.error(
          {type: "error", message: error.response.data.message}
        );
      }
    });
  },
  async getViaticos({ commit }, data){
    commit('SET_LOADING_VIATICOS', true);
    const url = `/api/admin/recargas/recarga/${data.id}/funcionario/${data.funcionario}/viaticos`;
    await this.$axios.$get(url).then(response => {
      commit('SET_LOADING_VIATICOS', false);
      if(response.status === 'Success'){
        commit('SET_VIATICOS', response.viaticos);
        commit('SET_RECARGA', response.recarga);
      }
    }).catch(error => {
      commit('SET_LOADING_VIATICOS', false);
      console.log(error);
    });
  },
  async getReajustes({ commit, state }, data){
    console.log(data);
    commit('SET_LOADING_REAJUSTES', true);
    const url = `/api/admin/recargas/recarga/${data.id}/funcionario/${data.funcionario}/reajustes`;
    await this.$axios.$get(url).then(response => {
      commit('SET_LOADING_REAJUSTES', false);
      if(response.status === 'Success'){
        commit('SET_REAJUSTES', response.data);
      }
    }).catch(error => {
      commit('SET_LOADING_REAJUSTES', false);
      if(error.response.status === 400){
        Notification.error(
          {type: "error", message: error.response.data.message}
        );
      }
    });
  },
};
