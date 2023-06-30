export const state = () => ({
  establecimientos: [],
  tipos_ausentismos :[],
  tipos_incrementos :[],
  grupos_ausentismos:[],
  meridianos:[],
  tipos_asistencia_turnos:[],
  leyes:[],
  unidades:[],
  unidades_recarga:[],
  roles:[],
  horas:[]
});

export const mutations = {
  SET_ESTABLECIMIENTOS(state, establecimientos){
    state.establecimientos = establecimientos;
  },
  SET_TIPOS_AUSENTISMOS(state, tipos_ausentismos){
    state.tipos_ausentismos = tipos_ausentismos;
  },
  SET_TIPOS_INCREMENTOS(state, tipos_incrementos){
    state.tipos_incrementos = tipos_incrementos;
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
  SET_LEYES(state, value){
    state.leyes = value;
  },
  SET_UNIDADES(state, value){
    state.unidades = value;
  },
  SET_UNIDADES_RECARGA(state, value){
    state.unidades_recarga = value;
  },
  SET_ROLES(state, value){
    state.roles = value;
  },
  SET_HORAS(state, value){
    state.horas = value;
  }
};

export const getters = {
  establecimientos(state){
    return state.establecimientos;
  },
  tiposAusentismos(state){
    return state.tipos_ausentismos;
  },
  tiposIncrementos(state){
    return state.tipos_incrementos;
  },
  gruposAusentismos(state){
    return state.grupos_ausentismos;
  },
  meridianos(state){
    return state.meridianos;
  },
  tiposAsistenciaTurnos(state){
    return state.tipos_asistencia_turnos;
  },
  leyes(state){
    return state.leyes;
  },
  unidades(state){
    return state.unidades;
  },
  unidadesRecarga(state){
    return state.unidades_recarga;
  },
  roles(state){
    return state.roles;
  },
  horas(state){
    return state.horas;
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
  async getTiposIncrementos({ commit }){
    const response = await this.$axios.$get('/api/admin/modulos/tipos-incrementos/response');
    commit('SET_TIPOS_INCREMENTOS', response);
  },
  async getGruposAusentismos({ commit }){
    const response = await this.$axios.$get('/api/admin/modulos/grupos-ausentismos/response');
    commit('SET_GRUPOS_AUSENTISMOS', response);
  },
  async getGruposAusentismosRecarga({ commit }, data){
    const response = await this.$axios.$get(`/api/admin/modulos/grupos-ausentismos/response/recarga/${data}`);
    commit('SET_GRUPOS_AUSENTISMOS', response);
  },
  async getMeridianos({ commit }){
    const response = await this.$axios.$get('/api/admin/modulos/meridianos/response');
    commit('SET_MERIDIANOS', response);
  },
  async getTiposAsistenciaTurnos({ commit }){
    const response = await this.$axios.$get('/api/admin/modulos/tipos-asistencia-turnos/response');
    commit('SET_TIPOS_ASISTENCIA_TURNOS', response);
  },
  async getLeyes({ commit }){
    const response = await this.$axios.$get('/api/admin/modulos/leyes/response');
    commit('SET_LEYES', response);
  },
  async getUnidades({ commit }){
    const response = await this.$axios.$get('/api/admin/modulos/unidades/response');
    commit('SET_UNIDADES', response);
  },
  async getUnidadesRecarga({ commit }, data){
    try {
      const response = await this.$axios.$get(`/api/admin/modulos/unidades/response/recarga/${data}`);
      commit('SET_UNIDADES_RECARGA', response);
    } catch (error) {
        console.log(error);
    }

  },
  async getRoles({ commit }){
    const response = await this.$axios.$get('/api/admin/modulos/roles/response');
    commit('SET_ROLES', response);
  },
  async getHoras({ commit }){
    const response = await this.$axios.$get('/api/admin/modulos/horas/response');
    commit('SET_HORAS', response);
  },
};


