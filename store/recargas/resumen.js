import { Notification } from 'element-ui';
export const state = () => ({
  fullscreenloading:false,
  recarga:{},
  funcionarios:[],
  loading_index:false,
  index_click_funcionario:undefined
});

export const mutations = {
  SET_LOADING(state, value){
    state.fullscreenloading = value;
  },
  SET_RECARGA(state, recarga){
    state.recarga = recarga;
  },
  SET_FUNCIONARIOS(state, funcionarios){
    state.funcionarios = funcionarios;
  },
  SET_UPDATE_FUNCIONARIO(state, funcionario){
    const i = state.funcionarios.findIndex(f => f.id === funcionario.id);
    state.funcionarios.splice(i, 1, funcionario);
  },
  SET_LOADING_INDEX(state, value){
    return state.loading_index = value;
  },
  SET_INDEX_CLICK_FUNCTIONARIO(state, value){
    state.index_click_funcionario = value;
  }
};

export const getters = {
  recarga(state){
    return state.recarga;
  },
  fullScreenLoading(state){
    return state.fullscreenloading;
  },
  funcionarios(state){
    return state.funcionarios;
  },
  loadingIndex(state){
    return state.loading_index;
  },
  indexClickFuncionario(state){
    return state.index_click_funcionario;
  }
};

export const actions = {
  async returnRecarga({commit}, codigo){
    try {
      commit('SET_LOADING', true);
      const url = `/api/admin/recargas/recarga/${codigo}/resumen`;

      await this.$axios.$get(url).then(response => {
        commit('SET_LOADING', false);
        if(response.status === 'Success'){
          commit('SET_RECARGA', response.data);
        }else{
          this.$router.push({name: 404});
        }
      }).catch(error => {
        commit('SET_LOADING', false);
        this.$router.push({name: 404});
      });
    } catch (error) {
      console.log(error);
    }
  },
  async getFuncionarios({commit}, codigo){
    try {
      commit('SET_LOADING', true);
      const url = `/api/admin/recargas/recarga/${codigo}/funcionarios`;

      await this.$axios.$get(url).then(response => {
        commit('SET_LOADING', false);
        if(response.status === 'Success'){
          commit('SET_FUNCIONARIOS', response.data);
        }else{
          this.$router.push({name: 404});
        }
      }).catch(error => {
        commit('SET_LOADING', false);
        this.$router.push({name: 404});
      });
    } catch (error) {
      console.log(error);
    }
  },
  async changeBeneficioFuncionario({ commit }, data){
    commit('SET_LOADING_INDEX', true);
    const url = '/api/admin/recargas/recarga/funcionario/beneficio';
    await this.$axios.$post(url, data).then(response => {
      commit('SET_LOADING_INDEX', false);
      if(response.status === 'Success'){
        commit('SET_UPDATE_FUNCIONARIO', response.data[0]);
        commit('SET_RECARGA', response.data[1]);

        Notification.success(
          {type: "success", title: response.title, message: response.message}
        );
      }else{

      }
    }).catch(error => {
      commit('SET_LOADING_INDEX', false);
      console.log(error);
    });
  }
};
