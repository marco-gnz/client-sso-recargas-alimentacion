export const state = () => ({
  establecimientos: [],
  tipos_ausentismos :[],
  grupos_ausentismos:[],
  meridianos:[],
  tipos_asistencia_turnos:[]
});

export const mutations = {
  SET_ESTABLECIMIENTOS(state, establecimientos){
    state.establecimientos = establecimientos;
  },
  SET_TIPOS_AUSENTISMOS(state, tipos_ausentismos){
    state.tipos_ausentismos = tipos_ausentismos;
  },
  SET_GRUPOS_AUSENTISMOS(state, grupos_ausentismos){
    state.grupos_ausentismos = grupos_ausentismos;
  },
  SET_MERIDIANOS(state, meridianos){
    state.meridianos = meridianos;
  },
  SET_LOADING(state, value){
    state.full_screen_loading = value;
  },
  SET_TIPOS_ASISTENCIA_TURNOS(state, value){
    state.tipos_asistencia_turnos = value;
  },
};

export const getters = {
  establecimientos(state){
    return state.establecimientos;
  },
  tiposAusentismos(state){
    return state.tipos_ausentismos;
  },
  gruposAusentismos(state){
    return state.grupos_ausentismos;
  },
  meridianos(state){
    return state.meridianos;
  },
  tiposAsistenciaTurnos(state){
    return state.tipos_asistencia_turnos;
  }
};

export const actions = {
  async getEstablecimientos({ commit }){
    const response = await this.$axios.$get('/api/admin/modulos/establecimientos/response');
    commit('SET_ESTABLECIMIENTOS', response);
  },
  async getTiposAusentismos({ commit }){
    const response = await this.$axios.$get('/api/admin/modulos/tipos-ausentismos/response');
    commit('SET_TIPOS_AUSENTISMOS', response);
  },
  async getGruposAusentismos({ commit }){
    const response = await this.$axios.$get('/api/admin/modulos/grupos-ausentismos/response');
    commit('SET_GRUPOS_AUSENTISMOS', response);
  },
  async getMeridianos({ commit }){
    const response = await this.$axios.$get('/api/admin/modulos/meridianos/response');
    commit('SET_MERIDIANOS', response);
  },
  async getTiposAsistenciaTurnos({ commit }){
    const response = await this.$axios.$get('/api/admin/modulos/tipos-asistencia-turnos/response');
    commit('SET_TIPOS_ASISTENCIA_TURNOS', response);
  }
};


