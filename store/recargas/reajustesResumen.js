export const state = () => ({
  open_modal:false,
  loading_table:false,
  reajustes:[],
  filtro:{
    input:'',
    estados:[],
    tipos:[]
  }
});

export const mutations = {
  SET_MODAL(state, value){
    state.open_modal = value;
  },
  SET_LOADING_TABLE(state, value){
      state.loading_table = value;
  },
  SET_REAJUSTES(state, value){
    state.reajustes = value;
  },
  SET_UPDATE_REAJUSTE(state, value){
    const indice = state.reajustes.findIndex(r => r.uuid === value.uuid);
    state.reajustes.splice(indice, 1, value);
  },

  SET_FILTRO_INPUT(state, value){
    state.filtro.input = value;
  },
  SET_FILTRO_ESTADO(state, value){
    state.filtro.estados = value;
  },
  SET_FILTRO_TIPO(state, value){
    state.filtro.tipos = value;
  }
};

export const getters = {
  modal(state){
    return state.open_modal;
  },
  reajustes(state){
    return state.reajustes;
  },
  loadingTable(state){
    return state.loading_table;
  }
};

export const actions = {
  closeModal({ commit }){
    commit('SET_MODAL', false);
  },
  async getReajustesRecarga({commit, state}, data){
    commit('SET_LOADING_TABLE', true);
    const url = `/api/admin/recargas/recarga/${data}/reajustes`;

    await this.$axios.$get(url, {params:state.filtro}).then(response => {
        commit('SET_LOADING_TABLE', false);
        if(response){
            commit('SET_REAJUSTES', response);
        }
    }).catch(error => {
        commit('SET_LOADING_TABLE', false);
        console.log(error);
    });
  },
  async validateReajuste({ commit }, data){
    const url = `/api/admin/recargas/reajuste/${data.uuid}`;
    commit('recargas/reajustes/SET_INDEX_REAJUSTES', data.index_reajuste, {root: true});
    commit('recargas/reajustes/SET_LOADING_RECHAZAR', true, {root: true});
    await this.$axios.$put(url, data).then(response => {
      commit('recargas/reajustes/SET_INDEX_REAJUSTES', undefined, {root: true});
      commit('recargas/reajustes/SET_LOADING_RECHAZAR', false, {root: true});
      if(response.status === 'Success'){
        commit('SET_UPDATE_REAJUSTE', response.data);
        commit('recargas/reajustes/SET_MODAL_RECHAZAR', false, {root: true});
        commit('recargas/reajustes/SET_OBSERVACION_RECHAZAR', '', {root: true});

        commit('recargas/reajustes/SET_ERRORS', '', {root: true});
        Notification.success(
          {type: "success", title: response.title}
        );
      }
    }).catch(error => {
      commit('recargas/reajustes/SET_LOADING_RECHAZAR', false, {root: true});
      commit('recargas/reajustes/SET_INDEX_REAJUSTES', undefined, {root: true});
    });
  },
};
