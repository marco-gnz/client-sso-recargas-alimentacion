import { Notification } from 'element-ui';
export const state = () => ({
  full_screen_loading:false,
  esquema:'',
  asignaciones:[],
  contratos:[],
  turnos:[],
  calendario:[],
  ausentismos:[],
  viaticos:[],
  ajustes:[],
  loading_table:false,
  n_grupo:1,
  grupos_ausentismos:[],
  tipos_turnos:[],
  reajuste:{
    rebaja_dias:0,
    fecha_inicio:'',
    fecha_termino:'',
    calculo_dias:true,
    tipo_ausentismo_id:'',
    tipo_incremento_id:'',
    tipo_reajuste:0,
    valor_dia:0,
    observacion:'',
    advertencias:[],
    errores:[],
    total_dias:0,
    diff_days:0,
    monto_ajuste:0,
    monto_ajuste_format:0,
    calculo:''
  },
  reajuste_errors:{},
  modal_reajuste:false,
  modal_show:false,
  loading_reajuste:false,
  loading_days_in_date:false,
  index_reajuste:undefined,
  modal_rechazar:false,
  loading_rechazar_reajuste:false,
  observacion_rechazo:'',
  errors_modal_rechazo:{},
  loading_pre_calculo:false
});

export const mutations = {
  SET_LOADING(state, value){
    state.full_screen_loading = value;
  },
  SET_ESQUEMA(state, value){
    state.esquema = value;
  },
  SET_ASIGNACIONES(state, value){
    state.asignaciones = value;
  },
  SET_CONTRATOS(state, value){
    state.contratos = value;
  },
  SET_TURNOS(state, value){
    state.turnos = value;
  },
  SET_CALENDARIO(state, value){
    state.calendario = value;
  },
  SET_AUSENTISMOS(state, value){
    state.ausentismos = value;
  },
  SET_VIATICOS(state, value){
    state.viaticos = value;
  },
  SET_AJUSTES(state, value){
    state.ajustes = value;
  },
  SET_LOADING_TANLE(state, value){
    state.loading_table = value;
  },
  SET_N_GRUPO(state, value){
    state.n_grupo = value;
  },
  SET_GRUPOS_AUSENTISMOS(state, value){
    state.grupos_ausentismos = value;
  },
  SET_TIPOS_TURNOS(state, value){
    state.tipos_turnos = value;
  },

  SET_REAJUSTE_FECHA_INICIO(state, value){
    state.reajuste.fecha_inicio = value;
  },
  SET_REAJUSTE_FECHA_TERMINO(state, value){
    state.reajuste.fecha_termino = value;
  },
  SET_REAJUSTE_CALCULO_DIAS(state, value){
    state.reajuste.calculo_dias = value;
  },
  SET_REAJUSTE_REBAJA_DIAS(state, value){
    state.reajuste.rebaja_dias = value;
  },
  SET_REAJUSTE_TIPO_AUSENTISMO(state, value){
    state.reajuste.tipo_ausentismo_id = value;
  },
  SET_REAJUSTE_TIPO_INCREMENTO(state, value){
    state.reajuste.tipo_incremento_id = value;
  },
  SET_ADVERTENCIAS(state, value){
    state.reajuste.advertencias = value;
  },
  SET_ERRORES(state, value){
    state.reajuste.errores = value;
  },
  SET_REAJUSTE_VALOR_DIA(state, value){
    state.reajuste.valor_dia = value;
  },
  SET_REAJUSTE_OBSERVACION(state, value){
    state.reajuste.observacion = value;
  },
  SET_REAJUSTE_ERRORS(state, value){
    state.reajuste_errors = value;
  },
  SET_REAJUSTE_TOTAL_DIAS(state, value){
    state.reajuste.total_dias = value;
  },
  SET_REAJUSTE_TOTAlES(state, value){
    state.reajuste.total_dias           = value.total_dias;
    state.reajuste.monto_ajuste         = value.monto_ajuste;
    state.reajuste.monto_ajuste_format  = value.monto_ajuste_format;
    state.reajuste.diff_days            = value.diff_days;
  },
  SET_REAJUSTE_MONTO_TOTAlES(state, value){
    state.reajuste.total_dias           = value.total_dias;
    state.reajuste.monto_ajuste         = value.monto_ajuste;
    state.reajuste.monto_ajuste_format  = value.monto_ajuste_format;
    state.reajuste.diff_days            = value.diff_days;
    state.reajuste.monto_ajuste         = value.monto_ajuste;
    state.reajuste.monto_ajuste_format  = value.monto_ajuste_format;
  },
  SET_REAJUSTE_PRE_CALCULO(state, value){
    state.reajuste.calculo = value;
  },
  SET_MODAL_REAJUSTE(state, value){
    state.modal_reajuste = value;
    if(!value){
      for(let key in state.reajuste){
        state.reajuste[key] = '';
      }
      state.reajuste.rebaja_dias = 0;
      state.reajuste.calculo_dias = true;
      state.reajuste.tipo_reajuste = 0;
      state.reajuste.calculo = '';
      state.reajuste.valor_dia = 0;
      state.reajuste.advertencias = [];
      state.reajuste.errores = [];
      state.reajuste.total_dias = 0;
      state.reajuste.monto_ajuste = 0;
      state.reajuste.monto_ajuste_format = 0;
      state.reajuste_errors = {};
      state.reajuste.diff_days = 0;
    }
  },
  SET_LOADING_DAYS_IN_DATE(state, value){
    state.loading_days_in_date = value;
  },
  SET_LOADING_REAJUSTE(state, value){
    state.loading_reajuste = value;
  },
  SET_ADD_AJUSTE(state, value){
    state.ajustes.push(value);
  },
  REFRESH_CAMPOS_REAJUSTE(state){
    for(let key in state.reajuste){
      state.reajuste[key] = '';
    }
    state.reajuste.rebaja_dias = 0;
    state.reajuste.calculo_dias = true;
    state.reajuste.calculo = '';
    state.reajuste.tipo_reajuste = 0;
    state.reajuste.valor_dia = 0;
    state.reajuste.advertencias = [];
    state.reajuste.errores = [];
    state.reajuste.total_dias = 0;
    state.reajuste.monto_ajuste = 0;
    state.reajuste.monto_ajuste_format = 0;
    state.reajuste_errors = {};
    state.reajuste.diff_days = 0;
  },
  SET_INDEX_REAJUSTES(state, value){
    state.index_reajuste = value;
  },
  SET_MODAL_SHOW(state, value){
    state.modal_show = value;
  },
  SET_MODAL_RECHAZAR(state, value){
    state.modal_rechazar = value;
  },
  SET_LOADING_RECHAZAR(state, value){
    state.loading_rechazar_reajuste = value;
  },
  SET_OBSERVACION_RECHAZAR(state, value){
    state.observacion_rechazo = value;
  },
  SET_UPDATE_AJUSTE(state, value){
    const indice = state.ajustes.findIndex(r => r.uuid === value.uuid);
    state.ajustes.splice(indice, 1, value);
  },
  SET_ERRORS_RECHAZO(state, value){
    state.errors_modal_rechazo = value;
  },
  SET_LOADING_PRE_CALCULO(state, value){
    state.loading_pre_calculo = value;
  }
};

export const getters = {
  fullScreenLoading(state){
    return state.full_screen_loading;
  },
  esquema(state){
    return state.esquema;
  },
  asignaciones(state){
    return state.asignaciones;
  },
  turnos(state){
    return state.turnos;
  },
  contratos(state){
    return state.contratos;
  },
  calendario(state){
    return state.calendario;
  },
  ausentismos(state){
    return state.ausentismos;
  },
  viaticos(state){
    return state.viaticos;
  },
  ajustes(state){
    return state.ajustes;
  },
  loadingTable(state){
    return state.loading_table;
  },
  gruposAusentismos(state){
    return state.grupos_ausentismos;
  },
  tiposTurnos(state){
    return state.tipos_turnos;
  },
  modalReajuste(state){
    return state.modal_reajuste;
  },
  reajuste(state){
    return state.reajuste;
  },
  loadingDaysInDate(state){
    return state.loading_days_in_date;
  },
  reajusteErrors(state){
    return state.reajuste_errors;
  },
  loadingReajuste(state){
    return state.loading_reajuste;
  },
  modalShow(state){
    return state.modal_show;
  },
  modalRechazarReajuste(state){
    return state.modal_rechazar;
  },
  loadingRechazarReajuste(state){
    return state.loading_rechazar_reajuste;
  },
  errorsRechazo(state){
    return state.errors_modal_rechazo;
  },
  diffDays(state){
    return state.reajuste.diff_days;
  },
  loadingPreCalculo(state){
    return state.loading_pre_calculo;
  }
};

export const actions = {
  async getEsquemaDetalle({ commit }, data){
    commit('SET_LOADING', true);
    const url = `/api/admin/esquema/${data.uuid}/detalle`;
    await this.$axios.$get(url).then(response => {
      commit('SET_LOADING', false);
      console.log(response);
      if(response.status === 'Success'){
        commit('SET_ESQUEMA', response.esquema);
      }
    }).catch(error => {
      commit('SET_LOADING', false);
      console.log(error);
    });
  },
  async getEsquemaAsignaciones({ commit }, data){
    commit('SET_LOADING', true);
    const url = `/api/admin/esquema/${data.uuid}/asignaciones`;
    await this.$axios.$get(url).then(response => {
      commit('SET_LOADING', false);
      console.log(response);
      if(response.status === 'Success'){
        commit('SET_ESQUEMA', response.esquema);
        commit('SET_ASIGNACIONES', response.asignaciones);
      }
    }).catch(error => {
      commit('SET_LOADING', false);
      console.log(error);
    });
  },
  async getEsquemaContratos({ commit }, data){
    commit('SET_LOADING', true);
    const url = `/api/admin/esquema/${data.uuid}/contratos`;
    await this.$axios.$get(url).then(response => {
      commit('SET_LOADING', false);
      console.log(response);
      if(response.status === 'Success'){
        commit('SET_ESQUEMA', response.esquema);
        commit('SET_CONTRATOS', response.contratos);
      }
    }).catch(error => {
      commit('SET_LOADING', false);
      console.log(error);
    });
  },
  async getEsquemaTurnos({ commit }, data){
    commit('SET_LOADING', true);
    const url = `/api/admin/esquema/${data.uuid}/turnos`;
    await this.$axios.$get(url).then(response => {
      commit('SET_LOADING', false);
      console.log(response);
      if(response.status === 'Success'){
        commit('SET_ESQUEMA', response.esquema);
        commit('SET_CALENDARIO', response.calendario);
        commit('SET_TURNOS', response.turnos);
        commit('SET_TIPOS_TURNOS', response.tipos_turnos);
      }
    }).catch(error => {
      commit('SET_LOADING', false);
      console.log(error);
    });
  },
  async getEsquemaAusentismos({ commit }, data){
    commit('SET_LOADING', true);
    const url = `/api/admin/esquema/${data.uuid}/ausentismos/${data.grupo}`;
    await this.$axios.$get(url).then(response => {
      commit('SET_LOADING', false);
      console.log(response);
      if(response.status === 'Success'){
        commit('SET_ESQUEMA', response.esquema);
        commit('SET_AUSENTISMOS', response.ausentismos);
        commit('SET_GRUPOS_AUSENTISMOS', response.grupos);
      }
    }).catch(error => {
      commit('SET_LOADING', false);
      console.log(error);
    });
  },
  async getEsquemaViaticos({ commit }, data){
    commit('SET_LOADING', true);
    const url = `/api/admin/esquema/${data.uuid}/viaticos`;
    await this.$axios.$get(url).then(response => {
      commit('SET_LOADING', false);
      console.log(response);
      if(response.status === 'Success'){
        commit('SET_ESQUEMA', response.esquema);
        commit('SET_VIATICOS', response.viaticos);
      }
    }).catch(error => {
      commit('SET_LOADING', false);
      console.log(error);
    });
  },
  async getEsquemaAjustes({ commit }, data){
    commit('SET_LOADING', true);
    const url = `/api/admin/esquema/${data.uuid}/ajustes`;
    await this.$axios.$get(url).then(response => {
      commit('SET_LOADING', false);
      console.log(response);
      if(response.status === 'Success'){
        commit('SET_ESQUEMA', response.esquema);
        commit('SET_AJUSTES', response.ajustes);
      }
    }).catch(error => {
      commit('SET_LOADING', false);
      console.log(error);
    });
  },
  async getDaysInDate({ commit }, data){
    commit('SET_LOADING_DAYS_IN_DATE', true);
    const url = '/api/admin/days-in-date';
    await this.$axios.$get(url, {
      params:data
    }).then(response => {
      console.log(response);
      commit('SET_LOADING_DAYS_IN_DATE', false);
      if(response.status === 'Success'){
        commit('SET_REAJUSTE_TOTAlES', response.totales);
        commit('SET_REAJUSTE_PRE_CALCULO', response.totales.new_esquema);
      }
    }).catch(error => {
      commit('SET_LOADING_DAYS_IN_DATE', false);
      console.log(error);
    });
  },
  async getMontoInDays({ commit }, data){
    commit('SET_LOADING_DAYS_IN_DATE', true);
    const url = '/api/admin/monto-in-days';
    await this.$axios.$get(url, {
      params:data
    }).then(response => {
      commit('SET_LOADING_DAYS_IN_DATE', false);
      console.log(response);
      if(response.status === 'Success'){
        commit('SET_REAJUSTE_MONTO_TOTAlES', response.totales);
        commit('SET_REAJUSTE_PRE_CALCULO', response.totales.new_esquema);
      }
    }).catch(error => {
      commit('SET_LOADING_DAYS_IN_DATE', false);
      console.log(error);
    });
  },
  async storeReajusteEsquema({ commit}, data){
    commit('SET_LOADING_REAJUSTE', true);
    const url = '/api/admin/recargas/recarga/funcionario/reajuste';
    await this.$axios.$post(url, data).then(response => {
      commit('SET_LOADING_REAJUSTE', false);
      console.log(response);
      if(response.status === 'Success'){
        commit('SET_ESQUEMA', response.esquema_unique);
        commit('SET_ADD_AJUSTE', response.ajuste);
        Notification.success(
          {type: "success", title: response.title, message: response.message}
        );
        commit('REFRESH_CAMPOS_REAJUSTE');
        commit('SET_MODAL_REAJUSTE', false);
        commit('SET_REAJUSTE_ERRORS', {});
      }
    }).catch(error => {
      commit('SET_LOADING_REAJUSTE', false);
      commit('SET_REAJUSTE_ERRORS', error.response.data.errors);
      console.log(error);
    });
  },
  async validateReajuste({ commit }, data){
    const url = `/api/admin/recargas/reajuste/${data.uuid}`;
    commit('SET_INDEX_REAJUSTES', data.index_reajuste);
    commit('SET_LOADING_RECHAZAR', true);
    await this.$axios.$put(url, data).then(response => {
      commit('SET_INDEX_REAJUSTES', undefined);
      commit('SET_LOADING_RECHAZAR', false);
      console.log(response);
      if(response.status === 'Success'){
        commit('SET_MODAL_RECHAZAR', false);
        commit('SET_OBSERVACION_RECHAZAR', '');
        commit('SET_ESQUEMA', response.esquema);
        commit('SET_UPDATE_AJUSTE', response.ajuste);
        commit('SET_ERRORS_RECHAZO', '');
        Notification.success(
          {type: "success", title: response.title}
        );
      }
    }).catch(error => {
      commit('SET_LOADING_RECHAZAR', false);
      commit('SET_INDEX_REAJUSTES', undefined);
      console.log(error);
      commit('SET_ERRORS_RECHAZO', error.response.data.errors);
    });
  },

};
