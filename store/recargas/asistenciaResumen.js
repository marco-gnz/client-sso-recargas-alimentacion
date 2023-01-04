import { Notification } from 'element-ui';
export const state = () => ({
    full_screen_loading:false,
    loading_actions:false,
    loading_table:false,
    asistencias:[],
    modal_edit_asistencia:false,
    asistenciaSelected:{
        tipo_asistencia_turno_id:''
    }
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
    SET_ASISTENCIA(state, value){
        const indice = state.asistencias.findIndex(a => a.id === value.id);
        state.asistencias.splice(indice, 1, value);
    },
    SET_ASISTENCIA_FUNCIONARIO(state, value){
      const indice = state.asistencias.findIndex(a => a.id === value.id);
      state.asistencias.splice(indice, 1, value);
  }
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
    }
};

export const actions = {
    successUpdate({ commit }){
        commit('SET_MODAL_EDIT', false);
    },
    async getAsistenciaFuncionario({ commit }, data){
      commit('SET_LOADING_TABLE', true);
      const url = `/api/admin/recargas/recarga/${data.id}/funcionario/${data.funcionario}/asistencias`;
      await this.$axios.$get(url).then(response => {
        commit('SET_LOADING_TABLE', false);
        if(response.status === 'Success'){
          commit('SET_ASISTENCIAS', response.data);
        }
      }).catch(error => {
        commit('SET_LOADING_TABLE', false);
        console.log(error);
      });
    },
    async getAsistenciasRecarga({commit}, data){
        commit('SET_LOADING', true);
        const url = `/api/admin/recargas/recarga/${data}/asistencias`;

        await this.$axios.$get(url).then(response => {
            commit('SET_LOADING', false);
            if(response.status === 'Success'){
                commit('SET_ASISTENCIAS', response.data);
            }
        }).catch(error => {
            commit('SET_LOADING', false);
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
                Notification.success(
                    {type: "success", title: response.title, message: response.message}
                );
            }
        }).catch(error => {
            commit('SET_LOADING_ACTIONS', false);
            console.log(error);
        });
    }
};
