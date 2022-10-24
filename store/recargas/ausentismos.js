export const state = () => ({
  full_screen_loading:false,
  loading_reglas:false,
  open_modal:false,
  paso:0,
  carga:{
    grupo_id:'',
    file:''
  },
  errors:{},
  reglas:[]
});

export const mutations = {
  SET_MODAL(state, value){
    state.open_modal = value;
  },
  SET_NEGATIVE_PASO_MODAL(state){
    state.paso--;
  },
  SET_POSITIVE_PASO_MODAL(state){
    state.paso++;
  },
  SET_REGLAS(state, value){
    state.reglas = value;
  },
  SET_GRUPO(state, value){
    state.carga.grupo_id = value;
  },
  SET_LOADING_REGLAS(state, value){
    state.loading_reglas = value;
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
};

export const actions = {
  closeModal({ commit }){
    commit('SET_MODAL', false);
  },
  async getReglas({ commit }, data){
    commit('SET_LOADING_REGLAS', true);
    console.log(data);
    const url = `/api/admin/recargas/grupo/reglas`;

    await this.$axios.$get(url, {params:data}).then(response => {
      commit('SET_LOADING_REGLAS', false);
      console.log(response);
      if(response.status === 'Success'){
        commit('SET_REGLAS', response.data)
      }
    }).catch(error => {
      commit('SET_LOADING_REGLAS', false);
      console.log(error);
    });
  }
};
