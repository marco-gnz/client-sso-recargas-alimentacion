import { Notification } from 'element-ui';
export const state = () => ({
  full_screen_loading:false,
  loading_table_turnos:false,
  loading_table_ausentismos:false,
  loading_table_asistencia:false,
  funcionario:'',
  turnos:[],
  ausentismos:[],
  asistencia:{},
  grupo_selected_ausentismo:"1"
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
  SET_ASISTENCIA(state, value){
    state.asistencia = value;
  },
  SET_GRUPO_SELECTED_AUSENTISMO(state, value){
    state.grupo_selected_ausentismo = value;
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
  }
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
        commit('SET_TURNOS', response.data);
      }
    }).catch(error => {
      commit('SET_LOADING_TURNOS_TABLE', false);
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
        commit('SET_AUSENTISMOS', response.data);
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
};
