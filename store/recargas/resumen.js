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
    monto_ajuste:0,
    monto_ajuste_format:0
  },
  reajuste_errors:{},
  loading_reajuste:false,
  modal_reajuste:false,
  modal_show_errores:false,
  filtro:{
    input:'',
    beneficio:[],
    is_turno:[],
    errores:[],
    ajustes:[],
    leyes:[],
    unidades:[],
    ordenamiento:[]
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
  index_selected_table:undefined,
  ordenamientos:[
    {index:0, nombre:'active', order:'ASC'},
    {index:1, nombre:'funcionario.apellidos', order:'ASC'},
    {index:2, nombre:'es_turnante', order:'ASC'},
    {index:3, nombre:'calculo_contrato', order:'ASC'},
    {index:4, nombre:'calculo_turno', order:'ASC'},
    {index:5, nombre:'calculo_grupo_uno', order:'ASC'},
    {index:6, nombre:'calculo_grupo_dos', order:'ASC'},
    {index:7, nombre:'calculo_grupo_tres', order:'ASC'},
    {index:8, nombre:'calculo_viaticos', order:'ASC'},
    {index:9, nombre:'calculo_dias_ajustes', order:'ASC'},
    {index:10, nombre:'total_dias_cancelar', order:'ASC'},
    {index:11, nombre:'total_monto_ajuste', order:'ASC'},
    {index:12, nombre:'monto_total_cancelar', order:'ASC'},
  ],
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
  SET_REAJUSTE_TOTAlES(state, value){
    state.reajuste.total_dias           = value.total_dias;
    state.reajuste.monto_ajuste         = value.monto_ajuste;
    state.reajuste.monto_ajuste_format  = value.monto_ajuste_format;
  },

  SET_LOADING_REAJUSTE(state, value){
    state.loading_reajuste = value;
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
      state.reajuste.valor_dia = 0;
      state.reajuste.advertencias = [];
      state.reajuste.errores = [];
      state.reajuste.total_dias = 0;
      state.reajuste.monto_ajuste = 0;
      state.reajuste.monto_ajuste_format = 0;
      state.reajuste_errors = {};
    }
  },
  REFRESH_CAMPOS_REAJUSTE(state){
    for(let key in state.reajuste){
      state.reajuste[key] = '';
    }
    state.reajuste.rebaja_dias = 0;
    state.reajuste.calculo_dias = true;
    state.reajuste.tipo_reajuste = 0;
    state.reajuste.valor_dia = 0;
    state.reajuste.advertencias = [];
    state.reajuste.errores = [];
    state.reajuste.total_dias = 0;
    state.reajuste.monto_ajuste = 0;
    state.reajuste.monto_ajuste_format = 0;
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
  SET_FILTRO_BENEFICIO(state, value){
    state.filtro.beneficio = value;
  },
  SET_FILTRO_TURNO(state, value){
    state.filtro.is_turno = value;
  },
  SET_FILTRO_AJUSTES(state, value){
    state.filtro.ajustes = value;
  },
  SET_FILTRO_ERRORES(state, value){
    state.filtro.errores = value;
  },
  SET_FILTRO_LEYES(state, value){
    state.filtro.leyes = value;
  },
  SET_FILTRO_UNIDADES(state, value){
    state.filtro.unidades = value;
  },
  SET_FILTRO_ORDENAMIENTO(state, value){
    state.filtro.ordenamiento = value;
  },
  SET_INDEX_SELECTED_TABLE(state, value){
    state.index_selected_table = value;
  },
  SET_MODAL_ERRORES(state, value){
    state.modal_show_errores = value;
  },
  SET_ORDENACION(state, value){
    state.filtro.ordenamiento = value;
  },
  SET_VALUE_ORDENACION(state, value){
    const element = state.filtro.ordenamiento.find(order => order.nombre === value.nombre);
    const index   = state.filtro.ordenamiento.indexOf(element);

    if((!element) && (index <= 0)){
      let new_value = {...value};
      state.filtro.ordenamiento.push(new_value);
    }else{
      if((element) && (element.order === 'ASC')){
        element.order = 'DESC';
      }else if((element) && (element.order === 'DESC')){
        state.filtro.ordenamiento.splice(index, 1);
      }
    }
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
  },
  ordenamientos(state){
    return state.ordenamientos;
  },
  filtroOrder(state){
    return state.filtro.ordenamiento;
  },
  reajuste(state){
    return state.reajuste;
  },
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
        console.log(response);
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
      if(response.status === 'Success'){
        commit('SET_REAJUSTE_TOTAlES', response.totales);
      }
    }).catch(error => {
      commit('SET_LOADING_DAYS_IN_DATE', false);
      console.log(error);
    });
  },
  async storeReajusteResumen({ commit}, data){
    commit('SET_LOADING_REAJUSTE', true);
    const url = '/api/admin/recargas/recarga/funcionario/reajuste';
    await this.$axios.$post(url, data).then(response => {
      commit('SET_LOADING_REAJUSTE', false);
      if(response.status === 'Success'){
        commit('SET_UPDATE_FUNCIONARIO', response.esquema);
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
