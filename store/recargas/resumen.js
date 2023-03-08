import { Notification } from 'element-ui';
export const state = () => ({
  fullscreenloading:false,
  recarga:{},
  funcionarios:[],
  loading_index:false,
  index_click_funcionario:undefined,
  loading_days_in_date:false,
  loading_tabla_resumen:false,
  reajuste:{
    rebaja_dias:0,
    recarga_codigo:'',
    user_id:'',
    fecha_inicio:'',
    fecha_termino:'',
    tipo_ausentismo_id:'',
    tipo_incremento_id:'',
    tipo_reajuste:0,
    dias:0,
    valor_dia:0,
    observacion:''
  },
  reajuste_errors:{},
  loading_reajuste:false,
  modal_reajuste:false,
  filtro:{
    input:''
  },
  pagination: {
    total: 0,
    current_page: 0,
    per_page: 0,
    last_page: 0,
    from: 0,
    to: 0
  },
  offset: 5,
});

export const mutations = {
  SET_LOADING(state, value){
    state.fullscreenloading = value;
  },
  SET_LOADING_TABLA_RESUMEN(state, value){
    state.loading_tabla_resumen = value;
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
  },

  SET_REAJUSTE_REBAJA_DIAS(state, value){
    state.reajuste.rebaja_dias = value;
  },
  SET_REAJUSTE_FECHA_INICIO(state, value){
    state.reajuste.fecha_inicio = value;
  },
  SET_REAJUSTE_FECHA_TERMINO(state, value){
    state.reajuste.fecha_termino = value;
  },
  SET_REAJUSTE_TIPO_AUSENTISMO(state, value){
    state.reajuste.tipo_ausentismo_id = value;
  },
  SET_REAJUSTE_TIPO_INCREMENTO(state, value){
    state.reajuste.tipo_incremento_id = value;
  },
  SET_REAJUSTE_DIAS(state, value){
    state.reajuste.dias = value;
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
  SET_LOADING_REAJUSTE(state, value){
    state.loading_reajuste = value;
  },
  SET_MODAL_REAJUSTE(state, value){
    state.modal_reajuste = value;
  },
  REFRESH_CAMPOS_REAJUSTE(state){
    for(let key in state.reajuste){
      state.reajuste[key] = '';
    }
    state.reajuste.rebaja_dias = 0;
    state.reajuste.dias = 0;
    state.reajuste_errors = {};
  },
  SET_LOADING_DAYS_IN_DATE(state, value){
    state.loading_days_in_date = value;
  },
  SET_CURRENT_PAGE(state, value){
    state.pagination.current_page = value;
  },
  SET_PAGINATION(state, value){
    state.pagination = value;
  },
  SET_FILTRO_INPUT(state, value){
    state.filtro.input = value;
  },
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
  },
  reajusteErrors(state){
    return state.reajuste_errors;
  },
  loadingReajuste(state){
    return state.loading_reajuste;
  },
  modalReajuste(state){
    return state.modal_reajuste;
  },
  loadingDaysInDate(state){
    return state.loading_days_in_date;
  },
  pagination(state){
    return state.pagination;
  },
  offset(state){
    return state.offset;
  },
  loadingTablaResumen(state){
    return state.loading_tabla_resumen;
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
  async getFuncionarios({commit, state}, codigo){
    try {
      commit('SET_LOADING_TABLA_RESUMEN', true);
      const url = `/api/admin/recargas/recarga/${codigo}/funcionarios?page=${state.pagination.current_page}`;
      await this.$axios.$get(url, {params:state.filtro}).then(response => {
        commit('SET_LOADING_TABLA_RESUMEN', false);
        if(response.status === 'Success'){
          commit('SET_FUNCIONARIOS', response.users);
          commit('SET_RECARGA', response.recarga);
          commit('SET_PAGINATION', response.pagination);
        }else{
          this.$router.push({name: 404});
        }
      }).catch(error => {
        commit('SET_LOADING_TABLA_RESUMEN', false);
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
        commit('SET_UPDATE_FUNCIONARIO', response.user);
        commit('SET_RECARGA', response.recarga);

        Notification.success(
          {type: "success", title: response.title, message: response.message}
        );
      }
    }).catch(error => {
      commit('SET_LOADING_INDEX', false);
      console.log(error);
    });
  },
  async getDaysInDate({ commit }, data){
    commit('SET_LOADING_DAYS_IN_DATE', true);
    const url = '/api/admin/days-in-date';
    await this.$axios.$get(url, {
      params:data
    }).then(response => {
      commit('SET_LOADING_DAYS_IN_DATE', false);
      console.log(response);
      if(response){
        commit('SET_REAJUSTE_DIAS', response);
      }
    }).catch(error => {
      commit('SET_LOADING_DAYS_IN_DATE', false);
      console.log(error);
    });
  },
  async storeReajusteFuncionario({ commit}, data){
    commit('SET_LOADING_REAJUSTE', true);
    const url = '/api/admin/recargas/recarga/funcionario/reajuste';
    await this.$axios.$post(url, data).then(response => {
      commit('SET_LOADING_REAJUSTE', false);
      console.log(response);
      if(response.status === 'Success'){
        commit('SET_UPDATE_FUNCIONARIO', response.user);
        commit('SET_RECARGA', response.recarga);
        Notification.success(
          {type: "success", title: response.title, message: response.message}
        );
        commit('REFRESH_CAMPOS_REAJUSTE');
        commit('SET_MODAL_REAJUSTE', false);
      }
    }).catch(error => {
      commit('SET_LOADING_REAJUSTE', false);
      commit('SET_REAJUSTE_ERRORS', error.response.data.errors);
      console.log(error);
    });
  }
};
