export const state = () => ({
  load_grupo_uno:false,
  load_grupo_dos:false,
  load_grupo_tres:false,
  load_grupo:null
});

export const mutations = {
  SET_LOAD_GRUPO_UNO(state, value){
    state.load_grupo_uno = value;
    localStorage.setItem('grupo_uno', JSON.stringify(state.load_grupo_uno));
  },
  SET_LOAD_GRUPO_DOS(state, value){
    state.load_grupo_dos = value;
    localStorage.setItem('grupo_dos', JSON.stringify(state.load_grupo_dos));
  },
  SET_LOAD_GRUPO_TRES(state, value){
    state.load_grupo_tres = value;
    localStorage.setItem('grupo_tres', JSON.stringify(state.load_grupo_tres));
  },
  SET_LOAD_GRUPO(state, value){
    state.load_grupo = value;
    localStorage.setItem('load_grupo', JSON.stringify(state.load_grupo));
  }
};

export const getters = {
  loadGrupoUno(state){
    return state.load_grupo_uno;
  },
  loadGrupoDos(state){
    return state.load_grupo_dos;
  },
  loadGrupoTres(state){
    return state.load_grupo_tres;
  }
};

export const actions = {
  changeValueGrupoUno({ commit }, value){
    commit('SET_LOAD_GRUPO_UNO', value);
  },
  createdValueGrupoUno({ commit }){
    const value = JSON.parse(localStorage.getItem('grupo_uno'));
    if(value){
      commit('SET_LOAD_GRUPO_UNO', value);
    }else{
      commit('SET_LOAD_GRUPO_UNO', false);
    }
  },
  changeValueGrupoDos({ commit }, value){
    commit('SET_LOAD_GRUPO_DOS', value);
  },
  createdValueGrupoDos({ commit }){
    const value = JSON.parse(localStorage.getItem('grupo_dos'));
    if(value){
      commit('SET_LOAD_GRUPO_DOS', value);
    }else{
      commit('SET_LOAD_GRUPO_DOS', false);
    }
  },
  changeValueGrupoTres({ commit }, value){
    commit('SET_LOAD_GRUPO_TRES', value);
  },
  createdValueGrupoTres({ commit }){
    const value = JSON.parse(localStorage.getItem('grupo_tres'));
    if(value){
      commit('SET_LOAD_GRUPO_TRES', value);
    }else{
      commit('SET_LOAD_GRUPO_TRES', false);
    }
  },
  createdValueGrupo({ commit }){
    const value = JSON.parse(localStorage.getItem('load_grupo'));
    if(value){
      commit('SET_LOAD_GRUPO', value);
    }else{
      commit('SET_LOAD_GRUPO', null);
    }
  },
};
